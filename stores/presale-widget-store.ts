/**
 * LUTAR Presale Widget - Zustand Store
 * Centralized state management for the presale widget
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  PresaleWidgetState, 
  PaymentCurrency, 
  WalletConnection, 
  PaymentDetails, 
  TransactionInfo,
  PresaleWidgetConfig,
  DEFAULT_CONFIG
} from '@/components/presale-widget/types/presale-widget.types'

interface PresaleWidgetStore extends PresaleWidgetState {
  // Actions
  setCurrentStep: (step: number) => void
  setSelectedCurrency: (currency: PaymentCurrency) => void
  setPaymentAmount: (amount: string) => void
  setTokenAmount: (amount: string) => void
  setEmail: (email: string) => void
  setBscWalletAddress: (address: string) => void
  setConnectedWallet: (wallet: WalletConnection | null) => void
  setPaymentDetails: (details: PaymentDetails | null) => void
  setTransactionInfo: (info: TransactionInfo | null) => void
  setCountdownTime: (time: number) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  
  // Navigation actions
  proceedToNextStep: () => void
  goBackToPreviousStep: () => void
  
  // Wallet actions
  connectWallet: (wallet: WalletConnection) => void
  disconnectWallet: () => void
  
  // Utility actions
  resetWidget: () => void
  calculateTokenAmount: (paymentAmount: string, lutarPrice: number) => string
}

const initialState: PresaleWidgetState = {
  currentStep: 1,
  selectedCurrency: null,
  paymentAmount: '',
  tokenAmount: '',
  email: '',
  bscWalletAddress: '',
  connectedWallet: null,
  paymentDetails: null,
  transactionInfo: null,
  countdownTime: 0,
  error: null,
  loading: false
}

export const usePresaleWidgetStore = create<PresaleWidgetStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Basic setters
      setCurrentStep: (step: number) => set({ currentStep: step }),
      setSelectedCurrency: (currency: PaymentCurrency) => set({ selectedCurrency: currency }),
      setPaymentAmount: (amount: string) => set({ paymentAmount: amount }),
      setTokenAmount: (amount: string) => set({ amount }),
      setEmail: (email: string) => set({ email }),
      setBscWalletAddress: (address: string) => set({ bscWalletAddress: address }),
      setConnectedWallet: (wallet: WalletConnection | null) => set({ connectedWallet: wallet }),
      setPaymentDetails: (details: PaymentDetails | null) => set({ paymentDetails: details }),
      setTransactionInfo: (info: TransactionInfo | null) => set({ transactionInfo: info }),
      setCountdownTime: (time: number) => set({ countdownTime: time }),
      setError: (error: string | null) => set({ error }),
      setLoading: (loading: boolean) => set({ loading }),
      
      // Navigation actions
      proceedToNextStep: () => {
        const { currentStep } = get()
        if (currentStep < 5) {
          set({ currentStep: currentStep + 1 })
        }
      },
      
      goBackToPreviousStep: () => {
        const { currentStep } = get()
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 })
        }
      },
      
      // Wallet actions
      connectWallet: (wallet: WalletConnection) => {
        set({ 
          connectedWallet: wallet,
          error: null 
        })
      },
      
      disconnectWallet: () => {
        set({ 
          connectedWallet: null,
          paymentDetails: null 
        })
      },
      
      // Utility actions
      resetWidget: () => set(initialState),
      
      calculateTokenAmount: (paymentAmount: string, lutarPrice: number): string => {
        const amount = parseFloat(paymentAmount)
        if (isNaN(amount) || amount <= 0) {
          return '0'
        }
        
        const tokenAmount = amount / lutarPrice
        return tokenAmount.toFixed(2)
      }
    }),
    {
      name: 'presale-widget-storage',
      partialize: (state) => ({
        // Only persist essential data
        selectedCurrency: state.selectedCurrency,
        paymentAmount: state.paymentAmount,
        email: state.email,
        bscWalletAddress: state.bscWalletAddress,
        connectedWallet: state.connectedWallet
      })
    }
  )
)

// Selector hooks for better performance
export const useCurrentStep = () => usePresaleWidgetStore(state => state.currentStep)
export const useSelectedCurrency = () => usePresaleWidgetStore(state => state.selectedCurrency)
export const usePaymentAmount = () => usePresaleWidgetStore(state => state.paymentAmount)
export const useTokenAmount = () => usePresaleWidgetStore(state => state.tokenAmount)
export const useEmail = () => usePresaleWidgetStore(state => state.email)
export const useBscWalletAddress = () => usePresaleWidgetStore(state => state.bscWalletAddress)
export const useConnectedWallet = () => usePresaleWidgetStore(state => state.connectedWallet)
export const usePaymentDetails = () => usePresaleWidgetStore(state => state.paymentDetails)
export const useTransactionInfo = () => usePresaleWidgetStore(state => state.transactionInfo)
export const useCountdownTime = () => usePresaleWidgetStore(state => state.countdownTime)
export const useError = () => usePresaleWidgetStore(state => state.error)
export const useLoading = () => usePresaleWidgetStore(state => state.loading)

// Action hooks
export const usePresaleWidgetActions = () => usePresaleWidgetStore(state => ({
  setCurrentStep: state.setCurrentStep,
  setSelectedCurrency: state.setSelectedCurrency,
  setPaymentAmount: state.setPaymentAmount,
  setTokenAmount: state.setTokenAmount,
  setEmail: state.setEmail,
  setBscWalletAddress: state.setBscWalletAddress,
  setConnectedWallet: state.setConnectedWallet,
  setPaymentDetails: state.setPaymentDetails,
  setTransactionInfo: state.setTransactionInfo,
  setCountdownTime: state.setCountdownTime,
  setError: state.setError,
  setLoading: state.setLoading,
  proceedToNextStep: state.proceedToNextStep,
  goBackToPreviousStep: state.goBackToPreviousStep,
  connectWallet: state.connectWallet,
  disconnectWallet: state.disconnectWallet,
  resetWidget: state.resetWidget,
  calculateTokenAmount: state.calculateTokenAmount
}))
