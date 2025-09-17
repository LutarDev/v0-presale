"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { UnifiedWalletModal } from "@/components/unified-wallet-modal"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet, Menu, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function MobileMenu() {
  const { isConnected, address, chain, adapter, disconnect } = useWallet()
  const [copied, setCopied] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getExplorerUrl = () => {
    if (!address) return "#"
    
    switch (chain) {
      case "ETH":
        return `https://etherscan.io/address/${address}`
      case "BNB":
        return `https://bscscan.com/address/${address}`
      case "POL":
        return `https://polygonscan.com/address/${address}`
      case "SOL":
        return `https://solscan.io/account/${address}`
      case "TRX":
        return `https://tronscan.org/#/address/${address}`
      case "TON":
        return `https://tonscan.org/address/${address}`
      case "BTC":
        return `https://blockstream.info/address/${address}`
      default:
        return "#"
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Open mobile menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-6 mt-6">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-4">
            <SheetClose asChild>
              <Link 
                href="/presale" 
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Presale
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link 
                href="/buy" 
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Buy Tokens
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link 
                href="/dashboard" 
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Dashboard
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Tokenomics
              </a>
            </SheetClose>
          </nav>

          {/* Wallet Section */}
          <div className="border-t pt-6">
            {isConnected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                    {adapter?.name}
                  </Badge>
                  <Badge variant="outline">{chain}</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Wallet Address</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {address?.slice(0, 8)}...{address?.slice(-8)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyAddress}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="sr-only">Copy address</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0"
                      >
                        <a
                          href={getExplorerUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="sr-only">View on explorer</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                  
                  {copied && (
                    <div className="text-xs text-green-500 text-center">
                      Address copied to clipboard!
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={disconnect}
                    className="w-full"
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to access all features
                </p>
                <Button className="w-full" onClick={() => setIsWalletModalOpen(true)}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
      
      <UnifiedWalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />
    </Sheet>
  )
}
