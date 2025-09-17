import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function PresaleProgress() {
  const progressPercentage = 57 // 57% to soft cap
  const timeLeft = {
    days: 12,
    hours: 8,
    minutes: 34,
    seconds: 22,
  }

  return (
    <section className="py-16 px-4 bg-card/30">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Presale Progress</h2>
            <p className="text-muted-foreground">Track the current progress towards our funding goals</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Progress to Soft Cap</span>
              <span className="text-sm font-medium text-primary">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>$2,847,392 raised</span>
              <span>$5,000,000 soft cap</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
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

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Presale ends in {timeLeft.days} days. Don't miss out!</p>
          </div>
        </Card>
      </div>
    </section>
  )
}
