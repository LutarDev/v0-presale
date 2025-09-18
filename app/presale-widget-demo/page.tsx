"use client"

import React from 'react'
import { PresaleWidget } from '@/components/presale-widget/PresaleWidget'
import { TransactionInfo } from '@/components/presale-widget/types/presale-widget.types'

export default function PresaleWidgetDemo() {
  const handleComplete = (result: TransactionInfo) => {
    console.log('Presale completed:', result)
    alert(`Presale completed! Transaction: ${result.hash}`)
  }

  const handleError = (error: string) => {
    console.error('Presale error:', error)
    alert(`Error: ${error}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            LUTAR Presale Widget Demo
          </h1>
          <p className="text-gray-400">
            Multi-step presale widget with TON support
          </p>
        </div>
        
        <PresaleWidget
          onComplete={handleComplete}
          onError={handleError}
          config={{
            lutarPrice: 0.004,
            supportedCurrencies: ['BTC', 'ETH', 'SOL', 'POL', 'BNB', 'TRX', 'USDT', 'USDC', 'TON'],
            paymentTimeout: 1800000,
            minPurchaseAmount: 10
          }}
        />
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            This is a demo of the LUTAR presale widget implementation
          </p>
        </div>
      </div>
    </div>
  )
}
