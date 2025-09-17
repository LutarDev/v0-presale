"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Clock, TrendingUp } from "lucide-react"

interface PurchaseSummaryProps {
  selectedChain: string
  selectedToken: string
  paymentAmount: string
  lutarAmount: string
  lutarPrice: number
  isWalletConnected: boolean
  onPurchase: () => void
}

export function PurchaseSummary({
  selectedChain,
  selectedToken,
  paymentAmount,
  lutarAmount,
  lutarPrice,
  isWalletConnected,
  onPurchase,
}: PurchaseSummaryProps) {
  const estimatedGasFee = "0.002" // Mock gas fee
  const bonusPercentage = 15 // 15% bonus for early participants
  const bonusTokens = lutarAmount ? ((Number(lutarAmount) * bonusPercentage) / 100).toFixed(2) : "0"
  const totalTokens = lutarAmount ? (Number(lutarAmount) + Number(bonusTokens)).toFixed(2) : "0"

  const canPurchase = paymentAmount && lutarAmount && isWalletConnected && Number(paymentAmount) > 0

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Purchase Summary</h3>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Payment Method</span>
            <Badge variant="secondary">
              {selectedToken} on {selectedChain}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">You Pay</span>
            <span className="font-medium">
              {paymentAmount || "0"} {selectedToken}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">LUTAR Tokens</span>
            <span className="font-medium">{lutarAmount || "0"} LUTAR</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Early Bird Bonus (15%)</span>
            <span className="font-medium text-green-500">+{bonusTokens} LUTAR</span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium">Total LUTAR Tokens</span>
            <span className="font-bold text-primary">{totalTokens} LUTAR</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Gas Fee</span>
            <span>
              {estimatedGasFee} {selectedChain}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-accent">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Price Increase Alert</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Token price increases to $0.055 in the next phase. Secure your tokens now!
          </p>

          <div className="flex items-center gap-2 text-amber-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">12 days, 8 hours left</span>
          </div>
        </div>
      </Card>

      <Button onClick={onPurchase} disabled={!canPurchase} className="w-full text-lg py-6" size="lg">
        {!isWalletConnected ? "Connect Wallet to Continue" : !paymentAmount ? "Enter Amount" : "Purchase LUTAR Tokens"}
      </Button>

      <Card className="p-4 bg-amber-500/10 border-amber-500/20">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
          <div className="text-xs text-amber-600">
            <p className="font-medium mb-1">Important Notice</p>
            <p>
              Tokens will be distributed to your BSC wallet address after the presale ends. Vesting schedule applies.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
