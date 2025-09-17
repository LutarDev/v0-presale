"use client"

import { Card } from "@/components/ui/card"
import { UnifiedWalletModal } from "@/components/unified-wallet-modal"
import { WalletStatus } from "@/components/wallet-status"
import { useWallet } from "@/hooks/use-wallet"
import { useState } from "react"

const blockchains = [
  { name: "Bitcoin", symbol: "BTC", color: "bg-[#f7931a]", textColor: "text-[#f7931a]", iconTextColor: "text-white" },
  { name: "Ethereum", symbol: "ETH", color: "bg-[#627eea]", textColor: "text-[#627eea]", iconTextColor: "text-white" },
  { name: "BSC", symbol: "BNB", color: "bg-[#f3ba2f]", textColor: "text-[#f3ba2f]", iconTextColor: "text-black" }, // Using black text for better contrast on yellow background
  { name: "Solana", symbol: "SOL", color: "bg-[#8c24a2]", textColor: "text-[#8c24a2]", iconTextColor: "text-white" },
  { name: "Polygon", symbol: "POL", color: "bg-[#8247e5]", textColor: "text-[#8247e5]", iconTextColor: "text-white" },
  { name: "TRON", symbol: "TRX", color: "bg-[#ff060a]", textColor: "text-[#ff060a]", iconTextColor: "text-white" },
  { name: "TON", symbol: "TON", color: "bg-[#0088cc]", textColor: "text-[#0088cc]", iconTextColor: "text-white" },
]

export function BlockchainSelector() {
  const { chain, isConnected, switchChain, isConnecting, adapter } = useWallet()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConnect = () => {
    setIsModalOpen(true)
  }

  const handleChainSelect = async (chainSymbol: string) => {
    if (chain === chainSymbol) return // Already selected

    // Show loading state during chain switch
    await switchChain(chainSymbol)
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Blockchain</h2>
          <p className="text-muted-foreground">Select from 7 supported blockchains to participate in the presale</p>
          {isConnecting && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Switching to {chain} network...
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {blockchains.map((blockchain) => (
            <Card
              key={blockchain.symbol}
              className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                chain === blockchain.symbol ? "ring-2 ring-primary bg-card/80" : "hover:bg-card/60"
              } ${isConnecting ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => handleChainSelect(blockchain.symbol)}
            >
              <div className="text-center">
                <div
                  className={`w-12 h-12 ${blockchain.color} rounded-full mx-auto mb-3 flex items-center justify-center`}
                >
                  <span className={`${blockchain.iconTextColor} font-bold text-sm`}>{blockchain.symbol}</span>{" "}
                  {/* Using dynamic text color for better contrast */}
                </div>
                <div className="text-sm font-medium text-foreground">{blockchain.name}</div>
                <div className={`text-xs ${blockchain.textColor} font-medium`}>{blockchain.symbol}</div>
                {isConnected && chain === blockchain.symbol && (
                  <div className="flex items-center justify-center mt-2 gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-500 font-medium">{adapter?.name}</span>
                  </div>
                )}
                {isConnecting && chain === blockchain.symbol && (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-2" />
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="max-w-md mx-auto">
          <WalletStatus onConnect={handleConnect} />
        </div>

        <UnifiedWalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </section>
  )
}
