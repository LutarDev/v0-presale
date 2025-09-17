import { Card } from "@/components/ui/card"

export function PresaleStats() {
  const stats = [
    {
      label: "Total Raised",
      value: "$2,847,392",
      change: "+12.5%",
      color: "text-primary",
    },
    {
      label: "Participants",
      value: "8,429",
      change: "+8.2%",
      color: "text-accent",
    },
    {
      label: "Soft Cap",
      value: "$5,000,000",
      change: "57% Complete",
      color: "text-ring",
    },
    {
      label: "Hard Cap",
      value: "$15,000,000",
      change: "19% Complete",
      color: "text-foreground",
    },
  ]

  return (
    <section className="py-16 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Presale Statistics</h2>
          <p className="text-muted-foreground">Real-time presale metrics and progress</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:bg-card/80 transition-colors">
              <div className="text-2xl md:text-3xl font-bold mb-2 text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
              <div className={`text-sm font-medium ${stat.color}`}>{stat.change}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
