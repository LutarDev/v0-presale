import { PaymentCurrency } from '@/components/presale-widget/types/presale-widget.types';
import { qrCodeService, PaymentQRData } from './qr-code-service';
import { walletService } from './wallet-service';

export interface PaymentDetails {
  address: string;
  amount: string;
  currency: PaymentCurrency;
  qrCode: string;
  expiresAt: number;
  memo?: string;
}

export interface PaymentConfig {
  addresses: Record<string, string>;
  timeouts: Record<string, number>;
  minAmounts: Record<string, number>;
  maxAmounts: Record<string, number>;
}

export class PaymentService {
  private static instance: PaymentService;
  private config: PaymentConfig;

  private constructor() {
    this.config = {
      addresses: {
        BTC: 'bc1qwftz8tm698pmmg5y0nrqffe5egtd05uaf0cflc',
        ETH: '0x6e8E31e66826424B318aBcD97DcabAF0C0d52736',
        BNB: '0x6e8E31e66826424B318aBcD97DcabAF0C0d52736',
        SOL: '2qyJAaBoeNBnXb2zmnYBzLAGRKGhmHqgb2ZejqMpuoue',
        POL: '0x6e8E31e66826424B318aBcD97DcabAF0C0d52736',
        TRX: 'TPmj9q2R53ytGGu8gL7CFLwCqGxprEUe9r',
        TON: 'UQAKRgdm0BN7Bgfojsj-bJMrwvFUw0sY5BPGeGgF8mtckTQI',
      },
      timeouts: {
        BTC: 1800000, // 30 minutes
        ETH: 1800000, // 30 minutes
        BNB: 1800000, // 30 minutes
        SOL: 1800000, // 30 minutes
        POL: 1800000, // 30 minutes
        TRX: 1800000, // 30 minutes
        TON: 1800000, // 30 minutes
      },
      minAmounts: {
        BTC: 0.0001,
        ETH: 0.001,
        BNB: 0.001,
        SOL: 0.01,
        POL: 0.1,
        TRX: 1,
        TON: 0.1,
      },
      maxAmounts: {
        BTC: 10,
        ETH: 100,
        BNB: 100,
        SOL: 1000,
        POL: 10000,
        TRX: 100000,
        TON: 1000,
      },
    };
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Generate payment details for a given currency and amount
   */
  public async generatePaymentDetails(
    currency: PaymentCurrency,
    amount: string,
    memo?: string
  ): Promise<PaymentDetails> {
    const address = this.getPaymentAddress(currency);
    const timeout = this.getPaymentTimeout(currency);
    const expiresAt = Date.now() + timeout;

    // Generate QR code
    const qrData: PaymentQRData = {
      address,
      amount,
      currency: currency.symbol,
      memo: memo || 'LUTAR Presale Payment',
    };

    const qrCode = await qrCodeService.generatePaymentQR(qrData);

    return {
      address,
      amount,
      currency,
      qrCode,
      expiresAt,
      memo: memo || 'LUTAR Presale Payment',
    };
  }

  /**
   * Validate payment amount
   */
  public validatePaymentAmount(currency: PaymentCurrency, amount: string): {
    valid: boolean;
    error?: string;
  } {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return { valid: false, error: 'Invalid amount' };
    }

    const minAmount = this.config.minAmounts[currency.symbol];
    const maxAmount = this.config.maxAmounts[currency.symbol];

    if (minAmount && numAmount < minAmount) {
      return { valid: false, error: `Minimum amount is ${minAmount} ${currency.symbol}` };
    }

    if (maxAmount && numAmount > maxAmount) {
      return { valid: false, error: `Maximum amount is ${maxAmount} ${currency.symbol}` };
    }

    return { valid: true };
  }

  /**
   * Check if payment is expired
   */
  public isPaymentExpired(expiresAt: number): boolean {
    return Date.now() > expiresAt;
  }

  /**
   * Get time remaining for payment
   */
  public getTimeRemaining(expiresAt: number): number {
    return Math.max(0, expiresAt - Date.now());
  }

  /**
   * Format amount for display
   */
  public formatAmount(amount: string, currency: PaymentCurrency): string {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '0';

    // Format based on currency decimals
    const decimals = currency.decimals;
    if (decimals <= 6) {
      return numAmount.toFixed(6);
    } else if (decimals <= 9) {
      return numAmount.toFixed(9);
    } else {
      return numAmount.toFixed(18);
    }
  }

  /**
   * Get payment address for currency
   */
  private getPaymentAddress(currency: PaymentCurrency): string {
    return this.config.addresses[currency.symbol] || this.config.addresses[currency.chain] || '';
  }

  /**
   * Get payment timeout for currency
   */
  private getPaymentTimeout(currency: PaymentCurrency): number {
    return this.config.timeouts[currency.symbol] || this.config.timeouts[currency.chain] || 1800000;
  }

  /**
   * Update payment configuration
   */
  public updateConfig(newConfig: Partial<PaymentConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  public getConfig(): PaymentConfig {
    return { ...this.config };
  }
}

export const paymentService = PaymentService.getInstance();
