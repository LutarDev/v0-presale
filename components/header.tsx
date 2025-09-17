"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UnifiedWalletModal } from "@/components/unified-wallet-modal"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet, Menu } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function Header() {
  const { isConnected, address, chain, adapter, disconnect } = useWallet()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleWalletClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-bold text-foreground">LUTAR</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link href="/presale" className="text-muted-foreground hover:text-foreground transition-colors">
                  Presale
                </Link>
                <Link href="/buy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Buy Tokens
                </Link>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tokenomics
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {isConnected ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                    {adapter?.name}
                  </Badge>
                  <Badge variant="outline">{chain}</Badge>
                  <Button variant="secondary" className="flex items-center gap-2" onClick={handleWalletClick}>
                    <Wallet className="w-4 h-4" />
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </Button>
                </div>
              ) : (
                <Button variant="default" className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90" onClick={handleWalletClick}>
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </Button>
              )}

              {copied && (
                <div className="absolute top-16 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Address copied!
                </div>
              )}

              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <UnifiedWalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
