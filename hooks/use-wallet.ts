"use client"

import { useState, useCallback, useEffect } from "react"
import { type WalletAdapter, getWalletAdapters } from "@/lib/wallet-adapters"
import { realtimeService } from "@/lib/realtime-service"

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
    chain: "TRX", // Default to TRX since user is using TronLink
    isConnecting: false,
    error: null,
    lastConnected: null,
  })

  const connect = useCallback(async (adapter: WalletAdapter, chain: string) => {
    setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      if (!adapter.isInstalled()) {
        const error: ConnectionError = new Error(`${adapter.name} wallet is not installed. Please install it first.`)
        error.type = 'WALLET_NOT_FOUND'
        throw error
      }

      // Auto-detect chain based on wallet adapter if not explicitly provided
      let detectedChain = chain
      if (!chain || chain === "ETH") {
        switch (adapter.name) {
          case "TronLink":
            detectedChain = "TRX"
            break
          case "Phantom":
          case "Solflare":
            detectedChain = "SOL"
            break
          case "Tonkeeper":
            detectedChain = "TON"
            break
          case "Unisat":
          case "Xverse":
            detectedChain = "BTC"
            break
          case "MetaMask":
            // Keep current chain for MetaMask or default to ETH
            detectedChain = chain || "ETH"
            break
          default:
            detectedChain = chain || "ETH"
        }
      }

      console.log(`[useWallet] Connecting ${adapter.name} to chain: ${detectedChain}`)

      // For EVM chains, switch to correct network
      if (["ETH", "BNB", "POL"].includes(detectedChain) && adapter.name === "MetaMask") {
        const chainIds = {
          ETH: "0x1",
          BNB: "0x38",
          POL: "0x89",
        }
        try {
          await (adapter as any).switchToNetwork(chainIds[detectedChain as keyof typeof chainIds])
        } catch (networkError) {
          console.warn(`[useWallet] Network switch failed for ${detectedChain}:`, networkError)
          // Continue with connection attempt
        }
      }

      const { address, balance } = await adapter.connect()

      setWalletState({
        isConnected: true,
        address,
        balance,
        adapter,
        chain: detectedChain, // Use the detected chain
        isConnecting: false,
        error: null,
        lastConnected: Date.now(),
      })

      // Subscribe to real-time balance updates
      if (address && detectedChain) {
        realtimeService.subscribeToBalanceUpdates(address, detectedChain, (balanceUpdate) => {
          setWalletState(prev => ({
            ...prev,
            balance: balanceUpdate.balances.native || prev.balance,
          }))
        })
      }

      // Store connection in localStorage with timestamp
      localStorage.setItem(
        "wallet_connection",
        JSON.stringify({
          adapterName: adapter.name,
          chain: detectedChain, // Store the detected chain
          address,
          timestamp: Date.now(),
        }),
      )
    } catch (error: any) {
      const connectionError = error as ConnectionError
      
      // Determine error type for better user feedback
      let errorMessage = "Failed to connect wallet"
      let errorType: ConnectionError['type'] = 'UNKNOWN'

      if (connectionError.type === 'USER_REJECTED') {
        errorMessage = "Connection was rejected by user"
        errorType = 'USER_REJECTED'
      } else if (connectionError.type === 'WALLET_NOT_FOUND') {
        errorMessage = connectionError.message
        errorType = 'WALLET_NOT_FOUND'
      } else if (connectionError.code === 'NETWORK_ERROR' || connectionError.message?.includes('network')) {
        errorMessage = "Network error occurred. Please check your connection."
        errorType = 'NETWORK_ERROR'
      } else {
        errorMessage = connectionError.message || errorMessage
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
      chain: walletState.chain,
      isConnecting: false,
      error: null,
    })

    localStorage.removeItem("wallet_connection")
  }, [walletState.adapter, walletState.chain])

  const switchChain = useCallback(
    async (newChain: string) => {
      const currentAdapter = walletState.adapter
      const wasConnected = walletState.isConnected

      // First disconnect current wallet if connected
      if (currentAdapter && wasConnected) {
        try {
          await currentAdapter.disconnect()
        } catch (error) {
          console.error("Error disconnecting wallet during chain switch:", error)
        }
      }

      // Update chain state
      setWalletState((prev) => ({
        ...prev,
        chain: newChain,
        isConnected: false,
        address: null,
        balance: null,
        adapter: null,
        error: null,
      }))

      // If wallet was connected, try to reconnect with compatible wallet for new chain
      if (wasConnected && currentAdapter) {
        const newAdapters = getWalletAdapters(newChain)

        // Try to find a compatible wallet for the new chain
        let compatibleAdapter = null

        // For EVM chains, try to use MetaMask if available
        if (["ETH", "BNB", "POL"].includes(newChain) && currentAdapter.name === "MetaMask") {
          compatibleAdapter = newAdapters.find((a) => a.name === "MetaMask")
        }
        // For Solana, try to use the same wallet if it was Phantom or Solflare
        else if (newChain === "SOL" && ["Phantom", "Solflare"].includes(currentAdapter.name)) {
          compatibleAdapter = newAdapters.find((a) => a.name === currentAdapter.name)
        }
        // For other chains, try to find the first available wallet
        else {
          compatibleAdapter = newAdapters.find((a) => a.isInstalled())
        }

        // Auto-reconnect if compatible wallet found
        if (compatibleAdapter && compatibleAdapter.isInstalled()) {
          setTimeout(() => {
            connect(compatibleAdapter, newChain)
          }, 500) // Small delay to ensure state is updated
        }
      }

      // Update localStorage with new chain preference
      const savedConnection = localStorage.getItem("wallet_connection")
      if (savedConnection) {
        try {
          const connectionData = JSON.parse(savedConnection)
          localStorage.setItem(
            "wallet_connection",
            JSON.stringify({
              ...connectionData,
              chain: newChain,
            }),
          )
        } catch (error) {
          console.error("Error updating saved connection:", error)
        }
      }
    },
    [walletState.adapter, walletState.isConnected, connect],
  )

  const refreshBalance = useCallback(async () => {
    if (walletState.adapter && walletState.address) {
      try {
        console.log("[useWallet] Refreshing balance for:", walletState.address)
        const balance = await walletState.adapter.getBalance(walletState.address)
        console.log("[useWallet] New balance:", balance)
        setWalletState((prev) => ({ ...prev, balance }))
      } catch (error) {
        console.error("[useWallet] Error refreshing balance:", error)
      }
    }
  }, [walletState.adapter, walletState.address])

  // Auto-reconnect on page load
  useEffect(() => {
    const savedConnection = localStorage.getItem("wallet_connection")
    if (savedConnection) {
      try {
        const { adapterName, chain } = JSON.parse(savedConnection)
        const adapters = getWalletAdapters(chain)
        const adapter = adapters.find((a) => a.name === adapterName)

        if (adapter && adapter.isInstalled()) {
          connect(adapter, chain)
        } else {
          localStorage.removeItem("wallet_connection")
        }
      } catch (error) {
        localStorage.removeItem("wallet_connection")
      }
    }
  }, [connect])

  return {
    ...walletState,
    connect,
    disconnect,
    switchChain,
    refreshBalance,
    availableWallets: getWalletAdapters(walletState.chain),
    isWalletCompatible: (targetChain: string) => {
      if (!walletState.adapter) return false
      const targetAdapters = getWalletAdapters(targetChain)
      return targetAdapters.some((adapter) => adapter.name === walletState.adapter?.name)
    },
  }
}
