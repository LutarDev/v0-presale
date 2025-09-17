import { Card } from "@/components/ui/card"
import { TrendingUp, Users, Globe, Shield } from "lucide-react"

export function PresaleMetrics() {
  const metrics = [
    {
      icon: TrendingUp,
      label: "Total Raised",
      value: "$2,847,392",
      change: "+12.5% today",
      color: "text-primary",
    },
    {
      icon: Users,
      label: "Participants",
      value: "8,429",
      change: "+247 today",
      color: "text-accent",
    },
    {
      icon: Globe,
      label: "Countries",
      value: "67",
      change: "Global reach",
      color: "text-ring",
    },
    {
      icon: Shield,
      label: "Security Score",
      value: "98/100",
      change: "Audited",
      color: "text-green-500",
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6 text-center hover:bg-card/80 transition-colors">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${metric.color}/20`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm text-muted-foreground mb-2">{metric.label}</div>
              <div className={`text-xs font-medium ${metric.color}`}>{metric.change}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
