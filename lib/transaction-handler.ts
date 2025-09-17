import type { PaymentCurrency } from "./payment-config"

export interface TransactionParams {
  currency: PaymentCurrency
  amount: string // Amount in the currency's base unit
  userAddress: string
  walletAdapter: any
}

export interface TransactionResult {
  success: boolean
  txHash?: string
  error?: string
}

export class TransactionHandler {
  static async executeTransaction(params: TransactionParams): Promise<TransactionResult> {
    const { currency, amount, userAddress, walletAdapter } = params

    try {
      console.log("[v0] Executing transaction:", { currency: currency.symbol, amount, chain: currency.chain })

      switch (currency.chain) {
        case "ETH":
          return await this.executeEthereumTransaction(params)
        case "BNB":
          return await this.executeBNBTransaction(params)
        case "POL":
          return await this.executePolygonTransaction(params)
        case "TRX":
          return await this.executeTronTransaction(params)
        case "SOL":
          return await this.executeSolanaTransaction(params)
        case "TON":
          return await this.executeTonTransaction(params)
        case "BTC":
          return await this.executeBitcoinTransaction(params)
        default:
          throw new Error(`Unsupported chain: ${currency.chain}`)
      }
    } catch (error) {
      console.error("[v0] Transaction failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Transaction failed",
      }
    }
  }

  private static async executeEthereumTransaction(params: TransactionParams): Promise<TransactionResult> {
    const { currency, amount, walletAdapter } = params

    if (!walletAdapter?.provider) {
      throw new Error("Wallet not connected")
    }

    const provider = walletAdapter.provider
    const accounts = await provider.request({ method: "eth_accounts" })

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found")
    }

    const fromAddress = accounts[0]

    if (currency.type === "native") {
      // Native ETH transfer
      const txParams = {
        from: fromAddress,
        to: currency.wallet.address,
        value: `0x${BigInt(amount).toString(16)}`,
        gas: "0x5208", // 21000 gas for simple transfer
      }

      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [txParams],
      })

      return { success: true, txHash }
    } else {
      // ERC-20 token transfer
      const transferData = this.encodeERC20Transfer(currency.wallet.address, amount)

      const txParams = {
        from: fromAddress,
        to: currency.contractAddress,
        data: transferData,
        gas: "0x186A0", // 100000 gas for token transfer
      }

      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [txParams],
      })

      return { success: true, txHash }
    }
  }

  private static async executeBNBTransaction(params: TransactionParams): Promise<TransactionResult> {
    // BNB Smart Chain uses same logic as Ethereum
    return await this.executeEthereumTransaction(params)
  }

  private static async executePolygonTransaction(params: TransactionParams): Promise<TransactionResult> {
    // Polygon uses same logic as Ethereum
    return await this.executeEthereumTransaction(params)
  }

  private static async executeTronTransaction(params: TransactionParams): Promise<TransactionResult> {
    const { currency, amount, walletAdapter } = params

    if (!walletAdapter?.tronWeb) {
      throw new Error("TronLink wallet not connected")
    }

    const tronWeb = walletAdapter.tronWeb

    if (currency.type === "native") {
      // Native TRX transfer
      const tx = await tronWeb.transactionBuilder.sendTrx(
        currency.wallet.address,
        Number.parseInt(amount),
        tronWeb.defaultAddress.base58,
      )

      const signedTx = await tronWeb.trx.sign(tx)
      const result = await tronWeb.trx.sendRawTransaction(signedTx)

      return { success: result.result, txHash: result.txid }
    } else {
      // TRC-20 token transfer
      const contract = await tronWeb.contract().at(currency.contractAddress)
      const result = await contract.transfer(currency.wallet.address, amount).send()

      return { success: true, txHash: result }
    }
  }

  private static async executeSolanaTransaction(params: TransactionParams): Promise<TransactionResult> {
    const { currency, amount, walletAdapter } = params

    if (!walletAdapter?.publicKey) {
      throw new Error("Solana wallet not connected")
    }

    // For Solana, we'll use the wallet's signAndSendTransaction method
    // This is a simplified implementation - in production, you'd use @solana/web3.js

    if (currency.type === "native") {
      // Native SOL transfer
      const transaction = {
        feePayer: walletAdapter.publicKey,
        instructions: [
          {
            keys: [
              { pubkey: walletAdapter.publicKey, isSigner: true, isWritable: true },
              { pubkey: currency.wallet.address, isSigner: false, isWritable: true },
            ],
            programId: "11111111111111111111111111111111", // System program
            data: Buffer.from([2, 0, 0, 0, ...new Uint8Array(new BigUint64Array([BigInt(amount)]).buffer)]),
          },
        ],
      }

      const result = await walletAdapter.signAndSendTransaction(transaction)
      return { success: true, txHash: result.signature }
    } else {
      // SPL token transfer - simplified
      throw new Error("SPL token transfers not implemented in this demo")
    }
  }

  private static async executeTonTransaction(params: TransactionParams): Promise<TransactionResult> {
    const { currency, amount, walletAdapter } = params

    if (!walletAdapter?.tonConnect) {
      throw new Error("TON wallet not connected")
    }

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
      messages: [
        {
          address: currency.wallet.address,
          amount: amount,
          payload: currency.wallet.comment ? btoa(currency.wallet.comment) : undefined,
        },
      ],
    }

    const result = await walletAdapter.tonConnect.sendTransaction(transaction)
    return { success: true, txHash: result.boc }
  }

  private static async executeBitcoinTransaction(params: TransactionParams): Promise<TransactionResult> {
    // Bitcoin transactions require more complex UTXO handling
    // This is a placeholder - in production, you'd integrate with a Bitcoin wallet
    throw new Error("Bitcoin transactions require specialized wallet integration")
  }

  // Helper function to encode ERC-20 transfer function call
  private static encodeERC20Transfer(to: string, amount: string): string {
    // transfer(address,uint256) function signature: 0xa9059cbb
    const functionSignature = "a9059cbb"

    // Remove 0x prefix and pad to 32 bytes
    const toAddress = to.slice(2).padStart(64, "0")

    // Convert amount to hex and pad to 32 bytes
    const amountHex = BigInt(amount).toString(16).padStart(64, "0")

    return `0x${functionSignature}${toAddress}${amountHex}`
  }

  // Helper function to estimate gas for transactions
  static async estimateGas(params: TransactionParams): Promise<string> {
    const { currency, amount, walletAdapter } = params

    if (currency.chain === "ETH" || currency.chain === "BNB" || currency.chain === "POL") {
      if (!walletAdapter?.provider) return "0x5208" // Default gas

      try {
        const accounts = await walletAdapter.provider.request({ method: "eth_accounts" })
        const fromAddress = accounts[0]

        const txParams =
          currency.type === "native"
            ? {
                from: fromAddress,
                to: currency.wallet.address,
                value: `0x${BigInt(amount).toString(16)}`,
              }
            : {
                from: fromAddress,
                to: currency.contractAddress,
                data: this.encodeERC20Transfer(currency.wallet.address, amount),
              }

        const gasEstimate = await walletAdapter.provider.request({
          method: "eth_estimateGas",
          params: [txParams],
        })

        return gasEstimate
      } catch (error) {
        console.error("[v0] Gas estimation failed:", error)
        return currency.type === "native" ? "0x5208" : "0x186A0"
      }
    }

    return "0" // Other chains handle gas differently
  }
}
