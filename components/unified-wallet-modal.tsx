"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SkeletonBalanceCard } from "@/components/ui/skeleton-card"
import { ChainIcon, WalletIcon, FallbackIcon } from "@/components/ui/icon"
import { Wallet, Copy, CheckCircle, AlertCircle, Download, ArrowLeft, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { getWalletAdapters } from "@/lib/wallet-adapters"
import { fetchWalletBalances, type WalletBalances } from "@/lib/balance-fetcher"
import { getAllBlockchainConfigs } from "@/lib/blockchain-config"

interface UnifiedWalletModalProps {
  isOpen: boolean
  onClose: () => void
  targetChain?: string // Add optional target chain prop
}

type ModalStep = "chain-selection" | "wallet-selection" | "wallet-info"

const blockchains = getAllBlockchainConfigs()

export function UnifiedWalletModal({ isOpen, onClose, targetChain }: UnifiedWalletModalProps) {
  const { chain, isConnected, address, balance, isConnecting, error, connect, disconnect } = useWallet()
  const [currentStep, setCurrentStep] = useState<ModalStep>("chain-selection")
  const [selectedChain, setSelectedChain] = useState<string>(chain)
  const [copied, setCopied] = useState(false)
  const [walletBalances, setWalletBalances] = useState<WalletBalances | null>(null)
  const [loadingBalances, setLoadingBalances] = useState(false)

  // Determine which step to show based on connection status and target chain
  useEffect(() => {
    if (isConnected) {
      setCurrentStep("wallet-info")
      loadWalletBalances()
    } else if (targetChain) {
      // If target chain is provided, skip chain selection and go directly to wallet selection
      setSelectedChain(targetChain)
      setCurrentStep("wallet-selection")
    } else {
      setCurrentStep("chain-selection")
    }
  }, [isConnected, targetChain])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (targetChain) {
        setSelectedChain(targetChain)
        setCurrentStep("wallet-selection")
      } else {
        setSelectedChain(chain)
        setCurrentStep(isConnected ? "wallet-info" : "chain-selection")
      }
      
      // Clear any previous errors when modal opens
      if (error) {
        // Error state will be cleared by the useWallet hook when connection succeeds
      }
      if (isConnected) {
        setCurrentStep("wallet-info")
        loadWalletBalances()
      } else if (targetChain) {
        setCurrentStep("wallet-selection")
      } else {
        setCurrentStep("chain-selection")
      }
    }
  }, [isOpen, chain, isConnected, error, targetChain])

  const loadWalletBalances = async () => {
    if (!address || !chain) return

    setLoadingBalances(true)
    try {
      const balances = await fetchWalletBalances(address, chain)
      setWalletBalances(balances)
    } catch (error) {
      console.error("[v0] Error loading wallet balances:", error)
    } finally {
      setLoadingBalances(false)
    }
  }

  const handleChainSelect = (chainSymbol: string) => {
    setSelectedChain(chainSymbol)
    setCurrentStep("wallet-selection")
  }

  const handleWalletConnect = async (adapter: any) => {
    console.log("[UnifiedWalletModal] Attempting to connect:", {
      adapter: adapter.name,
      chain: selectedChain,
      timestamp: new Date().toISOString()
    })
    
    try {
      await connect(adapter, selectedChain)
      
      // Wait a moment for state to update
      setTimeout(() => {
        console.log("[UnifiedWalletModal] Connection completed, checking state:", {
          isConnected,
          address,
          chain,
          adapter: adapter.name
        })
        
        if (isConnected && address) {
          // Connection successful - move to wallet info step
          setCurrentStep("wallet-info")
          // Load balances after a short delay to ensure state is updated
          setTimeout(() => {
            loadWalletBalances()
          }, 500)
        }
      }, 500)
    } catch (error) {
      console.error("[UnifiedWalletModal] Connection error:", error)
      // Error is handled by the connect function in useWallet hook
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
    if (targetChain) {
      setCurrentStep("wallet-selection")
    } else {
      setCurrentStep("chain-selection")
    }
    setWalletBalances(null)
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

  const availableWallets = getWalletAdapters(selectedChain)
  const selectedBlockchain = blockchains.find((b) => b.symbol === selectedChain)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            {currentStep === "chain-selection" && "Select Blockchain"}
            {currentStep === "wallet-selection" && `Connect ${selectedChain} Wallet`}
            {currentStep === "wallet-info" && `${chain} Wallet`}
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

        {/* Chain Selection Step - Only show if no target chain specified */}
        {currentStep === "chain-selection" && !targetChain && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Choose a blockchain network to connect your wallet.</p>
            <div className="grid grid-cols-2 gap-3">
              {blockchains.map((blockchain) => (
                <Card
                  key={blockchain.symbol}
                  className="p-4 cursor-pointer transition-all hover:scale-105 hover:bg-card/60"
                  onClick={() => handleChainSelect(blockchain.symbol)}
                >
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                      <ChainIcon 
                        chain={blockchain.symbol} 
                        size={40}
                        className="rounded-full"
                        fallback={
                          <FallbackIcon 
                            symbol={blockchain.symbol}
                            size={40}
                            backgroundColor={blockchain.color}
                            color={blockchain.iconTextColor.includes('white') ? 'white' : 'black'}
                          />
                        }
                      />
                    </div>
                    <div className="text-sm font-medium text-foreground">{blockchain.name}</div>
                    <div className={`text-xs ${blockchain.textColor} font-medium`}>{blockchain.symbol}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Wallet Selection Step */}
        {currentStep === "wallet-selection" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              {!targetChain && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentStep("chain-selection")}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="flex items-center gap-2">
                <ChainIcon 
                  chain={selectedChain} 
                  size={24}
                  className="rounded-full"
                  fallback={
                    <FallbackIcon 
                      symbol={selectedChain}
                      size={24}
                      backgroundColor={selectedBlockchain?.color || '#6c757d'}
                      color={selectedBlockchain?.iconTextColor.includes('white') ? 'white' : 'black'}
                    />
                  }
                />
                <span className="font-medium">{selectedBlockchain?.name}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Choose a wallet to connect to the {selectedChain} network.
              {availableWallets.length === 0 && " No compatible wallets found for this network."}
            </p>

            <div className="space-y-3">
              {availableWallets.map((adapter) => (
                <Card key={adapter.name} className="p-4 cursor-pointer hover:bg-card/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <WalletIcon 
                      wallet={adapter.name.toLowerCase().replace(/\s+/g, '-') as any}
                      size={32}
                      fallback={<span className="text-2xl">{adapter.icon}</span>}
                    />
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
                <p className="text-muted-foreground">No wallets available for {selectedChain} network</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Please install a compatible wallet or switch to a different blockchain
                </p>
              </div>
            )}
          </div>
        )}

        {/* Wallet Info Step */}
        {currentStep === "wallet-info" && isConnected && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Wallet Connected</span>
            </div>

            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 ${selectedBlockchain?.color} rounded-full flex items-center justify-center`}
                    >
                      <span className={`${selectedBlockchain?.iconTextColor} font-bold text-xs`}>{chain}</span>
                    </div>
                    <Badge variant="outline">{chain}</Badge>
                  </div>
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
              </div>
            </Card>

            {/* Balances Section */}
            {loadingBalances ? (
              <SkeletonBalanceCard />
            ) : walletBalances ? (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Balances</h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={loadWalletBalances}>
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{walletBalances.native.symbol}</span>
                    <span className="font-medium">{walletBalances.native.balance}</span>
                  </div>
                  {walletBalances.tokens?.map((token, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{token.symbol}</span>
                      <span className="font-medium">{token.balance}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {copied && (
              <div className="text-xs text-green-500 text-center">
                Address copied to clipboard!
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDisconnect} className="flex-1">
                Disconnect
              </Button>
              <Button onClick={onClose} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
