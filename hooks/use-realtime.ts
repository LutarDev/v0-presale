"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { realtimeService, type BalanceUpdate, type PriceUpdate, type TransactionUpdate, type PresaleUpdate } from '@/lib/realtime-service'

export function useRealtimeBalance(address: string, chain: string) {
  const [balance, setBalance] = useState<BalanceUpdate | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!address || !chain) return

    const handleBalanceUpdate = (data: BalanceUpdate) => {
      if (data.address === address && data.chain === chain) {
        setBalance(data)
      }
    }

    subscriptionRef.current = realtimeService.subscribeToBalanceUpdates(
      address,
      chain,
      handleBalanceUpdate
    )

    setIsConnected(realtimeService.isConnected())

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [address, chain])

  return { balance, isConnected }
}

export function useRealtimePrice(symbol: string) {
  const [price, setPrice] = useState<PriceUpdate | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!symbol) return

    const handlePriceUpdate = (data: PriceUpdate) => {
      if (data.symbol === symbol) {
        setPrice(data)
      }
    }

    subscriptionRef.current = realtimeService.subscribeToPriceUpdates(
      symbol,
      handlePriceUpdate
    )

    setIsConnected(realtimeService.isConnected())

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [symbol])

  return { price, isConnected }
}

export function useRealtimeTransaction(txHash: string) {
  const [transaction, setTransaction] = useState<TransactionUpdate | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!txHash) return

    const handleTransactionUpdate = (data: TransactionUpdate) => {
      if (data.hash === txHash) {
        setTransaction(data)
      }
    }

    subscriptionRef.current = realtimeService.subscribeToTransactionUpdates(
      txHash,
      handleTransactionUpdate
    )

    setIsConnected(realtimeService.isConnected())

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [txHash])

  return { transaction, isConnected }
}

export function useRealtimePresale() {
  const [presale, setPresale] = useState<PresaleUpdate | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    const handlePresaleUpdate = (data: PresaleUpdate) => {
      setPresale(data)
    }

    subscriptionRef.current = realtimeService.subscribeToPresaleUpdates(
      handlePresaleUpdate
    )

    setIsConnected(realtimeService.isConnected())

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [])

  return { presale, isConnected }
}

export function useRealtimeConnection() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(realtimeService.isConnected())
    }

    // Check connection status periodically
    const interval = setInterval(checkConnection, 5000)
    checkConnection() // Initial check

    return () => clearInterval(interval)
  }, [])

  const initialize = useCallback(() => {
    realtimeService.initialize()
  }, [])

  const disconnect = useCallback(() => {
    realtimeService.disconnect()
  }, [])

  return {
    isConnected,
    initialize,
    disconnect,
  }
}
