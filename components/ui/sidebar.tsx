"use client"

import React from "react"
import { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

// Context for sidebar state
interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  const toggle = () => setIsOpen(!isOpen)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return <SidebarContext.Provider value={{ isOpen, toggle, open, close }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

// Basic sidebar components
const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-screen w-64 flex-col bg-sidebar dark:bg-sidebar", className)} {...props} />
  ),
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex-shrink-0", className)} {...props} />,
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex-1 overflow-auto", className)} {...props} />,
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex-shrink-0 mt-auto", className)} {...props} />,
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("py-2", className)} {...props} />,
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("px-3 py-1", className)} {...props} />,
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarRail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("hidden", className)} {...props} />,
)
SidebarRail.displayName = "SidebarRail"

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarRail }

export function SidebarGroup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>
}

export function SidebarGroupAction({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>
}

export function SidebarGroupContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>
}

export function SidebarGroupLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>
}

export function SidebarInput({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${className}`} {...props} />
}

export function SidebarInset({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>
}

export function SidebarSeparator({ className = "" }: { className?: string }) {
  return <hr className={`${className}`} />
}

export function SidebarTrigger({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  const { toggle } = useSidebar()
  return (
    <button className={`${className}`} onClick={toggle}>
      {children || <span>Toggle</span>}
    </button>
  )
}
