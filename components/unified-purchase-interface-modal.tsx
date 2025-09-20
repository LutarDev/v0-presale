"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChainIcon, WalletIcon, FallbackIcon } from "@/components/ui/icon"
import { Copy, CheckCircle, ArrowLeft, Wallet, QrCode, TrendingUp, AlertTriangle } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"
import { TransactionModal } from "@/components/transaction-modal"
import { UnifiedWalletModal } from "@/components/unified-wallet-modal"
import { PaymentMethodSelector } from "@/components/payment-method-selector"
import { priceService } from "@/lib/price-service"
import { getPaymentCurrency } from "@/lib/payment-config"
import { getAllBlockchainConfigs } from "@/lib/blockchain-config"
import { cn } from "@/lib/utils"

interface UnifiedPurchaseInterfaceModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: (result: any) => void
}

type ModalStep = 1 | 2 | 3

interface PaymentMethod {
  chain: string
  token: string
}

const blockchains = getAllBlockchainConfigs()

const paymentTokens = {
  BTC: [{ symbol: "BTC", name: "Bitcoin" }],
  ETH: [
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "USDT", name: "Tether" },
  ],
  BNB: [
    { symbol: "BNB", name: "BNB" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "USDT", name: "Tether" },
  ],
  SOL: [
    { symbol: "SOL", name: "Solana" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "USDT", name: "Tether" },
  ],
  POL: [
    { symbol: "POL", name: "Polygon" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "USDT", name: "Tether" },
  ],
  TRX: [
    { symbol: "TRX", name: "TRON" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "USDT", name: "Tether" },
  ],
  TON: [
    { symbol: "TON", name: "TON" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "USDT", name: "Tether" },
  ],
}

