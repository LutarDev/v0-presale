import * as QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  height?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface PaymentQRData {
  address: string;
  amount: string;
  currency: string;
  memo?: string;
}

export class QRCodeService {
  private static instance: QRCodeService;

  private constructor() {}

  public static getInstance(): QRCodeService {
    if (!QRCodeService.instance) {
      QRCodeService.instance = new QRCodeService();
    }
    return QRCodeService.instance;
  }

  /**
   * Generate QR code for payment address
   */
  public async generatePaymentQR(
    data: PaymentQRData,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const defaultOptions: QRCodeOptions = {
      width: 200,
      height: 200,
      margin: 2,
      color: {
        dark: '#FFFFFF',
        light: '#000000',
      },
      errorCorrectionLevel: 'M',
      ...options,
    };

    try {
      const qrData = this.formatPaymentData(data);
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: defaultOptions.width,
        margin: defaultOptions.margin,
        color: defaultOptions.color,
        errorCorrectionLevel: defaultOptions.errorCorrectionLevel,
      });
      
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code for wallet connection (WalletConnect, etc.)
   */
  public async generateWalletConnectQR(
    uri: string,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const defaultOptions: QRCodeOptions = {
      width: 200,
      height: 200,
      margin: 2,
      color: {
        dark: '#FFFFFF',
        light: '#000000',
      },
      errorCorrectionLevel: 'M',
      ...options,
    };

    try {
      const qrCodeDataURL = await QRCode.toDataURL(uri, {
        width: defaultOptions.width,
        margin: defaultOptions.margin,
        color: defaultOptions.color,
        errorCorrectionLevel: defaultOptions.errorCorrectionLevel,
      });
      
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating wallet connect QR code:', error);
      throw new Error('Failed to generate wallet connect QR code');
    }
  }

  /**
   * Format payment data for QR code based on currency type
   */
  private formatPaymentData(data: PaymentQRData): string {
    const { address, amount, currency, memo } = data;

    switch (currency.toLowerCase()) {
      case 'btc':
        return this.formatBitcoinURI(address, amount, memo);
      case 'eth':
      case 'bnb':
      case 'polygon':
        return this.formatEthereumURI(address, amount, currency);
      case 'sol':
        return this.formatSolanaURI(address, amount, memo);
      case 'trx':
        return this.formatTronURI(address, amount, memo);
      case 'ton':
        return this.formatTonURI(address, amount, memo);
      default:
        // For other currencies, use a simple format
        return `${address}?amount=${amount}&currency=${currency}${memo ? `&memo=${memo}` : ''}`;
    }
  }

  /**
   * Format Bitcoin URI (BIP21)
   */
  private formatBitcoinURI(address: string, amount: string, memo?: string): string {
    let uri = `bitcoin:${address}`;
    const params = new URLSearchParams();
    
    if (amount && parseFloat(amount) > 0) {
      params.append('amount', amount);
    }
    
    if (memo) {
      params.append('label', memo);
    }
    
    if (params.toString()) {
      uri += `?${params.toString()}`;
    }
    
    return uri;
  }

  /**
   * Format Ethereum URI (EIP681)
   */
  private formatEthereumURI(address: string, amount: string, currency: string): string {
    const chainId = this.getChainId(currency);
    let uri = `ethereum:${address}`;
    
    if (amount && parseFloat(amount) > 0) {
      uri += `@${chainId}?value=${this.weiFromEther(amount)}`;
    } else if (chainId !== '1') {
      uri += `@${chainId}`;
    }
    
    return uri;
  }

  /**
   * Format Solana URI
   */
  private formatSolanaURI(address: string, amount: string, memo?: string): string {
    let uri = `solana:${address}`;
    const params = new URLSearchParams();
    
    if (amount && parseFloat(amount) > 0) {
      params.append('amount', amount);
    }
    
    if (memo) {
      params.append('memo', memo);
    }
    
    if (params.toString()) {
      uri += `?${params.toString()}`;
    }
    
    return uri;
  }

  /**
   * Format Tron URI
   */
  private formatTronURI(address: string, amount: string, memo?: string): string {
    let uri = `tron:${address}`;
    const params = new URLSearchParams();
    
    if (amount && parseFloat(amount) > 0) {
      params.append('amount', amount);
    }
    
    if (memo) {
      params.append('memo', memo);
    }
    
    if (params.toString()) {
      uri += `?${params.toString()}`;
    }
    
    return uri;
  }

  /**
   * Format TON URI
   */
  private formatTonURI(address: string, amount: string, memo?: string): string {
    let uri = `ton:${address}`;
    const params = new URLSearchParams();
    
    if (amount && parseFloat(amount) > 0) {
      params.append('amount', amount);
    }
    
    if (memo) {
      params.append('text', memo);
    }
    
    if (params.toString()) {
      uri += `?${params.toString()}`;
    }
    
    return uri;
  }

  /**
   * Get chain ID for Ethereum-compatible chains
   */
  private getChainId(currency: string): string {
    const chainIds: Record<string, string> = {
      'eth': '1',
      'bnb': '56',
      'polygon': '137',
    };
    
    return chainIds[currency.toLowerCase()] || '1';
  }

  /**
   * Convert ether to wei
   */
  private weiFromEther(ether: string): string {
    const wei = parseFloat(ether) * Math.pow(10, 18);
    return wei.toString();
  }

  /**
   * Generate QR code as SVG
   */
  public async generatePaymentQRSVG(
    data: PaymentQRData,
    options: QRCodeOptions = {}
  ): Promise<string> {
    const defaultOptions: QRCodeOptions = {
      width: 200,
      height: 200,
      margin: 2,
      color: {
        dark: '#FFFFFF',
        light: '#000000',
      },
      errorCorrectionLevel: 'M',
      ...options,
    };

    try {
      const qrData = this.formatPaymentData(data);
      const qrCodeSVG = await QRCode.toString(qrData, {
        type: 'svg',
        width: defaultOptions.width,
        margin: defaultOptions.margin,
        color: defaultOptions.color,
        errorCorrectionLevel: defaultOptions.errorCorrectionLevel,
      });
      
      return qrCodeSVG;
    } catch (error) {
      console.error('Error generating QR code SVG:', error);
      throw new Error('Failed to generate QR code SVG');
    }
  }
}

export const qrCodeService = QRCodeService.getInstance();
