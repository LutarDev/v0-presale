"use client"

import React from 'react'
import Image from 'next/image'
import { 
  IconMetadata, 
  IconCategory, 
  type CoinIcon, 
  type WalletIcon, 
  type ArrowIcon, 
  type CheckmarkIcon, 
  type BlockchainFilterIcon,
  ICON_SIZES,
  ICON_COLORS 
} from '@/lib/asset-types'
import { getIconMetadata, getIconPath } from '@/lib/icon-registry'
import { getBlockchainIcon, getWalletIcon, getTokenIcon } from '@/lib/icon-mapping'

// ============================================================================
// BASE ICON COMPONENT
// ============================================================================

interface BaseIconProps {
  size?: number | keyof typeof ICON_SIZES
  className?: string
  alt?: string
  fallback?: React.ReactNode
  onError?: () => void
}

interface IconComponentProps extends BaseIconProps {
  category: IconCategory
  name: string
}

export function Icon({ 
  category, 
  name, 
  size = 'md', 
  className = '', 
  alt,
  fallback,
  onError 
}: IconComponentProps) {
  const iconPath = getIconPath(category, name)
  const iconMetadata = getIconMetadata(category, name)
  
  if (!iconPath || !iconMetadata) {
    console.warn(`Icon not found: ${category}/${name}`)
    return fallback || <div className={`bg-muted rounded ${className}`} />
  }

  const iconSize = typeof size === 'number' ? size : ICON_SIZES[size]
  const altText = alt || `${name} icon`

  return (
    <Image
      src={iconPath}
      alt={altText}
      width={iconSize}
      height={iconSize}
      className={className}
      onError={onError}
      unoptimized={iconMetadata.format === 'svg'}
    />
  )
}

// ============================================================================
// SPECIALIZED ICON COMPONENTS
// ============================================================================

interface CoinIconProps extends BaseIconProps {
  coin: CoinIcon
}

export function CoinIcon({ coin, size = 'md', className = '', ...props }: CoinIconProps) {
  const iconName = getBlockchainIcon(coin)
  return (
    <Icon
      category="coins"
      name={iconName}
      size={size}
      className={className}
      {...props}
    />
  )
}

interface WalletIconProps extends BaseIconProps {
  wallet: WalletIcon
}

export function WalletIcon({ wallet, size = 'md', className = '', ...props }: WalletIconProps) {
  const iconName = getWalletIcon(wallet)
  return (
    <Icon
      category="wallets"
      name={iconName}
      size={size}
      className={className}
      {...props}
    />
  )
}

// ============================================================================
// CHAIN ICON COMPONENT (Alias for CoinIcon with string input)
// ============================================================================

interface ChainIconProps extends BaseIconProps {
  chain: string
}

export function ChainIcon({ chain, size = 'md', className = '', ...props }: ChainIconProps) {
  const iconName = getBlockchainIcon(chain)
  return (
    <Icon
      category="coins"
      name={iconName}
      size={size}
      className={className}
      {...props}
    />
  )
}

// ============================================================================
// CURRENCY ICON COMPONENT (For PaymentCurrency objects)
// ============================================================================

interface CurrencyIconProps extends BaseIconProps {
  currency: {
    symbol: string
    chain: string
    icon: string
    type: 'native' | 'token'
  }
}

export function CurrencyIcon({ currency, size = 'md', className = '', ...props }: CurrencyIconProps) {
  // For stablecoins (USDT/USDC), use the specific icon defined in the currency object
  // For native currencies, use the chain-based icon
  const iconName = currency.type === 'token' && (currency.symbol === 'USDT' || currency.symbol === 'USDC')
    ? currency.icon as CoinIcon
    : getBlockchainIcon(currency.chain)
  
  return (
    <Icon
      category="coins"
      name={iconName}
      size={size}
      className={className}
      {...props}
    />
  )
}

interface ArrowIconProps extends BaseIconProps {
  arrow: ArrowIcon
}

export function ArrowIcon({ arrow, size = 'md', className = '', ...props }: ArrowIconProps) {
  return (
    <Icon
      category="arrows"
      name={arrow}
      size={size}
      className={className}
      {...props}
    />
  )
}

interface CheckmarkIconProps extends BaseIconProps {
  checkmark: CheckmarkIcon
}

export function CheckmarkIcon({ checkmark, size = 'md', className = '', ...props }: CheckmarkIconProps) {
  return (
    <Icon
      category="checkmarks"
      name={checkmark}
      size={size}
      className={className}
      {...props}
    />
  )
}

interface BlockchainFilterIconProps extends BaseIconProps {
  filter: BlockchainFilterIcon
}

export function BlockchainFilterIcon({ filter, size = 'md', className = '', ...props }: BlockchainFilterIconProps) {
  return (
    <Icon
      category="blockchain-filters"
      name={filter}
      size={size}
      className={className}
      {...props}
    />
  )
}

// ============================================================================
// FALLBACK ICON COMPONENT
// ============================================================================

interface FallbackIconProps extends BaseIconProps {
  symbol?: string
  color?: string
  backgroundColor?: string
}

export function FallbackIcon({ 
  symbol = '?', 
  size = 'md', 
  className = '', 
  color = 'white',
  backgroundColor = '#6c757d'
}: FallbackIconProps) {
  const iconSize = typeof size === 'number' ? size : ICON_SIZES[size]
  
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-xs ${className}`}
      style={{
        width: iconSize,
        height: iconSize,
        backgroundColor,
        color
      }}
    >
      {symbol}
    </div>
  )
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the correct coin icon name for a blockchain symbol
 */
export function getCoinIconName(symbol: string): CoinIcon {
  return getBlockchainIcon(symbol)
}

/**
 * Get the correct wallet icon name for a wallet name
 */
export function getWalletIconName(walletName: string): WalletIcon {
  return getWalletIcon(walletName)
}