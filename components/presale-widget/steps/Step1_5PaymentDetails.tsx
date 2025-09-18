"use client"

import React, { useState } from 'react'
import { StepProps } from '../types/presale-widget.types'
import { CurrencyIcon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { usePresaleWidgetStore } from '@/stores/presale-widget-store'

interface PaymentDetailsProps extends StepProps {
  // No additional props needed as we get everything from the store
}

export const Step1_5PaymentDetails: React.FC<PaymentDetailsProps> = ({
  onNext,
  onBack,
  onError
}) => {
  const { 
    selectedCurrency,
    paymentAmount, 
    tokenAmount,
    email,
    bscWalletAddress,
    setEmail,
    setBscWalletAddress
  } = usePresaleWidgetStore()

  const [localEmail, setLocalEmail] = useState(email || '')
  const [localBscAddress, setLocalBscAddress] = useState(bscWalletAddress || '')

  const handleContinue = () => {
    if (!selectedCurrency) {
      onError('Please select a payment currency')
      return
    }
    
    if (!localBscAddress.trim()) {
      onError('BSC wallet address is required to receive LUTAR tokens')
      return
    }

    // Validate BSC address format (basic validation)
    if (!localBscAddress.startsWith('0x') || localBscAddress.length !== 42) {
      onError('Please enter a valid BSC wallet address')
      return
    }

    // Save to store
    setEmail(localEmail)
    setBscWalletAddress(localBscAddress)
    
    onNext()
  }

  const handleBack = () => {
    onBack()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">
          Payment Details
        </h2>
        <p className="text-[rgba(255,255,255,0.6)] text-sm">
          Review your purchase and provide required information
        </p>
      </div>

      {/* Token Amount Display */}
      <div className="p-4 bg-[rgba(255,199,0,0.1)] border border-[rgba(255,199,0,0.3)] rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[rgb(255,199,0)] rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">L</span>
            </div>
            <div>
              <p className="text-white font-medium">You will receive</p>
              <p className="text-[rgba(255,255,255,0.7)] text-sm">{tokenAmount || '0.00'} LUTAR</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">${paymentAmount || '0.00'}</p>
            <p className="text-[rgba(255,255,255,0.7)] text-sm">USD</p>
          </div>
        </div>
      </div>

      {/* Payment Method Display */}
      {selectedCurrency && (
        <div className="p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg">
          <div className="flex items-center gap-3">
            <CurrencyIcon 
              currency={selectedCurrency}
              size={24}
              className="w-6 h-6"
            />
            <div>
              <p className="text-white font-medium">Payment Method</p>
              <p className="text-[rgba(255,255,255,0.7)] text-sm">
                {selectedCurrency.symbol} on {selectedCurrency.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email Input (Optional) */}
      <div className="space-y-2">
        <label className="text-[rgba(255,255,255,0.45)] text-sm">
          Email (Optional)
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          value={localEmail}
          onChange={(e) => setLocalEmail(e.target.value)}
          className={cn(
            "w-full p-4 bg-transparent text-white text-base",
            "border border-[rgba(255,255,255,0.1)] rounded-[15px]",
            "focus:outline-none focus:border-[rgb(255,199,0)] focus:ring-1 focus:ring-[rgb(255,199,0)]",
            "placeholder:text-[rgba(255,255,255,0.45)]",
            "hover:border-[rgba(255,255,255,0.2)] transition-colors"
          )}
        />
      </div>

      {/* BSC Wallet Address Input (Required) */}
      <div className="space-y-2">
        <label className="text-[rgba(255,255,255,0.45)] text-sm">
          BSC Wallet Address <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={localBscAddress}
          onChange={(e) => setLocalBscAddress(e.target.value)}
          className={cn(
            "w-full p-4 bg-transparent text-white text-base",
            "border border-[rgba(255,255,255,0.1)] rounded-[15px]",
            "focus:outline-none focus:border-[rgb(255,199,0)] focus:ring-1 focus:ring-[rgb(255,199,0)]",
            "placeholder:text-[rgba(255,255,255,0.45)]",
            "hover:border-[rgba(255,255,255,0.2)] transition-colors"
          )}
        />
        <p className="text-[rgba(255,255,255,0.6)] text-xs">
          This is where your LUTAR tokens will be sent after payment confirmation
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleBack}
          className={cn(
            "flex-1 py-3 px-6 rounded-lg font-semibold text-base",
            "bg-[rgba(255,255,255,0.1)] text-white",
            "hover:bg-[rgba(255,255,255,0.2)] transition-colors",
            "border border-[rgba(255,255,255,0.2)]"
          )}
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedCurrency || !localBscAddress.trim()}
          className={cn(
            "flex-1 py-3 px-6 rounded-lg font-semibold text-base",
            "transition-all duration-200 ease-in-out",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            selectedCurrency && localBscAddress.trim()
              ? "bg-[rgb(255,199,0)] text-[rgba(0,0,0,0.95)] hover:bg-[rgb(255,210,0)]" 
              : "bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)]"
          )}
        >
          Continue
        </button>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-[rgba(255,255,255,0.5)] text-xs">
          Make sure your BSC wallet address is correct. LUTAR tokens will be sent to this address.
        </p>
      </div>
    </div>
  )
}
