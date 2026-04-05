import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAppSelector } from '@/hooks/storeHooks'

import { Briefcase, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

const data = {
  nav: [
    { name: 'Dashboard', icon: Home, link: '/' },
    { name: 'Jobs', icon: Briefcase, link: '/jobs' },
  ],
}

export function AppSidebar() {
  const user = useAppSelector((state) => state.auth.user)
  const username = user?.username ?? 'Guest'
  const email = user?.email ?? 'Not signed in'

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="px-2 py-2 text-3xl text-center font-semibold ">
          Job Tracker
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.nav.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link to={item.link}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Item variant="outline">
              <ItemContent className="min-w-0 gap-1">
                <ItemTitle>{username}</ItemTitle>
                <ItemDescription>{email}</ItemDescription>
              </ItemContent>
            </Item>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
