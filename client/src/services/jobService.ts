import api from '@/config/axios'
import type { Job, JobInput, Status } from '@/types/job'

export interface UserJobsResponse {
  jobs: Job[]
  numOfPages: string
  totalJobs: string
}

export interface UserJobsQuery {
  search?: string
  status?: Status | 'all'
  page?: number
  limit?: number
}

const getUserJobs = async (query: UserJobsQuery = {}) => {
  const params = {
    ...query,
    status: query.status === 'all' ? undefined : query.status,
  }

  const response = await api.get<UserJobsResponse>('/jobs/user', { params })
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
