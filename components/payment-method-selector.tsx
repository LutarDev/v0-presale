"use client"

import { Card } from "@/components/ui/card"

interface PaymentToken {
  symbol: string
  name: string
}

interface PaymentMethodSelectorProps {
  selectedChain: string
  selectedToken: string
  onTokenSelect: (token: string) => void
  availableTokens: PaymentToken[]
}

export function PaymentMethodSelector({
  selectedChain,
  selectedToken,
  onTokenSelect,
  availableTokens,
}: PaymentMethodSelectorProps) {
  const getTokenIcon = (symbol: string) => {
    const icons: Record<string, string> = {
      BTC: "🟠",
      ETH: "🔷",
      BNB: "🟡",
      SOL: "🟣",
      POL: "🟪",
      TRX: "🔴",
      TON: "🔵",
      USDC: "💵",
      USDT: "💰",
    }
    return icons[symbol] || "💎"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {availableTokens.map((token) => (
        <Card
          key={token.symbol}
          className={`p-4 cursor-pointer transition-all hover:scale-105 ${
            selectedToken === token.symbol ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
          }`}
          onClick={() => onTokenSelect(token.symbol)}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getTokenIcon(token.symbol)}</span>
            <div>
              <div className="font-medium">{token.symbol}</div>
              <div className="text-xs text-muted-foreground">{token.name}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
