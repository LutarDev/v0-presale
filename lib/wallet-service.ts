import { PaymentCurrency } from '@/components/presale-widget/types/presale-widget.types';

export interface WalletAdapter {
  name: string;
  icon: string;
  chain: string;
  connect: () => Promise<WalletConnectionResult>;
  disconnect: () => Promise<void>;
  sendTransaction: (to: string, amount: string, currency: PaymentCurrency) => Promise<TransactionResult>;
  getBalance: (currency: PaymentCurrency) => Promise<string>;
  isInstalled: () => boolean;
  isConnected: () => boolean;
}

export interface WalletConnectionResult {
  address: string;
  chain: string;
  walletName: string;
  success: boolean;
  error?: string;
}

export interface TransactionResult {
  hash: string;
  success: boolean;
  error?: string;
}

export interface WalletInfo {
  address: string;
  chain: string;
  name: string;
  balance?: string;
}

// Mock wallet adapters - these will be replaced with real implementations
export const createMockWalletAdapter = (name: string, chain: string, icon: string): WalletAdapter => ({
  name,
  icon,
  chain,
  connect: async (): Promise<WalletConnectionResult> => {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful connection
    return {
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      chain,
      walletName: name,
      success: true,
    };
  },
  disconnect: async () => {
    // Mock disconnection
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  sendTransaction: async (to: string, amount: string, currency: PaymentCurrency): Promise<TransactionResult> => {
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful transaction
    return {
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      success: true,
    };
  },
  getBalance: async (currency: PaymentCurrency): Promise<string> => {
    // Mock balance
    return (Math.random() * 10).toFixed(6);
  },
  isInstalled: () => {
    // Mock installation check - in real implementation, check if wallet extension is available
    return Math.random() > 0.3; // 70% chance of being "installed"
  },
  isConnected: () => {
    // Mock connection status
    return false;
  },
});

// Wallet adapters for different chains
export const WALLET_ADAPTERS: Record<string, WalletAdapter[]> = {
  bitcoin: [
    createMockWalletAdapter('Unisat', 'bitcoin', 'unisat'),
    createMockWalletAdapter('Xverse', 'bitcoin', 'xverse'),
  ],
  ethereum: [
    createMockWalletAdapter('MetaMask', 'ethereum', 'metamask'),
    createMockWalletAdapter('Trust Wallet', 'ethereum', 'trust-wallet'),
    createMockWalletAdapter('Coinbase Wallet', 'ethereum', 'coinbase-wallet'),
    createMockWalletAdapter('Rainbow', 'ethereum', 'rainbow'),
  ],
  bsc: [
    createMockWalletAdapter('MetaMask', 'bsc', 'metamask'),
    createMockWalletAdapter('Trust Wallet', 'bsc', 'trust-wallet'),
  ],
  solana: [
    createMockWalletAdapter('Phantom', 'solana', 'phantom'),
    createMockWalletAdapter('Backpack', 'solana', 'backpack'),
  ],
  polygon: [
    createMockWalletAdapter('MetaMask', 'polygon', 'metamask'),
    createMockWalletAdapter('Trust Wallet', 'polygon', 'trust-wallet'),
  ],
  tron: [
    createMockWalletAdapter('TronLink', 'tron', 'tronlink'),
  ],
  ton: [
    createMockWalletAdapter('Tonkeeper', 'ton', 'tonkeeper'),
    createMockWalletAdapter('Ton Wallet', 'ton', 'ton-wallet'),
  ],
};

export class WalletService {
  private static instance: WalletService;
  private connectedWallet: WalletInfo | null = null;
  private adapters: Map<string, WalletAdapter> = new Map();

  private constructor() {
    // Initialize adapters
    Object.values(WALLET_ADAPTERS).flat().forEach(adapter => {
      this.adapters.set(`${adapter.chain}-${adapter.name}`, adapter);
    });
  }

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  public getAvailableWallets(chain: string): WalletAdapter[] {
    return WALLET_ADAPTERS[chain] || [];
  }

  public async connectWallet(chain: string, walletName: string): Promise<WalletConnectionResult> {
    const adapter = this.adapters.get(`${chain}-${walletName}`);
    if (!adapter) {
      return {
        address: '',
        chain: '',
        walletName: '',
        success: false,
        error: 'Wallet adapter not found',
      };
    }

    try {
      const result = await adapter.connect();
      if (result.success) {
        this.connectedWallet = {
          address: result.address,
          chain: result.chain,
          name: result.walletName,
        };
      }
      return result;
    } catch (error) {
      return {
        address: '',
        chain: '',
        walletName: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  public async disconnectWallet(): Promise<void> {
    if (this.connectedWallet) {
      const adapter = this.adapters.get(`${this.connectedWallet.chain}-${this.connectedWallet.name}`);
      if (adapter) {
        await adapter.disconnect();
      }
      this.connectedWallet = null;
    }
  }

  public async sendTransaction(to: string, amount: string, currency: PaymentCurrency): Promise<TransactionResult> {
    if (!this.connectedWallet) {
      return {
        hash: '',
        success: false,
        error: 'No wallet connected',
      };
    }

    const adapter = this.adapters.get(`${this.connectedWallet.chain}-${this.connectedWallet.name}`);
    if (!adapter) {
      return {
        hash: '',
        success: false,
        error: 'Wallet adapter not found',
      };
    }

    try {
      return await adapter.sendTransaction(to, amount, currency);
    } catch (error) {
      return {
        hash: '',
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed',
      };
    }
  }

  public async getBalance(currency: PaymentCurrency): Promise<string> {
    if (!this.connectedWallet) {
      return '0';
    }

    const adapter = this.adapters.get(`${this.connectedWallet.chain}-${this.connectedWallet.name}`);
    if (!adapter) {
      return '0';
    }

    try {
      return await adapter.getBalance(currency);
    } catch (error) {
      return '0';
    }
  }

  public getConnectedWallet(): WalletInfo | null {
    return this.connectedWallet;
  }

  public isWalletConnected(): boolean {
    return this.connectedWallet !== null;
  }
}

export const walletService = WalletService.getInstance();
