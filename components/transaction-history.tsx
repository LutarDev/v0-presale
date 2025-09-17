"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, Search, Download } from "lucide-react"
import { useState } from "react"

const transactions = [
  {
    id: "0x1234...5678",
    type: "Purchase",
    amount: "$1,000.00",
    tokens: "22,222 LUTAR",
    chain: "ETH",
    status: "Completed",
    date: "2024-03-15 14:30",
    hash: "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    id: "0x2345...6789",
    type: "Purchase",
    amount: "$800.00",
    tokens: "17,778 LUTAR",
    chain: "BSC",
    status: "Completed",
    date: "2024-03-20 09:15",
    hash: "0x2345678901bcdef12345678901bcdef123456789",
  },
  {
    id: "0x3456...7890",
    type: "Claim",
    amount: "-",
    tokens: "11,250 LUTAR",
    chain: "BSC",
    status: "Completed",
    date: "2024-06-01 12:00",
    hash: "0x3456789012cdef123456789012cdef1234567890",
  },
  {
    id: "0x4567...8901",
    type: "Purchase",
    amount: "$650.00",
    tokens: "14,444 LUTAR",
    chain: "SOL",
    status: "Completed",
    date: "2024-03-25 16:45",
    hash: "0x4567890123def1234567890123def12345678901",
  },
  {
    id: "0x5678...9012",
    type: "Referral Reward",
    amount: "-",
    tokens: "1,125 LUTAR",
    chain: "BSC",
    status: "Completed",
    date: "2024-04-01 10:30",
    hash: "0x5678901234ef12345678901234ef123456789012",
  },
]

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterChain, setFilterChain] = useState("all")

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || tx.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || tx.type.toLowerCase() === filterType.toLowerCase()
    const matchesChain = filterChain === "all" || tx.chain === filterChain

    return matchesSearch && matchesType && matchesChain
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Purchase":
        return "bg-primary/20 text-primary border-primary/30"
      case "Claim":
        return "bg-green-500/20 text-green-500 border-green-500/30"
      case "Referral Reward":
        return "bg-accent/20 text-accent border-accent/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  const getChainColor = (chain: string) => {
    const colors: Record<string, string> = {
      ETH: "bg-[#627eea]/20 text-[#627eea] border-[#627eea]/30",
      BSC: "bg-[#f3ba2f]/20 text-[#f3ba2f] border-[#f3ba2f]/30",
      SOL: "bg-[#8c24a2]/20 text-[#8c24a2] border-[#8c24a2]/30",
    }
    return colors[chain] || "bg-muted/20 text-muted-foreground border-muted/30"
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <p className="text-sm text-muted-foreground">View all your LUTAR token transactions</p>
        </div>
        <Button variant="outline" size="sm" className="bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="purchase">Purchase</SelectItem>
            <SelectItem value="claim">Claim</SelectItem>
            <SelectItem value="referral reward">Referral Reward</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterChain} onValueChange={setFilterChain}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue placeholder="Chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chains</SelectItem>
            <SelectItem value="ETH">Ethereum</SelectItem>
            <SelectItem value="BSC">BSC</SelectItem>
            <SelectItem value="SOL">Solana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredTransactions.map((tx, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <Badge className={getTypeColor(tx.type)}>{tx.type}</Badge>
                <Badge className={getChainColor(tx.chain)}>{tx.chain}</Badge>
              </div>
              <div>
                <div className="font-medium text-sm">{tx.id}</div>
                <div className="text-xs text-muted-foreground">{tx.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                {tx.amount !== "-" && <div className="text-sm font-medium">{tx.amount}</div>}
                <div className="text-sm text-primary">{tx.tokens}</div>
              </div>
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">{tx.status}</Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions found matching your criteria.</p>
        </div>
      )}
    </Card>
  )
}
