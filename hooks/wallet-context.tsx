"use client"

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { WalletAdapter, getWalletAdapters } from '@/lib/wallet-adapters'

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

interface WalletContextType {
  // State
  isConnected: boolean
  address: string | null
  balance: string | null
  adapter: WalletAdapter | null
  chain: string
  isConnecting: boolean
  error: string | null
  lastConnected: number | null
  
  // Actions
  connect: (adapter: WalletAdapter, chain: string) => Promise<void>
  disconnect: () => Promise<void>
  switchChain: (newChain: string) => Promise<void>
  refreshBalance: () => Promise<void>
  availableWallets: WalletAdapter[]
  isWalletCompatible: (targetChain: string) => boolean
}

const WalletContext = createContext<WalletContextType | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const contextId = useRef(Math.random().toString(36).substr(2, 9))
  console.log(`[WalletProvider:${contextId.current}] Provider created`)

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
  
  // Debug wallet state changes for troubleshooting
  useEffect(() => {
    console.log(`[WalletProvider:${contextId.current}] Global wallet state updated:`, {
      isConnected: walletState.isConnected,
      address: walletState.address ? walletState.address.slice(0, 10) + '...' : null,
      adapter: walletState.adapter?.name,
      chain: walletState.chain
    })
  }, [walletState])
  
  // Ref to hold current adapter to avoid stale closures
  const adapterRef = useRef<WalletAdapter | null>(null)
  
  // Update ref when adapter changes
  useEffect(() => {
    adapterRef.current = walletState.adapter
  }, [walletState.adapter])

  const connect = useCallback(async (adapter: WalletAdapter, chain: string) => {
    console.log(`[WalletProvider:${contextId.current}] Manual connection initiated for ${adapter.name} to chain: ${chain}`)
    setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }))

    // Add connection timeout
    const connectTimeout = setTimeout(() => {
      setWalletState((prev) => ({
        ...prev,
        isConnecting: false,
        error: "Connection timeout"
      }))
    }, 30000) // 30 second timeout

    try {
      const result = await adapter.connect(chain)
      clearTimeout(connectTimeout)
      
      if (result.success) {
        const { address, balance, detectedChain } = result
        
        console.log(`[WalletProvider:${contextId.current}] Setting wallet state to connected:`, {
          address,
          balance,
          detectedChain: detectedChain || chain,
          adapterName: adapter.name
        })
        
        console.log(`[WalletProvider:${contextId.current}] About to call setWalletState with connected state`)
        setWalletState({
          isConnected: true,
          address,
          balance,
          adapter,
          chain: detectedChain || chain,
          isConnecting: false,
          error: null,
          lastConnected: Date.now(),
        })
        
        console.log(`[WalletProvider:${contextId.current}] Wallet state should now be connected`)

        // Store connection info for potential reconnection
        localStorage.setItem('wallet_connection', JSON.stringify({
          adapterName: adapter.name,
          chain: detectedChain || chain,
          address,
          timestamp: Date.now()
        }))
      } else {
        throw new Error(result.error || "Connection failed")
      }
    } catch (error: any) {
      clearTimeout(connectTimeout)
      console.error(`[WalletProvider:${contextId.current}] Connection failed:`, error)
      
      const errorType: ConnectionError['type'] = 
        error.code === 4001 ? 'USER_REJECTED' :
        error.code === -32002 ? 'NETWORK_ERROR' :
        error.message?.includes('not found') ? 'WALLET_NOT_FOUND' :
        'UNKNOWN'
      
      setWalletState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || "Failed to connect wallet",
      }))
    }
  }, [])

  const disconnect = useCallback(async () => {
    console.log(`[WalletProvider:${contextId.current}] DISCONNECT called - this might be unexpected!`)
    console.log(`[WalletProvider:${contextId.current}] Current state before disconnect:`, {
      isConnected: walletState.isConnected,
      address: walletState.address,
      adapter: walletState.adapter?.name,
      chain: walletState.chain
    })
    console.trace(`[WalletProvider:${contextId.current}] Disconnect call stack`)
    
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
  }, [walletState.adapter, walletState.isConnected, walletState.address, walletState.chain])

  const switchChain = useCallback(
    async (newChain: string) => {
      console.log(`[WalletProvider:${contextId.current}] Manual chain switch to: ${newChain}`)
      console.log(`[WalletProvider:${contextId.current}] Current state: chain=${walletState.chain}, isConnected=${walletState.isConnected}, adapter=${walletState.adapter?.name}`)
      setHasUserInteracted(true)
      
      // If chain is already correct, don't do anything
      if (walletState.chain === newChain) {
        console.log(`[WalletProvider:${contextId.current}] Chain already set to ${newChain}, no action needed`)
        return
      }
      
      if (!walletState.adapter || !walletState.isConnected) {
        // Just update the chain without connecting
        console.log(`[WalletProvider:${contextId.current}] No wallet connected, just updating chain to ${newChain}`)
        setWalletState((prev) => ({ ...prev, chain: newChain }))
        return
      }

      try {
        console.log(`[WalletProvider:${contextId.current}] Attempting to switch connected wallet from ${walletState.chain} to ${newChain}`)
        setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }))
        const result = await walletState.adapter.connect(newChain)
        
        if (result.success) {
          console.log(`[WalletProvider:${contextId.current}] Chain switch successful to ${result.detectedChain || newChain}`)
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
        console.error(`[WalletProvider:${contextId.current}] Chain switch failed:`, error)
        setWalletState((prev) => ({
          ...prev,
          isConnecting: false,
          error: "Failed to switch chain",
        }))
      }
    },
    [walletState.adapter, walletState.isConnected, walletState.chain],
  )

  const refreshBalance = useCallback(async () => {
    const currentAdapter = adapterRef.current
    const currentAddress = walletState.address
    
    if (!currentAdapter || !currentAddress) {
      console.log(`[WalletProvider:${contextId.current}] Cannot refresh balance: no adapter or address`)
      return
    }

    try {
      console.log(`[WalletProvider:${contextId.current}] Refreshing balance for ${currentAddress}`)
      const result = await currentAdapter.getBalance(currentAddress)
      if (result.success && result.balance !== undefined) {
        setWalletState((prev) => ({ ...prev, balance: result.balance! }))
        console.log(`[WalletProvider:${contextId.current}] Balance refreshed: ${result.balance}`)
      }
    } catch (error) {
      console.error("Failed to refresh balance:", error)
    }
  }, [walletState.address])

  // Auto-reconnection disabled to prevent interference with manual connections
  useEffect(() => {
    console.log(`[WalletProvider:${contextId.current}] Auto-reconnection is disabled to prevent interference with manual connections`)
  }, [])

  const contextValue: WalletContextType = {
    ...walletState,
    connect: useCallback((adapter: WalletAdapter, chain: string) => {
      console.log(`[WalletProvider:${contextId.current}] Manual wallet connection requested by user for:`, adapter.name, 'on chain:', chain)
      setHasUserInteracted(true)
      return connect(adapter, chain)
    }, [connect]),
    disconnect,
    switchChain,
    refreshBalance,
    availableWallets: getWalletAdapters(walletState.chain),
    isWalletCompatible: (targetChain: string) => {
      const adapters = getWalletAdapters(targetChain)
      return adapters.length > 0
    },
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}