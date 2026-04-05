import api from '@/config/axios'
import type { LoginCredentials, RegisterCredentials } from '@/types/auth'

const login = async (credentials: LoginCredentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

const register = async (credentials: RegisterCredentials) => {
  const response = await api.post('/auth/register', credentials)
  return response.data
}

export default { login, register }
