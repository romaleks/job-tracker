import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="flex items-center gap-4 border-b-2 px-6">
      <SidebarTrigger />
      <div className="w-full h-16 shadow flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dashboard</h2>

        <Button variant={'destructive'} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Navbar
