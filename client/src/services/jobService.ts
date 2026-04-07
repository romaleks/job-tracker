import api from '@/config/axios'
import type { Job, JobInput } from '@/types/job'

export interface userJobsResponse {
  jobs: Job[]
  numOfPages: string
  totalJobs: string
}

const getUserJobs = async () => {
  const response = await api.get<userJobsResponse>('/jobs/user')
  return response.data
}

const create = async (newObject: JobInput) => {
  const response = await api.post(`/jobs`, newObject)
  return response.data
}

const update = async (id: string, newObject: JobInput) => {
  const response = await api.put(`/jobs/${id}`, newObject)
  return response.data
}

const remove = async (id: string) => {
  const response = await api.delete(`/jobs/${id}`)
  return response.data
}

export default { getUserJobs, create, update, remove }
