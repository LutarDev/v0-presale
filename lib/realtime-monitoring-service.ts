import { PaymentCurrency } from '@/components/presale-widget/types/presale-widget.types';

export interface TransactionStatus {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  blockNumber?: number;
  gasUsed?: string;
  timestamp: number;
}

export interface MonitoringConfig {
  pollInterval: number; // milliseconds
  maxConfirmations: number;
  timeout: number; // milliseconds
}

export class RealtimeMonitoringService {
  private static instance: RealtimeMonitoringService;
  private activeMonitors: Map<string, NodeJS.Timeout> = new Map();
  private config: MonitoringConfig;

  private constructor() {
    this.config = {
      pollInterval: 5000, // 5 seconds
      maxConfirmations: 1,
      timeout: 300000, // 5 minutes
    };
  }

  public static getInstance(): RealtimeMonitoringService {
    if (!RealtimeMonitoringService.instance) {
      RealtimeMonitoringService.instance = new RealtimeMonitoringService();
    }
    return RealtimeMonitoringService.instance;
  }

  /**
   * Start monitoring a transaction
   */
  public startMonitoring(
    txHash: string,
    currency: PaymentCurrency,
    onStatusUpdate: (status: TransactionStatus) => void,
    onComplete: (status: TransactionStatus) => void,
    onError: (error: string) => void
  ): void {
    // Stop any existing monitor for this transaction
    this.stopMonitoring(txHash);

    const startTime = Date.now();
    let lastStatus: TransactionStatus | null = null;

    const monitor = setInterval(async () => {
      try {
        // Check timeout
        if (Date.now() - startTime > this.config.timeout) {
          this.stopMonitoring(txHash);
          onError('Transaction monitoring timeout');
          return;
        }

        const status = await this.getTransactionStatus(txHash, currency);
        
        // Update status if it changed
        if (!lastStatus || status.status !== lastStatus.status || status.confirmations !== lastStatus.confirmations) {
          onStatusUpdate(status);
          lastStatus = status;
        }

        // Check if transaction is complete
        if (status.status === 'confirmed' && status.confirmations >= this.config.maxConfirmations) {
          this.stopMonitoring(txHash);
          onComplete(status);
        } else if (status.status === 'failed') {
          this.stopMonitoring(txHash);
          onError('Transaction failed');
        }
      } catch (error) {
        console.error('Monitoring error:', error);
        // Don't stop monitoring on individual errors, just log them
      }
    }, this.config.pollInterval);

    this.activeMonitors.set(txHash, monitor);
  }

  /**
   * Stop monitoring a transaction
   */
  public stopMonitoring(txHash: string): void {
    const monitor = this.activeMonitors.get(txHash);
    if (monitor) {
      clearInterval(monitor);
      this.activeMonitors.delete(txHash);
    }
  }

  /**
   * Stop all active monitors
   */
  public stopAllMonitoring(): void {
    this.activeMonitors.forEach((monitor) => {
      clearInterval(monitor);
    });
    this.activeMonitors.clear();
  }

  /**
   * Get transaction status from blockchain
   */
  private async getTransactionStatus(txHash: string, currency: PaymentCurrency): Promise<TransactionStatus> {
    try {
      switch (currency.chain) {
        case 'ethereum':
        case 'bsc':
        case 'polygon':
          return await this.getEthereumTransactionStatus(txHash, currency);
        case 'bitcoin':
          return await this.getBitcoinTransactionStatus(txHash);
        case 'solana':
          return await this.getSolanaTransactionStatus(txHash);
        case 'tron':
          return await this.getTronTransactionStatus(txHash);
        case 'ton':
          return await this.getTonTransactionStatus(txHash);
        default:
          throw new Error(`Unsupported chain: ${currency.chain}`);
      }
    } catch (error) {
      console.error('Error getting transaction status:', error);
      return {
        hash: txHash,
        status: 'pending',
        confirmations: 0,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get Ethereum-compatible transaction status
   */
  private async getEthereumTransactionStatus(txHash: string, currency: PaymentCurrency): Promise<TransactionStatus> {
    const rpcUrl = this.getRpcUrl(currency.chain);
    
    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionReceipt',
          params: [txHash],
          id: 1,
        }),
      });

