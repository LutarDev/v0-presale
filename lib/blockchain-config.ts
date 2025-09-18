/**
 * LUTAR Presale Platform - Blockchain Configuration
 * Centralized configuration for all supported blockchains
 */

import { CoinIcon } from './asset-types'

export interface BlockchainConfig {
  symbol: string
  name: string
  icon: CoinIcon
  color: string
  textColor: string
  iconTextColor: string
  chainId?: string
  rpcUrl?: string
  explorerUrl?: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  supportedTokens: string[]
  walletAdapters: string[]
}

export const BLOCKCHAIN_CONFIGS: Record<string, BlockchainConfig> = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: 'bitcoin',
    color: '#f7931a',
    textColor: 'text-[#f7931a]',
    iconTextColor: 'text-white',
    nativeCurrency: {
      name: 'Bitcoin',
      symbol: 'BTC',
      decimals: 8
    },
    supportedTokens: ['BTC'],
    walletAdapters: ['Unisat', 'Xverse']
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'ethereum',
    color: '#627eea',
    textColor: 'text-[#627eea]',
    iconTextColor: 'text-white',
    chainId: '0x1',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    supportedTokens: ['ETH', 'USDC', 'USDT'],
    walletAdapters: ['MetaMask', 'WalletConnect', 'Coinbase Wallet']
  },
  BNB: {
    symbol: 'BNB',
    name: 'BSC',
    icon: 'bnb',
    color: '#f3ba2f',
    textColor: 'text-[#f3ba2f]',
    iconTextColor: 'text-black',
    chainId: '0x38',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    supportedTokens: ['BNB', 'USDC', 'USDT'],
    walletAdapters: ['MetaMask', 'Trust Wallet', 'WalletConnect']
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    icon: 'solana',
    color: '#8c24a2',
    textColor: 'text-[#8c24a2]',
    iconTextColor: 'text-white',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://explorer.solana.com',
    nativeCurrency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9
    },
    supportedTokens: ['SOL', 'USDC'],
    walletAdapters: ['Phantom', 'Solflare']
  },
  POL: {
    symbol: 'POL',
    name: 'Polygon',
    icon: 'polygon',
    color: '#8247e5',
    textColor: 'text-[#8247e5]',
    iconTextColor: 'text-white',
    chainId: '0x89',
    rpcUrl: 'https://polygon-rpc.com/',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    supportedTokens: ['POL', 'USDC', 'USDT'],
    walletAdapters: ['MetaMask', 'WalletConnect']
  },
  TRX: {
    symbol: 'TRX',
    name: 'TRON',
    icon: 'tron',
    color: '#ff060a',
    textColor: 'text-[#ff060a]',
    iconTextColor: 'text-white',
    rpcUrl: 'https://api.trongrid.io',
    explorerUrl: 'https://tronscan.org',
    nativeCurrency: {
      name: 'TRON',
      symbol: 'TRX',
      decimals: 6
    },
    supportedTokens: ['TRX', 'USDT'],
    walletAdapters: ['TronLink']
  },
  TON: {
    symbol: 'TON',
    name: 'TON',
    icon: 'ton',
    color: '#0088cc',
    textColor: 'text-[#0088cc]',
    iconTextColor: 'text-white',
    rpcUrl: 'https://toncenter.com/api/v2/jsonRPC',
    explorerUrl: 'https://tonscan.org',
    nativeCurrency: {
      name: 'TON',
      symbol: 'TON',
      decimals: 9
    },
    supportedTokens: ['TON', 'USDT'],
    walletAdapters: ['Tonkeeper']
  }
}

export function getBlockchainConfig(symbol: string): BlockchainConfig | null {
  return BLOCKCHAIN_CONFIGS[symbol.toUpperCase()] || null
}

export function getAllBlockchainConfigs(): BlockchainConfig[] {
  return Object.values(BLOCKCHAIN_CONFIGS)
}

export function getSupportedChains(): string[] {
  return Object.keys(BLOCKCHAIN_CONFIGS)
}

export function getChainColor(symbol: string): string {
  const config = getBlockchainConfig(symbol)
  return config?.color || '#6c757d'
}

export function getChainTextColor(symbol: string): string {
  const config = getBlockchainConfig(symbol)
  return config?.textColor || 'text-muted-foreground'
}

export function getChainIconTextColor(symbol: string): string {
  const config = getBlockchainConfig(symbol)
  return config?.iconTextColor || 'text-white'
}
