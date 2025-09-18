"use client"

import React from 'react'
import { CompletionProps } from '../types/presale-widget.types'
import { cn } from '@/lib/utils'

export const Step5Completion: React.FC<CompletionProps> = ({
  transactionInfo,
  onAccessDashboard,
  onNext,
  onBack,
  onError
}) => {
  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
        <h3 className="text-green-400 font-semibold mb-2">Payment Successful!</h3>
        <p className="text-white text-sm">
          Your LUTAR tokens will be sent to your BSC wallet address.
        </p>
        <p className="text-gray-400 text-xs mt-2 font-mono">
          BSC Address: {transactionInfo.bscAddress}
        </p>
      </div>

      {/* Transaction Details */}
      <div className="space-y-4">
        <h3 className="text-white text-lg font-semibold">Transaction Information</h3>
        
        <div className="p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Transaction Hash:</span>
              <span className="text-white font-mono text-sm">
                {transactionInfo.hash.slice(0, 6)}...{transactionInfo.hash.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={cn(
                "font-medium",
                transactionInfo.status === 'confirmed' ? "text-green-400" : "text-yellow-400"
              )}>
                {transactionInfo.status.charAt(0).toUpperCase() + transactionInfo.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">LUTAR Amount:</span>
              <span className="text-white font-medium">{transactionInfo.lutarAmount} LUTAR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">BSC Address:</span>
              <span className="text-white font-mono text-sm">
                {transactionInfo.bscAddress.slice(0, 6)}...{transactionInfo.bscAddress.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Timestamp:</span>
              <span className="text-white text-sm">
                {new Date(transactionInfo.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Access */}
      <button
        onClick={onAccessDashboard}
        className="w-full py-3 px-6 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
      >
        Redirect to Dashboard
      </button>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-gray-400 text-xs">
          You can access your dashboard anytime using the BSC wallet address you provided
        </p>
      </div>
    </div>
  )
}
