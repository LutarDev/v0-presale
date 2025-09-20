export interface WalletAdapter {
  name: string
  icon: string
  description: string
  isInstalled: () => boolean
  isAvailable?: () => boolean
  connect: (chain?: string) => Promise<{ 
    success: boolean
    address?: string
    balance?: string
    detectedChain?: string
    error?: string
  }>
  disconnect: () => Promise<void>
  getBalance: (address: string) => Promise<{ success: boolean; balance?: string; error?: string }>
  signTransaction?: (transaction: any) => Promise<string>
  // TON Connect integration
  tonConnect?: {
    sendTransaction: (transaction: any) => Promise<{ boc: string }>
    isConnected: () => boolean
    disconnect: () => Promise<void>
  }
}

// Bitcoin Wallet Adapters
export class UnisatAdapter implements WalletAdapter {
  name = "Unisat"
  icon = "🟠"
  description = "Bitcoin wallet for web3"

  isInstalled(): boolean {
    return typeof window !== "undefined" && "unisat" in window
  }

  async connect(chain?: string): Promise<{ 
    success: boolean
    address?: string
    balance?: string
    detectedChain?: string
    error?: string
  }> {
    if (!this.isInstalled()) {
      return {
        success: false,
        error: "Unisat wallet is not installed"
      }
    }

    try {
      const accounts = await (window as any).unisat.requestAccounts()
      const balance = await (window as any).unisat.getBalance()
      
      return {
        success: true,
        address: accounts[0],
        balance: (balance.confirmed / 100000000).toFixed(8), // Convert satoshis to BTC
        detectedChain: "BTC"
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to connect to Unisat wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async disconnect(): Promise<void> {
    // Unisat doesn't have a disconnect method, handled by browser
  }

  async getBalance(address: string): Promise<{ success: boolean; balance?: string; error?: string }> {
    if (!this.isInstalled()) {
      return { success: false, error: "Unisat wallet not installed" }
    }
    
    try {
      const balance = await (window as any).unisat.getBalance()
      return { 
        success: true, 
        balance: (balance.confirmed / 100000000).toFixed(8) 
      }
    } catch (error) {
      return { 
        success: false, 
        error: "Failed to get balance from Unisat wallet" 
      }
    }
  }
}

export class XverseAdapter implements WalletAdapter {
  name = "Xverse"
  icon = "⚡"
  description = "Bitcoin & Stacks wallet"

  isInstalled(): boolean {
    return typeof window !== "undefined" && "XverseProviders" in window
  }

  async connect(chain?: string): Promise<{ 
    success: boolean
    address?: string
    balance?: string
    detectedChain?: string
    error?: string
  }> {
    if (!this.isInstalled()) {
      return {
        success: false,
        error: "Xverse wallet is not installed"
      }
    }

    try {
      const getAddressOptions = {
        payload: {
          purposes: ["ordinals", "payment"],
          message: "Connect to LUTAR Presale",
          network: {
            type: "Mainnet",
          },
        },
        onFinish: (response: any) => response,
        onCancel: () => {
          throw new Error("User cancelled connection")
        },
      }

      const response = await (window as any).XverseProviders.getAddress(getAddressOptions)
      return {
        success: true,
        address: response.addresses[0].address,
        balance: "0.0000", // Xverse doesn't provide balance directly
        detectedChain: "BTC"
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to connect to Xverse wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async disconnect(): Promise<void> {
    // Xverse doesn't have a disconnect method
  }

  async getBalance(address: string): Promise<{ success: boolean; balance?: string; error?: string }> {
    try {
      // Use Blockstream API for Bitcoin balance
      const response = await fetch(`https://blockstream.info/api/address/${address}`)
      if (response.ok) {
        const data = await response.json()
        const balanceInSats = data.chain_stats?.funded_txo_sum || 0
        const spentInSats = data.chain_stats?.spent_txo_sum || 0
        const balanceInBTC = (balanceInSats - spentInSats) / Math.pow(10, 8)
        return { 
          success: true, 
          balance: balanceInBTC.toFixed(8)
        }
      } else {
        return {
          success: false,
          error: "Failed to fetch balance from Blockstream API"
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Error fetching Bitcoin balance: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}

// Ethereum/EVM Wallet Adapters
export class MetaMaskAdapter implements WalletAdapter {
  name = "MetaMask"
  icon = "🦊"
  description = "Most popular Ethereum wallet"

  isInstalled(): boolean {
    return typeof window !== "undefined" && "ethereum" in window && (window as any).ethereum.isMetaMask
  }

  isAvailable(): boolean {
    return this.isInstalled()
  }

  async connect(chain?: string): Promise<{ 
    success: boolean
    address?: string
    balance?: string
    detectedChain?: string
    error?: string
  }> {
    if (!this.isInstalled()) {
      return {
        success: false,
        error: "MetaMask is not installed"
      }
    }

    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        return {
          success: false,
          error: "No accounts found in MetaMask"
        }
      }

      const balance = await (window as any).ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })

      const balanceInEth = Number.parseInt(balance, 16) / Math.pow(10, 18)

      // Handle chain switching if needed
      if (chain && chain !== "ETH") {
        const chainIds: Record<string, string> = {
          "BNB": "0x38",
          "POL": "0x89"
        }
        
        if (chainIds[chain]) {
          try {
            await this.switchToNetwork(chainIds[chain])
          } catch (error) {
            console.warn("Failed to switch network:", error)
          }
        }
      }

      return {
        success: true,
        address: accounts[0],
        balance: balanceInEth.toFixed(4),
        detectedChain: chain || "ETH"
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to connect to MetaMask: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async disconnect(): Promise<void> {
    // MetaMask doesn't have a programmatic disconnect
  }

  async getBalance(address: string): Promise<{ success: boolean; balance?: string; error?: string }> {
    if (!this.isInstalled()) {
      return { success: false, error: "MetaMask not installed" }
    }
    
    try {
      const balance = await (window as any).ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      const balanceInEth = Number.parseInt(balance, 16) / Math.pow(10, 18)
      return { success: true, balance: balanceInEth.toFixed(4) }
    } catch (error) {
      return { success: false, error: "Failed to get balance" }
    }
  }

  async switchToNetwork(chainId: string): Promise<void> {
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added, add it
        await this.addNetwork(chainId)
      }
    }
  }

  private async addNetwork(chainId: string): Promise<void> {
    const networks: Record<string, any> = {
      "0x38": {
        // BSC
        chainId: "0x38",
        chainName: "BNB Smart Chain",
        nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        blockExplorerUrls: ["https://bscscan.com/"],
      },
      "0x89": {
        // Polygon
        chainId: "0x89",
        chainName: "Polygon",
        nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"],
      },
    }

    if (networks[chainId]) {
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networks[chainId]],
      })
    }
  }
}

// Solana Wallet Adapters
export class PhantomAdapter implements WalletAdapter {
  name = "Phantom"
  icon = "👻"
  description = "Leading Solana wallet"

  isInstalled(): boolean {
    return typeof window !== "undefined" && "solana" in window && (window as any).solana.isPhantom
  }

  async connect(chain?: string): Promise<{ 
    success: boolean
    address?: string
    balance?: string
    detectedChain?: string
    error?: string
  }> {
    if (!this.isInstalled()) {
      return {
        success: false,
        error: "Phantom wallet is not installed"
      }
    }

    try {
      const response = await (window as any).solana.connect()
      const balanceResult = await this.getBalance(response.publicKey.toString())

      return {
        success: true,
        address: response.publicKey.toString(),
        balance: balanceResult.success ? balanceResult.balance : "0.0000",
        detectedChain: "SOL"
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to connect to Phantom wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.isInstalled()) {
      await (window as any).solana.disconnect()
    }
  }

  async getBalance(address: string): Promise<{ success: boolean; balance?: string; error?: string }> {
    try {
      // Use Solana RPC to get actual balance
      const response = await fetch("https://api.mainnet-beta.solana.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [address],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.result && data.result.value !== undefined) {
          const balanceInSOL = data.result.value / Math.pow(10, 9)
          return { 
            success: true, 
            balance: balanceInSOL.toFixed(4)
          }
        }
      }
      
      return {
        success: false,
        error: "Failed to fetch balance from Solana RPC"
      }
    } catch (error) {
      return { 
        success: false, 
        error: `Error fetching Solana balance: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}

export class SolflareAdapter implements WalletAdapter {
  name = "Solflare"
  icon = "☀️"
  description = "Solana ecosystem wallet"

  isInstalled(): boolean {
    return typeof window !== "undefined" && "solflare" in window
  }

  async connect(chain?: string): Promise<{ 
    success: boolean
    address?: string
    balance?: string
    detectedChain?: string
    error?: string
  }> {
    if (!this.isInstalled()) {
      return {
        success: false,
        error: "Solflare wallet is not installed"
      }
    }

    try {
      const response = await (window as any).solflare.connect()
      const balanceResult = await this.getBalance(response.publicKey.toString())

      return {
        success: true,
        address: response.publicKey.toString(),
        balance: balanceResult.success ? balanceResult.balance : "0.0000",
        detectedChain: "SOL"
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to connect to Solflare wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.isInstalled()) {
      await (window as any).solflare.disconnect()
    }
  }

  async getBalance(address: string): Promise<{ success: boolean; balance?: string; error?: string }> {
    try {
      // Use Solana RPC to get actual balance
      const response = await fetch("https://api.mainnet-beta.solana.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [address],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.result && data.result.value !== undefined) {
          const balanceInSOL = data.result.value / Math.pow(10, 9)
          return { 
            success: true, 
            balance: balanceInSOL.toFixed(4)
          }
        }
      }
      
      return {
        success: false,
        error: "Failed to fetch balance from Solana RPC"
      }
    } catch (error) {
      return { 
        success: false, 
        error: `Error fetching Solana balance: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}

// TRON Wallet Adapters
export class TronLinkAdapter implements WalletAdapter {
  name = "TronLink"
  icon = "🔴"
  description = "Official TRON wallet"

  get tronWeb() {
    return typeof window !== "undefined" ? (window as any).tronWeb : null
  }

  isInstalled(): boolean {
    return typeof window !== "undefined" && "tronWeb" in window
  }

  isAvailable(): boolean {
    return this.isInstalled()
  }

  async connect(chain?: string): Promise<{ 
    success: boolean
    address?: string
    balance?: string
    detectedChain?: string
    error?: string
  }> {
    if (!this.isInstalled()) {
      return {
        success: false,
        error: "TronLink wallet is not installed"
      }
    }

    try {
      const tronWeb = this.tronWeb
      
      // Wait for TronLink to be ready
      if (!tronWeb.ready) {
        console.log("[TronLink Adapter] Waiting for TronLink to be ready...")
        
        // Use the new recommended method
        try {
          await tronWeb.request({ method: 'tron_requestAccounts' })
        } catch (error) {
          console.warn("[TronLink Adapter] New method failed, trying legacy method")
          // Fallback to legacy method if needed
          if (tronWeb.request) {
            await tronWeb.request({ method: 'tron_requestAccounts' })
          }
        }

        // Wait a bit for TronLink to initialize
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (!tronWeb.ready) {
          return {
            success: false,
            error: "TronLink failed to initialize. Please refresh the page and try again."
          }
        }
      }

      // Check if we have access to the address
      if (!tronWeb.defaultAddress || !tronWeb.defaultAddress.base58) {
        console.log("[TronLink Adapter] No default address, requesting account access...")
        
        try {
          await tronWeb.request({ method: 'tron_requestAccounts' })
        } catch (error) {
          return {
            success: false,
            error: "Please unlock TronLink and grant access to this website"
          }
        }
        
        // Wait for address to be available
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (!tronWeb.defaultAddress || !tronWeb.defaultAddress.base58) {
          return {
            success: false,
            error: "No TronLink account found. Please create or import an account."
          }
        }
      }

      const address = tronWeb.defaultAddress.base58
      
      // Get balance
      let balance = "0.0000"
      try {
        const balanceResult = await tronWeb.trx.getBalance(address)
        balance = (balanceResult / 1000000).toFixed(4) // Convert from sun to TRX
      } catch (error) {
        console.warn("[TronLink Adapter] Failed to get balance:", error)
        // Continue without balance, it's not critical for connection
      }

      console.log("[TronLink Adapter] Successfully connected:", {
        address,
        balance,
        timestamp: new Date().toISOString()
      })

      return {
        success: true,
        address,
        balance,
        detectedChain: "TRX"
      }
    } catch (error) {
      console.error("[TronLink Adapter] Connection error:", error)
      return {
        success: false,
        error: `Failed to connect to TronLink wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async disconnect(): Promise<void> {
    // TronLink doesn't have a disconnect method
  }

  async getBalance(address: string): Promise<{ success: boolean; balance?: string; error?: string }> {
    if (!this.isInstalled()) {
      return { success: false, error: "TronLink not installed" }
    }
    
    try {
      const tronWeb = this.tronWeb
      if (!tronWeb || !tronWeb.ready) {
        return { success: false, error: "TronLink not ready" }
      }
      
      const balance = await tronWeb.trx.getBalance(address)
      const balanceInTrx = (balance / 1000000).toFixed(4)
      
      console.log("[TronLink Adapter] getBalance:", {
        address,
        rawBalance: balance,
        balanceInTrx,
        timestamp: new Date().toISOString()
      })
      
      return { success: true, balance: balanceInTrx }
    } catch (error) {
      console.error("[TronLink Adapter] getBalance error:", error)
      return { success: false, error: "Failed to get balance" }
    }
  }
}

// TON Wallet Adapters
export class TonkeeperAdapter implements WalletAdapter {
  name = "Tonkeeper"
  icon = "💎"
  description = "Leading TON wallet"
  private connectedAddress: string | null = null
  
  // TON Connect integration
  tonConnect = {
    sendTransaction: async (transaction: any) => {
      if (!this.connectedAddress) {
        throw new Error("TON wallet not connected")
      }

      try {
        // Use TON Connect protocol for transaction
        if (typeof window !== "undefined" && (window as any).tonkeeper) {
          const result = await (window as any).tonkeeper.send("ton_sendTransaction", {
            transaction
          })
          return { boc: result }
        }
        throw new Error("TON wallet not available")
      } catch (error) {
        throw new Error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    
    isConnected: () => {
      return this.connectedAddress !== null
    },
    
    disconnect: async () => {
      this.connectedAddress = null
      if (typeof window !== "undefined" && (window as any).tonkeeper) {
        try {
          await (window as any).tonkeeper.send("ton_disconnect")
        } catch (error) {
          console.warn("Error disconnecting from Tonkeeper:", error)
        }
      }
    }
  }

  isInstalled(): boolean {
    return typeof window !== "undefined" && 
           ((window as any).tonkeeper !== undefined || 
            (window as any).ton !== undefined)
  }

  async connect(chain?: string): Promise<{ 
    success: boolean
    address?: string
    balance?: string
    detectedChain?: string
    error?: string
  }> {
    if (!this.isInstalled()) {
      return {
        success: false,
        error: "Tonkeeper wallet is not installed. Please install Tonkeeper browser extension or use Tonkeeper mobile app."
      }
    }

    try {
      let address: string
      
      // Try modern TON Connect first
      if ((window as any).tonkeeper) {
        const response = await (window as any).tonkeeper.send("ton_requestAccounts")
        address = Array.isArray(response) ? response[0] : response.address || response
      } 
      // Fallback to legacy TON API
      else if ((window as any).ton) {
        const response = await (window as any).ton.send("ton_requestAccounts")
        address = Array.isArray(response) ? response[0] : response.address || response
      }
      else {
        throw new Error("No TON wallet API found")
      }

      if (!address) {
        throw new Error("No address received from wallet")
      }

      // Store connected address
      this.connectedAddress = address
      
      // Get balance
      const balanceResult = await this.getBalance(address)
      
      return {
        success: true,
        address,
        balance: balanceResult.success ? balanceResult.balance : "0.0000",
        detectedChain: "TON"
      }
    } catch (error) {
      this.connectedAddress = null
      return {
        success: false,
        error: `Failed to connect to Tonkeeper wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.tonConnect.disconnect()
  }

  async getBalance(address: string): Promise<{ success: boolean; balance?: string; error?: string }> {
    try {
      // Use TON Center API for TON balance with better error handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(
        `https://toncenter.com/api/v2/getAddressBalance?address=${address}`, 
        { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        }
      )
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        if (data.ok && data.result !== undefined) {
          const balanceInNanoTON = Number(data.result)
          const balanceInTON = balanceInNanoTON / Math.pow(10, 9)
          return { 
            success: true, 
            balance: balanceInTON.toFixed(4)
          }
        } else {
          console.warn('TON Center API returned invalid data:', data)
        }
      } else {
        console.warn(`TON Center API error: ${response.status} ${response.statusText}`)
      }
      
      // Fallback: try alternative TON API
      try {
        const fallbackResponse = await fetch(
          `https://tonapi.io/v1/account/getInfo?account=${address}`,
          { 
            signal: AbortSignal.timeout(5000),
            headers: { 'Accept': 'application/json' }
          }
        )
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()
          if (fallbackData.balance !== undefined) {
            const balanceInTON = Number(fallbackData.balance) / Math.pow(10, 9)
            return { 
              success: true, 
              balance: balanceInTON.toFixed(4)
            }
          }
        }
      } catch (fallbackError) {
        console.warn('TON API fallback failed:', fallbackError)
      }
      
      return {
        success: false,
        error: "Failed to fetch balance from TON APIs"
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { 
          success: false, 
          error: "Request timeout - TON API is not responding"
        }
      }
      return { 
        success: false, 
        error: `Error fetching TON balance: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}

// Wallet Registry
export const walletAdapters = {
  BTC: [new UnisatAdapter(), new XverseAdapter()],
  ETH: [new MetaMaskAdapter()],
  BNB: [new MetaMaskAdapter()],
  SOL: [new PhantomAdapter(), new SolflareAdapter()],
  POL: [new MetaMaskAdapter()],
  TRX: [new TronLinkAdapter()],
  TON: [new TonkeeperAdapter()],
}

export function getWalletAdapters(chain: string): WalletAdapter[] {
  return walletAdapters[chain as keyof typeof walletAdapters] || []
}
