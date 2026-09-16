import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const revalidate = 7200

export const metadata: Metadata = {
  title: 'Job Market Overview | Job Tracker',
  description:
    'Explore application trends and the most popular job market directions on Job Tracker.',
  openGraph: {
    title: 'Job Market Overview | Job Tracker',
    description:
      'Explore application trends and the most popular job market directions.',
    url: '/market',
    siteName: 'Job Tracker',
    type: 'website',
  },
}

export interface MarketOverviewData {
  totalApplications: number
  popularDirections: Array<{
    name: string
    applications: number
  }>
}

const fallbackData: MarketOverviewData = {
  totalApplications: 0,
  popularDirections: [
    { name: 'Frontend', applications: 0 },
    { name: 'Backend', applications: 0 },
    { name: 'Fullstack', applications: 0 },
    { name: 'QA и тестирование', applications: 0 },
    { name: 'Data и аналитика', applications: 0 },
    { name: 'Продакт-менеджмент', applications: 0 },
  ],
}

const directionLabels: Record<string, string> = {
  Frontend: 'Frontend development',
  Backend: 'Backend development',
  Fullstack: 'Full-stack development',
  'QA и тестирование': 'QA and testing',
  'Data и аналитика': 'Data and analytics',
  'Продакт-менеджмент': 'Product management',
}

export async function getMarketOverview(): Promise<MarketOverviewData> {
  const baseUrl = process.env.SERVER_INTERNAL_URL

  if (!baseUrl) {
    return fallbackData
  }

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, '')}/api/public/market-overview`,
      { next: { revalidate: 7200 } },
    )

    if (!response.ok) {
      return fallbackData
    }

    const data: unknown = await response.json()

    if (!isMarketOverviewData(data)) {
      return fallbackData
    }

    return data
  } catch {
    return fallbackData
  }
}

function isMarketOverviewData(value: unknown): value is MarketOverviewData {
  if (!value || typeof value !== 'object') {
    return false
  }

  const data = value as Partial<MarketOverviewData>

  return (
    typeof data.totalApplications === 'number' &&
    Array.isArray(data.popularDirections) &&
    data.popularDirections.every(
      (direction) =>
        direction !== null &&
        typeof direction === 'object' &&
        typeof direction.name === 'string' &&
        typeof direction.applications === 'number',
    )
  )
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value)
}

export default async function MarketPage() {
  const market = await getMarketOverview()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b-2 bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Job Tracker
          </Link>
          <nav className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button>
              <Link href="/register">Create account</Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Job market overview
          </h1>
          <p className="text-sm text-muted-foreground">
            See where applications are concentrated across the platform.
          </p>
        </div>

        <Card className="mt-6 border-border/60 bg-card/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {formatNumber(market.totalApplications)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Updated every two hours.
            </p>
          </CardContent>
        </Card>

        <section className="mt-8">
          <div className="mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Popular directions
              </h2>
              <p className="text-sm text-muted-foreground">
                Application volume by job category.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {market.popularDirections.map((direction) => (
              <Card key={direction.name} size="sm">
                <CardHeader>
                  <CardTitle className="text-base">
                    {directionLabels[direction.name] ?? direction.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold tracking-tight">
                    {formatNumber(direction.applications)}
                  </p>
                  <CardDescription className="mt-1">
                    applications
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Card className="mt-8 border-border/60 bg-card/90">
          <CardContent>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Ready to start your search?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your profile and keep every application in one place.
                </p>
              </div>
              <Button size="lg">
                <Link href="/register">Get started</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
