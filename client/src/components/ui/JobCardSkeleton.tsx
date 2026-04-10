import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/shadcn/card'
import { Skeleton } from '@/components/ui/shadcn/skeleton'

interface CardSkeletonProps {
  count?: number
}

const JobCardSkeleton = ({ count = 1 }: CardSkeletonProps) => {
  return Array.from({ length: count }, (_, index) => (
    <Card key={index}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </CardHeader>

      <CardContent className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>

      <CardFooter className="grid grid-cols-3 gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  ))
}

export default JobCardSkeleton
