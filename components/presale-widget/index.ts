/**
 * LUTAR Presale Widget - Main Export
 * Modular presale widget with TON support and BSC wallet integration
 */

export { PresaleWidget } from './PresaleWidget'
export { default } from './PresaleWidget'

// Export types
export type {
  PresaleWidgetProps,
  PresaleWidgetConfig,
  PaymentCurrency,
  WalletConnection,
  PaymentDetails,
  TransactionInfo,
  PresaleWidgetState
} from './types/presale-widget.types'

// Export store hooks
export {
  usePresaleWidgetStore,
  useCurrentStep,
  useSelectedCurrency,
  usePaymentAmount,
  useTokenAmount,
  useEmail,
  useBscWalletAddress,
  useConnectedWallet,
  usePaymentDetails,
  useTransactionInfo,
  useCountdownTime,
  useError,
  useLoading,
  usePresaleWidgetActions
} from '@/stores/presale-widget-store'

// Export shared components
export { CountdownTimer } from './shared/CountdownTimer'
export { BscWalletInput } from './shared/BscWalletInput'

// Export step components
export { Step1CurrencySelection } from './steps/Step1CurrencySelection'
export { Step2PaymentConfirmation } from './steps/Step2PaymentConfirmation'
export { Step3PaymentDetails } from './steps/Step3PaymentDetails'
export { Step3_1WalletSelection } from './steps/Step3_1WalletSelection'
export { Step4WalletConnected } from './steps/Step4WalletConnected'
export { Step5Completion } from './steps/Step5Completion'
