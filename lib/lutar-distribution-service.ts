import { PaymentCurrency } from '@/components/presale-widget/types/presale-widget.types';

export interface LutarDistributionRequest {
  recipientAddress: string; // BSC wallet address from Step 2
  lutarAmount: string;
  paymentTxHash: string;
  paymentChain: string;
  paymentToken: string;
  paymentAmount: string;
  userEmail?: string; // Optional email from Step 2
}

export interface LutarDistributionResponse {
  success: boolean;
  message: string;
  distributionTxHash?: string;
  queueId?: string;
  recipientAddress: string;
  amount: string;
  paymentTxHash: string;
  timestamp: number;
}

export interface DistributionStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  txHash?: string;
  error?: string;
}

export class LutarDistributionService {
  private static instance: LutarDistributionService;
  private readonly ENGINE_URL = "https://engine-production-b94f.up.railway.app";
  private readonly ACCESS_TOKEN = "zBvVLRq77mUNj6-BqNZbHaSYDIULI50GtKghcy9qd28HHEKwkDhpODYyAjkOH7EpL3xIsXO-ATZhnEHxQnYdaA";
  private readonly BACKEND_WALLET = "0xfdCd87e45b13998326cA206Cc9De268f8CA480f8";
  private readonly LUTAR_CONTRACT = "0x2770904185Ed743d991D8fA21C8271ae6Cd4080E";
  private readonly BSC_CHAIN_ID = "56";

  private constructor() {}

  public static getInstance(): LutarDistributionService {
    if (!LutarDistributionService.instance) {
      LutarDistributionService.instance = new LutarDistributionService();
    }
    return LutarDistributionService.instance;
  }

  /**
   * Distribute LUTAR tokens to user's BSC wallet address
   */
  public async distributeLutarTokens(request: LutarDistributionRequest): Promise<LutarDistributionResponse> {
    try {
      // Validate BSC address
      if (!this.isValidBscAddress(request.recipientAddress)) {
        throw new Error('Invalid BSC wallet address provided');
      }

      // Convert LUTAR amount to wei (18 decimals)
      const amountInWei = this.convertToWei(request.lutarAmount, 18);

      // Call Thirdweb Engine API
      const response = await fetch(
        `${this.ENGINE_URL}/contract/${this.BSC_CHAIN_ID}/${this.LUTAR_CONTRACT}/write`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
            'x-backend-wallet-address': this.BACKEND_WALLET,
          },
          body: JSON.stringify({
            functionName: 'transfer',
            args: [request.recipientAddress, amountInWei],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Distribution failed');
      }

      return {
        success: true,
        message: 'LUTAR tokens distributed successfully',
        distributionTxHash: data.transactionHash,
        queueId: data.queueId,
        recipientAddress: request.recipientAddress,
        amount: request.lutarAmount,
        paymentTxHash: request.paymentTxHash,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('LUTAR distribution error:', error);
      throw new Error(`Token distribution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check distribution status by queue ID
   */
  public async checkDistributionStatus(queueId: string): Promise<DistributionStatus> {
    try {
      const response = await fetch(
        `${this.ENGINE_URL}/queue/${queueId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check status');
      }

      return {
        status: data.status || 'pending',
        message: data.message || 'Status check completed',
        txHash: data.transactionHash,
        error: data.error
      };
    } catch (error) {
      console.error('Status check error:', error);
      return {
        status: 'failed',
        message: 'Failed to check distribution status',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get backend wallet balance
   */
  public async getBackendWalletBalance(): Promise<string> {
    try {
      const response = await fetch(
        `${this.ENGINE_URL}/contract/${this.BSC_CHAIN_ID}/${this.LUTAR_CONTRACT}/read`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            functionName: 'balanceOf',
            args: [this.BACKEND_WALLET],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get balance');
      }

      // Convert from wei to LUTAR tokens
      return this.convertFromWei(data.result, 18);
    } catch (error) {
      console.error('Balance check error:', error);
      return '0';
    }
  }

  /**
   * Validate BSC address format
   */
  private isValidBscAddress(address: string): boolean {
    if (!address) return false;
    if (!address.startsWith('0x')) return false;
    if (address.length !== 42) return false;
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return false;
    return true;
  }

  /**
   * Convert amount to wei
   */
  private convertToWei(amount: string, decimals: number): string {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '0';
    
    const wei = numAmount * Math.pow(10, decimals);
    return Math.floor(wei).toString();
  }

  /**
   * Convert from wei to token amount
   */
  private convertFromWei(weiAmount: string, decimals: number): string {
    const numWei = parseFloat(weiAmount);
    if (isNaN(numWei)) return '0';
    
    const tokenAmount = numWei / Math.pow(10, decimals);
    return tokenAmount.toFixed(6);
  }

  /**
   * Estimate gas for distribution transaction
   */
  public async estimateDistributionGas(recipientAddress: string, amount: string): Promise<string> {
    try {
      const amountInWei = this.convertToWei(amount, 18);

      const response = await fetch(
        `${this.ENGINE_URL}/contract/${this.BSC_CHAIN_ID}/${this.LUTAR_CONTRACT}/estimate-gas`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
            'x-backend-wallet-address': this.BACKEND_WALLET,
          },
          body: JSON.stringify({
            functionName: 'transfer',
            args: [recipientAddress, amountInWei],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to estimate gas');
      }

      return data.gasEstimate || '0';
    } catch (error) {
      console.error('Gas estimation error:', error);
      return '0';
    }
  }

  /**
   * Get distribution history for a recipient
   */
  public async getDistributionHistory(recipientAddress: string): Promise<LutarDistributionResponse[]> {
    try {
      // This would typically be stored in a database
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('History retrieval error:', error);
      return [];
    }
  }

  /**
   * Validate distribution request
   */
  public validateDistributionRequest(request: LutarDistributionRequest): { valid: boolean; error?: string } {
    if (!request.recipientAddress) {
      return { valid: false, error: 'Recipient address is required' };
    }

    if (!this.isValidBscAddress(request.recipientAddress)) {
      return { valid: false, error: 'Invalid BSC address format' };
    }

    if (!request.lutarAmount || parseFloat(request.lutarAmount) <= 0) {
      return { valid: false, error: 'Invalid LUTAR amount' };
    }

    if (!request.paymentTxHash) {
      return { valid: false, error: 'Payment transaction hash is required' };
    }

    return { valid: true };
  }
}

export const lutarDistributionService = LutarDistributionService.getInstance();