import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import RemoveButton from '@/components/ui/RemoveButton'
import jobService from '@/services/jobService'
import type { Job } from '@/types/job'
import formatJobDate from '@/utils/formatJobDate'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: jobService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate(job.id)
  }

  let cn = ''
  switch (job.status) {
    case 'offer':
      cn = 'bg-green-600'
      break
    case 'interview':
      cn = 'bg-amber-300'
      break
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{job.position}</CardTitle>
        <Badge
          variant={job.status === 'rejected' ? 'destructive' : 'default'}
          className={cn}
        >
          {job.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{job.company}</div>
        <p className="text-xs text-muted-foreground">
          Applied on: {formatJobDate(job.createdAt)}
        </p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="w-full">
          Edit
        </Button>
        <RemoveButton
          handleClick={handleDelete}
          isPending={deleteMutation.isPending}
        />
      </CardFooter>
    </Card>
  )
}

export default JobCard
