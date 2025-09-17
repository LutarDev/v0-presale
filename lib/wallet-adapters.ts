export interface WalletAdapter {
  name: string
  icon: string
  description: string
  isInstalled: () => boolean
  connect: () => Promise<{ address: string; balance: string }>
  disconnect: () => Promise<void>
  getBalance: (address: string) => Promise<string>
  signTransaction?: (transaction: any) => Promise<string>
}

// Bitcoin Wallet Adapters
export class UnisatAdapter implements WalletAdapter {
  name = "Unisat"
  icon = "🟠"
  description = "Bitcoin wallet for web3"

  isInstalled(): boolean {
    return typeof window !== "undefined" && "unisat" in window
  }

  async connect(): Promise<{ address: string; balance: string }> {
    if (!this.isInstalled()) {
      throw new Error("Unisat wallet is not installed")
    }

    try {
      const accounts = await (window as any).unisat.requestAccounts()
      const balance = await (window as any).unisat.getBalance()
      return {
        address: accounts[0],
        balance: (balance.confirmed / 100000000).toFixed(8), // Convert satoshis to BTC
      }
    } catch (error) {
      throw new Error("Failed to connect to Unisat wallet")
    }
  }

  async disconnect(): Promise<void> {
    // Unisat doesn't have a disconnect method, handled by browser
  }

  async getBalance(address: string): Promise<string> {
    if (!this.isInstalled()) return "0.0000"
    try {
      const balance = await (window as any).unisat.getBalance()
      return (balance.confirmed / 100000000).toFixed(8)
    } catch {
      return "0.0000"
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

  async connect(): Promise<{ address: string; balance: string }> {
    if (!this.isInstalled()) {
      throw new Error("Xverse wallet is not installed")
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
        address: response.addresses[0].address,
        balance: "0.0000", // Xverse doesn't provide balance directly
      }
    } catch (error) {
      throw new Error("Failed to connect to Xverse wallet")
    }
  }

  async disconnect(): Promise<void> {
    // Xverse doesn't have a disconnect method
  }

  async getBalance(address: string): Promise<string> {
    return "0.0000" // Would need to query Bitcoin API
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

  async connect(): Promise<{ address: string; balance: string }> {
    if (!this.isInstalled()) {
      throw new Error("MetaMask is not installed")
    }

    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      })

      const balance = await (window as any).ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })

      const balanceInEth = Number.parseInt(balance, 16) / Math.pow(10, 18)

      return {
        address: accounts[0],
        balance: balanceInEth.toFixed(4),
      }
    } catch (error) {
      throw new Error("Failed to connect to MetaMask")
    }
  }

  async disconnect(): Promise<void> {
    // MetaMask doesn't have a programmatic disconnect
  }

  async getBalance(address: string): Promise<string> {
    if (!this.isInstalled()) return "0.0000"
    try {
      const balance = await (window as any).ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      const balanceInEth = Number.parseInt(balance, 16) / Math.pow(10, 18)
      return balanceInEth.toFixed(4)
    } catch {
      return "0.0000"
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

  async connect(): Promise<{ address: string; balance: string }> {
    if (!this.isInstalled()) {
      throw new Error("Phantom wallet is not installed")
    }

    try {
      const response = await (window as any).solana.connect()
      const balance = await this.getBalance(response.publicKey.toString())

      return {
        address: response.publicKey.toString(),
        balance,
      }
    } catch (error) {
      throw new Error("Failed to connect to Phantom wallet")
    }
  }

  async disconnect(): Promise<void> {
    if (this.isInstalled()) {
      await (window as any).solana.disconnect()
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      // Would need to use Solana RPC to get actual balance
      return "0.0000"
    } catch {
      return "0.0000"
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

  async connect(): Promise<{ address: string; balance: string }> {
    if (!this.isInstalled()) {
      throw new Error("Solflare wallet is not installed")
    }

    try {
      const response = await (window as any).solflare.connect()
      return {
        address: response.publicKey.toString(),
        balance: "0.0000",
      }
    } catch (error) {
      throw new Error("Failed to connect to Solflare wallet")
    }
  }

  async disconnect(): Promise<void> {
    if (this.isInstalled()) {
      await (window as any).solflare.disconnect()
    }
  }

  async getBalance(address: string): Promise<string> {
    return "0.0000"
  }
}

// TRON Wallet Adapters
export class TronLinkAdapter implements WalletAdapter {
  name = "TronLink"
  icon = "🔴"
  description = "Official TRON wallet"

  isInstalled(): boolean {
    return typeof window !== "undefined" && "tronWeb" in window
  }

  async connect(): Promise<{ address: string; balance: string }> {
    if (!this.isInstalled()) {
      throw new Error("TronLink wallet is not installed")
    }

    try {
      const tronWeb = (window as any).tronWeb
      if (!tronWeb.ready) {
        throw new Error("TronLink is not ready")
      }

      const address = tronWeb.defaultAddress.base58
      const balance = await tronWeb.trx.getBalance(address)
      const balanceInTrx = balance / 1000000 // Convert from sun to TRX

      return {
        address,
        balance: balanceInTrx.toFixed(4),
      }
    } catch (error) {
      throw new Error("Failed to connect to TronLink wallet")
    }
  }

  async disconnect(): Promise<void> {
    // TronLink doesn't have a disconnect method
  }

  async getBalance(address: string): Promise<string> {
    if (!this.isInstalled()) return "0.0000"
    try {
      const balance = await (window as any).tronWeb.trx.getBalance(address)
      return (balance / 1000000).toFixed(4)
    } catch {
      return "0.0000"
    }
  }
}

// TON Wallet Adapters
export class TonkeeperAdapter implements WalletAdapter {
  name = "Tonkeeper"
  icon = "💎"
  description = "Leading TON wallet"

  isInstalled(): boolean {
    return typeof window !== "undefined" && "tonkeeper" in window
  }

  async connect(): Promise<{ address: string; balance: string }> {
    if (!this.isInstalled()) {
      throw new Error("Tonkeeper wallet is not installed")
    }

    try {
      const response = await (window as any).tonkeeper.send("ton_requestAccounts")
      return {
        address: response[0],
        balance: "0.0000",
      }
    } catch (error) {
      throw new Error("Failed to connect to Tonkeeper wallet")
    }
  }

  async disconnect(): Promise<void> {
    // Tonkeeper disconnect would be handled here
  }

  async getBalance(address: string): Promise<string> {
    return "0.0000"
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