export function UnifiedPurchaseInterfaceModal({ 
  isOpen, 
  onClose, 
  onComplete 
}: UnifiedPurchaseInterfaceModalProps) {
  const { chain, isConnected, address, balance, adapter } = useWallet()
  const { toast } = useToast()
  
  // Modal state
  const [currentStep, setCurrentStep] = useState<ModalStep>(1)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [lutarAmount, setLutarAmount] = useState("")
  const [bscAddress, setBscAddress] = useState("")
  const [copied, setCopied] = useState(false)
  const [loadingPrices, setLoadingPrices] = useState(true)
  const [lutarPrice] = useState(0.004)
  const [exchangeRates, setExchangeRates] = useState<Map<string, number>>(new Map())
  
  // Modal visibility state
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)

  // Load exchange rates
  useEffect(() => {
    const loadPrices = async () => {
      try {
        setLoadingPrices(true)
        const tokens = ["BTC", "ETH", "BNB", "SOL", "POL", "TRX", "TON"]
        const rates = new Map<string, number>()
        
        for (const token of tokens) {
          try {
            const rate = await priceService.getExchangeRate(token, "USD")
            rates.set(token, rate)
          } catch (error) {
            console.warn(`Failed to load rate for ${token}:`, error)
            const mockRates: Record<string, number> = {
              'BTC': 43000, 'ETH': 2500, 'BNB': 300, 'SOL': 100, 'POL': 0.8, 'TRX': 0.1, 'TON': 2.5
            }
            rates.set(token, mockRates[token] || 1)
          }
        }
        setExchangeRates(rates)
      } catch (error) {
        console.error("Error loading prices:", error)
      } finally {
        setLoadingPrices(false)
      }
    }

    if (isOpen) {
      loadPrices()
    }
  }, [isOpen])

  // Calculate LUTAR amount when payment amount changes
  useEffect(() => {
    if (paymentAmount && selectedPaymentMethod && !loadingPrices) {
      let usdValue: number
      
      if (selectedPaymentMethod.token === "USDC" || selectedPaymentMethod.token === "USDT") {
        usdValue = Number(paymentAmount)
      } else {
        const exchangeRate = exchangeRates.get(selectedPaymentMethod.token) || 1
        usdValue = Number(paymentAmount) * exchangeRate
      }
      
      const tokens = (usdValue / lutarPrice).toFixed(2)
      setLutarAmount(tokens)
    } else {
      setLutarAmount("")
    }
  }, [paymentAmount, selectedPaymentMethod, lutarPrice, exchangeRates, loadingPrices])

  // Reset modal state when closing
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1)
      setSelectedPaymentMethod(null)
      setPaymentAmount("")
      setLutarAmount("")
      setBscAddress("")
      setCopied(false)
    }
  }, [isOpen])

  const handlePaymentMethodSelect = (chain: string, token: string) => {
    setSelectedPaymentMethod({ chain, token })
    setIsPaymentMethodModalOpen(false)
  }

  const handleContinueFromStep1 = () => {
    if (selectedPaymentMethod && paymentAmount && Number(paymentAmount) > 0) {
      setCurrentStep(2)
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please select payment method and enter amount",
        variant: "destructive"
      })
    }
  }

  const handleContinueFromStep2 = () => {
    if (bscAddress && bscAddress.startsWith("0x") && bscAddress.length === 42) {
      setCurrentStep(3)
    } else {
      toast({
        title: "Invalid BSC Address",
        description: "Please enter a valid BSC wallet address",
        variant: "destructive"
      })
    }
  }

  const handleBuyLutar = () => {
    if (!isConnected) {
      setIsWalletModalOpen(true)
      return
    }
    setIsTransactionModalOpen(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    })
  }

  const getPaymentCurrencyData = () => {
    if (!selectedPaymentMethod) return null
    return getPaymentCurrency(selectedPaymentMethod.token, selectedPaymentMethod.chain)
  }

  const getMinimumPurchase = () => {
    if (!selectedPaymentMethod) return "0"
    return selectedPaymentMethod.token === "USDC" || selectedPaymentMethod.token === "USDT" ? "10" : "0.001"
  }

  const generateQRCode = () => {
    const paymentData = getPaymentCurrencyData()
    if (!paymentData) return ""
    
    // Generate QR code data based on payment method
    const qrData = {
      address: paymentData.wallet.address,
      amount: paymentAmount,
      token: selectedPaymentMethod?.token,
      chain: selectedPaymentMethod?.chain
    }
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="12" fill="black">
          QR Code
        </text>
        <text x="100" y="120" text-anchor="middle" font-family="monospace" font-size="8" fill="gray">
          ${paymentData.wallet.address.slice(0, 16)}...
        </text>
      </svg>
    `)}`
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Enter Purchase Amount</h2>
        <p className="text-muted-foreground">Select your payment method and amount</p>
      </div>

      {/* Payment Amount Input */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Pay with</label>
          <div className="relative">
            <Input
              type="number"
              placeholder={`Minimum ${getMinimumPurchase()}`}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {selectedPaymentMethod && (
                <div className="flex items-center gap-1">
                  <ChainIcon 
                    chain={selectedPaymentMethod.chain} 
                    size={20}
                    fallback={<span className="text-xs">💎</span>}
                  />
                  <span className="text-sm font-medium">{selectedPaymentMethod.token}</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaymentMethodModalOpen(true)}
                className="h-8 px-2"
              >
                {selectedPaymentMethod ? "Change" : "Select"}
              </Button>
            </div>
          </div>
        </div>

        {/* You Receive */}
        <div>
          <label className="text-sm font-medium mb-2 block text-green-600">You Receive</label>
          <div className="relative">
            <Input
              type="text"
              value={lutarAmount || "0.00"}
              readOnly
              className="pr-16 bg-green-50 border-green-200"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <img src="/lutar.svg" alt="LUTAR" className="w-5 h-5" />
              <span className="text-sm font-medium text-green-600">LUTAR</span>
            </div>
          </div>
        </div>

        {selectedPaymentMethod && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span>Token Price:</span>
              <span className="font-medium">${lutarPrice.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Exchange Rate:</span>
              <span className="font-medium">
                1 {selectedPaymentMethod.token} = ${exchangeRates.get(selectedPaymentMethod.token)?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        )}
      </div>

      <Button 
        onClick={handleContinueFromStep1}
        disabled={!selectedPaymentMethod || !paymentAmount || Number(paymentAmount) <= 0}
        className="w-full"
        size="lg"
      >
        Continue
      </Button>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">BSC Wallet Address</h2>
        <p className="text-muted-foreground">Enter your BSC address to receive LUTAR tokens</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            BSC Wallet Address for LUTAR Tokens
          </label>
          <Input
            type="text"
            placeholder="0x..."
            value={bscAddress}
            onChange={(e) => setBscAddress(e.target.value)}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Enter your BSC wallet address to receive LUTAR tokens after payment confirmation.
            LUTAR tokens will be sent immediately after successful payment.
          </p>
        </div>

        {bscAddress && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-600">
                <p className="font-medium mb-1">Important</p>
                <p>
                  LUTAR tokens will be automatically sent to this BSC address after payment confirmation.
                  Make sure this is the correct address as transfers cannot be reversed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Summary */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Purchase Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pay with:</span>
              <span className="font-medium">
                {paymentAmount} {selectedPaymentMethod?.token} on {selectedPaymentMethod?.chain}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Receive:</span>
              <span className="font-medium text-green-600">{lutarAmount} LUTAR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">BSC Address:</span>
              <span className="font-mono text-xs">{bscAddress || "Not set"}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleContinueFromStep2}
          disabled={!bscAddress || !bscAddress.startsWith("0x") || bscAddress.length !== 42}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => {
    const paymentData = getPaymentCurrencyData()
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Complete Purchase</h2>
          <p className="text-muted-foreground">Send payment to the address below</p>
        </div>

        {/* QR Code and Payment Address */}
        {paymentData && (
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border">
                  <img 
                    src={generateQRCode()} 
                    alt="Payment QR Code"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Send {selectedPaymentMethod?.token} to:</p>
                <div className="flex items-center gap-2 justify-center">
                  <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                    {paymentData.wallet.address}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(paymentData.wallet.address)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600">Address copied to clipboard!</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Purchase Summary */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Purchase Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <Badge variant="secondary">
                {selectedPaymentMethod?.token} on {selectedPaymentMethod?.chain}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">You Pay:</span>
              <span className="font-medium">{paymentAmount} {selectedPaymentMethod?.token}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">LUTAR Tokens:</span>
              <span className="font-medium">{lutarAmount} LUTAR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Early Bird Bonus (5%):</span>
              <span className="font-medium text-green-500">
                +{lutarAmount ? ((Number(lutarAmount) * 5) / 100).toFixed(2) : "0"} LUTAR
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-medium">Total LUTAR Tokens:</span>
              <span className="font-bold text-primary">
                {lutarAmount ? (Number(lutarAmount) * 1.05).toFixed(2) : "0"} LUTAR
              </span>
            </div>
          </div>
        </Card>

        {/* Wallet Connection Status */}
        {isConnected && selectedPaymentMethod?.chain === chain ? (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <ChainIcon chain={chain} size={20} />
                  <WalletIcon wallet={adapter?.name.toLowerCase().replace(/\s+/g, '-') as any} size={20} />
                  <span className="font-medium">{adapter?.name} Connected</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {address?.slice(0, 6)}...{address?.slice(-4)} • Balance: {balance} {selectedPaymentMethod.token}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Connect your {selectedPaymentMethod?.chain} wallet to continue</span>
            </div>
          </Card>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {!isConnected || selectedPaymentMethod?.chain !== chain ? (
            <Button 
              onClick={() => setIsWalletModalOpen(true)}
              className="flex-1"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Select Wallet
            </Button>
          ) : (
            <Button 
              onClick={handleBuyLutar}
              className="flex-1"
              size="lg"
            >
              Buy LUTAR
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              Purchase LUTAR Tokens
              <div className="flex justify-center mt-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      currentStep >= step 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={cn(
                        "w-8 h-0.5 mx-1",
                        currentStep > step ? "bg-primary" : "bg-muted"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Method Selection Modal */}
      <Dialog open={isPaymentMethodModalOpen} onOpenChange={setIsPaymentMethodModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Choose your preferred blockchain and token</p>
            {blockchains.map((blockchain) => (
              <div key={blockchain.symbol} className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <ChainIcon chain={blockchain.symbol} size={20} />
                  {blockchain.name}
                </h3>
                <div className="grid gap-2">
                  {(paymentTokens[blockchain.symbol as keyof typeof paymentTokens] || []).map((token) => (
                    <Button
                      key={`${blockchain.symbol}-${token.symbol}`}
                      variant="outline"
                      className="justify-start"
                      onClick={() => handlePaymentMethodSelect(blockchain.symbol, token.symbol)}
                    >
                      <ChainIcon chain={token.symbol} size={16} className="mr-2" />
                      {token.name} ({token.symbol})
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Wallet Modal */}
      <UnifiedWalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />

      {/* Transaction Modal */}
      {selectedPaymentMethod && (
        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          selectedChain={selectedPaymentMethod.chain}
          selectedToken={selectedPaymentMethod.token}
          paymentAmount={paymentAmount}
          lutarAmount={lutarAmount}
          walletAddress={address || ""}
          bscAddress={bscAddress}
        />
      )}
    </>
  )
}