"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, CheckCircle, AlertCircle, Download } from "lucide-react"
import { useState } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { getWalletAdapters } from "@/lib/wallet-adapters"

interface WalletConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedChain?: string
}

export function WalletConnectionModal({ isOpen, onClose, selectedChain }: WalletConnectionModalProps) {
  const { chain: hookChain, isConnected, address, balance, isConnecting, error, connect, disconnect } = useWallet()

  const effectiveChain = selectedChain || hookChain
  const availableWallets = getWalletAdapters(effectiveChain)

  const [copied, setCopied] = useState(false)

  const handleWalletConnect = async (adapter: any) => {
    await connect(adapter, effectiveChain)
    if (!error) {
      setTimeout(() => {
        onClose()
      }, 1000)
    }
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getWalletInstallUrl = (walletName: string) => {
    const urls: Record<string, string> = {
      MetaMask: "https://metamask.io/download/",
      Phantom: "https://phantom.app/",
      Unisat: "https://unisat.io/",
      Xverse: "https://www.xverse.app/",
      TronLink: "https://www.tronlink.org/",
      Solflare: "https://solflare.com/",
      Tonkeeper: "https://tonkeeper.com/",
    }
    return urls[walletName] || "#"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            {isConnected ? `${effectiveChain} Wallet Connected` : `Connect ${effectiveChain} Wallet`}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
              <div className="text-sm text-red-600">
                <p className="font-medium mb-1">Connection Error</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isConnected ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a wallet to connect to the {effectiveChain} network.
              {availableWallets.length === 0 && " No compatible wallets found for this network."}
            </p>

            <div className="space-y-3">
              {availableWallets.map((adapter) => (
                <Card key={adapter.name} className="p-4 cursor-pointer hover:bg-card/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{adapter.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{adapter.name}</div>
                      <div className="text-xs text-muted-foreground">{adapter.description}</div>
                    </div>

                    {adapter.isInstalled() ? (
                      <Button size="sm" onClick={() => handleWalletConnect(adapter)} disabled={isConnecting}>
                        {isConnecting ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(getWalletInstallUrl(adapter.name), "_blank")}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Install
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {availableWallets.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No wallets available for {effectiveChain} network</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Please install a compatible wallet or switch to a different blockchain
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Wallet Connected</span>
            </div>

            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <Badge variant="outline">{effectiveChain}</Badge>
                </div>

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
                  <span className="text-sm font-medium">
                    {balance} {effectiveChain}
                  </span>
                </div>
              </div>
            </Card>

            {copied && <div className="text-xs text-green-500 text-center">Address copied to clipboard!</div>}

            <div className="flex gap-2">
              <Button className="flex-1" onClick={onClose}>
                Continue to Presale
              </Button>
              <Button variant="outline" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
