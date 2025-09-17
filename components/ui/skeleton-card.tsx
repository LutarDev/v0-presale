import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonCardProps {
  className?: string
  showIcon?: boolean
  lines?: number
}

export function SkeletonCard({ className, showIcon = false, lines = 3 }: SkeletonCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {showIcon && (
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton key={i} className={`h-4 ${i === 0 ? 'w-full' : i === lines - 1 ? 'w-3/4' : 'w-5/6'}`} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonBalanceCard() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="text-right">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonTransactionCard() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonStatsCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className={`w-12 h-12 bg-muted rounded-lg flex items-center justify-center`}>
            <Skeleton className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
