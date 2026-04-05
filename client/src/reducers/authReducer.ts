import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export type AuthUser = {
  username: string
  email: string
}

export type AuthState = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
}

let user = null
const loggedUserJSON = localStorage.getItem('loggedUserJSON')
if (loggedUserJSON) {
  user = JSON.parse(loggedUserJSON)
}

const token = localStorage.getItem('token')

const initialState: AuthState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>,
    ) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true

      localStorage.setItem('loggedUserJSON', JSON.stringify(user))
      localStorage.setItem('token', token)
    },

    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      localStorage.removeItem('loggedUserJSON')
      localStorage.removeItem('token')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
