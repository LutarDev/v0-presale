"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChainIcon, WalletIcon, CoinIcon, FallbackIcon } from "@/components/ui/icon"
import { Copy, CheckCircle, ArrowLeft, ArrowRight, Wallet, QrCode, TrendingUp, AlertTriangle, Loader2, X } from "lucide-react"
import { useWallet } from "@/hooks/wallet-context"
import { useToast } from "@/hooks/use-toast"
import { UnifiedWalletModal } from "@/components/unified-wallet-modal"
import { priceService } from "@/lib/price-service"
import { getPaymentCurrency } from "@/lib/payment-config"
import { getAllBlockchainConfigs } from "@/lib/blockchain-config"
import { TransactionHandler } from "@/lib/transaction-handler"
import { cn, validateBSCAddress } from "@/lib/utils"

interface UnifiedPurchaseInterfaceEmbedProps {
  onComplete?: (result: any) => void
  className?: string
}

type EmbedStep = 1 | 2 | 3

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

export function UnifiedPurchaseInterfaceEmbed({ 
  onComplete,
  className 
}: UnifiedPurchaseInterfaceEmbedProps) {
  const { chain, isConnected, address, balance, adapter, switchChain } = useWallet()
  const { toast } = useToast()
  
  // Component state
  const [currentStep, setCurrentStep] = useState<EmbedStep>(1)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [usdAmount, setUsdAmount] = useState("")
  const [lutarAmount, setLutarAmount] = useState("")
  const [cryptoAmount, setCryptoAmount] = useState("")
  const [bscAddress, setBscAddress] = useState("")
  const [bscAddressValidation, setBscAddressValidation] = useState<{
    isValid: boolean
    error?: string
    warnings?: string[]
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [loadingPrices, setLoadingPrices] = useState(true)
  const [lutarPrice] = useState(0.004)
  const [exchangeRates, setExchangeRates] = useState<Map<string, number>>(new Map())
  
  // Modal visibility state
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [walletModalExplicitlyOpened, setWalletModalExplicitlyOpened] = useState(false)
  const [isTransactionPending, setIsTransactionPending] = useState(false)

  // Debug wallet state and auto-close wallet modal on successful connection
  useEffect(() => {
    console.log('[Embed] Wallet state changed:', {
      isConnected,
      chain,
      address,
      balance,
      adapter: adapter?.name,
      selectedPaymentMethod: selectedPaymentMethod?.token + ' on ' + selectedPaymentMethod?.chain,
      walletModalOpen: isWalletModalOpen,
      explicitlyOpened: walletModalExplicitlyOpened
    })

    // Auto-close wallet modal when successfully connected to the correct chain
    if (isConnected && address && adapter && selectedPaymentMethod?.chain === chain && isWalletModalOpen && walletModalExplicitlyOpened) {
      console.log('[Embed] Successful connection detected, closing wallet modal')
      setTimeout(() => {
        setIsWalletModalOpen(false)
        setWalletModalExplicitlyOpened(false)
      }, 100)
    }
  }, [isConnected, chain, address, adapter, selectedPaymentMethod?.chain, isWalletModalOpen, walletModalExplicitlyOpened])

  // Helper function to get payment currency data
  const getPaymentCurrencyData = () => {
    if (!selectedPaymentMethod) return null
    
    try {
      const paymentCurrency = getPaymentCurrency(selectedPaymentMethod.token, selectedPaymentMethod.chain)
      if (!paymentCurrency) {
        console.warn(`Payment currency not found for ${selectedPaymentMethod.token} on ${selectedPaymentMethod.chain}`)
        return null
      }
      return paymentCurrency
    } catch (error) {
      console.error('Error getting payment currency data:', error)
      return null
    }
  }

  // Generate QR Code URL
  const generateQRCode = () => {
    const paymentData = getPaymentCurrencyData()
    if (!paymentData || !cryptoAmount) return ""
    
    const address = paymentData.wallet.address
    const amount = cryptoAmount
    const qrData = `${selectedPaymentMethod?.chain}:${address}?amount=${amount}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`
  }

  // Handle wallet modal opening
  const handleWalletModalOpen = () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please select a payment method first",
        variant: "destructive"
      })
      return
    }
    
    console.log(`[Embed] Opening wallet modal for ${selectedPaymentMethod.chain}`)
    setWalletModalExplicitlyOpened(true)
    setIsWalletModalOpen(true)
  }

  // Handle Buy LUTAR action
  const handleBuyLutar = async () => {
    console.log('[Embed] Buy LUTAR clicked, checking connection state:', {
      isConnected,
      address,
      adapter: adapter?.name,
      selectedPaymentMethod,
      chain,
      walletModalOpen: isWalletModalOpen
    })

    // Only open wallet modal if we're truly not connected to the right chain
    if (!isConnected || !address || !adapter || !selectedPaymentMethod || selectedPaymentMethod.chain !== chain) {
      console.log('[Embed] Connection check failed, opening wallet modal')
      handleWalletModalOpen()
      return
    }

    // If we reach here, we're properly connected - proceed with transaction
    const paymentCurrency = getPaymentCurrencyData()
    if (!paymentCurrency) {
      toast({
        title: "Payment Configuration Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsTransactionPending(true)
      
      // Convert payment amount to base units (wei, satoshi, etc.)
      const amountInBaseUnits = (Number(cryptoAmount) * Math.pow(10, paymentCurrency.decimals)).toString()

      console.log('[Embed] Initiating LUTAR purchase:', {
        paymentMethod: selectedPaymentMethod,
        usdAmount: usdAmount,
        cryptoAmount: cryptoAmount,
        amountInBaseUnits,
        lutarAmount,
        bscAddress,
        walletAddress: address,
        currency: paymentCurrency
      })

      toast({
        title: "Transaction Initiated",
        description: "Please confirm the transaction in your wallet",
      })

      // Execute the transaction using TransactionHandler
      const result = await TransactionHandler.executeTransaction({
        currency: paymentCurrency,
        amount: amountInBaseUnits,
        userAddress: address,
        walletAdapter: adapter
      })

      if (result.success) {
        console.log('[Embed] Transaction successful:', result.txHash)
        
        toast({
          title: "Payment Successful!",
          description: `Transaction confirmed: ${result.txHash?.slice(0, 10)}...`,
        })

        setTimeout(() => {
          toast({
            title: "LUTAR Tokens Sent!",
            description: `${lutarAmount} LUTAR tokens sent to your BSC address`,
          })
          
          if (onComplete) {
            onComplete({
              success: true,
              txHash: result.txHash,
              usdAmount,
              cryptoAmount,
              lutarAmount,
              bscAddress,
              paymentMethod: selectedPaymentMethod
            })
          }
        }, 3000)
        
      } else {
        console.error('[Embed] Transaction failed:', result.error)
        toast({
          title: "Transaction Failed",
          description: result.error || "Transaction could not be completed. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('[Embed] Transaction error:', error)
      toast({
        title: "Transaction Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsTransactionPending(false)
    }
  }

  // Validate BSC address whenever it changes
  useEffect(() => {
    if (!bscAddress) {
      setBscAddressValidation(null)
      return
    }

    const validation = validateBSCAddress(bscAddress)
    setBscAddressValidation(validation)
  }, [bscAddress])

  // Load exchange rates
  useEffect(() => {
    const loadPrices = async () => {
      try {
        setLoadingPrices(true)
        const tokens = ["BTC", "ETH", "BNB", "SOL", "POL", "TRX", "TON"]
        const rates = new Map<string, number>()
        
        // Set immediate fallback rates
        const fallbackRates: Record<string, number> = {
          'BTC': 43000, 'ETH': 2500, 'BNB': 300, 'SOL': 100, 
          'POL': 0.8, 'TRX': 0.1, 'TON': 2.5, 'USDC': 1, 'USDT': 1
        }
        
        // Set fallback rates immediately
        tokens.forEach(token => rates.set(token, fallbackRates[token] || 1))
        rates.set('USDC', 1)
        rates.set('USDT', 1)
        setExchangeRates(new Map(rates))
        
        // Try to fetch real rates with proper rate limiting
        console.log('[Embed] Loading exchange rates...')
        let successCount = 0
        const maxRequests = 3
        
        for (let i = 0; i < Math.min(tokens.length, maxRequests); i++) {
          const token = tokens[i]
          try {
            if (i > 0) {
              await new Promise(resolve => setTimeout(resolve, 2000))
            }
            
            const rate = await priceService.getExchangeRate(token, "USD")
            if (rate && rate > 0) {
              rates.set(token, rate)
              successCount++
            }
          } catch (error) {
            console.warn(`Failed to load rate for ${token}, using fallback`)
          }
        }
        
        console.log(`[Embed] Loaded ${successCount} real exchange rates, using fallback for others`)
        setExchangeRates(new Map(rates))
      } catch (error) {
        console.error("Error loading prices:", error)
        // Ensure we always have fallback rates
        const fallbackMap = new Map<string, number>()
        const fallbackRates = {
          'BTC': 43000, 'ETH': 2500, 'BNB': 300, 'SOL': 100,
          'POL': 0.8, 'TRX': 0.1, 'TON': 2.5, 'USDC': 1, 'USDT': 1
        }
        Object.entries(fallbackRates).forEach(([token, rate]) => {
          fallbackMap.set(token, rate)
        })
        setExchangeRates(fallbackMap)
      } finally {
        setLoadingPrices(false)
      }
    }

    loadPrices()
  }, [])

  // Calculate LUTAR amount and crypto amount based on USD input
  useEffect(() => {
    if (usdAmount && selectedPaymentMethod && !loadingPrices && exchangeRates.size > 0) {
      const usdValue = parseFloat(usdAmount)
      if (isNaN(usdValue) || usdValue <= 0) {
        setLutarAmount("")
        setCryptoAmount("")
        return
      }

      // Calculate LUTAR tokens from USD
      const tokens = (usdValue / lutarPrice).toFixed(2)
      setLutarAmount(tokens)

      // Calculate crypto amount needed for the USD value
      if (selectedPaymentMethod.token === "USDC" || selectedPaymentMethod.token === "USDT") {
        // For stablecoins, crypto amount = USD amount
        setCryptoAmount(usdValue.toFixed(6))
      } else {
        const exchangeRate = exchangeRates.get(selectedPaymentMethod.token)
        if (!exchangeRate || exchangeRate <= 0) {
          console.warn(`No valid exchange rate for ${selectedPaymentMethod.token}`)
          setCryptoAmount("")
          return
        }
        // Calculate how much crypto is needed for the USD amount
        const cryptoNeeded = (usdValue / exchangeRate).toFixed(6)
        setCryptoAmount(cryptoNeeded)
      }
    } else {
      setLutarAmount("")
      setCryptoAmount("")
    }
  }, [usdAmount, selectedPaymentMethod, lutarPrice, exchangeRates, loadingPrices])

  const handlePaymentMethodSelect = (selectedChain: string, token: string) => {
    console.log(`[Embed] Payment method selected: ${token} on ${selectedChain}`)
    setSelectedPaymentMethod({ chain: selectedChain, token })
    setIsPaymentMethodModalOpen(false)
    
    // Switch chain if needed
    if (selectedChain !== chain) {
      console.log(`[Embed] Switching chain from ${chain} to ${selectedChain}`)
      switchChain(selectedChain)
    }
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

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Enter Purchase Amount</h2>
        <p className="text-muted-foreground">Select your payment method and amount</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">You Pay (in USD)</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="Enter USD amount"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              className="pr-36"
              disabled={loadingPrices}
              step="0.01"
              min="0"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {selectedPaymentMethod && (
                <div className="flex items-center gap-1">
                  <ChainIcon 
                    chain={selectedPaymentMethod.chain} 
                    size={16}
                    fallback={<span className="text-xs">💎</span>}
                  />
                  <span className="text-sm font-medium">{selectedPaymentMethod.token}</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaymentMethodModalOpen(true)}
                className="h-8 px-2 text-xs"
                disabled={loadingPrices}
              >
                {selectedPaymentMethod ? "Change" : "Select"}
              </Button>
            </div>
          </div>
          {selectedPaymentMethod && cryptoAmount && (
            <p className="text-xs text-muted-foreground mt-1">
              ≈ {cryptoAmount} {selectedPaymentMethod.token} on {selectedPaymentMethod.chain}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block text-green-600">You Receive</label>
          <div className="relative">
            <Input
              type="text"
              value={loadingPrices ? "Loading..." : (lutarAmount || "0.00")}
              readOnly
              className="pr-20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {loadingPrices ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Image 
                    src="/images/icons/coins/lutar.svg" 
                    alt="LUTAR Token" 
                    width={18} 
                    height={18}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-green-600">LUTAR</span>
                </>
              )}
            </div>
          </div>
        </div>

        {selectedPaymentMethod && !loadingPrices && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span>LUTAR Price:</span>
              <span className="font-medium">${lutarPrice.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Exchange Rate:</span>
              <span className="font-medium">
                1 {selectedPaymentMethod.token} = ${exchangeRates.get(selectedPaymentMethod.token)?.toLocaleString() || "0.00"}
              </span>
            </div>
          </div>
        )}
      </div>

      <Button 
        onClick={() => {
          if (selectedPaymentMethod && usdAmount && Number(usdAmount) > 0) {
            setCurrentStep(2)
          } else {
            toast({
              title: "Incomplete Information",
              description: "Please select payment method and enter amount",
              variant: "destructive"
            })
          }
        }}
        disabled={!selectedPaymentMethod || !usdAmount || Number(usdAmount) <= 0 || loadingPrices}
        className="w-full"
        size="lg"
      >
        {loadingPrices ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Loading Prices...
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
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
            className={cn(
              "font-mono",
              bscAddressValidation?.error && "border-red-500 focus:border-red-500",
              bscAddressValidation?.isValid && "border-green-500 focus:border-green-500"
            )}
          />
          
          {/* Validation feedback */}
          {bscAddressValidation?.error && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <X className="w-3 h-3" />
              {bscAddressValidation.error}
            </p>
          )}
          
          {bscAddressValidation?.isValid && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Valid BSC address
            </p>
          )}
          
          {bscAddressValidation?.warnings && bscAddressValidation.warnings.length > 0 && (
            <div className="mt-2">
              {bscAddressValidation.warnings.map((warning, index) => (
                <p key={index} className="text-xs text-yellow-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {warning}
                </p>
              ))}
            </div>
          )}
          
          {!bscAddress && (
            <p className="text-xs text-muted-foreground mt-2">
              Enter your BSC wallet address to receive LUTAR tokens after payment confirmation.
              LUTAR tokens will be sent immediately after successful payment.
            </p>
          )}
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
                {cryptoAmount} {selectedPaymentMethod?.token} on {selectedPaymentMethod?.chain}
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
          onClick={() => {
            if (bscAddressValidation?.isValid) {
              setCurrentStep(3)
            } else {
              toast({
                title: "Invalid BSC Address",
                description: bscAddressValidation?.error || "Please enter a valid BSC wallet address",
                variant: "destructive"
              })
            }
          }}
          disabled={!bscAddressValidation?.isValid}
          className="flex-1"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => {
    const paymentData = getPaymentCurrencyData()
    
    if (!paymentData) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Payment Configuration Error</h2>
            <p className="text-muted-foreground">Unable to load payment configuration</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentStep(2)} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      )
    }
    
    // Check if we're connected to the correct chain
    const isCorrectChain = isConnected && address && adapter && selectedPaymentMethod?.chain === chain
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Complete Purchase</h2>
          <p className="text-muted-foreground">Send payment to complete your purchase</p>
        </div>

        {/* QR Code and Payment Address */}
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
              <span className="text-muted-foreground">Amount to Send:</span>
              <span className="font-medium">{cryptoAmount} {selectedPaymentMethod?.token}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">You Receive:</span>
              <span className="font-medium text-green-600">{lutarAmount} LUTAR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">BSC Address:</span>
              <span className="font-mono text-xs">{bscAddress || "Not set"}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Bonus (5%):</span>
              <span className="font-bold text-primary">
                {lutarAmount ? (Number(lutarAmount) * 1.05).toFixed(2) : "0"} LUTAR
              </span>
            </div>
          </div>
        </Card>

        {/* Wallet Connection Status */}
        {isCorrectChain ? (
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
                  {address?.slice(0, 6)}...{address?.slice(-4)} • Balance: {balance || '0.00'} {selectedPaymentMethod?.token}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">
                {!isConnected ? 
                  `Connect your ${selectedPaymentMethod?.chain} wallet to continue` :
                  `Switch to ${selectedPaymentMethod?.chain} network to continue`
                }
              </span>
            </div>
          </Card>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {!isCorrectChain ? (
            <Button 
              onClick={handleWalletModalOpen}
              className="flex-1"
              disabled={isWalletModalOpen}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {!isConnected ? 'Connect Wallet' : 'Switch Network'}
            </Button>
          ) : (
            <Button 
              onClick={handleBuyLutar}
              disabled={isTransactionPending}
              className="flex-1"
              size="lg"
            >
              {isTransactionPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Buy LUTAR
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Step Indicator */}
      <div className="flex justify-center">
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

      {/* Step Content */}
      <div className="max-w-2xl mx-auto">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Payment Method Selection Modal */}
      <Dialog open={isPaymentMethodModalOpen} onOpenChange={setIsPaymentMethodModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose your preferred blockchain and token
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {blockchains.map((blockchain) => {
              const chainTokens = paymentTokens[blockchain.symbol as keyof typeof paymentTokens] || []
              if (chainTokens.length === 0) return null
              
              // Special case for Bitcoin - no dropdown, just a single button
              if (blockchain.symbol === 'BTC') {
                return (
                  <div key={blockchain.symbol} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ChainIcon chain={blockchain.symbol} size={20} />
                      <span className="font-medium">{blockchain.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handlePaymentMethodSelect(blockchain.symbol, 'BTC')}
                    >
                      <ChainIcon chain="BTC" size={16} className="mr-2" />
                      Bitcoin (BTC)
                    </Button>
                  </div>
                )
              }
              
              // Regular dropdown for other chains with multiple tokens
              return (
                <div key={blockchain.symbol} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ChainIcon chain={blockchain.symbol} size={20} />
                    <span className="font-medium">{blockchain.name}</span>
                  </div>
                  <Select onValueChange={(tokenSymbol) => handlePaymentMethodSelect(blockchain.symbol, tokenSymbol)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${blockchain.symbol} token`} />
                    </SelectTrigger>
                    <SelectContent>
                      {chainTokens.map((token) => (
                        <SelectItem key={`${blockchain.symbol}-${token.symbol}`} value={token.symbol}>
                          <div className="flex items-center gap-2">
                            <ChainIcon chain={token.symbol} size={16} />
                            <span>{token.name} ({token.symbol})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Wallet Modal */}
      {walletModalExplicitlyOpened && (
        <UnifiedWalletModal 
          isOpen={isWalletModalOpen} 
          onClose={() => {
            console.log('[Embed] Wallet modal closed')
            setIsWalletModalOpen(false)
            setWalletModalExplicitlyOpened(false)
          }}
          targetChain={selectedPaymentMethod?.chain}
        />
      )}
    </div>
  )
}