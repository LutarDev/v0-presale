export interface TokenBalance {
  symbol: string
  balance: string
  decimals: number
  contractAddress?: string
}

export interface WalletBalances {
  native: TokenBalance
  usdc?: TokenBalance
  usdt?: TokenBalance
  lutar?: TokenBalance
}

const LUTAR_TOKEN_ADDRESS = "0x2770904185Ed743d991D8fA21C8271ae6Cd4080E"

// Cache for balance data
const balanceCache = new Map<string, { data: WalletBalances; timestamp: number }>()
const CACHE_TTL = 30000 // 30 seconds

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// ERC-20 ABI for balance checking
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
]

export async function fetchWalletBalances(address: string, chain: string): Promise<WalletBalances> {
  console.log("[v0] Fetching balances for:", { address, chain })

  const cacheKey = `${address}-${chain}`
  
  // Check cache first
  const cached = balanceCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("[v0] Returning cached balance data")
    return cached.data
  }

  const balances: WalletBalances = {
    native: { symbol: chain, balance: "0.0000", decimals: 18 },
  }

  try {
    let result: WalletBalances
    
    switch (chain) {
      case "ETH":
        result = await fetchEthereumBalances(address)
        break
      case "BNB":
        result = await fetchBSCBalances(address)
        break
      case "POL":
        result = await fetchPolygonBalances(address)
        break
      case "SOL":
        result = await fetchSolanaBalances(address)
        break
      case "TRX":
        result = await fetchTronBalances(address)
        break
      case "BTC":
        result = await fetchBitcoinBalances(address)
        break
      case "TON":
        result = await fetchTonBalances(address)
        break
      default:
        console.warn("[v0] Unsupported chain for balance fetching:", chain)
        result = balances
    }

    // Cache the result
    balanceCache.set(cacheKey, { data: result, timestamp: Date.now() })
    return result
  } catch (error) {
    console.error("[v0] Error fetching balances:", error)
    return balances
  }
}

// Retry mechanism for failed requests
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
  throw new Error("Max retries exceeded")
}

