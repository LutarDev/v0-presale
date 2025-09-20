"use client"

import { useState, useCallback, useEffect } from "react"
import { getWalletAdapters, type WalletAdapter } from "@/lib/wallet-adapters"

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  adapter: WalletAdapter | null
  chain: string
  isConnecting: boolean
  error: string | null
  lastConnected: number | null
}

interface ConnectionError extends Error {
  code?: string
  type?: 'USER_REJECTED' | 'NETWORK_ERROR' | 'WALLET_NOT_FOUND' | 'UNKNOWN'
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    adapter: null,
    chain: "BTC", // Default to BTC to prevent auto MetaMask connection
    isConnecting: false,
    error: null,
    lastConnected: null,
  })

  // Flag to prevent auto-connection on initial load
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  const connect = useCallback(async (adapter: WalletAdapter, chain: string) => {
    console.log(`[useWallet] Manual connection initiated for ${adapter.name} to chain: ${chain}`)
    setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }))

    // Add connection timeout - longer for TronLink
    const timeoutDuration = adapter.name === "TronLink" ? 30000 : 15000
    const connectTimeout = setTimeout(() => {
      setWalletState((prev) => ({ 
        ...prev, 
        isConnecting: false, 
        error: "Connection timeout. Please try again." 
      }))
    }, timeoutDuration)

    try {
      const result = await adapter.connect(chain)
      clearTimeout(connectTimeout)
      
      console.log(`[useWallet] Connection result for ${adapter.name}:`, result)
      
      if (result.success) {
        const { address, balance, detectedChain } = result
        
        const newState = {
          isConnected: true,
          address,
          balance,
          adapter,
          chain: detectedChain || chain,
          isConnecting: false,
          error: null,
          lastConnected: Date.now(),
        }
        
        console.log(`[useWallet] Setting new wallet state:`, newState)
        setWalletState(newState)

        // Store connection info for potential reconnection (but not for TronLink)
        if (adapter.name !== "TronLink") {
          localStorage.setItem('wallet_connection', JSON.stringify({
            adapterName: adapter.name,
            chain: detectedChain || chain,
            lastConnected: Date.now(),
          }))
        }
        
        // Force a re-render by triggering a small delay
        setTimeout(() => {
          console.log(`[useWallet] State verification:`, {
            isConnected: true,
            address,
            adapter: adapter.name,
            chain: detectedChain || chain
          })
        }, 100)
      } else {
        throw new Error(result.error || "Connection failed")
      }
    } catch (error: any) {
      clearTimeout(connectTimeout)
      console.error(`[useWallet] Connection failed:`, error)
      
      let errorMessage = "Failed to connect wallet"
      let errorType: ConnectionError['type'] = 'UNKNOWN'

      // Better error categorization for TronLink
      if (adapter.name === "TronLink") {
        if (error.message?.includes('rejected') || error.code === 4001) {
          errorMessage = "Connection request was rejected in TronLink"
          errorType = 'USER_REJECTED'
        } else if (error.message?.includes('timeout') || error.message?.includes('failed to initialize')) {
          errorMessage = "TronLink connection timed out. Please try again."
          errorType = 'NETWORK_ERROR'
        } else if (error.message?.includes('not ready')) {
          errorMessage = "TronLink is not ready. Please unlock your wallet and try again."
          errorType = 'WALLET_NOT_FOUND'
        }
      } else {
        if (error.message?.includes('rejected') || error.code === 4001) {
          errorMessage = "Connection request was rejected"
          errorType = 'USER_REJECTED'
        } else if (error.message?.includes('not found') || error.code === -32002) {
          errorMessage = "Wallet extension not found or locked"
          errorType = 'WALLET_NOT_FOUND'
        } else if (error.message?.includes('network')) {
          errorMessage = "Network connection error"
          errorType = 'NETWORK_ERROR'
        }
      }

      setWalletState((prev) => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }))
    }
  }, [])

  const disconnect = useCallback(async () => {
    if (walletState.adapter) {
      try {
        await walletState.adapter.disconnect()
      } catch (error) {
        console.error("Error disconnecting wallet:", error)
      }
    }

    setWalletState({
      isConnected: false,
      address: null,
      balance: null,
      adapter: null,
      chain: "BTC", // Reset to BTC to prevent auto-connection
      isConnecting: false,
      error: null,
      lastConnected: null,
    })

    // Clear stored connection info
    localStorage.removeItem('wallet_connection')
    setHasUserInteracted(false)
  }, [walletState.adapter])

  const switchChain = useCallback(
    async (newChain: string) => {
      console.log(`[useWallet] Manual chain switch to: ${newChain}`)
      setHasUserInteracted(true)
      
      if (!walletState.adapter || !walletState.isConnected) {
        // Just update the chain without connecting
        setWalletState((prev) => ({ ...prev, chain: newChain }))
        return
      }

      try {
        setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }))
        const result = await walletState.adapter.connect(newChain)
        
        if (result.success) {
          setWalletState((prev) => ({
            ...prev,
            chain: result.detectedChain || newChain,
            address: result.address,
            balance: result.balance,
            isConnecting: false,
          }))
        } else {
          throw new Error(result.error || "Chain switch failed")
        }
      } catch (error: any) {
        console.error(`[useWallet] Chain switch failed:`, error)
        setWalletState((prev) => ({
          ...prev,
          isConnecting: false,
          error: "Failed to switch chain",
        }))
      }
    },
    [walletState.adapter, walletState.isConnected],
  )

  const refreshBalance = useCallback(async () => {
    if (!walletState.adapter || !walletState.address) return

    try {
      const result = await walletState.adapter.getBalance(walletState.address)
      if (result.success && result.balance) {
        setWalletState((prev) => ({ ...prev, balance: result.balance! }))
      }
    } catch (error) {
      console.error("Failed to refresh balance:", error)
    }
  }, [walletState.adapter, walletState.address])

  // Only attempt auto-reconnect if user has previously interacted
  useEffect(() => {
    const attemptReconnection = async () => {
      const stored = localStorage.getItem('wallet_connection')
      if (!stored || hasUserInteracted) return

      try {
        const connectionInfo = JSON.parse(stored)
        const timeSinceLastConnection = Date.now() - connectionInfo.lastConnected
        
        // Only auto-reconnect if it was within the last hour and user hasn't interacted
        if (timeSinceLastConnection < 60 * 60 * 1000) {
          console.log('[useWallet] Attempting auto-reconnection...')
          
          // Skip auto-reconnection for TronLink to prevent initialization issues
          if (connectionInfo.adapterName === "TronLink") {
            console.log('[useWallet] Skipping auto-reconnection for TronLink - requires manual connection')
            localStorage.removeItem('wallet_connection')
            return
          }
          
          const adapters = getWalletAdapters(connectionInfo.chain)
          const adapter = adapters.find(a => a.name === connectionInfo.adapterName)
          
          if (adapter && adapter.isAvailable()) {
            // Set user interaction flag to prevent loops
            setHasUserInteracted(true)
            
            await connect(adapter, connectionInfo.chain)
          }
        } else {
          // Clear old connection info
          localStorage.removeItem('wallet_connection')
        }
      } catch (error) {
        console.error('[useWallet] Auto-reconnection failed:', error)
        localStorage.removeItem('wallet_connection')
      }
    }

    // Only attempt auto-reconnection once after component mounts
    if (!hasUserInteracted) {
      // Delay auto-reconnection to prevent immediate execution
      const timer = setTimeout(attemptReconnection, 5000) // Increased delay
      return () => clearTimeout(timer)
    }
  }, [connect, hasUserInteracted])

  return {
    ...walletState,
    connect: useCallback((adapter: WalletAdapter, chain: string) => {
      setHasUserInteracted(true)
      return connect(adapter, chain)
    }, [connect]),
    disconnect,
    switchChain,
    refreshBalance,
    availableWallets: getWalletAdapters(walletState.chain),
    isWalletCompatible: (targetChain: string) => {
      const adapters = getWalletAdapters(targetChain)
      return adapters.some(adapter => adapter.isAvailable())
    },
  }
}
