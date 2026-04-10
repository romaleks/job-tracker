import api from '@/config/axios'

interface Month {
  date: string
  count: number
}

export interface UserStatsResponse {
  stats: {
    applied: number
    interview: number
    offer: number
    rejected: number
  }
  monthlyStats: Month[]
}

const getUserStats = async () => {
  const response = await api.get<UserStatsResponse>('/stats')
  return response.data
}

export default { getUserStats }
