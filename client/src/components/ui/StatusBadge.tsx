import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Status } from '@/types/job'

interface StatusBadgeProps {
  status: Status
  className?: string
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  [Status.Applied]: {
    label: 'Applied',
    className:
      'bg-sky-500/10 text-sky-700 ring-1 ring-inset ring-sky-500/20 dark:text-sky-300',
  },
  [Status.Interview]: {
    label: 'Interview',
    className:
      'bg-amber-500/10 text-amber-700 ring-1 ring-inset ring-amber-500/20 dark:text-amber-300',
  },
  [Status.Offer]: {
    label: 'Offer',
    className:
      'bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-300',
  },
  [Status.Rejected]: {
    label: 'Rejected',
    className:
      'bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-500/20 dark:text-rose-300',
  },
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status]

  return (
    <Badge
      variant="outline"
      className={cn('border-transparent', config.className, className)}
    >
      {config.label}
    </Badge>
  )
}

export default StatusBadge
