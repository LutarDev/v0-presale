"use client"

import React from 'react'
import { CurrencySelectionProps, SUPPORTED_CURRENCIES } from '../types/presale-widget.types'
import { CurrencyIcon, ChainIcon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

export const Step1CurrencySelection: React.FC<CurrencySelectionProps> = ({
  selectedCurrency,
  onCurrencySelect,
  onNext,
  onError
}) => {
  const handleCurrencySelect = (currency: typeof SUPPORTED_CURRENCIES[0]) => {
    onCurrencySelect(currency)
    // Auto-continue after selection to go back to step 0
    setTimeout(() => {
      onNext()
    }, 500)
  }

  const handleContinue = () => {
    if (!selectedCurrency) {
      onError('Please select a payment currency')
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Currency Grid */}
      <div className="grid grid-cols-3 gap-3">
        {SUPPORTED_CURRENCIES.map((currency) => (
          <button
            key={`${currency.symbol}-${currency.chain}`}
            onClick={() => handleCurrencySelect(currency)}
            className={cn(
              "currency-option",
              "border border-[rgba(255,255,255,0.1)] rounded-[15px] p-[15px]",
              "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.45)]",
              "flex flex-col items-center gap-2 cursor-pointer",
              "transition-all duration-200 ease-in-out",
              "hover:bg-[rgba(255,255,255,0.1)]",
              selectedCurrency?.symbol === currency.symbol && 
              selectedCurrency?.chain === currency.chain && [
                "border-[rgb(255,199,0)] bg-[rgba(255,199,0,0.1)]",
                "text-white"
              ]
            )}
          >
            <CurrencyIcon 
              currency={currency}
              size={32}
              className="w-8 h-8"
            />
            <div className="text-center">
              <div className="text-sm font-medium">
                {currency.symbol}
              </div>
              <div className="text-xs text-[rgba(255,255,255,0.6)]">
                {currency.name}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Currency Display */}
      {selectedCurrency && (
        <div className="p-4 bg-[rgba(255,199,0,0.1)] border border-[rgba(255,199,0,0.3)] rounded-lg">
          <div className="flex items-center gap-3">
            <CurrencyIcon 
              currency={selectedCurrency}
              size={24}
              className="w-6 h-6"
            />
            <div>
              <p className="text-white font-medium">
                Selected: {selectedCurrency.symbol}
              </p>
              <p className="text-[rgba(255,255,255,0.7)] text-sm">
                {selectedCurrency.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Supported Chains Display */}
      <div className="flex items-center justify-center gap-1">
        {['bitcoin', 'ethereum', 'solana', 'polygon', 'bsc', 'tron', 'ton'].map((chain) => (
          <ChainIcon 
            key={chain}
            chain={chain as any} 
            size={20}
            className="w-5 h-5 opacity-60"
          />
        ))}
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!selectedCurrency}
        className={cn(
          "w-full py-3 px-6 rounded-lg font-semibold text-base",
          "transition-all duration-200 ease-in-out",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          selectedCurrency 
            ? "bg-[rgb(255,199,0)] text-[rgba(0,0,0,0.95)] hover:bg-[rgb(255,210,0)]" 
            : "bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)]"
        )}
      >
        Continue
      </button>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-[rgba(255,255,255,0.5)] text-xs">
          Select your preferred payment currency to continue
        </p>
      </div>
    </div>
  )
}
