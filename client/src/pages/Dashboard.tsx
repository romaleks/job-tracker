import DashboardSkeleton from '@/components/ui/DashboardSkeleton'
import JobChart from '@/components/ui/JobChart'
import StatusCard from '@/components/ui/StatusCard'
import type { UserStatsResponse } from '@/services/statsService'
import statsService from '@/services/statsService'
import { Status } from '@/types/job'
import { useQuery } from '@tanstack/react-query'

const Dashboard = () => {
  const query = useQuery<UserStatsResponse>({
    queryKey: ['stats'],
    queryFn: statsService.getUserStats,
  })

  if (query.isLoading) {
    return <DashboardSkeleton />
  }

  const stats = query.data?.stats ?? null
  const monthlyStats = query.data?.monthlyStats ?? []

  const statusCards = [
    { status: Status.Applied, count: stats?.applied ?? 0 },
    { status: Status.Interview, count: stats?.interview ?? 0 },
    { status: Status.Offer, count: stats?.offer ?? 0 },
    { status: Status.Rejected, count: stats?.rejected ?? 0 },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Applications status
          </h1>
          <p className="text-sm text-muted-foreground">
            Track how your applications are moving through each stage.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statusCards.map((card) => (
            <StatusCard
              key={card.status}
              status={card.status}
              count={card.count}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your activity</h1>
          <p className="text-sm text-muted-foreground">
            Review your monthly application submissions and trend over time.
          </p>
        </div>

        <JobChart monthlyStats={monthlyStats} />
      </div>
    </div>
  )
}
export default Dashboard
