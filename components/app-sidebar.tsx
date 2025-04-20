"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

// Menu items definition
const menuItems = [
  {
    title: "Home",
    icon: Home,
    href: "/",
    isActive: false,
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
    title: "Customs",
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
  const { logout, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      })
      // Redirigir al usuario a la página de login
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al cerrar sesión.",
        variant: "destructive",
      })
    }
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
              <span className="text-sm font-medium">{user?.email || "User"}</span>
              <span className="text-xs text-neon-green">Online</span>
            </div>
          </div>
          <Button
            className="flex items-center justify-center gap-2 w-full bg-neon-green text-black hover:bg-neon-green/90"
            size="sm"
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
