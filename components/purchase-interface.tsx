"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UnifiedWalletModal } from "@/components/unified-wallet-modal"
import { TransactionModal } from "@/components/transaction-modal"
import { PaymentMethodSelector } from "@/components/payment-method-selector"
import { PurchaseSummary } from "@/components/purchase-summary"
import { useWallet } from "@/hooks/use-wallet"
import { priceService } from "@/lib/price-service"
import { useState, useEffect } from "react"
import { ArrowRight, Wallet, CheckCircle, Copy, Loader2 } from "lucide-react"

const blockchains = [
  { name: "Bitcoin", symbol: "BTC", color: "bg-[#f7931a]", rate: 0.000001, iconTextColor: "text-white" },
  { name: "Ethereum", symbol: "ETH", color: "bg-[#627eea]", rate: 0.000018, iconTextColor: "text-white" },
  { name: "BSC", symbol: "BNB", color: "bg-[#f3ba2f]", rate: 0.000075, iconTextColor: "text-black" }, // Using black text for better contrast on yellow background
  { name: "Solana", symbol: "SOL", color: "bg-[#8c24a2]", rate: 0.0005, iconTextColor: "text-white" },
  { name: "Polygon", symbol: "POL", color: "bg-[#8247e5]", rate: 0.06, iconTextColor: "text-white" },
  { name: "TRON", symbol: "TRX", color: "bg-[#ff060a]", rate: 0.45, iconTextColor: "text-white" },
  { name: "TON", symbol: "TON", color: "bg-[#0088cc]", rate: 0.02, iconTextColor: "text-white" },
]

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

