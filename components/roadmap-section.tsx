import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock } from "lucide-react"

const roadmapItems = [
  {
    quarter: "Q4 2023",
    title: "Foundation & Planning",
    status: "completed",
    items: ["Concept Development", "Team Formation", "Initial Funding", "Whitepaper v1.0"],
  },
  {
    quarter: "Q1 2024",
    title: "Development & Audit",
    status: "completed",
    items: ["Smart Contract Development", "Security Audit", "Multi-chain Integration", "Beta Testing"],
  },
  {
    quarter: "Q2 2024",
    title: "Presale Launch",
    status: "active",
    items: ["Presale Platform Launch", "Marketing Campaign", "Community Building", "Partnership Announcements"],
  },
  {
    quarter: "Q3 2024",
    title: "Token Launch",
    status: "upcoming",
    items: ["DEX Listing", "CEX Partnerships", "Liquidity Provision", "Staking Platform"],
  },
  {
    quarter: "Q4 2024",
    title: "Ecosystem Expansion",
    status: "upcoming",
    items: ["DeFi Integrations", "Cross-chain Bridges", "Mobile App Launch", "Governance Implementation"],
  },
  {
    quarter: "Q1 2025",
    title: "Global Adoption",
    status: "upcoming",
    items: ["Enterprise Partnerships", "Institutional Adoption", "Advanced Features", "Global Expansion"],
  },
]

export function RoadmapSection() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "active":
        return <Clock className="w-5 h-5 text-primary" />
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Completed</Badge>
      case "active":
        return <Badge className="bg-primary/20 text-primary border-primary/30">In Progress</Badge>
      default:
        return <Badge variant="outline">Upcoming</Badge>
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Roadmap</h2>
          <p className="text-muted-foreground">Our journey to revolutionize multi-chain token distribution</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapItems.map((item, index) => (
            <Card
              key={index}
              className={`p-6 transition-all hover:scale-105 ${
                item.status === "active" ? "ring-2 ring-primary bg-card/80" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className="font-semibold text-sm">{item.quarter}</span>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <h3 className="text-lg font-semibold mb-4">{item.title}</h3>

              <ul className="space-y-2">
                {item.items.map((task, taskIndex) => (
                  <li key={taskIndex} className="flex items-center gap-2 text-sm">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status === "completed"
                          ? "bg-green-500"
                          : item.status === "active"
                            ? "bg-primary"
                            : "bg-muted-foreground"
                      }`}
                    />
                    <span className={item.status === "completed" ? "text-muted-foreground" : ""}>{task}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
