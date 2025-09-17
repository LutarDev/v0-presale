/**
 * LUTAR Presale Platform - Wallet Selection Component
 * Multi-chain wallet selection with icons and connection status
 */

'use client'

import React, { useState, useEffect } from 'react'
import { WalletIcon } from '@/components/ui/icon'
import { WalletData, WalletIcon as WalletIconType } from '@/lib/asset-types'
import { cn } from '@/lib/utils'

// ============================================================================
// WALLET DATA CONFIGURATION
// ============================================================================

const WALLET_CONFIG: Record<string, WalletData> = {
  metamask: {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'metamask',
    supportedChains: ['ETH', 'BNB', 'POL'],
    type: 'browser',
    downloadUrl: 'https://metamask.io/download/',
    isInstalled: false
  },
  phantom: {
    id: 'phantom',
    name: 'Phantom',
    icon: 'phantom',
    supportedChains: ['SOL'],
    type: 'browser',
    downloadUrl: 'https://phantom.app/download',
    isInstalled: false
  },
  tronlink: {
    id: 'tronlink',
    name: 'TronLink',
    icon: 'tronlink',
    supportedChains: ['TRX'],
    type: 'browser',
    downloadUrl: 'https://www.tronlink.org/',
    isInstalled: false
  },
  tonconnect: {
    id: 'tonconnect',
    name: 'TON Connect',
    icon: 'tonconnect',
    supportedChains: ['TON'],
    type: 'web3',
    downloadUrl: 'https://ton.org/wallets',
    isInstalled: false
  },
  walletconnect: {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: 'walletconnect',
    supportedChains: ['ETH', 'BNB', 'POL', 'SOL', 'TRX', 'TON'],
    type: 'web3',
    downloadUrl: 'https://walletconnect.com/',
    isInstalled: false
  },
  trust: {
    id: 'trust',
    name: 'Trust Wallet',
    icon: 'trust-wallet',
    supportedChains: ['ETH', 'BNB', 'POL', 'SOL', 'TRX'],
    type: 'mobile',
    downloadUrl: 'https://trustwallet.com/download',
    isInstalled: false
  },
  coinbase: {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: 'coinbase-wallet',
    supportedChains: ['ETH', 'BNB', 'POL'],
    type: 'browser',
    downloadUrl: 'https://www.coinbase.com/wallet',
    isInstalled: false
  },
  rainbow: {
    id: 'rainbow',
    name: 'Rainbow',
    icon: 'rainbow',
    supportedChains: ['ETH', 'POL'],
    type: 'mobile',
    downloadUrl: 'https://rainbow.me/',
    isInstalled: false
  },
  argent: {
    id: 'argent',
    name: 'Argent',
    icon: 'argent',
    supportedChains: ['ETH', 'POL'],
    type: 'mobile',
    downloadUrl: 'https://www.argent.xyz/',
    isInstalled: false
  },
  imtoken: {
    id: 'imtoken',
    name: 'imToken',
    icon: 'imtoken',
    supportedChains: ['ETH', 'BNB', 'POL', 'TRX'],
    type: 'mobile',
    downloadUrl: 'https://token.im/',
    isInstalled: false
  },
  tokenpocket: {
    id: 'tokenpocket',
    name: 'TokenPocket',
    icon: 'tokenpocket',
    supportedChains: ['ETH', 'BNB', 'POL', 'SOL', 'TRX', 'TON'],
    type: 'mobile',
    downloadUrl: 'https://www.tokenpocket.pro/',
    isInstalled: false
  },
  safepal: {
    id: 'safepal',
    name: 'SafePal',
    icon: 'safepal',
    supportedChains: ['ETH', 'BNB', 'POL', 'SOL', 'TRX'],
    type: 'mobile',
    downloadUrl: 'https://www.safepal.io/',
    isInstalled: false
  },
  math: {
    id: 'math',
    name: 'Math Wallet',
    icon: 'math-wallet',
    supportedChains: ['ETH', 'BNB', 'POL', 'SOL', 'TRX', 'TON'],
    type: 'mobile',
    downloadUrl: 'https://mathwallet.org/',
    isInstalled: false
  },
  bitget: {
    id: 'bitget',
    name: 'Bitget Wallet',
    icon: 'bitget-wallet',
    supportedChains: ['ETH', 'BNB', 'POL', 'SOL', 'TRX'],
    type: 'mobile',
    downloadUrl: 'https://web3.bitget.com/',
    isInstalled: false
  },
  okx: {
    id: 'okx',
    name: 'OKX Wallet',
    icon: 'okx-wallet',
    supportedChains: ['ETH', 'BNB', 'POL', 'SOL', 'TRX', 'TON'],
    type: 'browser',
    downloadUrl: 'https://www.okx.com/web3',
    isInstalled: false
  },
  exodus: {
    id: 'exodus',
    name: 'Exodus',
    icon: 'exodus',
    supportedChains: ['ETH', 'BNB', 'SOL', 'TRX'],
    type: 'mobile',
    downloadUrl: 'https://www.exodus.com/',
    isInstalled: false
  },
  atomic: {
    id: 'atomic',
    name: 'Atomic Wallet',
    icon: 'atomic-wallet',
    supportedChains: ['ETH', 'BNB', 'SOL', 'TRX'],
    type: 'mobile',
    downloadUrl: 'https://atomicwallet.io/',
    isInstalled: false
  },
  ledger: {
    id: 'ledger',
    name: 'Ledger',
    icon: 'ledger',
    supportedChains: ['ETH', 'BNB', 'POL', 'SOL', 'TRX'],
    type: 'hardware',
    downloadUrl: 'https://www.ledger.com/',
    isInstalled: false
  },
  trezor: {
    id: 'trezor',
    name: 'Trezor',
    icon: 'trezor',
    supportedChains: ['ETH', 'BNB', 'POL'],
    type: 'hardware',
    downloadUrl: 'https://trezor.io/',
    isInstalled: false
  },
  keystone: {
    id: 'keystone',
    name: 'Keystone',
    icon: 'keystone',
    supportedChains: ['ETH', 'BNB', 'POL'],
    type: 'hardware',
    downloadUrl: 'https://keyst.one/',
    isInstalled: false
  }
}

