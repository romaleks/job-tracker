import JobForm from '@/components/layout/JobForm'
import JobCard from '@/components/ui/JobCard'
import JobCardSkeleton from '@/components/ui/JobCardSkeleton'
import JobFilter from '@/components/ui/JobFilter'
import JobPagination from '@/components/ui/JobPagination'
import { Button } from '@/components/ui/shadcn/button'
import { useDebounce } from '@/hooks/useDebounce'
import jobService, { type UserJobsResponse } from '@/services/jobService'
import { Status } from '@/types/job'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

const getPageSizeByWidth = (width: number) => {
  if (width >= 1536) {
    return 16
  }

  if (width >= 1280) {
    return 9
  }

  if (width >= 640) {
    return 6
  }

  return 4
}

const Jobs = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [status, setStatus] = useState<Status | 'all'>('all')
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window === 'undefined') {
      return 4
    }

    return getPageSizeByWidth(window.innerWidth)
  })

  useEffect(() => {
    const handleResize = () => {
      const nextPageSize = getPageSizeByWidth(window.innerWidth)

      setPageSize((currentPageSize) => {
        if (currentPageSize === nextPageSize) {
          return currentPageSize
        }

        setPage(1)
        return nextPageSize
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const { data, isLoading, isFetching } = useQuery<UserJobsResponse>({
    queryKey: ['jobs', { page, pageSize, search: debouncedSearch, status }],
    queryFn: () =>
      jobService.getUserJobs({ page, limit: pageSize, search, status }),
    placeholderData: keepPreviousData,
  })

  const jobs = data?.jobs ?? []
  const totalPages = Math.max(1, Number(data?.numOfPages ?? 1) || 1)

  return (
    <div className="flex min-h-full justify-center">
      <div className="w-full min-h-full flex flex-col 2xl:max-w-360 xl:max-w-6xl sm:max-w-3xl max-w-96">
        <div className="mb-5 space-y-4">
          <div className="flex justify-center items-center gap-3">
            <h1 className="text-2xl font-bold">Job applications</h1>
            <JobForm action="add">
              <Button variant="outline" size="icon-sm" aria-label="Add">
                <PlusIcon />
              </Button>
            </JobForm>
          </div>

          <JobFilter
            search={search}
            status={status}
            onSearchChange={(value) => {
              setPage(1)
              setSearch(value)
            }}
            onStatusChange={(value) => {
              setPage(1)
              setStatus(value)
            }}
          />
        </div>

        {isLoading ? (
          <div className="w-full grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-6">
            <JobCardSkeleton count={pageSize} />
          </div>
        ) : (
          <div className="w-full grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        <div className="mt-auto">
          <JobPagination
            page={page}
            totalPages={totalPages}
            isFetching={isFetching}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}

export default Jobs
