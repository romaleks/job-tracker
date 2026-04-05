import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="h-16 shadow flex items-center justify-between px-6 border-b-2">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <Button variant={'destructive'} onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}

export default Navbar
