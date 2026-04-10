import { Button } from '@/components/ui/shadcn/button'
import { SidebarTrigger } from '@/components/ui/shadcn/sidebar'
import { useLocation, useNavigate } from 'react-router-dom'

const pageTitles = [
  { path: '/', title: 'Dashboard' },
  { path: '/jobs', title: 'Jobs' },
]

const Navbar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const activePage = pageTitles.find((page) =>
    page.path === '/' ? pathname === '/' : pathname.startsWith(page.path),
  )
  const title = activePage?.title ?? 'Job Tracker'

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="flex items-center gap-4 border-b-2 px-6">
      <SidebarTrigger />
      <div className="w-full h-16 shadow flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>

        <Button variant={'destructive'} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Navbar
