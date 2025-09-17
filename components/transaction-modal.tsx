"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, ExternalLink, Copy, AlertTriangle } from "lucide-react"
import { SecurityVerification } from "@/components/security-verification"
import { TransactionSecurityCheck } from "@/components/transaction-security-check"
import { useWallet } from "@/hooks/use-wallet"
import { TransactionHandler } from "@/lib/transaction-handler"
import { getPaymentCurrency, getExplorerUrl } from "@/lib/payment-config"
import { useState, useEffect } from "react"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedChain: string
  selectedToken: string
  paymentAmount: string
  lutarAmount: string
  walletAddress: string
  bscAddress: string
}

type TransactionStatus = "security-check" | "verification" | "confirming" | "processing" | "completed" | "failed"

export function TransactionModal({
  isOpen,
  onClose,
  selectedChain,
  selectedToken,
  paymentAmount,
  lutarAmount,
  walletAddress,
  bscAddress,
}: TransactionModalProps) {
  const { adapter } = useWallet()
  const [status, setStatus] = useState<TransactionStatus>("security-check")
  const [txHash, setTxHash] = useState("")
  const [countdown, setCountdown] = useState(30)
  const [error, setError] = useState("")

  const paymentCurrency = getPaymentCurrency(selectedToken, selectedChain)

  const transactionDetails = {
    amount: paymentAmount,
    token: selectedToken,
    recipient: paymentCurrency?.wallet.address || "Unknown",
    gasLimit: "21000",
    gasPrice: "20",
  }

  const handleSecurityConfirm = (confirmed: boolean) => {
    if (confirmed) {
      setStatus("verification")
    }
  }

  const handleVerificationComplete = (verified: boolean) => {
    if (verified) {
      setStatus("confirming")
    }
  }

  useEffect(() => {
    if (status === "confirming") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            executeTransaction()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [status])

  const executeTransaction = async () => {
    if (!paymentCurrency || !adapter) {
      setError("Payment configuration or wallet not available")
      setStatus("failed")
      return
    }

    setStatus("processing")
    setError("")

    try {
      console.log("[v0] Starting transaction execution")

      // Convert payment amount to the currency's base unit (wei, satoshi, etc.)
      const amountInBaseUnit = (Number.parseFloat(paymentAmount) * Math.pow(10, paymentCurrency.decimals)).toString()

      console.log("[v0] Transaction parameters:", {
        paymentAmount,
        amountInBaseUnit,
        currency: paymentCurrency.symbol,
        chain: paymentCurrency.chain,
        decimals: paymentCurrency.decimals,
        walletAddress,
        adapterName: adapter?.name,
        adapterType: typeof adapter
      })

      const result = await TransactionHandler.executeTransaction({
        currency: paymentCurrency,
        amount: amountInBaseUnit,
        userAddress: walletAddress,
        walletAdapter: adapter,
      })

      if (result.success && result.txHash) {
        setTxHash(result.txHash)
        setTimeout(() => {
          setStatus("completed")
        }, 2000)
      } else {
        setError(result.error || "Transaction failed")
        setStatus("failed")
      }
    } catch (error) {
      console.error("[v0] Transaction execution failed:", error)
      setError(error instanceof Error ? error.message : "Transaction failed")
      setStatus("failed")
    }
  }

  const handleConfirm = () => {
    executeTransaction()
  }

  const copyTxHash = () => {
    navigator.clipboard.writeText(txHash)
  }

  const getStatusIcon = () => {
    switch (status) {
      case "security-check":
        return <AlertTriangle className="w-6 h-6 text-amber-500" />
      case "verification":
        return <CheckCircle className="w-6 h-6 text-blue-500" />
      case "confirming":
        return <Clock className="w-6 h-6 text-amber-500" />
      case "processing":
        return <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case "failed":
        return <AlertTriangle className="w-6 h-6 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "security-check":
        return "Security Verification Required"
      case "verification":
        return "Verifying Transaction"
      case "confirming":
        return "Confirm Transaction"
      case "processing":
        return "Processing Transaction"
      case "completed":
        return "Transaction Completed"
      case "failed":
        return "Transaction Failed"
    }
  }

  useEffect(() => {
    if (isOpen) {
      setStatus("security-check")
      setTxHash("")
      setCountdown(30)
      setError("")
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusText()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {status === "security-check" && (
            <TransactionSecurityCheck
              transactionDetails={transactionDetails}
              onSecurityConfirm={handleSecurityConfirm}
            />
          )}

          {status === "verification" && (
            <SecurityVerification
              walletAddress={walletAddress}
              contractAddress={paymentCurrency?.wallet.address || "Unknown"}
              transactionAmount={`${paymentAmount} ${selectedToken}`}
              onVerificationComplete={handleVerificationComplete}
            />
          )}

          {status === "confirming" && (
            <>
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Transaction Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network</span>
                    <Badge variant="secondary">{selectedChain}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment</span>
                    <span>
                      {paymentAmount} {selectedToken}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Receive</span>
                    <span>{lutarAmount} LUTAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment To</span>
                    <span className="font-mono text-xs">{paymentCurrency?.wallet.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LUTAR To</span>
                    <span className="font-mono text-xs">{bscAddress}</span>
                  </div>
                  {paymentCurrency?.wallet.comment && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comment/Tag</span>
                      <span className="font-mono text-xs">{paymentCurrency.wallet.comment}</span>
                    </div>
                  )}
                </div>
              </Card>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Please confirm this transaction in your wallet within {countdown} seconds
                </p>
                <div className="text-2xl font-bold text-primary mb-4">{countdown}s</div>
                <Button onClick={handleConfirm} className="w-full">
                  Confirm in Wallet
                </Button>
              </div>
            </>
          )}

          {status === "processing" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="font-semibold mb-2">Processing Your Purchase</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Your transaction is being processed on the {selectedChain} network
                </p>
                {txHash && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Transaction Hash</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyTxHash}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-xs font-mono mt-1">{txHash}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {status === "completed" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-green-500">Purchase Successful!</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  You have successfully purchased {lutarAmount} LUTAR tokens
                </p>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div className="text-sm text-blue-600">
                      <p className="font-medium mb-1">LUTAR Tokens Distribution</p>
                      <p>
                        Your LUTAR tokens will be automatically sent to your BSC address: {bscAddress}
                      </p>
                      <p className="mt-1 text-xs">
                        Distribution will be processed by our Thirdweb Engine backend after payment confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-4 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tokens Purchased</span>
                    <span className="font-medium">{lutarAmount} LUTAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bonus Tokens</span>
                    <span className="font-medium text-green-500">+{(Number(lutarAmount) * 0.15).toFixed(2)} LUTAR</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Total Tokens</span>
                    <span className="font-bold text-primary">{(Number(lutarAmount) * 1.15).toFixed(2)} LUTAR</span>
                  </div>
                </div>
              </Card>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    if (txHash) {
                      const explorerUrl = getExplorerUrl(selectedChain, txHash)
                      window.open(explorerUrl, "_blank")
                    }
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Explorer
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Continue
                </Button>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-xs text-blue-600">
                  <strong>Next Steps:</strong> Your LUTAR tokens will be distributed to your BSC wallet address after
                  the presale ends. Check your dashboard for updates.
                </p>
              </div>
            </div>
          )}

          {status === "failed" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-red-500">Transaction Failed</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {error || "Your transaction failed. Please try again."}
                </p>
              </div>
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
