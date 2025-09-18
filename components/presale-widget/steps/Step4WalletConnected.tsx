"use client"

import React, { useState } from 'react'
import { WalletConnectedProps } from '../types/presale-widget.types'
import { WalletIcon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { walletService } from '@/lib/wallet-service'

export const Step4WalletConnected: React.FC<WalletConnectedProps> = ({
  connectedWallet,
  paymentDetails,
  onOpenWallet,
  onDisconnect,
  onNext,
  onBack,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  const handleSendTransaction = async () => {
    if (!paymentDetails) return

    setIsProcessing(true)
    try {
      const result = await walletService.sendTransaction(
        paymentDetails.address,
        paymentDetails.amount,
        paymentDetails.currency
      )

      if (result.success && result.hash) {
        setTransactionHash(result.hash)
        // Move to completion step with transaction info
        onNext()
      } else {
        onError(result.error || 'Transaction failed')
      }
    } catch (error) {
      onError('Transaction failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Connected Wallet Info */}
      <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <WalletIcon 
            wallet={connectedWallet.adapter as any} 
            size={24}
            className="w-6 h-6"
          />
          <div>
            <p className="text-green-400 font-medium">Wallet Connected</p>
            <p className="text-gray-400 text-sm font-mono">
              {connectedWallet.address.slice(0, 6)}...{connectedWallet.address.slice(-4)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-white text-sm">
            Balance: {connectedWallet.balance} {connectedWallet.chain.toUpperCase()}
          </p>
          <button
            onClick={onDisconnect}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        <h3 className="text-white text-lg font-semibold">Payment Information</h3>
        
        <div className="p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Amount:</span>
              <span className="text-white font-medium">{paymentDetails.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Currency:</span>
              <span className="text-white font-medium">{paymentDetails.currency.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">To Address:</span>
              <span className="text-white font-mono text-sm">
                {paymentDetails.address.slice(0, 6)}...{paymentDetails.address.slice(-4)}
              </span>
            </div>
            {transactionHash && (
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction:</span>
                <span className="text-white font-mono text-sm">
                  {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleSendTransaction}
        disabled={isProcessing}
        className={cn(
          "w-full py-3 px-6 font-semibold rounded-lg transition-colors",
          isProcessing
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-yellow-400 text-black hover:bg-yellow-500"
        )}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            Processing...
          </div>
        ) : (
          'Send Transaction'
        )}
      </button>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          {isProcessing 
            ? 'Please approve the transaction in your wallet' 
            : 'Click "Send Transaction" to initiate the payment'
          }
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 py-3 px-6 bg-gray-700 text-white rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        {transactionHash && (
          <button
            onClick={onNext}
            className="flex-1 py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  )
}
