import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import { SidebarProvider } from '@/components/ui/shadcn/sidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="p-6 flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default MainLayout
