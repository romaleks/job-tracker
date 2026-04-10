import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/shadcn/card'
import { Skeleton } from '@/components/ui/shadcn/skeleton'

const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Card key={index} size="sm">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-44" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-72 w-full" />
          </CardContent>
          <CardFooter className="flex-col items-start gap-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-52" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default DashboardSkeleton
