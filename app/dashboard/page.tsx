"use client"

import { Header } from "@/components/header"
import { DashboardOverview } from "@/components/dashboard-overview"
import { InvestmentPortfolio } from "@/components/investment-portfolio"
import { TransactionHistory } from "@/components/transaction-history"
import { ReferralProgram } from "@/components/referral-program"
import { VestingSchedule } from "@/components/vesting-schedule"
import { Footer } from "@/components/footer"
import { UnifiedWalletModal } from "@/components/unified-wallet-modal"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function DashboardPage() {
  const { isConnected, chain } = useWallet()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="container mx-auto max-w-2xl px-4">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
              <p className="text-muted-foreground mb-6">
                You need to connect your wallet to access your investment dashboard and view your LUTAR token portfolio.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div className="text-sm text-amber-600 text-left">
                    <p className="font-medium mb-1">Security Notice</p>
                    <p>
                      Make sure you're on the official LUTAR website before connecting your wallet. Never share your
                      private keys or seed phrase.
                    </p>
                  </div>
                </div>
              </div>
              <Button onClick={() => setIsModalOpen(true)} size="lg">
                Connect Wallet to Continue
              </Button>
            </Card>
          </div>
        </main>
        <Footer />

        <UnifiedWalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Investment Dashboard</h1>
            <p className="text-muted-foreground">Track your LUTAR token investments and portfolio performance</p>
          </div>

          <div className="space-y-8">
            <DashboardOverview />
            <div className="grid lg:grid-cols-2 gap-8">
              <InvestmentPortfolio />
              <VestingSchedule />
            </div>
            <TransactionHistory />
            <ReferralProgram />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
