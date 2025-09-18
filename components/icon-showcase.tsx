"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChainIcon, WalletIcon, FallbackIcon, getCoinIconName, getWalletIconName } from "@/components/ui/icon"
import { getAllBlockchainConfigs } from "@/lib/blockchain-config"
import { getWalletAdapters } from "@/lib/wallet-adapters"

export function IconShowcase() {
  const blockchains = getAllBlockchainConfigs()
  const allWallets = ['MetaMask', 'Phantom', 'TronLink', 'Tonkeeper', 'WalletConnect', 'Trust Wallet']

  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">LUTAR Design System</h1>
        <p className="text-muted-foreground">Comprehensive icon system for blockchain and cryptocurrency assets</p>
      </div>

      {/* Blockchain Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Icons</CardTitle>
          <CardDescription>All supported blockchain networks with their native currencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {blockchains.map((blockchain) => (
              <div key={blockchain.symbol} className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto flex items-center justify-center">
                  <ChainIcon 
                    chain={blockchain.symbol} 
                    size={64}
                    fallback={
                      <FallbackIcon 
                        symbol={blockchain.symbol}
                        size={64}
                        backgroundColor={blockchain.color}
                        color={blockchain.iconTextColor.includes('white') ? 'white' : 'black'}
                      />
                    }
                  />
                </div>
                <div className="text-sm font-medium">{blockchain.name}</div>
                <Badge variant="outline" className="text-xs">{blockchain.symbol}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wallet Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Icons</CardTitle>
          <CardDescription>Supported wallet providers across different blockchains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {allWallets.map((wallet) => (
              <div key={wallet} className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto flex items-center justify-center">
                  <WalletIcon 
                    wallet={getWalletIconName(wallet)} 
                    size={64}
                    fallback={
                      <FallbackIcon 
                        symbol={wallet.charAt(0)}
                        size={64}
                        backgroundColor="#6c757d"
                        color="white"
                      />
                    }
                  />
                </div>
                <div className="text-sm font-medium">{wallet}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Icon Sizes Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Icon Sizes</CardTitle>
          <CardDescription>Different sizes available for the icon system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            {[16, 24, 32, 48, 64, 96].map((size) => (
              <div key={size} className="text-center space-y-2">
                <ChainIcon 
                  chain="BTC" 
                  size={size}
                  fallback={
                    <FallbackIcon 
                      symbol="BTC"
                      size={size}
                      backgroundColor="#f7931a"
                      color="white"
                    />
                  }
                />
                <div className="text-xs text-muted-foreground">{size}px</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fallback Icons Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Fallback Icons</CardTitle>
          <CardDescription>Fallback icons when image assets are not available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['BTC', 'ETH', 'SOL', 'TON'].map((symbol) => (
              <div key={symbol} className="text-center space-y-2">
                <FallbackIcon 
                  symbol={symbol}
                  size={48}
                  backgroundColor="#6c757d"
                  color="white"
                />
                <div className="text-sm font-medium">{symbol}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}