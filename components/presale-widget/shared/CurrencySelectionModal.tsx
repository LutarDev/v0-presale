import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CurrencyIcon, ChainIcon } from '@/components/ui/icon'
import { usePresaleWidgetStore } from '@/stores/presale-widget-store'
import { PAYMENT_WALLETS, PaymentCurrency } from '@/lib/payment-config'

interface CurrencySelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onCurrencySelect: (currency: PaymentCurrency) => void
  selectedCurrency?: PaymentCurrency
}

export const CurrencySelectionModal: React.FC<CurrencySelectionModalProps> = ({
  isOpen,
  onClose,
  onCurrencySelect,
  selectedCurrency
}) => {
  if (!isOpen) return null

  const handleCurrencySelect = (currency: PaymentCurrency) => {
    onCurrencySelect(currency)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)]">
          <h2 className="text-xl font-semibold text-white">Select Payment Currency</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

                {/* Currency Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(PAYMENT_WALLETS).map((currency: PaymentCurrency) => (
              <button
                key={`${currency.symbol}-${currency.chain}`}
                onClick={() => handleCurrencySelect(currency)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border transition-all",
                  "hover:bg-[rgba(255,255,255,0.05)]",
                  selectedCurrency?.symbol === currency.symbol && selectedCurrency?.chain === currency.chain
                    ? "border-[rgb(255,199,0)] bg-[rgba(255,199,0,0.1)]"
                    : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]"
                )}
              >
                <div className="flex items-center gap-2">
                  <CurrencyIcon 
                    currency={currency}
                    size={24}
                    className="w-6 h-6"
                  />
                  <ChainIcon 
                    chain={currency.symbol}
                    size={20}
                    className="w-5 h-5"
                  />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">{currency.symbol}</p>
                  <p className="text-[rgba(255,255,255,0.6)] text-xs">{currency.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[rgba(255,255,255,0.1)]">
          <p className="text-[rgba(255,255,255,0.6)] text-sm text-center">
            Choose your preferred payment method
          </p>
        </div>
      </div>
    </div>
  )
}
