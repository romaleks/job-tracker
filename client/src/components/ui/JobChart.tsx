'use client'

import type { UserStatsResponse } from '@/services/statsService'
import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/shadcn/chart'

export const description = 'A bar chart'

interface JobChartProps {
  monthlyStats: UserStatsResponse['monthlyStats']
}

const chartConfig = {
  applications: {
    label: 'Applications',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

const parseMonthDate = (date: string) => {
  const [monthPart, yearPart] = date.split('/')
  const month = Number(monthPart)
  const year = Number(yearPart)

  if (!Number.isInteger(month) || !Number.isInteger(year)) {
    return null
  }

  return new Date(year, month - 1)
}

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

const addMonths = (date: Date, months: number) =>
  new Date(date.getFullYear(), date.getMonth() + months, 1)

const monthDiff = (start: Date, end: Date) =>
  (end.getFullYear() - start.getFullYear()) * 12 +
  (end.getMonth() - start.getMonth())

export function JobChart({ monthlyStats }: JobChartProps) {
  const parsedStats = monthlyStats
    .map((item) => {
      const parsedDate = parseMonthDate(item.date)

      if (!parsedDate) {
        return null
      }

      return {
        date: new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1),
        count: item.count,
      }
    })
    .filter((item): item is { date: Date; count: number } => item !== null)

  const monthlyCountMap = new Map<string, number>()
  parsedStats.forEach((item) => {
    monthlyCountMap.set(monthKey(item.date), item.count)
  })

  const lastMonthDate =
    parsedStats[parsedStats.length - 1]?.date ??
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const firstKnownMonthDate =
    parsedStats[0]?.date ?? addMonths(lastMonthDate, -4)
  const spanMonths = monthDiff(firstKnownMonthDate, lastMonthDate) + 1
  const totalMonths = Math.max(5, spanMonths)
  const startMonthDate = addMonths(lastMonthDate, -(totalMonths - 1))

  const chartData = Array.from({ length: totalMonths }, (_, index) => {
    const date = addMonths(startMonthDate, index)

    return {
      date,
      month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
      applications: monthlyCountMap.get(monthKey(date)) ?? 0,
    }
  })

  const totalApplications = chartData.reduce(
    (accumulator, item) => accumulator + item.applications,
    0,
  )

  const firstDate = chartData[0]?.date
  const lastDate = chartData[chartData.length - 1]?.date
  const rangeFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  })
  const rangeText =
    firstDate && lastDate
      ? `${rangeFormatter.format(firstDate)} - ${rangeFormatter.format(lastDate)}`
      : 'No data yet'

  const previousMonthCount = chartData[chartData.length - 2]?.applications ?? 0
  const currentMonthCount = chartData[chartData.length - 1]?.applications ?? 0
  const growthPercent =
    previousMonthCount > 0
      ? ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
      : currentMonthCount > 0
        ? 100
        : 0
  const hasGrowthData = chartData.length > 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Applications</CardTitle>
        <CardDescription>{rangeText}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="applications"
              fill="var(--color-applications)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {hasGrowthData
            ? `Trending ${growthPercent >= 0 ? 'up' : 'down'} by ${Math.abs(growthPercent).toFixed(1)}% this month`
            : 'Not enough data to show a monthly trend yet'}{' '}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing {totalApplications} total applications
        </div>
      </CardFooter>
    </Card>
  )
}

export default JobChart
