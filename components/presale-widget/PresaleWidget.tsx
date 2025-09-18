"use client"

import React, { useEffect, useState } from 'react'
import { usePresaleWidgetStore } from '@/stores/presale-widget-store'
import { PresaleWidgetProps, DEFAULT_CONFIG } from './types/presale-widget.types'
import { cn } from '@/lib/utils'
import { paymentService } from '@/lib/payment-service'
import { walletService } from '@/lib/wallet-service'

// Step components
import { Step1CurrencySelection } from './steps/Step1CurrencySelection'
import { Step2AmountInput } from './steps/Step2AmountInput'
import { Step3PaymentDetails } from './steps/Step3PaymentDetails'
import { Step3_1WalletSelection } from './steps/Step3_1WalletSelection'
import { Step4WalletConnected } from './steps/Step4WalletConnected'
import { Step5Completion } from './steps/Step5Completion'

// Shared components
import { CountdownTimer } from './shared/CountdownTimer'

export const PresaleWidget: React.FC<PresaleWidgetProps> = ({
  onComplete,
  onError,
  config = {},
  className
}) => {
  const {
    currentStep,
    selectedCurrency,
    paymentAmount,
    tokenAmount,
    email,
    bscWalletAddress,
    connectedWallet,
    paymentDetails,
    transactionInfo,
    countdownTime,
    error,
    loading,
    setError,
    setCountdownTime,
    proceedToNextStep,
    goBackToPreviousStep,
    calculateTokenAmount
  } = usePresaleWidgetStore()

  const [showWalletModal, setShowWalletModal] = useState(false)
  const [widgetConfig] = useState({ ...DEFAULT_CONFIG, ...config })

  // Calculate token amount when payment amount changes
  useEffect(() => {
    if (paymentAmount && widgetConfig.lutarPrice) {
      const calculatedAmount = calculateTokenAmount(paymentAmount, widgetConfig.lutarPrice)
      usePresaleWidgetStore.getState().setTokenAmount(calculatedAmount)
    }
  }, [paymentAmount, widgetConfig.lutarPrice, calculateTokenAmount])

  // Handle countdown timer
  useEffect(() => {
    if (widgetConfig.presaleEndTime) {
      const interval = setInterval(() => {
        const now = Date.now()
        const timeLeft = Math.max(0, widgetConfig.presaleEndTime - now)
        setCountdownTime(timeLeft)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [widgetConfig.presaleEndTime, setCountdownTime])

  // Handle errors
  useEffect(() => {
    if (error && onError) {
      onError(error)
    }
  }, [error, onError])

  // Handle completion
  useEffect(() => {
    if (transactionInfo && onComplete) {
      onComplete(transactionInfo)
    }
  }, [transactionInfo, onComplete])

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleWalletConnect = () => {
    setShowWalletModal(true)
  }

  const handleWalletDisconnect = async () => {
    await walletService.disconnectWallet()
    usePresaleWidgetStore.getState().disconnectWallet()
  }

  const handleWalletSelect = async (walletName: string) => {
    if (!selectedCurrency) return

    try {
      const result = await walletService.connectWallet(selectedCurrency.chain, walletName)
      if (result.success) {
        usePresaleWidgetStore.getState().setConnectedWallet({
          adapter: walletName,
          address: result.address,
          chain: result.chain,
          name: result.walletName,
          balance: '0',
          connected: true
        })
        setShowWalletModal(false)
      } else {
        handleError(result.error || 'Failed to connect wallet')
      }
    } catch (error) {
      handleError('Wallet connection failed')
    }
  }

  const handleAccessDashboard = () => {
    // Navigate to dashboard with BSC wallet address
    if (bscWalletAddress) {
      window.location.href = `/dashboard?address=${encodeURIComponent(bscWalletAddress)}`
    }
  }

  const renderCurrentStep = () => {
    const commonProps = {
      onNext: proceedToNextStep,
      onBack: goBackToPreviousStep,
      onError: handleError
    }

    switch (currentStep) {
      case 1:
        return (
          <Step1CurrencySelection
            {...commonProps}
            selectedCurrency={selectedCurrency}
            onCurrencySelect={(currency) => {
              usePresaleWidgetStore.getState().setSelectedCurrency(currency)
            }}
          />
        )

      case 2:
        if (!selectedCurrency) {
          handleError('Please select a payment currency first')
          return null
        }
        return (
          <Step2AmountInput
            {...commonProps}
            selectedCurrency={selectedCurrency}
            paymentAmount={paymentAmount}
            tokenAmount={tokenAmount}
            email={email}
            bscWalletAddress={bscWalletAddress}
            onAmountChange={(amount) => {
              usePresaleWidgetStore.getState().setPaymentAmount(amount)
            }}
            onEmailChange={(email) => {
              usePresaleWidgetStore.getState().setEmail(email)
            }}
            onBscWalletChange={(address) => {
              usePresaleWidgetStore.getState().setBscWalletAddress(address)
            }}
            onNext={async () => {
              // Generate payment details before proceeding to step 3
              if (selectedCurrency && paymentAmount) {
                try {
                  const paymentDetails = await paymentService.generatePaymentDetails(
                    selectedCurrency,
                    paymentAmount,
                    'LUTAR Presale Payment'
                  )
                  usePresaleWidgetStore.getState().setPaymentDetails(paymentDetails)
                  proceedToNextStep()
                } catch (error) {
                  handleError('Failed to generate payment details')
                }
              } else {
                proceedToNextStep()
              }
            }}
          />
        )

      case 3:
        if (!paymentDetails) {
          handleError('Payment details not available')
          return null
        }
        return (
          <Step3PaymentDetails
            {...commonProps}
            paymentDetails={paymentDetails}
            connectedWallet={connectedWallet}
            onWalletConnect={handleWalletConnect}
            onWalletDisconnect={handleWalletDisconnect}
          />
        )

      case 4:
        if (!connectedWallet || !paymentDetails) {
          handleError('Wallet connection or payment details not available')
          return null
        }
        return (
          <Step4WalletConnected
            {...commonProps}
            connectedWallet={connectedWallet}
            paymentDetails={paymentDetails}
            onOpenWallet={() => {
              // Open wallet for transaction approval
              console.log('Opening wallet for transaction approval')
            }}
            onDisconnect={handleWalletDisconnect}
            onNext={() => {
              // Create transaction info and move to completion step
              const transactionInfo = {
                hash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock transaction hash
                status: 'confirmed' as const,
                lutarAmount: tokenAmount,
                bscAddress: bscWalletAddress,
                timestamp: Date.now()
              }
              usePresaleWidgetStore.getState().setTransactionInfo(transactionInfo)
              proceedToNextStep()
            }}
          />
        )

      case 5:
        if (!transactionInfo) {
          handleError('Transaction information not available')
          return null
        }
        return (
          <Step5Completion
            {...commonProps}
            transactionInfo={transactionInfo}
            onAccessDashboard={handleAccessDashboard}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={cn(
      "presale-widget",
      "w-[450px] min-h-[550px] max-w-full",
      "bg-[rgba(0,0,0,0.84)] p-[30px] rounded-[25px]",
      "flex flex-col relative overflow-hidden",
      "font-inter text-white",
      className
    )}>
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-[30px] text-center z-0">
        <h1 className="text-[46px] font-[800] text-white mb-2">
          BUY $LUTAR
        </h1>
        <p className="text-[rgba(255,255,255,0.45)] text-sm">
          1 LUTAR = <span className="text-white font-semibold">${widgetConfig.lutarPrice}</span>
        </p>
      </div>

      {/* Countdown Timer */}
      {countdownTime > 0 && (
        <div className="mb-[30px]">
          <CountdownTimer timeLeft={countdownTime} />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-2"></div>
            <p className="text-sm">Processing...</p>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="flex-1">
        {renderCurrentStep()}
      </div>

      {/* Wallet Selection Modal */}
      {showWalletModal && selectedCurrency && (
        <Step3_1WalletSelection
          selectedCurrency={selectedCurrency}
          onWalletSelect={handleWalletSelect}
          onClose={() => setShowWalletModal(false)}
        />
      )}
    </div>
  )
}

export default PresaleWidget
