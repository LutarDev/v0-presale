"use client"

import { Card } from "@/components/ui/card"
import { ChainIcon, FallbackIcon } from "@/components/ui/icon"

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
    // For stablecoins, use the chain icon as fallback
    if (['USDC', 'USDT'].includes(symbol)) {
      return (
        <ChainIcon 
          chain={selectedChain} 
          size={24}
          fallback={<span className="text-2xl">💰</span>}
        />
      )
    }
    
    return (
      <ChainIcon 
        chain={symbol} 
        size={24}
        fallback={<span className="text-2xl">💎</span>}
      />
    )
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
            {getTokenIcon(token.symbol)}
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
