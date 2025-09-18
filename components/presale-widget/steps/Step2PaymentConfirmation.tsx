"use client"

import React, { useState, useEffect } from 'react'
import { PaymentDetailsProps } from '../types/presale-widget.types'
import { ChainIcon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { paymentService } from '@/lib/payment-service'
import { CountdownTimer } from '../shared/CountdownTimer'

export const Step2PaymentConfirmation: React.FC<PaymentDetailsProps> = ({
  paymentDetails,
  connectedWallet,
  onWalletConnect,
  onWalletDisconnect,
  onNext,
  onBack,
  onError
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Update countdown timer
  useEffect(() => {
    if (!paymentDetails) return

    const updateTimer = () => {
      const remaining = paymentService.getTimeRemaining(paymentDetails.expiresAt)
      setTimeRemaining(remaining)
      
      if (remaining <= 0) {
        onError('Payment session expired. Please start over.')
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [paymentDetails, onError])

  const handleCopyAddress = async () => {
    if (paymentDetails?.address) {
      try {
        await navigator.clipboard.writeText(paymentDetails.address)
        setCopiedField('address')
        setTimeout(() => setCopiedField(null), 2000)
      } catch (error) {
        onError('Failed to copy address')
      }
    }
  }

  const handleCopyAmount = async () => {
    if (paymentDetails?.amount) {
      try {
        await navigator.clipboard.writeText(paymentDetails.amount)
        setCopiedField('amount')
        setTimeout(() => setCopiedField(null), 2000)
      } catch (error) {
        onError('Failed to copy amount')
      }
    }
  }

  const formatAmount = (amount: string, currency: any) => {
    return paymentService.formatAmount(amount, currency)
  }

  if (!paymentDetails) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-red-400">Payment details not available</p>
        </div>
        <button
          onClick={onBack}
          className="w-full py-3 px-6 bg-gray-700 text-white rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">
          Complete Payment
        </h2>
        <p className="text-[rgba(255,255,255,0.6)] text-sm">
          Send the exact amount to the address below
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="w-48 h-48 bg-white p-4 rounded-[15px]">
          <img
            src={paymentDetails.qrCode}
            alt="Payment QR Code"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Amount Due */}
      <div className="p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[15px]">
        <div className="text-center">
          <p className="text-[rgba(255,255,255,0.6)] text-sm mb-1">Amount Due</p>
          <p className="text-2xl font-bold text-white">
            {formatAmount(paymentDetails.amount, paymentDetails.currency)}
          </p>
          <p className="text-[rgba(255,255,255,0.6)] text-sm">
            {paymentDetails.currency.symbol} on {paymentDetails.currency.name}
          </p>
        </div>
      </div>

      {/* Countdown Timer */}
      {timeRemaining > 0 && (
        <div className="space-y-2">
          <p className="text-white text-sm text-center">Payment expires in:</p>
          <CountdownTimer timeLeft={timeRemaining} />
        </div>
      )}

      {/* Payment Address */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">Payment Address</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={paymentDetails.address}
            readOnly
            className="flex-1 p-3 bg-[rgba(255,255,255,0.05)] text-white rounded-[15px] border border-[rgba(255,255,255,0.1)] font-mono text-sm"
          />
          <button
            onClick={handleCopyAddress}
            className={cn(
              "p-3 rounded-[15px] transition-colors",
              copiedField === 'address'
                ? "bg-green-600 text-white"
                : "bg-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.2)]"
            )}
          >
            {copiedField === 'address' ? '✓' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Wallet Connection */}
      {connectedWallet ? (
        <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-[15px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 font-medium">Wallet Connected</p>
              <p className="text-gray-400 text-sm font-mono">
                {connectedWallet.address.slice(0, 6)}...{connectedWallet.address.slice(-4)}
              </p>
            </div>
            <button
              onClick={onWalletDisconnect}
              className="px-4 py-2 bg-red-600 text-white rounded-[15px] hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onWalletConnect}
          className="w-full py-4 px-6 bg-[rgb(255,199,0)] text-black font-semibold rounded-[15px] hover:bg-[rgb(255,210,0)] transition-colors"
        >
          Select Wallet
        </button>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 px-6 bg-[rgba(255,255,255,0.05)] text-white rounded-[15px] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-colors font-medium"
        >
          Back
        </button>
        {connectedWallet && (
          <button
            onClick={onNext}
            className="flex-1 py-4 px-6 bg-[rgb(255,199,0)] text-black font-semibold rounded-[15px] hover:bg-[rgb(255,210,0)] transition-colors"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  )
}
