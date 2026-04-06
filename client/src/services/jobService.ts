import api from '@/config/axios'
import type { Job } from '@/types/job'

export interface userJobsResponse {
  jobs: Job[]
  numOfPages: string
  totalJobs: string
}

const getUserJobs = async () => {
  const response = await api.get<userJobsResponse>('/jobs/user')
  return response.data
}

const remove = async (id: string) => {
  const response = await api.delete(`/jobs/${id}`)
  return response.data
}

export default { getUserJobs, remove }
