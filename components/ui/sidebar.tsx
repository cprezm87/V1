"use client"

import type * as React from "react"
import { createContext, useContext, useState } from "react"

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
export function Sidebar({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { isOpen } = useSidebar()
  return (
    <aside className={`${className} ${isOpen ? "w-64" : "w-16"} transition-width duration-300 ease-in-out`}>
      {children}
    </aside>
  )
}

export function SidebarHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>
}

export function SidebarContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>
}

export function SidebarFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>
}

export function SidebarMenu({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <nav className={`${className}`}>{children}</nav>
}

export function SidebarMenuItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>
}

export function SidebarRail({ className = "" }: { className?: string }) {
  const { toggle } = useSidebar()
  return (
    <div className={`${className} cursor-pointer`} onClick={toggle}>
      <div className="h-full w-1 bg-sidebar-border"></div>
    </div>
  )
}

// Export all the necessary components
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
