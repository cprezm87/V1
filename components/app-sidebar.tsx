"use client"
import Link from "next/link"
import Image from "next/image"
import {
  Home,
  Plus,
  ClipboardCheck,
  Heart,
  Pencil,
  LayoutGrid,
  BarChart,
  Rewind,
  Settings,
  Info,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

// Menu items definition
const menuItems = [
  {
    title: "Home",
    icon: Home,
    href: "/",
    isActive: true,
  },
  {
    title: "Add",
    icon: Plus,
    href: "/add",
  },
  {
    title: "Checklist",
    icon: ClipboardCheck,
    href: "/checklist",
  },
  {
    title: "Wishlist",
    icon: Heart,
    href: "/wishlist",
  },
  {
    title: "Custom's",
    icon: Pencil,
    href: "/customs",
  },
  {
    title: "Display",
    icon: LayoutGrid,
    href: "/display",
  },
  {
    title: "Insights",
    icon: BarChart,
    href: "/insights",
  },
  {
    title: "Rewind",
    icon: Rewind,
    href: "/rewind",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "About",
    icon: Info,
    href: "/about",
  },
]

export function AppSidebar() {
  const handleLogout = () => {
    // Aquí iría la lógica de cierre de sesión
    console.log("Logging out...")
  }

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link href="/">
          <Image src="/logo.png" alt="OPACO Pérez" width={180} height={50} className="h-auto" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.isActive}>
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image src="/user.jpg" alt="User profile" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Opaco Pérez</span>
              <span className="text-xs text-muted-foreground">c.prezm87@gmail.com</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-2 w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
