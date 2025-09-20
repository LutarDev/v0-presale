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
  // USDT icons by chain
  'USDT': 'tether',
  'USDT_ETH': 'usdt-erc20',
  'USDT_BSC': 'usdt-bep20',
  'USDT_SOL': 'usdt-solana',
  'USDT_POL': 'usdt-polygon',
  'USDT_TRON': 'usdt-tron',
  'USDT_TON': 'usdt-ton',
  
  // USDC icons by chain
  'USDC': 'usd-coin',
  'USDC_ETH': 'usdc-erc20',
  'USDC_BSC': 'usdc-bep20',
  'USDC_SOL': 'usdc-solana',
  'USDC_POL': 'usdc-polygon',
  'USDC_TRON': 'usdc-tron',
  'USDC_TON': 'usdc-ton',
  
  // Legacy mappings for backward compatibility
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'USDC_ERC20': 'usdc-erc20',
  'USDC_BEP20': 'usdc-bep20',
  //'USDC_POL': 'usdc-polygon',
  //'USDC_SOL': 'usdc-solana',
  //'USDT_TRC20': 'usdt-tron',
  //'USDT_TON': 'usdt-ton',
  //'USDT_POL': 'usdt-polygon',
  'USDT_ERC20': 'usdt-erc20',
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
  return normalizedSymbol === 'USDT' || normalizedSymbol === 'USDC' || 
         Object.keys(STABLECOIN_ICON_MAP).includes(normalizedSymbol)
}

/**
 * Get the appropriate icon for any token/currency symbol
 * @param symbol - Token symbol
 * @param chain - Optional chain to get chain-specific icon
 */
export function getTokenIcon(symbol: string, chain?: string): CoinIcon {
  if (isStablecoin(symbol)) {
    // For stablecoins, try to get chain-specific icon first
    if (chain) {
      const chainSpecificIcon = STABLECOIN_ICON_MAP[`${symbol}_${chain.toUpperCase()}`]
      if (chainSpecificIcon) {
        return chainSpecificIcon
      }
    }
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
