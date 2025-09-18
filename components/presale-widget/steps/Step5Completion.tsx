"use client"

import React, { useState, useEffect } from 'react'
import { CompletionProps } from '../types/presale-widget.types'
import { cn } from '@/lib/utils'
import { lutarDistributionService } from '@/lib/lutar-distribution-service'

export const Step5Completion: React.FC<CompletionProps> = ({
  transactionInfo,
  onAccessDashboard,
  onNext,
  onBack,
  onError
}) => {
  const [distributionStatus, setDistributionStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending')
  const [distributionHash, setDistributionHash] = useState<string | null>(null)
  const [isDistributing, setIsDistributing] = useState(false)

  useEffect(() => {
    // Automatically trigger LUTAR token distribution when component mounts
    if (transactionInfo.status === 'confirmed' && !distributionHash) {
      triggerLutarDistribution()
    }
  }, [transactionInfo.status])

  const triggerLutarDistribution = async () => {
    setIsDistributing(true)
    setDistributionStatus('processing')

    try {
      const distributionRequest = {
        recipientAddress: transactionInfo.bscAddress,
        lutarAmount: transactionInfo.lutarAmount,
        paymentTxHash: transactionInfo.hash,
        paymentChain: 'ethereum', // This should come from the payment details
        paymentToken: 'ETH', // This should come from the payment details
        paymentAmount: '0.1', // This should come from the payment details
      }

      const result = await lutarDistributionService.distributeLutarTokens(distributionRequest)

      if (result.success) {
        setDistributionHash(result.distributionTxHash || null)
        setDistributionStatus('completed')
        
        // Update transaction info with distribution hash
        if (result.distributionTxHash) {
          // You could update the store here if needed
          console.log('LUTAR distribution completed:', result.distributionTxHash)
        }
      } else {
        setDistributionStatus('failed')
        onError('LUTAR token distribution failed')
      }
    } catch (error) {
      setDistributionStatus('failed')
      onError('LUTAR token distribution failed')
    } finally {
      setIsDistributing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'processing':
        return 'text-yellow-400'
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'processing':
        return 'Processing...'
      case 'failed':
        return 'Failed'
      default:
        return 'Pending'
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
        <h3 className="text-green-400 font-semibold mb-2">Payment Successful!</h3>
        <p className="text-white text-sm">
          Your LUTAR tokens are being sent to your BSC wallet address.
        </p>
        <p className="text-gray-400 text-xs mt-2 font-mono">
          BSC Address: {transactionInfo.bscAddress}
        </p>
      </div>

      {/* LUTAR Distribution Status */}
      <div className="p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium">LUTAR Token Distribution</h4>
          <div className="flex items-center gap-2">
            {isDistributing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
            )}
            <span className={cn("text-sm font-medium", getStatusColor(distributionStatus))}>
              {getStatusText(distributionStatus)}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Amount:</span>
            <span className="text-white text-sm font-medium">{transactionInfo.lutarAmount} LUTAR</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Recipient:</span>
            <span className="text-white text-sm font-mono">
              {transactionInfo.bscAddress.slice(0, 6)}...{transactionInfo.bscAddress.slice(-4)}
            </span>
          </div>
          {distributionHash && (
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Distribution TX:</span>
              <span className="text-white text-sm font-mono">
                {distributionHash.slice(0, 6)}...{distributionHash.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details */}
      <div className="space-y-4">
        <h3 className="text-white text-lg font-semibold">Payment Transaction</h3>
        
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
        Access Presale Dashboard
      </button>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-gray-400 text-xs">
          You can access your dashboard anytime using the BSC wallet address you provided
        </p>
      </div>

      {/* Additional Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => window.open(`https://bscscan.com/tx/${transactionInfo.hash}`, '_blank')}
          className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors text-sm"
        >
          View Payment on BSCScan
        </button>
        {distributionHash && (
          <button
            onClick={() => window.open(`https://bscscan.com/tx/${distributionHash}`, '_blank')}
            className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors text-sm"
          >
            View Distribution
          </button>
        )}
      </div>

      {/* Copy Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigator.clipboard.writeText(transactionInfo.hash)}
          className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors text-sm"
        >
          Copy Payment TX
        </button>
        {distributionHash && (
          <button
            onClick={() => navigator.clipboard.writeText(distributionHash)}
            className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors text-sm"
          >
            Copy Distribution TX
          </button>
        )}
      </div>
    </div>
  )
}
