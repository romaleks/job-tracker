import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Job } from '@/types/job'
import formatJobDate from '@/utils/formatJobDate'
import { EyeIcon } from 'lucide-react'

interface JobDetailsProps {
  job: Job
}

const JobDetails = ({ job }: JobDetailsProps) => {
  const formattedSalary =
    typeof job.salary === 'number'
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(job.salary)
      : 'Not specified'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <EyeIcon />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{job.position}</DialogTitle>
          <DialogDescription>{job.company}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium capitalize">{job.status}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium capitalize">{job.type}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Salary</p>
            <p className="font-medium">{formattedSalary}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Applied on</p>
            <p className="font-medium">{formatJobDate(job.createdAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last updated</p>
            <p className="font-medium">{formatJobDate(job.updatedAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Link</p>
            {job.link ? (
              <a
                className="font-medium text-primary underline-offset-4 hover:underline"
                href={job.link}
                target="_blank"
                rel="noreferrer"
              >
                Open job posting
              </a>
            ) : (
              <p className="font-medium">Not provided</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default JobDetails
