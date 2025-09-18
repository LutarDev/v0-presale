"use client"

import React, { useState } from 'react'
import { AmountInputProps } from '../types/presale-widget.types'
import { BscWalletInput } from '../shared/BscWalletInput'
import { ChainIcon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

// Validation functions
const validateBscAddress = (address: string): { valid: boolean; error?: string } => {
  if (!address) {
    return { valid: false, error: 'BSC wallet address is required' }
  }
  
  if (!address.startsWith('0x')) {
    return { valid: false, error: 'BSC address must start with 0x' }
  }
  
  if (address.length !== 42) {
    return { valid: false, error: 'BSC address must be 42 characters long' }
  }
  
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { valid: false, error: 'Invalid BSC address format' }
  }
  
  return { valid: true }
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const Step2AmountInput: React.FC<AmountInputProps> = ({
  selectedCurrency,
  paymentAmount,
  tokenAmount,
  email,
  bscWalletAddress,
  onAmountChange,
  onEmailChange,
  onBscWalletChange,
  onNext,
  onBack,
  onError
}) => {
  const [errors, setErrors] = useState<{
    amount?: string
    email?: string
    bscWallet?: string
  }>({})

  const validateAndProceed = () => {
    const newErrors: typeof errors = {}
    
    // Validate payment amount
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      newErrors.amount = 'Please enter a valid payment amount'
    }
    
    // Validate email (optional but if provided, must be valid)
    if (email && !isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Validate BSC wallet address (required)
    const bscValidation = validateBscAddress(bscWalletAddress)
    if (!bscValidation.valid) {
      newErrors.bscWallet = bscValidation.error
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      {/* Amount Input */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">You pay (USD)</label>
        <input
          type="number"
          placeholder="$0.00"
          value={paymentAmount}
          onChange={(e) => onAmountChange(e.target.value)}
          className={cn(
            "w-full p-3 bg-gray-700 text-white rounded-lg border transition-colors",
            "focus:outline-none focus:ring-0",
            errors.amount ? "border-red-500 focus:border-red-400" : "border-gray-600 focus:border-yellow-400"
          )}
        />
        {errors.amount && (
          <p className="text-red-400 text-xs">{errors.amount}</p>
        )}
      </div>
      
      {/* Token Amount Display */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">You receive</label>
        <div className="p-3 bg-gray-700 text-white rounded-lg border border-gray-600 flex items-center justify-between">
          <span className="text-lg font-medium">{tokenAmount}</span>
          <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded-full">
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-black text-xs font-bold">L</span>
            </div>
            <span className="text-white text-sm font-medium">LUTAR</span>
          </div>
        </div>
      </div>
      
      {/* Email Input (Optional) */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">Email Address (Optional)</label>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className={cn(
            "w-full p-3 bg-gray-700 text-white rounded-lg border transition-colors",
            "focus:outline-none focus:ring-0",
            errors.email ? "border-red-500 focus:border-red-400" : "border-gray-600 focus:border-yellow-400"
          )}
        />
        {errors.email && (
          <p className="text-red-400 text-xs">{errors.email}</p>
        )}
        <p className="text-gray-400 text-xs">
          Optional: Receive updates about your purchase
        </p>
      </div>
      
      {/* BSC Wallet Address (Required) */}
      <BscWalletInput
        value={bscWalletAddress}
        onChange={onBscWalletChange}
        error={errors.bscWallet}
      />
      
      {/* Selected Currency Display */}
      <div className="p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg">
        <div className="flex items-center gap-3">
          <ChainIcon 
            chain={selectedCurrency.chain as any} 
            size={24}
            className="w-6 h-6"
          />
          <div>
            <p className="text-white font-medium">
              Payment Currency: {selectedCurrency.symbol}
            </p>
            <p className="text-[rgba(255,255,255,0.7)] text-sm">
              {selectedCurrency.name}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
        <button
          onClick={validateAndProceed}
          className="flex-1 py-3 px-6 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
