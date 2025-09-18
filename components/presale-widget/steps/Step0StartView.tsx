"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChainIcon, CurrencyIcon } from '@/components/ui/icon'
import { usePresaleWidgetStore } from '@/stores/presale-widget-store'
import { DEFAULT_CONFIG } from '../types/presale-widget.types'
import { CurrencySelectionModal } from '../shared/CurrencySelectionModal'

interface Step0StartViewProps {
  onNext: () => void
  onError: (error: string) => void
}

export const Step0StartView: React.FC<Step0StartViewProps> = ({
  onNext,
  onError
}) => {
  const { 
    paymentAmount, 
    tokenAmount,
    selectedCurrency,
    setPaymentAmount,
    setSelectedCurrency,
    calculateTokenAmount
  } = usePresaleWidgetStore()
  
  const [localAmount, setLocalAmount] = useState(paymentAmount || '')
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false)

  // Calculate token amount when local amount changes
  useEffect(() => {
    if (localAmount && !isNaN(parseFloat(localAmount))) {
      const calculatedTokens = calculateTokenAmount(localAmount, DEFAULT_CONFIG.lutarPrice)
      usePresaleWidgetStore.getState().setTokenAmount(calculatedTokens)
      setPaymentAmount(localAmount)
    } else {
      usePresaleWidgetStore.getState().setTokenAmount('0')
      setPaymentAmount('')
    }
  }, [localAmount, calculateTokenAmount, setPaymentAmount])

  const handleAmountChange = (value: string) => {
    // Allow empty string, valid numbers, and numbers with decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      // Prevent multiple decimal points
      if ((value.match(/\./g) || []).length <= 1) {
        setLocalAmount(value)
      }
    }
  }

  const handleCurrencySelect = () => {
    setIsCurrencyModalOpen(true)
  }

  const handleCurrencyModalClose = () => {
    setIsCurrencyModalOpen(false)
  }

  const handleBuyClick = () => {
    if (!localAmount || parseFloat(localAmount) <= 0) {
      onError('Please enter a valid amount')
      return
    }
    
    if (parseFloat(localAmount) < DEFAULT_CONFIG.minPurchaseAmount) {
      onError(`Minimum purchase amount is $${DEFAULT_CONFIG.minPurchaseAmount}`)
      return
    }
    
    if (DEFAULT_CONFIG.maxPurchaseAmount && parseFloat(localAmount) > DEFAULT_CONFIG.maxPurchaseAmount) {
      onError(`Maximum purchase amount is $${DEFAULT_CONFIG.maxPurchaseAmount}`)
      return
    }
    
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Amount Input Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[rgba(255,255,255,0.45)] text-sm">
            You pay (USD)
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={localAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              step="0.01"
              min="0"
              className={cn(
                "w-full p-4 bg-transparent text-white text-lg",
                "border border-[rgba(255,255,255,0.1)] rounded-[15px]",
                "focus:outline-none focus:border-[rgb(255,199,0)] focus:ring-1 focus:ring-[rgb(255,199,0)]",
                "placeholder:text-[rgba(255,255,255,0.45)]",
                "hover:border-[rgba(255,255,255,0.2)] transition-colors",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-[rgba(255,255,255,0.45)] text-sm"></span>
              <button
                onClick={handleCurrencySelect}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5",
                  "bg-[rgba(255,255,255,0.05)] rounded-[15px]",
                  "border border-[rgba(255,255,255,0.1)]",
                  "hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                )}
              >
                {selectedCurrency ? (
                  <>
                    <CurrencyIcon currency={selectedCurrency} size={20} />
                    <ChainIcon chain={selectedCurrency.symbol} size={20} />
                    <span className="text-white text-sm">{selectedCurrency.symbol}</span>
                  </>
                ) : (
                  <>
                    <ChainIcon chain="ETH" size={20} />
                    <span className="text-white text-sm">Select</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* You receive section */}
        <div className="space-y-2">
          <label className="text-[rgba(255,255,255,0.45)] text-sm">
            You receive
          </label>
          <div className="p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[15px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[rgb(255,199,0)] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">L</span>
              </div>
              <span className="text-white text-lg">
                {tokenAmount || '0.00'} LUTAR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Button */}
      <button
        onClick={handleBuyClick}
        disabled={!localAmount || parseFloat(localAmount) <= 0}
        className={cn(
          "w-full py-4 px-6",
          "bg-[rgb(255,199,0)] text-black font-semibold text-lg text-center",
          "rounded-[15px] hover:bg-[rgb(255,210,0)]",
          "transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[rgb(255,199,0)]"
        )}
      >
        CONTINUE
      </button>

      {/* Additional Info */}
      <div className="text-center">
        <p className="text-[rgba(255,255,255,0.45)] text-xs">
          By purchasing LUTAR tokens, you agree to our Terms of Service
        </p>
      </div>

      {/* Currency Selection Modal */}
      <CurrencySelectionModal
        isOpen={isCurrencyModalOpen}
        onClose={handleCurrencyModalClose}
        selectedCurrency={selectedCurrency}
        onCurrencySelect={(currency) => {
          setSelectedCurrency(currency)
          setIsCurrencyModalOpen(false)
        }}
      />
    </div>
  )
}
