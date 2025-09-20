/**
 * LUTAR Presale Platform - Icon Registry
 * Central registry for all icon assets with metadata
 */

import { 
  IconRegistry, 
  IconMetadata, 
  CoinIcon, 
  WalletIcon, 
  ArrowIcon, 
  CheckmarkIcon, 
  BlockchainFilterIcon,
  IconCategory 
} from './asset-types'

// ============================================================================
// ICON REGISTRY IMPLEMENTATION
// ============================================================================

export const ICON_REGISTRY: IconRegistry = {
  // ============================================================================
  // COIN ICONS
  // ============================================================================
  coins: {
    // LUTAR tokens
    'lutar': {
      category: 'coins',
      name: 'lutar',
      path: '/images/icons/coins/lutar.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    /* 'lutar-white': {
      category: 'coins',
      name: 'lutar-white',
      path: '/images/icons/coins/lutar-white.svg',
      size: { width: 24, height: 24 },
      format: 'svg',
      theme: 'dark'
    }, */
    
    // Major cryptocurrencies
    'bitcoin': {
      category: 'coins',
      name: 'bitcoin',
      path: '/images/icons/coins/bitcoin.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'eth-contrast': {
      category: 'coins',
      name: 'eth-contrast',
      path: '/images/icons/coins/eth-contrast.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'bnb': {
      category: 'coins',
      name: 'bnb',
      path: '/images/icons/coins/bnb.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'solana': {
      category: 'coins',
      name: 'solana',
      path: '/images/icons/coins/solana.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'tron': {
      category: 'coins',
      name: 'tron',
      path: '/images/icons/coins/tron.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'ton': {
      category: 'coins',
      name: 'ton',
      path: '/images/icons/coins/ton.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'polygon': {
      category: 'coins',
      name: 'polygon',
      path: '/images/icons/coins/polygon.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    
    // Stablecoins
    'usdc': {
      category: 'coins',
      name: 'usdc',
      path: '/images/icons/coins/usdc.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'usdt': {
      category: 'coins',
      name: 'usdt',
      path: '/images/icons/coins/usdt.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'dai': {
      category: 'coins',
      name: 'dai',
      path: '/images/icons/coins/dai.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'busd': {
      category: 'coins',
      name: 'busd',
      path: '/images/icons/coins/busd.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    
    // DeFi tokens
    'chainlink': {
      category: 'coins',
      name: 'chainlink',
      path: '/images/icons/coins/chainlink.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'uniswap': {
      category: 'coins',
      name: 'uniswap',
      path: '/images/icons/coins/uniswap.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'aave': {
      category: 'coins',
      name: 'aave',
      path: '/images/icons/coins/aave.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'compound': {
      category: 'coins',
      name: 'compound',
      path: '/images/icons/coins/compound.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'maker': {
      category: 'coins',
      name: 'maker',
      path: '/images/icons/coins/maker.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'yearn': {
      category: 'coins',
      name: 'yearn',
      path: '/images/icons/coins/yearn.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'sushi': {
      category: 'coins',
      name: 'sushi',
      path: '/images/icons/coins/sushi.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'curve': {
      category: 'coins',
      name: 'curve',
      path: '/images/icons/coins/curve.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'balancer': {
      category: 'coins',
      name: 'balancer',
      path: '/images/icons/coins/balancer.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    '1inch': {
      category: 'coins',
      name: '1inch',
      path: '/images/icons/coins/1inch.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'pancakeswap': {
      category: 'coins',
      name: 'pancakeswap',
      path: '/images/icons/coins/pancakeswap.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
     'usd-coin': {
      category: 'coins',
      name: 'usd-coin',
      path: '/images/icons/coins/usdc.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'tether': {
      category: 'coins',
      name: 'tether',
      path: '/images/icons/coins/usdt.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    }, 
    'usdc-tron': {
      category: 'coins',
      name: 'usdc-tron',
      path: '/images/icons/coins/usdc-tron.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'usdt-tron': {
      category: 'coins',
      name: 'usdt-tron',
      path: '/images/icons/coins/usdt-tron.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'usdc-solana': {
      category: 'coins',
      name: 'usdc-solana',
      path: '/images/icons/coins/usdc-solana.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'usdt-solana': {
      category: 'coins',
      name: 'usdt-solana',
      path: '/images/icons/coins/usdt-solana.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'usdc-polygon': {
      category: 'coins',
      name: 'usdc-polygon',
      path: '/images/icons/coins/usdc-polygon.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'usdt-polygon': {
      category: 'coins',
      name: 'usdt-polygon',
      path: '/images/icons/coins/usdt-polygon.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'usdc-ton': {
      category: 'coins',
      name: 'usdc-ton',
      path: '/images/icons/coins/usdc-ton.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'usdt-ton': {
      category: 'coins',
      name: 'usdt-ton',
      path: '/images/icons/coins/usdt-ton.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'usdc-erc20': {
      category: 'coins',
      name: 'usdc-erc20',
      path: '/images/icons/coins/usdc-erc20.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'usdt-erc20': {
      category: 'coins',
      name: 'usdt-erc20',
      path: '/images/icons/coins/usdt-erc20.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'usdc-bep20': {
      category: 'coins',
      name: 'usdc-bep20',
      path: '/images/icons/coins/usdc-bep20.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'usdt-bep20': {
      category: 'coins',
      name: 'usdt-bep20',
      path: '/images/icons/coins/usdt-bep20.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    }
  },

  // ============================================================================
  // WALLET ICONS
  // ============================================================================
  wallets: {
    'metamask': {
      category: 'wallets',
      name: 'metamask',
      path: '/images/icons/wallets/metamask.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'phantom': {
      category: 'wallets',
      name: 'phantom',
      path: '/images/icons/wallets/phantom.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'tronlink': {
      category: 'wallets',
      name: 'tronlink',
      path: '/images/icons/wallets/tronlink.webp',
      size: { width: 24, height: 24 },
      format: 'webp'
    },
    'tonconnect': {
      category: 'wallets',
      name: 'tonconnect',
      path: '/images/icons/wallets/tonconnect.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'walletconnect': {
      category: 'wallets',
      name: 'walletconnect',
      path: '/images/icons/wallets/walletconnect.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'trust-wallet': {
      category: 'wallets',
      name: 'trust-wallet',
      path: '/images/icons/wallets/trust-wallet.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'coinbase-wallet': {
      category: 'wallets',
      name: 'coinbase-wallet',
      path: '/images/icons/wallets/coinbase-wallet.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'rainbow': {
      category: 'wallets',
      name: 'rainbow',
      path: '/images/icons/wallets/rainbow.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'argent': {
      category: 'wallets',
      name: 'argent',
      path: '/images/icons/wallets/argent.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'imtoken': {
      category: 'wallets',
      name: 'imtoken',
      path: '/images/icons/wallets/imtoken.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'tokenpocket': {
      category: 'wallets',
      name: 'tokenpocket',
      path: '/images/icons/wallets/tokenpocket.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'safepal': {
      category: 'wallets',
      name: 'safepal',
      path: '/images/icons/wallets/safepal.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'math-wallet': {
      category: 'wallets',
      name: 'math-wallet',
      path: '/images/icons/wallets/math-wallet.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'bitget-wallet': {
      category: 'wallets',
      name: 'bitget-wallet',
      path: '/images/icons/wallets/bitget-wallet.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'okx-wallet': {
      category: 'wallets',
      name: 'okx-wallet',
      path: '/images/icons/wallets/okx-wallet.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'exodus': {
      category: 'wallets',
      name: 'exodus',
      path: '/images/icons/wallets/exodus.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'atomic-wallet': {
      category: 'wallets',
      name: 'atomic-wallet',
      path: '/images/icons/wallets/atomic-wallet.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'ledger': {
      category: 'wallets',
      name: 'ledger',
      path: '/images/icons/wallets/ledger.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'trezor': {
      category: 'wallets',
      name: 'trezor',
      path: '/images/icons/wallets/trezor.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'keystone': {
      category: 'wallets',
      name: 'keystone',
      path: '/images/icons/wallets/keystone.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'backpack': {
      category: 'wallets',
      name: 'backpack',
      path: '/images/icons/wallets/backpack.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'trust': {
      category: 'wallets',
      name: 'trust',
      path: '/images/icons/wallets/trust.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
  },

  // ============================================================================
  // ARROW ICONS
  // ============================================================================
  arrows: {
    'arrow-down-green': {
      category: 'arrows',
      name: 'arrow-down-green',
      path: '/images/icons/arrow/arrow-down-green.svg',
      size: { width: 7, height: 4 },
      format: 'svg'
    },
    'arrow-down-grey': {
      category: 'arrows',
      name: 'arrow-down-grey',
      path: '/images/icons/arrow/arrow-down-grey.svg',
      size: { width: 13, height: 9 },
      format: 'svg'
    },
    'arrow-down-white': {
      category: 'arrows',
      name: 'arrow-down-white',
      path: '/images/icons/arrow/arrow-down-white.svg',
      size: { width: 13, height: 9 },
      format: 'svg'
    },
    'arrow-up-green': {
      category: 'arrows',
      name: 'arrow-up-green',
      path: '/images/icons/arrow/arrow-up-green.svg',
      size: { width: 7, height: 4 },
      format: 'svg'
    },
    'arrow-up-grey': {
      category: 'arrows',
      name: 'arrow-up-grey',
      path: '/images/icons/arrow/arrow-up-grey.svg',
      size: { width: 13, height: 9 },
      format: 'svg'
    },
    'arrow-up-white': {
      category: 'arrows',
      name: 'arrow-up-white',
      path: '/images/icons/arrow/arrow-up-white.svg',
      size: { width: 13, height: 9 },
      format: 'svg'
    },
    'arrow-right-green': {
      category: 'arrows',
      name: 'arrow-right-green',
      path: '/images/icons/arrow/arrow-right-green.svg',
      size: { width: 4, height: 7 },
      format: 'svg'
    },
    'arrow-right-white': {
      category: 'arrows',
      name: 'arrow-right-white',
      path: '/images/icons/arrow/arrow-right-white.svg',
      size: { width: 9, height: 14 },
      format: 'svg'
    },
    'long-arrow-right-grey': {
      category: 'arrows',
      name: 'long-arrow-right-grey',
      path: '/images/icons/arrow/long-arrow-right-grey.svg',
      size: { width: 24, height: 14 },
      format: 'svg'
    },
    'long-arrow-left-black': {
      category: 'arrows',
      name: 'long-arrow-left-black',
      path: '/images/icons/arrow/long-arrow-left-black.svg',
      size: { width: 24, height: 21 },
      format: 'svg'
    }
  },

  // ============================================================================
  // CHECKMARK ICONS
  // ============================================================================
  checkmarks: {
    'checkmark-bold-black': {
      category: 'checkmarks',
      name: 'checkmark-bold-black',
      path: '/images/icons/checkmark/checkmark-bold-black.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'checkmark-thin-black': {
      category: 'checkmarks',
      name: 'checkmark-thin-black',
      path: '/images/icons/checkmark/checkmark-thin-black.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'checkmark-thin-white': {
      category: 'checkmarks',
      name: 'checkmark-thin-white',
      path: '/images/icons/checkmark/checkmark-thin-white.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    },
    'failed-checkmark': {
      category: 'checkmarks',
      name: 'failed-checkmark',
      path: '/images/icons/checkmark/failed-checkmark.svg',
      size: { width: 24, height: 24 },
      format: 'svg'
    }
  },

  // ============================================================================
  // BLOCKCHAIN FILTER ICONS
  // ============================================================================
  blockchainFilters: {
    'all-chains': {
      category: 'blockchain-filters',
      name: 'all-chains',
      path: '/images/icons/blockchain-filters/all-chains.svg',
      size: { width: 25, height: 25 },
      format: 'svg'
    },
    'evm': {
      category: 'blockchain-filters',
      name: 'evm',
      path: '/images/icons/blockchain-filters/evm.svg',
      size: { width: 10, height: 14 },
      format: 'svg'
    },
    'layer-2': {
      category: 'blockchain-filters',
      name: 'layer-2',
      path: '/images/icons/blockchain-filters/layer-2.svg',
      size: { width: 13, height: 11 },
      format: 'svg'
    },
    'non-evm': {
      category: 'blockchain-filters',
      name: 'non-evm',
      path: '/images/icons/blockchain-filters/non-evm.svg',
      size: { width: 11, height: 14 },
      format: 'svg'
    },
    'popular': {
      category: 'blockchain-filters',
      name: 'popular',
      path: '/images/icons/blockchain-filters/popular.svg',
      size: { width: 10, height: 13 },
      format: 'svg'
    },
    'promo': {
      category: 'blockchain-filters',
      name: 'promo',
      path: '/images/icons/blockchain-filters/promo.svg',
      size: { width: 13, height: 13 },
      format: 'svg'
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getIconMetadata(category: IconCategory, name: string): IconMetadata | null {
  const categoryRegistry = ICON_REGISTRY[category as keyof IconRegistry]
  if (!categoryRegistry) return null
  
  return categoryRegistry[name as keyof typeof categoryRegistry] || null
}

export function getIconPath(category: IconCategory, name: string): string | null {
  const metadata = getIconMetadata(category, name)
  return metadata?.path || null
}

export function getAllIconsByCategory(category: IconCategory): IconMetadata[] {
  const categoryRegistry = ICON_REGISTRY[category as keyof IconRegistry]
  if (!categoryRegistry) return []
  
  return Object.values(categoryRegistry)
}

export function searchIcons(query: string): IconMetadata[] {
  const results: IconMetadata[] = []
  const lowerQuery = query.toLowerCase()
  
  Object.values(ICON_REGISTRY).forEach(categoryRegistry => {
    Object.values(categoryRegistry).forEach(metadata => {
      if (metadata.name.toLowerCase().includes(lowerQuery)) {
        results.push(metadata)
      }
    })
  })
  
  return results
}

export function getIconByPath(path: string): IconMetadata | null {
  for (const categoryRegistry of Object.values(ICON_REGISTRY)) {
    for (const metadata of Object.values(categoryRegistry)) {
      if (metadata.path === path) {
        return metadata
      }
    }
  }
  return null
}
