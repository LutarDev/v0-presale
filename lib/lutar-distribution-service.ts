export interface LutarDistributionParams {
  recipientAddress: string // BSC wallet address to receive LUTAR tokens
  lutarAmount: string // Amount of LUTAR tokens to send (in tokens, not wei)
  paymentTxHash: string // Original payment transaction hash for tracking
  paymentChain: string // Chain where payment was made
  paymentToken: string // Token used for payment
  paymentAmount: string // Amount paid
}

export interface LutarDistributionResult {
  success: boolean
  distributionTxHash?: string
  error?: string
  queueId?: string
}

export class LutarDistributionService {
  private static readonly ENGINE_URL = "https://engine-production-b94f.up.railway.app"
  private static readonly ACCESS_TOKEN = "zBvVLRq77mUNj6-BqNZbHaSYDIULI50GtKghcy9qd28HHEKwkDhpODYyAjkOH7EpL3xIsXO-ATZhnEHxQnYdaA"
  private static readonly BACKEND_WALLET = "0xfdCd87e45b13998326cA206Cc9De268f8CA480f8"
  private static readonly LUTAR_CONTRACT = "0x2770904185Ed743d991D8fA21C8271ae6Cd4080E" // LUTAR ERC20 contract on BSC
  private static readonly BSC_CHAIN_ID = "56" // BNB Smart Chain mainnet
  private static readonly LUTAR_DECIMALS = 18 // LUTAR token has 18 decimals

  /**
   * Send LUTAR tokens to the recipient's BSC wallet address
   */
  static async distributeLutarTokens(params: LutarDistributionParams): Promise<LutarDistributionResult> {
    try {
      console.log("[LutarDistribution] Starting LUTAR token distribution:", {
        recipientAddress: params.recipientAddress,
        lutarAmount: params.lutarAmount,
        paymentTxHash: params.paymentTxHash,
        paymentChain: params.paymentChain,
        paymentToken: params.paymentToken,
        paymentAmount: params.paymentAmount
      })

      // Validate parameters
      const validation = this.validateDistributionParams(params)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        }
      }

      // Convert LUTAR amount to wei (18 decimals)
      const amountInWei = this.convertToWei(params.lutarAmount, this.LUTAR_DECIMALS)
      console.log("[LutarDistribution] Amount in wei:", amountInWei)

