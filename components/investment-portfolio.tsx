"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const investments = [
  {
    date: "2024-03-15",
    amount: "$1,000.00",
    tokens: "22,222",
    bonus: "3,333",
    chain: "ETH",
    status: "completed",
  },
  {
    date: "2024-03-20",
    amount: "$800.00",
    tokens: "17,778",
    bonus: "2,667",
    chain: "BSC",
    status: "completed",
  },
  {
    date: "2024-03-25",
    amount: "$650.00",
    tokens: "14,444",
    bonus: "2,167",
    chain: "SOL",
    status: "completed",
  },
]

const portfolioData = [
  { name: "Ethereum", value: 40, color: "#627eea" },
  { name: "BSC", value: 32, color: "#f3ba2f" },
  { name: "Solana", value: 28, color: "#8c24a2" },
]

export function InvestmentPortfolio() {
  const totalInvested = investments.reduce(
    (sum, inv) => sum + Number.parseFloat(inv.amount.replace("$", "").replace(",", "")),
    0,
  )
  const totalTokens = investments.reduce((sum, inv) => sum + Number.parseInt(inv.tokens.replace(",", "")), 0)
  const totalBonus = investments.reduce((sum, inv) => sum + Number.parseInt(inv.bonus.replace(",", "")), 0)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Investment Portfolio</h3>
          <p className="text-sm text-muted-foreground">Your LUTAR token purchases across chains</p>
        </div>
        <Badge variant="secondary">{investments.length} Purchases</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">${totalInvested.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Total Invested</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-accent">{totalTokens.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Base Tokens</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-500">+{totalBonus.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Bonus Tokens</div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-3">Distribution by Chain</h4>
        <div className="h-32 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {portfolioData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Recent Purchases</h4>
        {investments.slice(0, 3).map((investment, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="outline">{investment.chain}</Badge>
              <div>
                <div className="text-sm font-medium">{investment.amount}</div>
                <div className="text-xs text-muted-foreground">{investment.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{investment.tokens} LUTAR</div>
              <div className="text-xs text-green-500">+{investment.bonus} bonus</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
