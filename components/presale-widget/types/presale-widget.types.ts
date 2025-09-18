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
  // Existing currencies from Radom
  { symbol: 'SOL', name: 'Solana', chain: 'solana', icon: 'solana', type: 'native', decimals: 9 },
  { symbol: 'POL', name: 'Polygon', chain: 'polygon', icon: 'polygon', type: 'native', decimals: 18 },
  { symbol: 'BNB', name: 'BNB', chain: 'bsc', icon: 'bnb', type: 'native', decimals: 18 },
  { symbol: 'USDT', name: 'Tether on Ethereum', chain: 'ethereum', icon: 'usdt-eth', type: 'token', contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  { symbol: 'USDT', name: 'Tether on Polygon', chain: 'polygon', icon: 'usdt-polygon', type: 'token', contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin on Polygon', chain: 'polygon', icon: 'usdc-polygon', type: 'token', contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },
  
  // Extended currencies with TON support
  { symbol: 'TON', name: 'TON', chain: 'ton', icon: 'ton', type: 'native', decimals: 9 },
  { symbol: 'USDT', name: 'Tether on TON', chain: 'ton', icon: 'usdt-ton', type: 'token', contractAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs', decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin on TON', chain: 'ton', icon: 'usdc-ton', type: 'token', contractAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs', decimals: 6 }
]

export const DEFAULT_CONFIG: PresaleWidgetConfig = {
  lutarPrice: 0.004,
  supportedCurrencies: ['SOL', 'POL', 'BNB', 'USDT', 'USDC', 'TON'],
  paymentTimeout: 1800000, // 30 minutes
  minPurchaseAmount: 10,
  maxPurchaseAmount: 10000,
  presaleEndTime: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now
}
