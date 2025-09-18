/**
 * LUTAR Presale Widget - Type Definitions
 * Comprehensive type definitions for the multi-step presale widget
 */

export interface PaymentCurrency {
  symbol: string
  name: string
  chain: string
  icon: string
  type: 'native' | 'token'
  contractAddress?: string
  decimals: number
}

export interface WalletConnection {
  adapter: string
  address: string
  balance: string
  chain: string
  connected: boolean
}

export interface PaymentDetails {
  address: string
  amount: string
  currency: PaymentCurrency
  qrCode: string
  expiresAt: number
}

export interface TransactionInfo {
  hash: string
  distributionHash?: string
  status: 'pending' | 'confirmed' | 'failed'
  lutarAmount: string
  bscAddress: string
  timestamp: number
}

export interface PresaleWidgetState {
  currentStep: number
  selectedCurrency: PaymentCurrency | null
  paymentAmount: string
  tokenAmount: string
  email: string
  bscWalletAddress: string
  connectedWallet: WalletConnection | null
  paymentDetails: PaymentDetails | null
  transactionInfo: TransactionInfo | null
  countdownTime: number
  error: string | null
  loading: boolean
}

export interface PresaleWidgetConfig {
  lutarPrice: number
  supportedCurrencies: string[]
  paymentTimeout: number
  minPurchaseAmount: number
  maxPurchaseAmount?: number
  presaleEndTime?: number
}

export interface PresaleWidgetProps {
  onComplete?: (result: TransactionInfo) => void
  onError?: (error: string) => void
  config?: Partial<PresaleWidgetConfig>
  className?: string
}

export interface StepProps {
  onNext: () => void
  onBack: () => void
  onError: (error: string) => void
}

export interface CurrencySelectionProps extends StepProps {
  selectedCurrency: PaymentCurrency | null
  onCurrencySelect: (currency: PaymentCurrency) => void
}

export interface AmountInputProps extends StepProps {
  selectedCurrency: PaymentCurrency
  paymentAmount: string
  tokenAmount: string
  email: string
  bscWalletAddress: string
  onAmountChange: (amount: string) => void
  onEmailChange: (email: string) => void
  onBscWalletChange: (address: string) => void
}

export interface PaymentDetailsProps extends StepProps {
  paymentDetails: PaymentDetails
  connectedWallet: WalletConnection | null
  onWalletConnect: () => void
  onWalletDisconnect: () => void
}

export interface WalletSelectionProps {
  selectedCurrency: PaymentCurrency
  onWalletSelect: (wallet: string) => void
  onClose: () => void
}

export interface WalletConnectedProps extends StepProps {
  connectedWallet: WalletConnection
  paymentDetails: PaymentDetails
  onOpenWallet: () => void
  onDisconnect: () => void
}

export interface CompletionProps extends StepProps {
  transactionInfo: TransactionInfo
  onAccessDashboard: () => void
}

// Error types
export interface ValidationError {
  field: string
  message: string
}

export interface PresaleWidgetError {
  type: 'validation' | 'network' | 'wallet' | 'transaction' | 'distribution'
  message: string
  details?: any
}

// Utility types
export type StepNumber = 1 | 2 | 3 | 4 | 5

export type WalletAdapterType = 
  | 'metamask' 
  | 'trustwallet' 
  | 'phantom' 
  | 'unisat' 
  | 'xverse' 
  | 'tronlink' 
  | 'tonkeeper' 
  | 'tonwallet' 
  | 'backpack' 
  | 'argent' 
  | 'coinbase' 
  | 'rainbow'

export type BlockchainType = 
  | 'bitcoin' 
  | 'ethereum' 
  | 'bsc' 
  | 'solana' 
  | 'polygon' 
  | 'tron' 
  | 'ton'

// Constants
export const SUPPORTED_CURRENCIES: PaymentCurrency[] = [
  // Native blockchain currencies
  { symbol: 'BTC', name: 'Bitcoin', chain: 'bitcoin', icon: 'bitcoin', type: 'native', decimals: 8 },
  { symbol: 'ETH', name: 'Ethereum', chain: 'ethereum', icon: 'eth-contrast', type: 'native', decimals: 18 },
  { symbol: 'BNB', name: 'BNB', chain: 'bsc', icon: 'bnb', type: 'native', decimals: 18 },
  { symbol: 'SOL', name: 'Solana', chain: 'solana', icon: 'solana', type: 'native', decimals: 9 },
  { symbol: 'POL', name: 'Polygon', chain: 'polygon', icon: 'polygon', type: 'native', decimals: 18 },
  { symbol: 'TRX', name: 'TRON', chain: 'tron', icon: 'tron', type: 'native', decimals: 6 },
  { symbol: 'TON', name: 'TON', chain: 'ton', icon: 'ton', type: 'native', decimals: 9 },
  
  // USDT on all chains
  //{ symbol: 'USDT', name: 'Tether on Bitcoin', chain: 'bitcoin', icon: 'usdt-btc', type: 'token', contractAddress: 'bc1qwftz8tm698pmmg5y0nrqffe5egtd05uaf0cflc', decimals: 8 },
  { symbol: 'USDT', name: 'Tether on Ethereum', chain: 'ethereum', icon: 'usdt-erc20', type: 'token', contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  { symbol: 'USDT', name: 'Tether on BSC', chain: 'bsc', icon: 'usdt-bep20', type: 'token', contractAddress: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },
  { symbol: 'USDT', name: 'Tether on Solana', chain: 'solana', icon: 'usdt-solana', type: 'token', contractAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6 },
  { symbol: 'USDT', name: 'Tether on Polygon', chain: 'polygon', icon: 'usdt-polygon', type: 'token', contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },
  { symbol: 'USDT', name: 'Tether on TRON', chain: 'tron', icon: 'usdt-tron', type: 'token', contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', decimals: 6 },
  { symbol: 'USDT', name: 'Tether on TON', chain: 'ton', icon: 'usdt-ton', type: 'token', contractAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs', decimals: 6 },
  
  // USDC on all chains
  //{ symbol: 'USDC', name: 'USD Coin on Bitcoin', chain: 'bitcoin', icon: 'usdc-btc', type: 'token', contractAddress: 'bc1qwftz8tm698pmmg5y0nrqffe5egtd05uaf0cflc', decimals: 8 },
  { symbol: 'USDC', name: 'USD Coin on Ethereum', chain: 'ethereum', icon: 'usdc-erc20', type: 'token', contractAddress: '0xA0b86a33E6441b8c4C8C0C4e8b8b8b8b8b8b8b8b8', decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin on BSC', chain: 'bsc', icon: 'usdc-bep20', type: 'token', contractAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin on Solana', chain: 'solana', icon: 'usdc-solana', type: 'token', contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin on Polygon', chain: 'polygon', icon: 'usdc-polygon', type: 'token', contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin on TRON', chain: 'tron', icon: 'usdc-tron', type: 'token', contractAddress: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8', decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin on TON', chain: 'ton', icon: 'usdc-ton', type: 'token', contractAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs', decimals: 6 }
]

export const DEFAULT_CONFIG: PresaleWidgetConfig = {
  lutarPrice: 0.004,
  supportedCurrencies: ['BTC', 'ETH', 'SOL', 'POL', 'BNB', 'TRX', 'USDT', 'USDC', 'TON'],
  paymentTimeout: 1800000, // 30 minutes
  minPurchaseAmount: 10,
  maxPurchaseAmount: 10000,
  presaleEndTime: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now
}
