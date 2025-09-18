/**
 * LUTAR Presale Platform - Asset Type Definitions
 * Comprehensive TypeScript definitions for all UI assets
 */

// ============================================================================
// ICON CATEGORIES
// ============================================================================

export type IconCategory = 
  | 'coins'
  | 'wallets' 
  | 'arrows'
  | 'checkmarks'
  | 'blockchain-filters'
  | 'navigation'
  | 'status'
  | 'ui'

// ============================================================================
// COIN ICONS
// ============================================================================

export type CoinIcon = 
  // Major cryptocurrencies (available icons)
  | 'bitcoin' | 'eth-contrast' | 'bnb' | 'solana' | 'tron' | 'ton' | 'polygon'
  // Stablecoins (using chain icons as fallbacks)
  | 'usdc' | 'usdt' | 'dai' | 'busd'
  // LUTAR tokens
  | 'lutar' | 'lutar-white'
  // Other popular tokens
  | 'chainlink' | 'uniswap' | 'aave' | 'compound' | 'maker' | 'yearn'
  | 'sushi' | 'curve' | 'balancer' | '1inch' | 'pancakeswap'

export interface CoinIconData {
  symbol: string
  name: string
  chain: string
  type: 'native' | 'token'
  contractAddress?: string
  decimals: number
  icon: CoinIcon
}

// ============================================================================
// WALLET ICONS
// ============================================================================

export type WalletIcon = 
  // Available wallet icons
  | 'metamask' | 'phantom' | 'walletconnect' | 'trust' | 'backpack' | 'argent'
  // Fallback icons (using available ones)
  | 'tronlink' | 'tonconnect' | 'trust-wallet' | 'coinbase-wallet' | 'rainbow' | 'imtoken'
  | 'tokenpocket' | 'safepal' | 'math-wallet' | 'bitget-wallet' | 'okx-wallet'
  | 'exodus' | 'atomic-wallet' | 'ledger' | 'trezor' | 'keystone'

export interface WalletData {
  id: string
  name: string
  icon: WalletIcon
  supportedChains: string[]
  type: 'browser' | 'mobile' | 'hardware' | 'web3'
  downloadUrl?: string
  isInstalled?: boolean
}

// ============================================================================
// ARROW ICONS
// ============================================================================

export type ArrowIcon = 
  | 'arrow-down-green' | 'arrow-down-grey' | 'arrow-down-white'
  | 'arrow-up-green' | 'arrow-up-grey' | 'arrow-up-white'
  | 'arrow-right-green' | 'arrow-right-grey' | 'arrow-right-white'
  | 'arrow-left-green' | 'arrow-left-grey' | 'arrow-left-white'
  | 'long-arrow-right-grey' | 'long-arrow-right-white'
  | 'long-arrow-left-black' | 'long-arrow-left-white'
  | 'long-arrow-left-grey' | 'long-arrow-right-black'

export type ArrowDirection = 'up' | 'down' | 'left' | 'right'
export type ArrowColor = 'green' | 'grey' | 'white' | 'black'
export type ArrowStyle = 'short' | 'long'

// ============================================================================
// CHECKMARK ICONS
// ============================================================================

export type CheckmarkIcon = 
  | 'checkmark-bold-black' | 'checkmark-thin-black'
  | 'checkmark-thin-white' | 'failed-checkmark'

export type CheckmarkStyle = 'bold' | 'thin'
export type CheckmarkState = 'success' | 'failed'

// ============================================================================
// BLOCKCHAIN FILTER ICONS
// ============================================================================

export type BlockchainFilterIcon = 
  | 'all-chains' | 'evm' | 'layer-2' | 'non-evm' | 'popular' | 'promo'

export interface BlockchainFilter {
  id: string
  name: string
  icon: BlockchainFilterIcon
  description: string
  chains: string[]
  isActive: boolean
}

// ============================================================================
// ICON COMPONENT PROPS
// ============================================================================

export interface IconProps {
  name: string
  size?: number | string
  className?: string
  color?: string
  strokeWidth?: number
  fill?: string
  stroke?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export interface CoinIconProps extends Omit<IconProps, 'name'> {
  coin: CoinIcon
  size?: number | string
}

export interface WalletIconProps extends Omit<IconProps, 'name'> {
  wallet: WalletIcon
  size?: number | string
}

export interface ArrowIconProps extends Omit<IconProps, 'name'> {
  direction: ArrowDirection
  color: ArrowColor
  style?: ArrowStyle
  size?: number | string
}

export interface CheckmarkIconProps extends Omit<IconProps, 'name'> {
  state: CheckmarkState
  style?: CheckmarkStyle
  size?: number | string
}

// ============================================================================
// ASSET CONFIGURATION
// ============================================================================

export interface AssetConfig {
  basePath: string
  fallbackIcon: string
  defaultSize: number
  supportedFormats: string[]
}

export const ASSET_CONFIG: AssetConfig = {
  basePath: '/images/icons',
  fallbackIcon: '/images/icons/coins/lutar.svg',
  defaultSize: 24,
  supportedFormats: ['svg', 'png', 'webp']
}

// ============================================================================
// THEME SUPPORT
// ============================================================================

export type Theme = 'light' | 'dark'

export interface ThemedIconProps extends IconProps {
  theme?: Theme
  lightIcon?: string
  darkIcon?: string
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type AllIconTypes = 
  | CoinIcon 
  | WalletIcon 
  | ArrowIcon 
  | CheckmarkIcon 
  | BlockchainFilterIcon

export interface IconMetadata {
  category: IconCategory
  name: string
  path: string
  size?: { width: number; height: number }
  format: 'svg' | 'png' | 'webp'
  theme?: Theme
}

// ============================================================================
// ICON REGISTRY
// ============================================================================

export interface IconRegistry {
  coins: Record<CoinIcon, IconMetadata>
  wallets: Record<WalletIcon, IconMetadata>
  arrows: Record<ArrowIcon, IconMetadata>
  checkmarks: Record<CheckmarkIcon, IconMetadata>
  blockchainFilters: Record<BlockchainFilterIcon, IconMetadata>
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class IconError extends Error {
  constructor(
    public iconName: string,
    public category: IconCategory,
    message?: string
  ) {
    super(message || `Icon not found: ${category}/${iconName}`)
    this.name = 'IconError'
  }
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64
} as const

export const ICON_COLORS = {
  primary: '#ffc700',
  secondary: '#f76b1c', 
  success: '#00e28e',
  error: '#ff4757',
  warning: '#ffa502',
  info: '#3742fa',
  muted: '#6c757d',
  white: '#ffffff',
  black: '#000000',
  grey: '#6c757d'
} as const

export type IconSize = keyof typeof ICON_SIZES
export type IconColor = keyof typeof ICON_COLORS
