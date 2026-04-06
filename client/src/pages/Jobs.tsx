import JobCard from '@/components/ui/JobCard'
import jobService, { type userJobsResponse } from '@/services/jobService'
import { useQuery } from '@tanstack/react-query'

const Jobs = () => {
  const query = useQuery<userJobsResponse>({
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
        <h1 className="text-2xl font-bold mb-4 text-center">
          Job applications
        </h1>
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
