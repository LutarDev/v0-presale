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
      address: "bc1qwftz8tm698pmmg5y0nrqffe5egtd05uaf0cflc",
    },
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    chain: "ETH",
    type: "native",
    decimals: 18,
    wallet: {
      address: "0x6e8E31e66826424B318aBcD97DcabAF0C0d52736",
    },
  },
  BNB: {
    symbol: "BNB",
    name: "BNB",
    chain: "BNB",
    type: "native",
    decimals: 18,
    wallet: {
      address: "0x6e8E31e66826424B318aBcD97DcabAF0C0d52736",
    },
  },
  TRX: {
    symbol: "TRX",
    name: "TRON",
    chain: "TRX",
    type: "native",
    decimals: 6,
    wallet: {
      address: "TPmj9q2R53ytGGu8gL7CFLwCqGxprEUe9r",
    },
  },
  SOL: {
    symbol: "SOL",
    name: "Solana",
    chain: "SOL",
    type: "native",
    decimals: 9,
    wallet: {
      address: "2qyJAaBoeNBnXb2zmnYBzLAGRKGhmHqgb2ZejqMpuoue",
    },
  },
  POL: {
    symbol: "POL",
    name: "Polygon",
    chain: "POL",
    type: "native",
    decimals: 18,
    wallet: {
      address: "0x6e8E31e66826424B318aBcD97DcabAF0C0d52736",
    },
  },
  TON: {
    symbol: "TON",
    name: "TON",
    chain: "TON",
    type: "native",
    decimals: 9,
    wallet: {
      address: "UQAKRgdm0BN7Bgfojsj-bJMrwvFUw0sY5BPGeGgF8mtckTQI",
      comment: "",
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
      address: "0x6e8E31e66826424B318aBcD97DcabAF0C0d52736",
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
      address: "0x6e8E31e66826424B318aBcD97DcabAF0C0d52736",
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
      address: "0x6e8E31e66826424B318aBcD97DcabAF0C0d52736",
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
      address: "2qyJAaBoeNBnXb2zmnYBzLAGRKGhmHqgb2ZejqMpuoue",
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
      address: "TPmj9q2R53ytGGu8gL7CFLwCqGxprEUe9r",
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
      address: "UQAKRgdm0BN7Bgfojsj-bJMrwvFUw0sY5BPGeGgF8mtckTQI",
      comment: "",
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
      address: "0x6e8E31e66826424B318aBcD97DcabAF0C0d52736",
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
      address: "0x6e8E31e66826424B318aBcD97DcabAF0C0d52736",
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