// ============================================================================
// WALLET SELECTOR COMPONENT
// ============================================================================

interface WalletSelectorProps {
  selectedChain?: string
  onWalletSelect?: (wallet: WalletData) => void
  onWalletConnect?: (wallet: WalletData) => Promise<void>
  className?: string
  showAllWallets?: boolean
  filterByChain?: boolean
  showInstallPrompts?: boolean
}

export function WalletSelector({
  selectedChain,
  onWalletSelect,
  onWalletConnect,
  className = '',
  showAllWallets = false,
  filterByChain = true,
  showInstallPrompts = true
}: WalletSelectorProps) {
  const [wallets, setWallets] = useState<WalletData[]>([])
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Filter wallets based on selected chain
  useEffect(() => {
    let availableWallets = Object.values(WALLET_CONFIG)

    if (filterByChain && selectedChain) {
      availableWallets = availableWallets.filter(wallet => 
        wallet.supportedChains.includes(selectedChain)
      )
    }

    if (!showAllWallets) {
      // Show only popular wallets by default
      const popularWallets = ['metamask', 'phantom', 'tronlink', 'tonconnect', 'walletconnect', 'trust']
      availableWallets = availableWallets.filter(wallet => 
        popularWallets.includes(wallet.id)
      )
    }

    // Check if wallets are installed
    availableWallets = availableWallets.map(wallet => ({
      ...wallet,
      isInstalled: checkWalletInstalled(wallet.id)
    }))

    setWallets(availableWallets)
  }, [selectedChain, showAllWallets, filterByChain])

  // Check if wallet is installed
  const checkWalletInstalled = (walletId: string): boolean => {
    if (typeof window === 'undefined') return false

    switch (walletId) {
      case 'metamask':
        return !!(window as any).ethereum?.isMetaMask
      case 'phantom':
        return !!(window as any).solana?.isPhantom
      case 'tronlink':
        return !!(window as any).tronWeb
      case 'coinbase':
        return !!(window as any).ethereum?.isCoinbaseWallet
      case 'okx':
        return !!(window as any).okxwallet
      default:
        return false
    }
  }

  // Handle wallet selection
  const handleWalletSelect = (wallet: WalletData) => {
    setSelectedWallet(wallet)
    setConnectionError(null)
    onWalletSelect?.(wallet)
  }

  // Handle wallet connection
  const handleWalletConnect = async (wallet: WalletData) => {
    if (!wallet.isInstalled && showInstallPrompts) {
      window.open(wallet.downloadUrl, '_blank')
      return
    }

    setIsConnecting(true)
    setConnectionError(null)

    try {
      await onWalletConnect?.(wallet)
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }

  // Group wallets by type
  const groupedWallets = wallets.reduce((acc, wallet) => {
    if (!acc[wallet.type]) {
      acc[wallet.type] = []
    }
    acc[wallet.type].push(wallet)
    return acc
  }, {} as Record<string, WalletData[]>)

  const walletTypeLabels = {
    browser: 'Browser Wallets',
    mobile: 'Mobile Wallets',
    hardware: 'Hardware Wallets',
    web3: 'Web3 Wallets'
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedChain 
            ? `Select a wallet that supports ${selectedChain}`
            : 'Choose your preferred wallet to continue'
          }
        </p>
      </div>

      {/* Connection Error */}
      {connectionError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-200">
                {connectionError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Groups */}
      {Object.entries(groupedWallets).map(([type, typeWallets]) => (
        <div key={type} className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {walletTypeLabels[type as keyof typeof walletTypeLabels]}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {typeWallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                isSelected={selectedWallet?.id === wallet.id}
                isConnecting={isConnecting && selectedWallet?.id === wallet.id}
                onSelect={() => handleWalletSelect(wallet)}
                onConnect={() => handleWalletConnect(wallet)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Show All Toggle */}
      {!showAllWallets && (
        <div className="text-center">
          <button
            onClick={() => setWallets(Object.values(WALLET_CONFIG))}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Show all wallets
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// WALLET CARD COMPONENT
// ============================================================================

interface WalletCardProps {
  wallet: WalletData
  isSelected: boolean
  isConnecting: boolean
  onSelect: () => void
  onConnect: () => void
}

function WalletCard({ 
  wallet, 
  isSelected, 
  isConnecting, 
  onSelect, 
  onConnect 
}: WalletCardProps) {
  return (
    <div
      className={cn(
        'relative p-4 border rounded-lg cursor-pointer transition-all duration-200',
        'hover:border-blue-300 dark:hover:border-blue-600',
        'hover:shadow-md hover:scale-105',
        isSelected 
          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
        !wallet.isInstalled && 'opacity-75'
      )}
      onClick={onSelect}
    >
      {/* Wallet Icon */}
      <div className="flex justify-center mb-3">
        <WalletIcon 
          wallet={wallet.icon} 
          size="lg" 
          className="transition-transform duration-200"
        />
      </div>

      {/* Wallet Name */}
      <div className="text-center">
        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {wallet.name}
        </h5>
        
        {/* Installation Status */}
        {!wallet.isInstalled && (
          <p className="text-xs text-orange-600 dark:text-orange-400">
            Install Required
          </p>
        )}
      </div>

      {/* Connect Button */}
      <div className="mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onConnect()
          }}
          disabled={isConnecting}
          className={cn(
            'w-full px-3 py-2 text-xs font-medium rounded-md transition-colors',
            'bg-blue-600 hover:bg-blue-700 text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'dark:bg-blue-500 dark:hover:bg-blue-600'
          )}
        >
          {isConnecting ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Connecting...
            </div>
          ) : (
            wallet.isInstalled ? 'Connect' : 'Install'
          )}
        </button>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// WALLET STATUS COMPONENT
// ============================================================================

interface WalletStatusProps {
  wallet: WalletData | null
  address?: string
  chain?: string
  onDisconnect?: () => void
  className?: string
}

export function WalletStatus({ 
  wallet, 
  address, 
  chain, 
  onDisconnect, 
  className = '' 
}: WalletStatusProps) {
  if (!wallet || !address) return null

  return (
    <div className={cn('flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg', className)}>
      <WalletIcon wallet={wallet.icon} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {wallet.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
        {chain && (
          <p className="text-xs text-blue-600 dark:text-blue-400">
            {chain}
          </p>
        )}
      </div>
      {onDisconnect && (
        <button
          onClick={onDisconnect}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default WalletSelector
