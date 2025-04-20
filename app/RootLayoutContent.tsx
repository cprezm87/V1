"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CollectionProvider } from "@/contexts/collection-context"

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  // Aplicar el tema al cargar la página
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
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show nothing while checking auth state
  if (loading || !isClient) {
    return null
  }

  // Siempre mostrar el layout completo, ya que siempre habrá un usuario por defecto
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
      <Toaster />
    </div>
  )
}