async function fetchEthereumBalances(address: string): Promise<WalletBalances> {
  const balances: WalletBalances = {
    native: { symbol: "ETH", balance: "0.0000", decimals: 18 },
  }

  if (typeof window !== "undefined" && (window as any).ethereum) {
    try {
      // Get ETH balance
      const ethBalance = await (window as any).ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      const ethBalanceInEth = Number.parseInt(ethBalance, 16) / Math.pow(10, 18)
      balances.native.balance = ethBalanceInEth.toFixed(4)

      // Get USDC balance (ERC-20)
      const usdcAddress = "0xA0b86a33E6441c8C06DD2c5b0b5B3173a6c5b8c2"
      const usdcBalance = await getERC20Balance(address, usdcAddress)
      if (usdcBalance) {
        balances.usdc = {
          symbol: "USDC",
          balance: (Number(usdcBalance) / Math.pow(10, 6)).toFixed(2),
          decimals: 6,
          contractAddress: usdcAddress,
        }
      }

      // Get USDT balance (ERC-20)
      const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
      const usdtBalance = await getERC20Balance(address, usdtAddress)
      if (usdtBalance) {
        balances.usdt = {
          symbol: "USDT",
          balance: (Number(usdtBalance) / Math.pow(10, 6)).toFixed(2),
          decimals: 6,
          contractAddress: usdtAddress,
        }
      }

      // Get LUTAR balance (ERC-20)
      const lutarBalance = await getERC20Balance(address, LUTAR_TOKEN_ADDRESS)
      if (lutarBalance) {
        balances.lutar = {
          symbol: "LUTAR",
          balance: (Number(lutarBalance) / Math.pow(10, 18)).toFixed(4),
          decimals: 18,
          contractAddress: LUTAR_TOKEN_ADDRESS,
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching Ethereum balances:", error)
    }
  }

  return balances
}

async function fetchBSCBalances(address: string): Promise<WalletBalances> {
  const balances: WalletBalances = {
    native: { symbol: "BNB", balance: "0.0000", decimals: 18 },
  }

  if (typeof window !== "undefined" && (window as any).ethereum) {
    try {
      // Get BNB balance
      const bnbBalance = await (window as any).ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      const bnbBalanceInBnb = Number.parseInt(bnbBalance, 16) / Math.pow(10, 18)
      balances.native.balance = bnbBalanceInBnb.toFixed(4)

      // Get USDC balance (BEP-20)
      const usdcAddress = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"
      const usdcBalance = await getERC20Balance(address, usdcAddress)
      if (usdcBalance) {
        balances.usdc = {
          symbol: "USDC",
          balance: (Number(usdcBalance) / Math.pow(10, 18)).toFixed(2),
          decimals: 18,
          contractAddress: usdcAddress,
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching BSC balances:", error)
    }
  }

  return balances
}

async function fetchPolygonBalances(address: string): Promise<WalletBalances> {
  const balances: WalletBalances = {
    native: { symbol: "POL", balance: "0.0000", decimals: 18 },
  }

  if (typeof window !== "undefined" && (window as any).ethereum) {
    try {
      // Get POL balance
      const polBalance = await (window as any).ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      const polBalanceInPol = Number.parseInt(polBalance, 16) / Math.pow(10, 18)
      balances.native.balance = polBalanceInPol.toFixed(4)

      // Get USDC balance (Polygon)
      const usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
      const usdcBalance = await getERC20Balance(address, usdcAddress)
      if (usdcBalance) {
        balances.usdc = {
          symbol: "USDC",
          balance: (Number(usdcBalance) / Math.pow(10, 6)).toFixed(2),
          decimals: 6,
          contractAddress: usdcAddress,
        }
      }

      // Get USDT balance (Polygon)
      const usdtAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
      const usdtBalance = await getERC20Balance(address, usdtAddress)
      if (usdtBalance) {
        balances.usdt = {
          symbol: "USDT",
          balance: (Number(usdtBalance) / Math.pow(10, 6)).toFixed(2),
          decimals: 6,
          contractAddress: usdtAddress,
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching Polygon balances:", error)
    }
  }

  return balances
}

async function fetchSolanaBalances(address: string): Promise<WalletBalances> {
  const balances: WalletBalances = {
    native: { symbol: "SOL", balance: "0.0000", decimals: 9 },
  }

  try {
    // Use Solana Web3.js for real balance fetching
    if (typeof window !== "undefined" && (window as any).solana) {
      const solana = (window as any).solana
      
      // Get SOL balance
      const connection = new (window as any).solanaWeb3.Connection("https://api.mainnet-beta.solana.com")
      const publicKey = new (window as any).solanaWeb3.PublicKey(address)
      const solBalance = await connection.getBalance(publicKey)
      balances.native.balance = (solBalance / Math.pow(10, 9)).toFixed(4)

      // Get USDC balance (SPL token)
      try {
        const usdcMint = new (window as any).solanaWeb3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
        const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
          mint: usdcMint,
        })
        
        if (tokenAccounts.value.length > 0) {
          const tokenAccount = tokenAccounts.value[0]
          const tokenBalance = await connection.getTokenAccountBalance(tokenAccount.pubkey)
          balances.usdc = {
            symbol: "USDC",
            balance: (tokenBalance.value.uiAmount || 0).toFixed(2),
            decimals: 6,
            contractAddress: usdcMint.toString(),
          }
        }
      } catch (usdcError) {
        console.warn("[v0] Error fetching USDC balance on Solana:", usdcError)
      }
    }
  } catch (error) {
    console.error("[v0] Error fetching Solana balances:", error)
  }

  return balances
}

async function fetchTronBalances(address: string): Promise<WalletBalances> {
  const balances: WalletBalances = {
    native: { symbol: "TRX", balance: "0.0000", decimals: 6 },
  }

  if (typeof window !== "undefined" && (window as any).tronWeb) {
    try {
      const balance = await (window as any).tronWeb.trx.getBalance(address)
      balances.native.balance = (balance / 1000000).toFixed(4)
      
      console.log("[Balance Fetcher] TRON balance:", {
        address,
        rawBalance: balance,
        balanceInTrx: balances.native.balance,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error("[v0] Error fetching TRON balances:", error)
    }
  }

  return balances
}

async function fetchBitcoinBalances(address: string): Promise<WalletBalances> {
  const balances: WalletBalances = {
    native: { symbol: "BTC", balance: "0.0000", decimals: 8 },
  }

  try {
    // Use Blockstream API for Bitcoin balance
    const response = await fetch(`https://blockstream.info/api/address/${address}`)
    if (response.ok) {
      const data = await response.json()
      const balanceInSats = data.chain_stats?.funded_txo_sum || 0
      const spentInSats = data.chain_stats?.spent_txo_sum || 0
      const balanceInBTC = (balanceInSats - spentInSats) / Math.pow(10, 8)
      balances.native.balance = balanceInBTC.toFixed(8)
    }
  } catch (error) {
    console.error("[v0] Error fetching Bitcoin balances:", error)
  }

  return balances
}

async function fetchTonBalances(address: string): Promise<WalletBalances> {
  const balances: WalletBalances = {
    native: { symbol: "TON", balance: "0.0000", decimals: 9 },
  }

  try {
    // Use TON Center API for TON balance
    const response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`)
    if (response.ok) {
      const data = await response.json()
      if (data.ok && data.result) {
        const balanceInNanoTON = Number(data.result)
        const balanceInTON = balanceInNanoTON / Math.pow(10, 9)
        balances.native.balance = balanceInTON.toFixed(4)
      }
    }
  } catch (error) {
    console.error("[v0] Error fetching TON balances:", error)
  }

  return balances
}

async function getERC20Balance(walletAddress: string, tokenAddress: string): Promise<string | null> {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    return null
  }

  try {
    const data = `0x70a08231000000000000000000000000${walletAddress.slice(2)}`

    const balance = await (window as any).ethereum.request({
      method: "eth_call",
      params: [
        {
          to: tokenAddress,
          data: data,
        },
        "latest",
      ],
    })

    return balance ? Number.parseInt(balance, 16).toString() : "0"
  } catch (error) {
    console.error("[v0] Error fetching ERC20 balance:", error)
    return null
  }
}