      const data = await response.json();

      if (data.result) {
        const receipt = data.result;
        return {
          hash: txHash,
          status: receipt.status === '0x1' ? 'confirmed' : 'failed',
          confirmations: 1, // Simplified - in real implementation, calculate from current block
          blockNumber: parseInt(receipt.blockNumber, 16),
          gasUsed: receipt.gasUsed,
          timestamp: Date.now(),
        };
      } else {
        // Transaction not found or still pending
        return {
          hash: txHash,
          status: 'pending',
          confirmations: 0,
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      console.error('Ethereum status check error:', error);
      return {
        hash: txHash,
        status: 'pending',
        confirmations: 0,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get Bitcoin transaction status
   */
  private async getBitcoinTransactionStatus(txHash: string): Promise<TransactionStatus> {
    try {
      const response = await fetch(`https://blockstream.info/api/tx/${txHash}`);
      const data = await response.json();

      if (data.status && data.status.confirmed) {
        return {
          hash: txHash,
          status: 'confirmed',
          confirmations: data.status.block_height ? 1 : 0, // Simplified
          blockNumber: data.status.block_height,
          timestamp: Date.now(),
        };
      } else {
        return {
          hash: txHash,
          status: 'pending',
          confirmations: 0,
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      console.error('Bitcoin status check error:', error);
      return {
        hash: txHash,
        status: 'pending',
        confirmations: 0,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get Solana transaction status
   */
  private async getSolanaTransactionStatus(txHash: string): Promise<TransactionStatus> {
    try {
      const response = await fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getSignatureStatuses',
          params: [[txHash]],
        }),
      });

      const data = await response.json();

      if (data.result && data.result.value && data.result.value[0]) {
        const status = data.result.value[0];
        return {
          hash: txHash,
          status: status.err ? 'failed' : 'confirmed',
          confirmations: status.confirmationStatus === 'finalized' ? 1 : 0,
          timestamp: Date.now(),
        };
      } else {
        return {
          hash: txHash,
          status: 'pending',
          confirmations: 0,
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      console.error('Solana status check error:', error);
      return {
        hash: txHash,
        status: 'pending',
        confirmations: 0,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get TRON transaction status
   */
  private async getTronTransactionStatus(txHash: string): Promise<TransactionStatus> {
    try {
      const response = await fetch(`https://api.trongrid.io/v1/transactions/${txHash}`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const tx = data.data[0];
        return {
          hash: txHash,
          status: tx.ret && tx.ret[0] && tx.ret[0].contractRet === 'SUCCESS' ? 'confirmed' : 'failed',
          confirmations: 1, // Simplified
          timestamp: Date.now(),
        };
      } else {
        return {
          hash: txHash,
          status: 'pending',
          confirmations: 0,
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      console.error('TRON status check error:', error);
      return {
        hash: txHash,
        status: 'pending',
        confirmations: 0,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get TON transaction status
   */
  private async getTonTransactionStatus(txHash: string): Promise<TransactionStatus> {
    try {
      const response = await fetch(`https://toncenter.com/api/v2/getTransactions?hash=${txHash}`);
      const data = await response.json();

      if (data.result && data.result.length > 0) {
        return {
          hash: txHash,
          status: 'confirmed',
          confirmations: 1,
          timestamp: Date.now(),
        };
      } else {
        return {
          hash: txHash,
          status: 'pending',
          confirmations: 0,
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      console.error('TON status check error:', error);
      return {
        hash: txHash,
        status: 'pending',
        confirmations: 0,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get RPC URL for chain
   */
  private getRpcUrl(chain: string): string {
    const rpcUrls: Record<string, string> = {
      ethereum: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
      bsc: 'https://bsc-dataseed.binance.org/',
      polygon: 'https://polygon-rpc.com/',
    };
    
    return rpcUrls[chain] || rpcUrls.ethereum;
  }

  /**
   * Update monitoring configuration
   */
  public updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  public getConfig(): MonitoringConfig {
    return { ...this.config };
  }

  /**
   * Get active monitors count
   */
  public getActiveMonitorsCount(): number {
    return this.activeMonitors.size;
  }
}

export const realtimeMonitoringService = RealtimeMonitoringService.getInstance();