      // Call Thirdweb Engine v2 REST API to send LUTAR tokens
      const response = await fetch(
        `${this.ENGINE_URL}/contract/${this.BSC_CHAIN_ID}/${this.LUTAR_CONTRACT}/write`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.ACCESS_TOKEN}`,
            "x-backend-wallet-address": this.BACKEND_WALLET,
            "x-idempotency-key": this.generateIdempotencyKey(params),
          },
          body: JSON.stringify({
            functionName: "transfer",
            args: [params.recipientAddress, amountInWei],
          }),
        }
      )

      const data = await response.json()
      console.log("[LutarDistribution] Engine response:", data)

      if (!response.ok) {
        const errorMessage = data.message || `HTTP ${response.status}: ${response.statusText}`
        console.error("[LutarDistribution] Engine API error:", errorMessage)
        return {
          success: false,
          error: `Failed to distribute LUTAR tokens: ${errorMessage}`,
        }
      }

      // Extract transaction hash or queue ID from response
      const distributionTxHash = data.transactionHash || data.result?.transactionHash
      const queueId = data.queueId || data.id

      console.log("[LutarDistribution] Distribution successful:", {
        distributionTxHash,
        queueId,
        recipientAddress: params.recipientAddress,
        amount: params.lutarAmount
      })

      return {
        success: true,
        distributionTxHash,
        queueId,
      }

    } catch (error) {
      console.error("[LutarDistribution] Distribution failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred during distribution",
      }
    }
  }

  /**
   * Check the status of a LUTAR token distribution transaction
   */
  static async checkDistributionStatus(queueId: string): Promise<{
    success: boolean
    status?: string
    transactionHash?: string
    error?: string
  }> {
    try {
      console.log("[LutarDistribution] Checking distribution status for queue ID:", queueId)

      const response = await fetch(
        `${this.ENGINE_URL}/transaction/status/${queueId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${this.ACCESS_TOKEN}`,
          },
        }
      )

      const data = await response.json()
      console.log("[LutarDistribution] Status response:", data)

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `Failed to check status: ${response.statusText}`,
        }
      }

      return {
        success: true,
        status: data.status,
        transactionHash: data.transactionHash || data.result?.transactionHash,
      }

    } catch (error) {
      console.error("[LutarDistribution] Status check failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred during status check",
      }
    }
  }

  /**
   * Get LUTAR token balance of the backend wallet
   */
  static async getBackendWalletBalance(): Promise<{
    success: boolean
    balance?: string
    error?: string
  }> {
    try {
      console.log("[LutarDistribution] Checking backend wallet LUTAR balance")

      const response = await fetch(
        `${this.ENGINE_URL}/contract/${this.BSC_CHAIN_ID}/${this.LUTAR_CONTRACT}/read?functionName=balanceOf&args=${this.BACKEND_WALLET}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${this.ACCESS_TOKEN}`,
          },
        }
      )

      const data = await response.json()
      console.log("[LutarDistribution] Balance response:", data)

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `Failed to get balance: ${response.statusText}`,
        }
      }

      // Convert wei to tokens
      const balanceInTokens = this.convertFromWei(data.result || data, this.LUTAR_DECIMALS)

      return {
        success: true,
        balance: balanceInTokens,
      }

    } catch (error) {
      console.error("[LutarDistribution] Balance check failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred during balance check",
      }
    }
  }

  /**
   * Validate distribution parameters
   */
  private static validateDistributionParams(params: LutarDistributionParams): { valid: boolean; error?: string } {
    if (!params.recipientAddress) {
      return { valid: false, error: "Recipient address is required" }
    }

    if (!params.recipientAddress.startsWith("0x") || params.recipientAddress.length !== 42) {
      return { valid: false, error: "Invalid BSC wallet address format" }
    }

    if (!params.lutarAmount || isNaN(Number(params.lutarAmount)) || Number(params.lutarAmount) <= 0) {
      return { valid: false, error: "Invalid LUTAR amount" }
    }

    if (!params.paymentTxHash) {
      return { valid: false, error: "Payment transaction hash is required" }
    }

    return { valid: true }
  }

  /**
   * Convert token amount to wei
   */
  private static convertToWei(amount: string, decimals: number): string {
    const amountNum = Number.parseFloat(amount)
    const weiAmount = amountNum * Math.pow(10, decimals)
    return Math.floor(weiAmount).toString()
  }

  /**
   * Convert wei amount to tokens
   */
  private static convertFromWei(weiAmount: string | number, decimals: number): string {
    const weiNum = Number(weiAmount)
    const tokenAmount = weiNum / Math.pow(10, decimals)
    return tokenAmount.toFixed(6)
  }

  /**
   * Generate unique idempotency key for the distribution request
   */
  private static generateIdempotencyKey(params: LutarDistributionParams): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    return `lutar-dist-${params.paymentTxHash}-${timestamp}-${random}`
  }

  /**
   * Create a webhook payload for LUTAR distribution
   * This can be used to trigger distribution from a webhook endpoint
   */
  static createWebhookPayload(params: LutarDistributionParams): {
    type: string
    paymentTxHash: string
    paymentChain: string
    paymentToken: string
    paymentAmount: string
    lutarAmount: string
    recipientAddress: string
    timestamp: number
  } {
    return {
      type: "lutar_distribution_request",
      paymentTxHash: params.paymentTxHash,
      paymentChain: params.paymentChain,
      paymentToken: params.paymentToken,
      paymentAmount: params.paymentAmount,
      lutarAmount: params.lutarAmount,
      recipientAddress: params.recipientAddress,
      timestamp: Date.now(),
    }
  }
}
