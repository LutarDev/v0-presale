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

  const balances: WalletBalances = {
    native: { symbol: chain, balance: "0.0000", decimals: 18 },
  }

  try {
    switch (chain) {
      case "ETH":
        return await fetchEthereumBalances(address)
      case "BNB":
        return await fetchBSCBalances(address)
      case "POL":
        return await fetchPolygonBalances(address)
      case "SOL":
        return await fetchSolanaBalances(address)
      case "TRX":
        return await fetchTronBalances(address)
      case "BTC":
        return await fetchBitcoinBalances(address)
      case "TON":
        return await fetchTonBalances(address)
      default:
        console.warn("[v0] Unsupported chain for balance fetching:", chain)
        return balances
    }
  } catch (error) {
    console.error("[v0] Error fetching balances:", error)
    return balances
  }
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
  return {
    native: { symbol: "SOL", balance: "0.0000", decimals: 9 },
    usdc: { symbol: "USDC", balance: "0.00", decimals: 6 },
  }
}

async function fetchTronBalances(address: string): Promise<WalletBalances> {
  const balances: WalletBalances = {
    native: { symbol: "TRX", balance: "0.0000", decimals: 6 },
  }

  if (typeof window !== "undefined" && (window as any).tronWeb) {
    try {
      const balance = await (window as any).tronWeb.trx.getBalance(address)
      balances.native.balance = (balance / 1000000).toFixed(4)
    } catch (error) {
      console.error("[v0] Error fetching TRON balances:", error)
    }
  }

  return balances
}

async function fetchBitcoinBalances(address: string): Promise<WalletBalances> {
  return {
    native: { symbol: "BTC", balance: "0.0000", decimals: 8 },
  }
}

async function fetchTonBalances(address: string): Promise<WalletBalances> {
  return {
    native: { symbol: "TON", balance: "0.0000", decimals: 9 },
    usdt: { symbol: "USDT", balance: "0.00", decimals: 6 },
  }
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
