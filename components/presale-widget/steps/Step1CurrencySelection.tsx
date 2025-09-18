"use client"

import React from 'react'
import { CurrencySelectionProps, SUPPORTED_CURRENCIES } from '../types/presale-widget.types'
import { CurrencyIcon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

export const Step1CurrencySelection: React.FC<CurrencySelectionProps> = ({
  selectedCurrency,
  onCurrencySelect,
  onNext,
  onBack,
  onError
}) => {
  const handleCurrencySelect = (currency: any) => {
    onCurrencySelect(currency)
  }

  const handleContinue = () => {
    if (!selectedCurrency) {
      onError('Please select a payment currency')
      return
    }
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
          Select Payment Method
        </h2>
        <p className="text-[rgba(255,255,255,0.6)] text-sm">
          Choose your preferred cryptocurrency to pay with
        </p>
      </div>

      {/* Currency Selection Grid */}
      <div className="grid grid-cols-3 gap-3">
        {SUPPORTED_CURRENCIES.map((currency) => (
          <button
            key={`${currency.symbol}-${currency.chain}`}
            onClick={() => handleCurrencySelect(currency)}
            className={cn(
              "p-4 rounded-lg border-2 transition-all duration-200",
              "flex flex-col items-center gap-2",
              "hover:scale-105 hover:shadow-lg",
              selectedCurrency?.symbol === currency.symbol && selectedCurrency?.chain === currency.chain
                ? "border-[rgb(255,199,0)] bg-[rgba(255,199,0,0.1)]"
                : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)]"
            )}
          >
            <CurrencyIcon 
              currency={currency}
              size={32}
              className="w-8 h-8"
            />
            <div className="text-center">
              <p className="text-white font-medium text-sm">{currency.symbol}</p>
              <p className="text-[rgba(255,255,255,0.6)] text-xs">
                {currency.chain}
              </p>
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
              <p className="text-white font-medium">Selected Payment Method</p>
              <p className="text-[rgba(255,255,255,0.7)] text-sm">
                {selectedCurrency.symbol} on {selectedCurrency.chain}
              </p>
            </div>
          </div>
        </div>
      )}

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
          disabled={!selectedCurrency}
          className={cn(
            "flex-1 py-3 px-6 rounded-lg font-semibold text-base",
            "transition-all duration-200 ease-in-out",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            selectedCurrency
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
          Select a cryptocurrency to proceed with your LUTAR token purchase
        </p>
      </div>
    </div>
  )
}