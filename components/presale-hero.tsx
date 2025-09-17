import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Users, Shield } from "lucide-react"

export function PresaleHero() {
  const progressPercentage = 57
  const timeLeft = {
    days: 12,
    hours: 8,
    minutes: 34,
    seconds: 22,
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">Live Presale</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              LUTAR Token
              <span className="block text-primary">Presale</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Revolutionary multi-chain token powering the future of decentralized finance. Join thousands of investors
              in the most anticipated presale of 2024.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="text-lg px-8 py-6">
                Participate Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                Download Whitepaper
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm">Audited Smart Contract</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-sm">8,429+ Participants</span>
              </div>
            </div>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Presale Progress</h3>
                <p className="text-muted-foreground">Track our journey to the soft cap</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress to Soft Cap</span>
                  <span className="text-sm font-medium text-primary">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$2,847,392 raised</span>
                  <span>$5,000,000 soft cap</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{timeLeft.days}</div>
                  <div className="text-xs text-muted-foreground">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{timeLeft.hours}</div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ring">{timeLeft.minutes}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-2">{timeLeft.seconds}</div>
                  <div className="text-xs text-muted-foreground">Seconds</div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Token Price</span>
                  <span className="text-sm font-medium">$0.045</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Next Price</span>
                  <span className="text-sm font-medium">$0.055</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Listing Price</span>
                  <span className="text-sm font-medium">$0.08</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
