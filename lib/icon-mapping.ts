/**
 * LUTAR Presale Platform - Icon Mapping System
 * Maps blockchain symbols and wallet names to their corresponding image files
 */

import { CoinIcon, WalletIcon } from './asset-types'

// ============================================================================
// BLOCKCHAIN ICON MAPPING
// ============================================================================

export const BLOCKCHAIN_ICON_MAP: Record<string, CoinIcon> = {
  // Native blockchain currencies (using available icons)
  'BTC': 'bitcoin',
  'ETH': 'eth-contrast',  // Using available eth-contrast.svg
  'BNB': 'bnb',           // Using available bnb.svg
  'SOL': 'solana',
  'POL': 'polygon',
  'TRX': 'tron',
  'TON': 'ton',           // Using available ton.svg
  
  // Alternative names
  'BITCOIN': 'bitcoin',
  'ETHEREUM': 'eth-contrast',
  'BSC': 'bnb',
  'BINANCE': 'bnb',
  'SOLANA': 'solana',
  'POLYGON': 'polygon',
  'TRON': 'tron',
  'THE-OPEN-NETWORK': 'ton',
}

// ============================================================================
// WALLET ICON MAPPING
// ============================================================================

export const WALLET_ICON_MAP: Record<string, WalletIcon> = {
  // MetaMask variants (available)
  'metamask': 'metamask',
  'MetaMask': 'metamask',
  'META_MASK': 'metamask',
  
  // Phantom (available)
  'phantom': 'phantom',
  'Phantom': 'phantom',
  
  // TronLink (fallback to metamask)
  'tronlink': 'metamask',
  'TronLink': 'metamask',
  'TRON_LINK': 'metamask',
  
  // Tonkeeper (fallback to phantom)
  'tonkeeper': 'phantom',
  'Tonkeeper': 'phantom',
  'TON_KEEPER': 'phantom',
  
  // WalletConnect (available)
  'walletconnect': 'walletconnect',
  'WalletConnect': 'walletconnect',
  'WALLET_CONNECT': 'walletconnect',
  
  // Trust Wallet (available)
  'trustwallet': 'trust',
  'Trust Wallet': 'trust',
  'TRUST_WALLET': 'trust',
  
  // Unisat (fallback to metamask)
  'unisat': 'metamask',
  'Unisat': 'metamask',
  
  // Xverse (fallback to phantom)
  'xverse': 'phantom',
  'Xverse': 'phantom',
  
  // Coinbase Wallet (fallback to metamask)
  'coinbase': 'metamask',
  'Coinbase': 'metamask',
  'COINBASE_WALLET': 'metamask',
  
  // Rainbow (fallback to walletconnect)
  'rainbow': 'walletconnect',
  'Rainbow': 'walletconnect',
  
  // Backpack (available)
  'backpack': 'backpack',
  'Backpack': 'backpack',
  
  // Argent (available)
  'argent': 'argent',
  'Argent': 'argent',
}

// ============================================================================
// STABLECOIN ICON MAPPING
// ============================================================================

export const STABLECOIN_ICON_MAP: Record<string, CoinIcon> = {
  // Using chain icons as fallbacks for stablecoins since specific stablecoin icons aren't available
  'USDC': 'eth-contrast',  // USDC is primarily on Ethereum
  'USDT': 'tron',          // USDT is primarily on TRON
  'USDC_ERC20': 'eth-contrast',
  'USDC_BEP20': 'bnb',
  'USDC_POL': 'polygon',
  'USDC_SOL': 'solana',
  'USDT_TRC20': 'tron',
  'USDT_TON': 'ton',
  'USDT_POL': 'polygon',
  'USDT_ERC20': 'eth-contrast',
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the correct icon name for a blockchain symbol
 */
export function getBlockchainIcon(symbol: string): CoinIcon {
  const normalizedSymbol = symbol.toUpperCase()
  return BLOCKCHAIN_ICON_MAP[normalizedSymbol] || 'bitcoin' // Default fallback
}

/**
 * Get the correct icon name for a wallet
 */
export function getWalletIcon(walletName: string): WalletIcon {
  const normalizedName = walletName.toLowerCase().replace(/\s+/g, '')
  return WALLET_ICON_MAP[normalizedName] || 'metamask' // Default fallback
}

/**
 * Get the correct icon name for a stablecoin
 */
export function getStablecoinIcon(symbol: string): CoinIcon {
  const normalizedSymbol = symbol.toUpperCase()
  return STABLECOIN_ICON_MAP[normalizedSymbol] || 'usd-coin' // Default fallback
}

/**
 * Check if a symbol is a stablecoin
 */
export function isStablecoin(symbol: string): boolean {
  const normalizedSymbol = symbol.toUpperCase()
  return Object.keys(STABLECOIN_ICON_MAP).includes(normalizedSymbol)
}

/**
 * Get the appropriate icon for any token/currency symbol
 */
export function getTokenIcon(symbol: string): CoinIcon {
  if (isStablecoin(symbol)) {
    return getStablecoinIcon(symbol)
  }
  return getBlockchainIcon(symbol)
}

// ============================================================================
// ICON AVAILABILITY CHECK
// ============================================================================

/**
 * List of all available blockchain icons
 */
export const AVAILABLE_BLOCKCHAIN_ICONS: CoinIcon[] = [
  'bitcoin',
  'eth-contrast',
  'bnb',
  'solana',
  'polygon',
  'tron',
  'ton',
]

/**
 * List of all available wallet icons
 */
export const AVAILABLE_WALLET_ICONS: WalletIcon[] = [
  'metamask',
  'phantom',
  'walletconnect',
  'trust',
  'backpack',
  'argent',
]

/**
 * Check if an icon is available
 */
export function isIconAvailable(category: 'blockchain' | 'wallet', name: string): boolean {
  if (category === 'blockchain') {
    return AVAILABLE_BLOCKCHAIN_ICONS.includes(name as CoinIcon)
  } else {
    return AVAILABLE_WALLET_ICONS.includes(name as WalletIcon)
  }
}
