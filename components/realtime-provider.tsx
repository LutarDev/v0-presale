"use client"

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { realtimeService } from '@/lib/realtime-service'
import { priceService } from '@/lib/price-service'

interface RealtimeContextType {
  isConnected: boolean
  initialize: () => void
  disconnect: () => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function useRealtimeContext() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtimeContext must be used within a RealtimeProvider')
  }
  return context
}

interface RealtimeProviderProps {
  children: ReactNode
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  useEffect(() => {
    // Initialize real-time services
    const initializeServices = () => {
      try {
        // Initialize real-time service (uses polling in development, WebSocket in production)
        realtimeService.initialize()
        
        // Start price updates
        priceService.startPriceUpdates()
        
        console.log('[RealtimeProvider] Services initialized')
      } catch (error) {
        console.error('[RealtimeProvider] Failed to initialize services:', error)
      }
    }

    // Initialize on mount
    initializeServices()

    // Cleanup on unmount
    return () => {
      realtimeService.disconnect()
      priceService.stopPriceUpdates()
    }
  }, [])

  const contextValue: RealtimeContextType = {
    isConnected: realtimeService.isConnected(),
    initialize: () => realtimeService.initialize(),
    disconnect: () => realtimeService.disconnect(),
  }

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  )
}
