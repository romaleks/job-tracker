import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import store from './config/store.ts'
import './index.css'

const queryClient = new QueryClient()

const applyInitialTheme = () => {
  const root = document.documentElement
  const storedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const shouldUseDark = storedTheme === 'dark' || (!storedTheme && prefersDark)

  root.classList.toggle('dark', shouldUseDark)
}

applyInitialTheme()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </QueryClientProvider>,
)
