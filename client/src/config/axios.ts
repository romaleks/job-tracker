import axios from 'axios'
import { logout } from '../reducers/authReducer'
import store from './store'

const api = axios.create({
  baseURL: 'https://job-tracker-9ogn.onrender.com/api',
})

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout())
    }
    return Promise.reject(error)
  },
)

export default api