export function PurchaseInterface() {
  const { chain, isConnected, address, balance, switchChain, isConnecting, adapter } = useWallet()
  const [selectedToken, setSelectedToken] = useState(chain)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [lutarAmount, setLutarAmount] = useState("")
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [lutarPrice, setLutarPrice] = useState(0.004) // Correct LUTAR price: $0.004 USD
  const [exchangeRates, setExchangeRates] = useState<Map<string, number>>(new Map())
  const [loadingPrices, setLoadingPrices] = useState(true)
  const [bscAddress, setBscAddress] = useState("") // BSC address for receiving LUTAR tokens

  const selectedChainData = blockchains.find((blockchain) => blockchain.symbol === chain)
  const availableTokens = paymentTokens[chain as keyof typeof paymentTokens] || []

  // Load prices and exchange rates on component mount
  useEffect(() => {
    const loadPrices = async () => {
      try {
        setLoadingPrices(true)
        
        // Load LUTAR price - use fixed price of $0.004
        setLutarPrice(0.004)
        
        // Load exchange rates for all supported tokens
        const tokens = ["BTC", "ETH", "BNB", "SOL", "POL", "TRX", "TON"]
        const rates = new Map<string, number>()
        
        for (const token of tokens) {
          try {
            const rate = await priceService.getExchangeRate(token, "USD")
            rates.set(token, rate)
          } catch (error) {
            console.warn(`Failed to load rate for ${token}:`, error)
            // Fallback to mock rates
            const mockRate = blockchains.find(b => b.symbol === token)?.rate || 1
            rates.set(token, mockRate)
          }
        }
        
        setExchangeRates(rates)
      } catch (error) {
        console.error("Error loading prices:", error)
        // Fallback to mock data
        const rates = new Map<string, number>()
        blockchains.forEach(blockchain => {
          rates.set(blockchain.symbol, blockchain.rate)
        })
        setExchangeRates(rates)
      } finally {
        setLoadingPrices(false)
      }
    }

    loadPrices()
  }, [])

  useEffect(() => {
    setSelectedToken(chain)
  }, [chain])

  // Calculate LUTAR tokens based on payment amount
  useEffect(() => {
    if (paymentAmount && !isNaN(Number(paymentAmount)) && !loadingPrices) {
      let usdValue: number
      
      if (selectedToken === "USDC" || selectedToken === "USDT") {
        usdValue = Number(paymentAmount)
      } else {
        const exchangeRate = exchangeRates.get(selectedToken) || selectedChainData?.rate || 1
        usdValue = Number(paymentAmount) * exchangeRate
      }
      
      const tokens = (usdValue / lutarPrice).toFixed(2)
      setLutarAmount(tokens)
    } else {
      setLutarAmount("")
    }
  }, [paymentAmount, selectedToken, selectedChainData, lutarPrice, exchangeRates, loadingPrices])

  // Calculate payment amount based on LUTAR amount
  const handleLutarAmountChange = (value: string) => {
    setLutarAmount(value)
    if (value && !isNaN(Number(value)) && !loadingPrices) {
      const usdValue = Number(value) * lutarPrice
      let paymentValue: number
      
      if (selectedToken === "USDC" || selectedToken === "USDT") {
        paymentValue = usdValue
      } else {
        const exchangeRate = exchangeRates.get(selectedToken) || selectedChainData?.rate || 1
        paymentValue = usdValue / exchangeRate
      }
      
      setPaymentAmount(paymentValue.toFixed(6))
    } else {
      setPaymentAmount("")
    }
  }

  const handlePurchase = () => {
    console.log("[v0] Purchase initiated:", {
      chain,
      selectedToken,
      paymentAmount,
      lutarAmount,
      isConnected,
      address,
      bscAddress,
    })

    if (!isConnected) {
      console.log("[v0] Wallet not connected, opening wallet modal")
      setIsWalletModalOpen(true)
      return
    }

    if (!paymentAmount || Number.parseFloat(paymentAmount) <= 0) {
      console.log("[v0] Invalid payment amount:", paymentAmount)
      return
    }

    if (!lutarAmount || Number.parseFloat(lutarAmount) <= 0) {
      console.log("[v0] Invalid LUTAR amount:", lutarAmount)
      return
    }

    if (!bscAddress || !bscAddress.startsWith("0x") || bscAddress.length !== 42) {
      console.log("[v0] Invalid BSC address:", bscAddress)
      alert("Please enter a valid BSC wallet address (0x...)")
      return
    }

    console.log("[v0] Opening transaction modal")
    setIsTransactionModalOpen(true)
  }

  const getMinimumPurchase = () => {
    return selectedToken === "USDC" || selectedToken === "USDT" ? "10" : "0.001"
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Purchase LUTAR Tokens</h1>
        <p className="text-muted-foreground">Join the presale and secure your LUTAR tokens at the best price</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Blockchain Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">1. Select Blockchain</h3>
            {isConnecting && (
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Switching to {chain} network...
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {blockchains.map((blockchain) => (
                <div
                  key={blockchain.symbol}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                    chain === blockchain.symbol
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  } ${isConnecting ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() => {
                    if (chain !== blockchain.symbol) {
                      switchChain(blockchain.symbol)
                      setSelectedToken(blockchain.symbol)
                    }
                  }}
                >
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 ${blockchain.color} rounded-full mx-auto mb-2 flex items-center justify-center`}
                    >
                      <span className={`${blockchain.iconTextColor} font-bold text-xs`}>{blockchain.symbol}</span>{" "}
                      {/* Using dynamic text color for better contrast */}
                    </div>
                    <div className="text-xs font-medium">{blockchain.symbol}</div>
                    {isConnected && chain === blockchain.symbol && (
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mx-auto mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">2. Choose Payment Token</h3>
            <PaymentMethodSelector
              selectedChain={chain}
              selectedToken={selectedToken}
              onTokenSelect={setSelectedToken}
              availableTokens={availableTokens}
            />
          </Card>

          {/* Purchase Amount */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">3. Enter Purchase Amount</h3>
            {loadingPrices ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading exchange rates...
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Pay with {selectedToken}</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder={`Minimum ${getMinimumPurchase()} ${selectedToken}`}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="pr-16"
                      disabled={loadingPrices}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {selectedToken}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Receive LUTAR Tokens</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={lutarAmount}
                      onChange={(e) => handleLutarAmountChange(e.target.value)}
                      className="pr-16"
                      disabled={loadingPrices}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">LUTAR</div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span>Token Price:</span>
                  <span className="font-medium">${lutarPrice.toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Phase Price:</span>
                  <span className="font-medium text-accent">$0.005</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Your Savings:</span>
                  <span className="font-medium text-green-500">
                    {lutarAmount ? `$${((0.005 - lutarPrice) * Number(lutarAmount)).toFixed(2)}` : "$0.00"}
                  </span>
                </div>
              </div>
              </>
            )}
          </Card>

          {/* Wallet Connection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">4. Connect Wallet</h3>
            {!isConnected ? (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Connect your {chain} wallet to continue</p>
                <Button onClick={() => setIsWalletModalOpen(true)} disabled={isConnecting}>
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    `Connect ${chain} Wallet`
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">{adapter?.name} Connected</span>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Network:</span>
                    <span className="font-medium">{chain}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Address:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setIsWalletModalOpen(true)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Balance:</span>
                    <span className="font-medium">
                      {balance} {selectedToken}
                    </span>
                  </div>
                </div>
                {copied && <div className="text-xs text-green-500 text-center">Address copied to clipboard!</div>}
              </div>
            )}
          </Card>

          {/* BSC Address Input */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">5. BSC Wallet Address</h3>
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
            </div>
          </Card>
        </div>

        {/* Purchase Summary */}
        <div className="lg:col-span-1">
          <PurchaseSummary
            selectedChain={chain}
            selectedToken={selectedToken}
            paymentAmount={paymentAmount}
            lutarAmount={lutarAmount}
            lutarPrice={lutarPrice}
            isWalletConnected={isConnected}
            onPurchase={handlePurchase}
          />
        </div>
      </div>

      {/* Modals */}
      <UnifiedWalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        selectedChain={chain}
        selectedToken={selectedToken}
        paymentAmount={paymentAmount}
        lutarAmount={lutarAmount}
        walletAddress={address || ""}
        bscAddress={bscAddress}
      />
    </div>
  )
}
