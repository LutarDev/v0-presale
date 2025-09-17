export interface PaymentWallet {
  address: string
  comment?: string
  tag?: string
  note?: string
}

export interface PaymentCurrency {
  symbol: string
  name: string
  chain: string
  type: "native" | "token"
  contractAddress?: string
  decimals: number
  wallet: PaymentWallet
}

export const PAYMENT_WALLETS: Record<string, PaymentCurrency> = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    chain: "BTC",
    type: "native",
    decimals: 8,
    wallet: {
      address: "bc1qarvyg3f4ymcwrp0naftqm6zq05j233s82cpaq2",
    },
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    chain: "ETH",
    type: "native",
    decimals: 18,
    wallet: {
      address: "0x047693b22f3f9F246A563872E58056f0C766337b",
    },
  },
  BNB: {
    symbol: "BNB",
    name: "BNB",
    chain: "BNB",
    type: "native",
    decimals: 18,
    wallet: {
      address: "0xb23DdB2b79d9af4e4DCE7C457e48F7912e242e9a",
    },
  },
  TRX: {
    symbol: "TRX",
    name: "TRON",
    chain: "TRX",
    type: "native",
    decimals: 6,
    wallet: {
      address: "TLyKLx3w3hJGJgzhSjvdRJbYt85RLdBX7M",
    },
  },
  SOL: {
    symbol: "SOL",
    name: "Solana",
    chain: "SOL",
    type: "native",
    decimals: 9,
    wallet: {
      address: "EgJbUJKNn8eUpKLEqXPbogEUiUsYE7J5MWLXcEBWHA29SlxF",
    },
  },
  POL: {
    symbol: "POL",
    name: "Polygon",
    chain: "POL",
    type: "native",
    decimals: 18,
    wallet: {
      address: "0xC8a68a33E6441c8C06DD2c5b0b5B3173a6c5b8c2",
    },
  },
  TON: {
    symbol: "TON",
    name: "TON",
    chain: "TON",
    type: "native",
    decimals: 9,
    wallet: {
      address: "EQBNY7a1Gsy1O7TX0OhGBnM8YhpHQ6mAWIjq2glCTuJ1SlxF",
      comment: "4122895226",
    },
  },
  "USDC-ERC20": {
    symbol: "USDC",
    name: "USD Coin (ERC-20)",
    chain: "ETH",
    type: "token",
    contractAddress: "0xA0b86a33E6441c8C06DD2c5b0b5B3173a6c5b8c2",
    decimals: 6,
    wallet: {
      address: "0x931EecD3bf8f4ed5359C52016fb8F06D29C6202a",
    },
  },
  "USDC-BEP20": {
    symbol: "USDC",
    name: "USD Coin (BEP-20)",
    chain: "BNB",
    type: "token",
    contractAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    decimals: 18,
    wallet: {
      address: "0x5d882e17B8aeeB0f0e82701DB436C42dE2990a83",
    },
  },
  "USDC-POL": {
    symbol: "USDC",
    name: "USD Coin (Polygon)",
    chain: "POL",
    type: "token",
    contractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6,
    wallet: {
      address: "0x131050060158C764331Df2588a172d02406dfF14",
    },
  },
  "USDC-SOL": {
    symbol: "USDC",
    name: "USD Coin (Solana)",
    chain: "SOL",
    type: "token",
    contractAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
    wallet: {
      address: "7cGELFBgYjGjZ9ruo5ckXf4ZomNkgQxoRGjrMPwwKAho",
    },
  },
  "USDT-TRC20": {
    symbol: "USDT",
    name: "Tether (TRC-20)",
    chain: "TRX",
    type: "token",
    contractAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    decimals: 6,
    wallet: {
      address: "TY8JjNbWDVA6wbTFot8vEL8vMNXFYdsibg",
    },
  },
  "USDT-TON": {
    symbol: "USDT",
    name: "Tether (TON)",
    chain: "TON",
    type: "token",
    contractAddress: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
    decimals: 6,
    wallet: {
      address: "EQBNY7a1Gsy1O7TX0OhGBnM8YhpHQ6mAWIjq2glCTuJ1SlxF",
      comment: "7749351237",
    },
  },
  "USDT-POL": {
    symbol: "USDT",
    name: "Tether (Polygon)",
    chain: "POL",
    type: "token",
    contractAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    decimals: 6,
    wallet: {
      address: "0x3e62F373D69062A0B5b2851b677Ad8ab1F557aF1",
    },
  },
  "USDT-ERC20": {
    symbol: "USDT",
    name: "Tether (ERC-20)",
    chain: "ETH",
    type: "token",
    contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    wallet: {
      address: "0xBf8A4341Fe649018D3C56f85092233EdC7242f12",
    },
  },
}

// Helper function to get payment currency by symbol and chain
export function getPaymentCurrency(symbol: string, chain?: string): PaymentCurrency | undefined {
  // For native tokens, match by symbol
  if (!chain || symbol === chain) {
    return PAYMENT_WALLETS[symbol]
  }

  // For tokens, match by symbol-chain combination
  const key = `${symbol}-${getChainSuffix(chain)}`
  return PAYMENT_WALLETS[key]
}

// Helper function to get all currencies for a specific chain
export function getCurrenciesForChain(chain: string): PaymentCurrency[] {
  return Object.values(PAYMENT_WALLETS).filter((currency) => currency.chain === chain)
}

// Helper function to get chain suffix for token identification
function getChainSuffix(chain: string): string {
  const suffixMap: Record<string, string> = {
    ETH: "ERC20",
    BNB: "BEP20",
    TRX: "TRC20",
    POL: "POL",
    SOL: "SOL",
    TON: "TON",
  }
  return suffixMap[chain] || chain
}

// Helper function to format amount with proper decimals
export function formatPaymentAmount(amount: number, currency: PaymentCurrency): string {
  return (amount / Math.pow(10, currency.decimals)).toFixed(currency.decimals)
}

export function validatePaymentCurrency(symbol: string, chain: string): boolean {
  const currency = getPaymentCurrency(symbol, chain)
  if (!currency) {
    console.error("[v0] Payment currency not found:", { symbol, chain })
    return false
  }

  if (!currency.wallet.address) {
    console.error("[v0] Payment wallet address missing:", currency)
    return false
  }

  console.log("[v0] Payment currency validated:", currency)
  return true
}

export function getExplorerUrl(chain: string, txHash: string): string {
  const explorerUrls: Record<string, string> = {
    ETH: `https://etherscan.io/tx/${txHash}`,
    BNB: `https://bscscan.com/tx/${txHash}`,
    POL: `https://polygonscan.com/tx/${txHash}`,
    TRX: `https://tronscan.org/#/transaction/${txHash}`,
    SOL: `https://solscan.io/tx/${txHash}`,
    TON: `https://tonscan.org/tx/${txHash}`,
    BTC: `https://blockstream.info/tx/${txHash}`,
  }

  return explorerUrls[chain] || "#"
}
