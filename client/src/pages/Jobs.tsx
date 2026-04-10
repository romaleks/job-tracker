import JobForm from '@/components/layout/JobForm'
import { Button } from '@/components/ui/button'
import JobCard from '@/components/ui/JobCard'
import jobService, { type UserJobsResponse } from '@/services/jobService'
import { useQuery } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'

const Jobs = () => {
  const query = useQuery<UserJobsResponse>({
    queryKey: ['jobs'],
    queryFn: jobService.getUserJobs,
  })

  if (query.isLoading) {
    return <div>loading blogs...</div>
  }

  const jobs = query.data?.jobs ?? []

  return (
    <div className="flex justify-center">
      <div className="flex-col w-full 2xl:max-w-360 xl:max-w-6xl sm:max-w-3xl max-w-96">
        <div className="flex justify-center items-center gap-3 mb-5">
          <h1 className="text-2xl font-bold">Job applications</h1>
          <JobForm action="add">
            <Button variant="outline" size="icon-sm" aria-label="Add">
              <PlusIcon />
            </Button>
          </JobForm>
        </div>
        <div className="w-full grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  )
}
export default Jobs
