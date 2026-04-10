import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card'
import StatusBadge from '@/components/ui/StatusBadge'
import { cn } from '@/lib/utils'
import { Status } from '@/types/job'

interface StatusCardProps {
  status: Status
  count: number
  className?: string
}

const StatusCard = ({ status, count, className }: StatusCardProps) => {
  return (
    <Card
      size="sm"
      className={cn(
        'border-border/60 bg-card/90 shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Applications
          </CardTitle>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{count}</p>
        </div>
        <StatusBadge status={status} className="h-8 px-3 text-xs font-medium" />
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">
          {status.charAt(0).toUpperCase() + status.slice(1)}
          {''} stage applications tracked in your pipeline.
        </p>
      </CardContent>
    </Card>
  )
}

export default StatusCard
