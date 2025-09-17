"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, ExternalLink, AlertTriangle, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useWallet } from "@/hooks/use-wallet"

interface WalletStatusProps {
  onConnect: () => void
}

export function WalletStatus({ onConnect }: WalletStatusProps) {
  const { isConnected, address, balance, chain, disconnect, refreshBalance, adapter } = useWallet()

  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRefreshBalance = async () => {
    setIsRefreshing(true)
    await refreshBalance()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getExplorerUrl = (address: string, chain: string) => {
    const explorers: Record<string, string> = {
      ETH: `https://etherscan.io/address/${address}`,
      BNB: `https://bscscan.com/address/${address}`,
      POL: `https://polygonscan.com/address/${address}`,
      BTC: `https://blockstream.info/address/${address}`,
      SOL: `https://explorer.solana.com/address/${address}`,
      TRX: `https://tronscan.org/#/address/${address}`,
      TON: `https://tonscan.org/address/${address}`,
    }
    return explorers[chain] || "#"
  }

  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Connect Your {chain} Wallet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your wallet to participate in the LUTAR token presale
            </p>
          </div>
          <Button onClick={onConnect} className="w-full">
            Connect {chain} Wallet
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Wallet Connected</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-500">
              {adapter?.name}
            </Badge>
            <Badge variant="outline">{chain}</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Address</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {balance || "0.0000"} {chain}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleRefreshBalance}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Network</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm">Connected</span>
            </div>
          </div>
        </div>

        {copied && <div className="text-xs text-green-500 text-center">Address copied to clipboard!</div>}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => window.open(getExplorerUrl(address!, chain), "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </Button>
          <Button variant="outline" size="sm" onClick={disconnect}>
            Disconnect
          </Button>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
            <div className="text-xs text-amber-600">
              <p className="font-medium mb-1">Security Notice</p>
              <p>Always verify the contract address before making transactions. Never share your private keys.</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
