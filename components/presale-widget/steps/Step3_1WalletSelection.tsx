"use client"

import React, { useState, useEffect } from 'react'
import { WalletSelectionProps } from '../types/presale-widget.types'
import { WalletIcon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { walletService } from '@/lib/wallet-service'

export const Step3_1WalletSelection: React.FC<WalletSelectionProps> = ({
  selectedCurrency,
  onWalletSelect,
  onClose
}) => {
  const [availableWallets, setAvailableWallets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    const loadWallets = async () => {
      setLoading(true)
      try {
        const wallets = walletService.getAvailableWallets(selectedCurrency.chain)
        setAvailableWallets(wallets)
      } catch (error) {
        console.error('Error loading wallets:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWallets()
  }, [selectedCurrency.chain])

  const handleWalletSelect = async (walletName: string) => {
    setConnecting(walletName)
    try {
      const result = await walletService.connectWallet(selectedCurrency.chain, walletName)
      if (result.success) {
        onWalletSelect(walletName)
        onClose()
      } else {
        console.error('Wallet connection failed:', result.error)
        // You could show an error message here
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
    } finally {
      setConnecting(null)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[rgba(0,0,0,0.9)] border border-[rgba(255,255,255,0.1)] rounded-[25px] p-6 w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-white">Loading wallets...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[rgba(0,0,0,0.9)] border border-[rgba(255,255,255,0.1)] rounded-[25px] p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-semibold">Select Wallet</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Currency Info */}
        <div className="mb-6 p-3 bg-[rgba(255,255,255,0.05)] rounded-lg">
          <p className="text-white text-sm">
            Connect wallet for <span className="font-semibold">{selectedCurrency.symbol}</span> payments
          </p>
        </div>

        {/* Wallet List */}
        <div className="space-y-3">
          {availableWallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleWalletSelect(wallet.name)}
              disabled={!wallet.isInstalled() || connecting === wallet.name}
              className={cn(
                "w-full p-4 rounded-lg border transition-all duration-200",
                "flex items-center gap-4",
                wallet.isInstalled() && connecting !== wallet.name
                  ? "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white"
                  : "border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] text-gray-500 cursor-not-allowed"
              )}
            >
              <WalletIcon 
                wallet={wallet.icon as any} 
                size={32}
                className="w-8 h-8"
              />
              <div className="flex-1 text-left">
                <p className="font-medium">{wallet.name}</p>
                {!wallet.isInstalled() && (
                  <p className="text-xs text-gray-500">Not installed</p>
                )}
                {connecting === wallet.name && (
                  <p className="text-xs text-yellow-400">Connecting...</p>
                )}
              </div>
              {wallet.isInstalled() && connecting !== wallet.name && (
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              )}
              {connecting === wallet.name && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
              )}
            </button>
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs">
            Don't have a wallet? Install one from the official website
          </p>
        </div>
      </div>
    </div>
  )
}
