import type { AuthUser } from '@/reducers/authReducer'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  username: string
}

export interface UserResponse {
  token: string
  user: AuthUser
}
