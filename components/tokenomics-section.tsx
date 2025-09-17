"use client"

import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { useState, useEffect } from "react"

const tokenDistribution = [
  { name: "Presale", value: 40, color: "#f7931a" },
  { name: "Liquidity", value: 25, color: "#627eea" },
  { name: "Team", value: 15, color: "#f3ba2f" },
  { name: "Marketing", value: 10, color: "#8c24a2" },
  { name: "Development", value: 10, color: "#8247e5" },
]

const vestingSchedule = [
  { phase: "TGE", percentage: 20 },
  { phase: "Month 1", percentage: 15 },
  { phase: "Month 2", percentage: 15 },
  { phase: "Month 3", percentage: 15 },
  { phase: "Month 4", percentage: 15 },
  { phase: "Month 5", percentage: 10 },
  { phase: "Month 6", percentage: 10 },
]

export function TokenomicsSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tokenomics</h2>
            <p className="text-muted-foreground">Transparent and sustainable token distribution model</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-center">Token Distribution</h3>
              <div className="h-64 mb-6 flex items-center justify-center">
                <div className="text-muted-foreground">Loading chart...</div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-center">Vesting Schedule</h3>
              <div className="h-64 mb-6 flex items-center justify-center">
                <div className="text-muted-foreground">Loading chart...</div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tokenomics</h2>
          <p className="text-muted-foreground">Transparent and sustainable token distribution model</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-center">Token Distribution</h3>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {tokenDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {tokenDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-center">Vesting Schedule</h3>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vestingSchedule}>
                  <XAxis dataKey="phase" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value}%`, "Release"]} />
                  <Bar dataKey="percentage" fill="#f7931a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Token release schedule for presale participants</p>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <h4 className="font-semibold mb-2">Total Supply</h4>
            <p className="text-2xl font-bold text-primary mb-2">1,000,000,000</p>
            <p className="text-sm text-muted-foreground">LUTAR Tokens</p>
          </Card>

          <Card className="p-6 text-center">
            <h4 className="font-semibold mb-2">Initial Market Cap</h4>
            <p className="text-2xl font-bold text-accent mb-2">$32,000,000</p>
            <p className="text-sm text-muted-foreground">At listing price</p>
          </Card>

          <Card className="p-6 text-center">
            <h4 className="font-semibold mb-2">Presale Allocation</h4>
            <p className="text-2xl font-bold text-ring mb-2">400,000,000</p>
            <p className="text-sm text-muted-foreground">LUTAR Tokens</p>
          </Card>
        </div>
      </div>
    </section>
  )
}
