"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, Lock } from "lucide-react"

const vestingSchedule = [
  {
    phase: "TGE (Token Generation Event)",
    percentage: 20,
    tokens: "11,250",
    date: "2024-06-01",
    status: "claimed",
  },
  {
    phase: "Month 1",
    percentage: 15,
    tokens: "8,437",
    date: "2024-07-01",
    status: "available",
  },
  {
    phase: "Month 2",
    percentage: 15,
    tokens: "8,437",
    date: "2024-08-01",
    status: "locked",
  },
  {
    phase: "Month 3",
    percentage: 15,
    tokens: "8,437",
    date: "2024-09-01",
    status: "locked",
  },
  {
    phase: "Month 4",
    percentage: 15,
    tokens: "8,437",
    date: "2024-10-01",
    status: "locked",
  },
  {
    phase: "Month 5",
    percentage: 10,
    tokens: "5,625",
    date: "2024-11-01",
    status: "locked",
  },
  {
    phase: "Month 6",
    percentage: 10,
    tokens: "5,625",
    date: "2024-12-01",
    status: "locked",
  },
]

export function VestingSchedule() {
  const totalTokens = vestingSchedule.reduce((sum, item) => sum + Number.parseInt(item.tokens.replace(",", "")), 0)
  const claimedTokens = vestingSchedule
    .filter((item) => item.status === "claimed")
    .reduce((sum, item) => sum + Number.parseInt(item.tokens.replace(",", "")), 0)
  const availableTokens = vestingSchedule
    .filter((item) => item.status === "available")
    .reduce((sum, item) => sum + Number.parseInt(item.tokens.replace(",", "")), 0)

  const progressPercentage = (claimedTokens / totalTokens) * 100

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "claimed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "available":
        return <Clock className="w-4 h-4 text-primary" />
      default:
        return <Lock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "claimed":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Claimed</Badge>
      case "available":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Available</Badge>
      default:
        return <Badge variant="outline">Locked</Badge>
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Vesting Schedule</h3>
          <p className="text-sm text-muted-foreground">Track your token release schedule</p>
        </div>
        {availableTokens > 0 && (
          <Button size="sm" className="bg-primary">
            Claim {availableTokens.toLocaleString()} Tokens
          </Button>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Vesting Progress</span>
          <span className="text-sm font-medium text-primary">{progressPercentage.toFixed(1)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2 mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{claimedTokens.toLocaleString()} claimed</span>
          <span>{totalTokens.toLocaleString()} total</span>
        </div>
      </div>

      <div className="space-y-3">
        {vestingSchedule.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              item.status === "available" ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(item.status)}
              <div>
                <div className="text-sm font-medium">{item.phase}</div>
                <div className="text-xs text-muted-foreground">{item.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">{item.tokens} LUTAR</div>
                <div className="text-xs text-muted-foreground">{item.percentage}%</div>
              </div>
              {getStatusBadge(item.status)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
