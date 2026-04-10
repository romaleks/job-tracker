import JobForm from '@/components/layout/JobForm'
import JobDetails from '@/components/ui/JobDetails'
import { Button } from '@/components/ui/shadcn/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card'
import StatusBadge from '@/components/ui/StatusBadge'

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{job.position}</CardTitle>
        <StatusBadge
          status={job.status}
          className="h-6 px-2.5 text-xs font-medium"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{job.company}</div>
        <p className="text-xs text-muted-foreground">
          Applied on: {formatJobDate(job.createdAt)}
        </p>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2">
        <JobDetails job={job} />
        <JobForm action="edit" job={job}>
          <Button variant="outline" size="sm" className="w-full">
            Edit
          </Button>
        </JobForm>
        <RemoveButton
          handleClick={handleDelete}
          isPending={deleteMutation.isPending}
        />
      </CardFooter>
    </Card>
  )
}

export default JobCard
