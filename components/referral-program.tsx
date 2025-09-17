"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Share2, Users, Gift } from "lucide-react"
import { useState } from "react"

const referralStats = [
  {
    icon: Users,
    label: "Total Referrals",
    value: "3",
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
  {
    icon: Gift,
    label: "Rewards Earned",
    value: "1,125 LUTAR",
    color: "text-accent",
    bgColor: "bg-accent/20",
  },
]

const referralHistory = [
  {
    address: "0x1234...5678",
    amount: "$500.00",
    reward: "375 LUTAR",
    date: "2024-03-18",
    status: "Claimed",
  },
  {
    address: "0x2345...6789",
    amount: "$800.00",
    reward: "600 LUTAR",
    date: "2024-03-22",
    status: "Claimed",
  },
  {
    address: "0x3456...7890",
    amount: "$200.00",
    reward: "150 LUTAR",
    date: "2024-03-28",
    status: "Pending",
  },
]

export function ReferralProgram() {
  const [referralCode] = useState("LUTAR-REF-ABC123")
  const [copied, setCopied] = useState(false)

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://lutar.io/presale?ref=${referralCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join LUTAR Token Presale",
        text: "Get bonus tokens when you join the LUTAR presale using my referral link!",
        url: `https://lutar.io/presale?ref=${referralCode}`,
      })
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Referral Program</h3>
          <p className="text-sm text-muted-foreground">Earn 5% bonus tokens for each successful referral</p>
        </div>
        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">5% Commission</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {referralStats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Your Referral Link</label>
          <div className="flex gap-2">
            <Input value={`https://lutar.io/presale?ref=${referralCode}`} readOnly className="font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={copyReferralCode} className="bg-transparent">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={shareReferral} className="bg-transparent">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          {copied && <p className="text-xs text-green-500 mt-1">Referral link copied to clipboard!</p>}
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h4 className="font-medium text-primary mb-2">How it works:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Share your referral link with friends</li>
            <li>• They purchase LUTAR tokens using your link</li>
            <li>• You earn 5% of their purchase in bonus LUTAR tokens</li>
            <li>• Rewards are distributed after the presale ends</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Referral History</h4>
        {referralHistory.map((referral, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm font-medium">{referral.address}</div>
                <div className="text-xs text-muted-foreground">{referral.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">{referral.amount}</div>
                <div className="text-xs text-primary">{referral.reward}</div>
              </div>
              <Badge
                className={
                  referral.status === "Claimed"
                    ? "bg-green-500/20 text-green-500 border-green-500/30"
                    : "bg-amber-500/20 text-amber-500 border-amber-500/30"
                }
              >
                {referral.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
