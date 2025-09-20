"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/hooks/wallet-context"
import { TrendingUp, Wallet, Clock, Gift, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export function DashboardOverview() {
  const { chain, address, balance } = useWallet()

  const stats = [
    {
      icon: Wallet,
      label: "Total Investment",
      value: "$2,450.00",
      change: "+$450 this month",
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      icon: TrendingUp,
      label: "LUTAR Tokens",
      value: "56,250",
      change: "+8,750 bonus tokens",
      color: "text-accent",
      bgColor: "bg-accent/20",
    },
    {
      icon: Clock,
      label: "Vested Tokens",
      value: "11,250",
      change: "20% unlocked",
      color: "text-ring",
      bgColor: "bg-ring/20",
    },
    {
      icon: Gift,
      label: "Referral Rewards",
      value: "1,125",
      change: "3 successful referrals",
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-green-500/10 border-green-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium">Wallet Connected</span>
            <Badge variant="outline">{chain}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {address?.slice(0, 6)}...{address?.slice(-4)} • {balance} {chain}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:bg-card/80 transition-colors">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
            <div className={`text-xs font-medium ${stat.color}`}>{stat.change}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Portfolio Performance</h3>
            <p className="text-sm text-muted-foreground">Your investment growth over time</p>
          </div>
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">+18.4% ROI</Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Current Value</div>
            <div className="text-2xl font-bold text-primary">$2,900.50</div>
            <div className="text-sm text-green-500 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              +$450.50 (18.4%)
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Projected Value</div>
            <div className="text-2xl font-bold text-accent">$4,500.00</div>
            <div className="text-sm text-muted-foreground">At listing price ($0.08)</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Next Vesting</div>
            <div className="text-2xl font-bold text-ring">8,437</div>
            <div className="text-sm text-muted-foreground">LUTAR tokens in 15 days</div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Link href="/buy" className="flex-1">
            <Button className="w-full">Buy More Tokens</Button>
          </Link>
          <Button variant="outline" className="flex-1 bg-transparent">
            Claim Vested Tokens
          </Button>
        </div>
      </Card>
    </div>
  )
}
