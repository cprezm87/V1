"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { useRouter, usePathname } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CollectionProvider } from "@/contexts/collection-context"

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  // Modificar el RootLayoutContent para asegurar que el tema se aplique correctamente

  // Añadir un useEffect para aplicar el tema al cargar la página
  useEffect(() => {
    // Aplicar el tema guardado en localStorage
    const savedTheme = localStorage.getItem("theme") as "dark" | "light"
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
      document.documentElement.classList.toggle("light", savedTheme === "light")
    } else {
      // Por defecto, usar tema oscuro
      document.documentElement.classList.add("dark")
    }
  }, [])
  return (
    <AuthProvider>
      <ThemeProvider>
        <CollectionProvider>
          <SidebarProvider>
            <RootLayoutWithAuth>{children}</RootLayoutWithAuth>
          </SidebarProvider>
        </CollectionProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

function RootLayoutWithAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !loading) {
      // If user is not logged in and not on login or about page, redirect to login
      if (!user && pathname !== "/login" && pathname !== "/about") {
        router.push("/login")
      }
      // If user is logged in and on login page, redirect to home
      else if (user && pathname === "/login") {
        router.push("/")
      }
    }
  }, [user, loading, pathname, router, isClient])

  // Show nothing while checking auth state
  if (loading || !isClient) {
    return null
  }

  // If user is not logged in, only show the children (which should be login page)
  if (!user && (pathname === "/login" || pathname === "/about")) {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  // If user is logged in, show the full layout
  if (user) {
    return (
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 overflow-auto">{children}</div>
        <Toaster />
      </div>
    )
  }

  // Default case - should not reach here
  return null
}
