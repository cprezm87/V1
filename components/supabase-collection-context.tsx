"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// Define interfaces for data types
interface FigureItem {
  id: string | number
  name: string
  type: string
  franchise: string
  brand: string
  serie?: string
  yearReleased?: string
  condition?: string
  price?: string
  yearPurchase?: string
  upc?: string
  logo?: string
  photo?: string
  tagline?: string
  review?: string
  shelf?: string
  display?: string
  ranking?: number
  comments?: string
}

interface WishlistItem {
  id: string | number
  name: string
  type: string
  franchise: string
  brand: string
  serie?: string
  yearReleased?: string
  price?: string
  logo?: string
  photo?: string
  tagline?: string
  review?: string
  released?: boolean
  buy?: boolean
  comments?: string
  trackingNumber?: string
}

interface CustomItem {
  id: string | number
  name: string
  type: string
  franchise: string
  head: string
  body: string
  logo?: string
  tagline?: string
  comments?: string
}

// Define the context type
interface SupabaseCollectionContextType {
  figures: FigureItem[]
  wishlist: WishlistItem[]
  customs: CustomItem[]
  loading: boolean
  error: string | null
  refreshFigures: () => Promise<void>
  refreshWishlist: () => Promise<void>
  refreshCustoms: () => Promise<void>
  deleteFigure: (id: string | number) => Promise<void>
  deleteWishlistItem: (id: string | number) => Promise<void>
  deleteCustomItem: (id: string | number) => Promise<void>
}

// Create the context
const SupabaseCollectionContext = createContext<SupabaseCollectionContextType | undefined>(undefined)

// Context provider
export function SupabaseCollectionProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [figures, setFigures] = useState<FigureItem[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [customs, setCustoms] = useState<CustomItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to load figures from Supabase
  const refreshFigures = async () => {
    try {
      setLoading(true)
      // Mock data for now
      setFigures([])
    } catch (error: any) {
      console.error("Error loading figures:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Function to load wishlist from Supabase
  const refreshWishlist = async () => {
    try {
      setLoading(true)
      // Mock data for now
      setWishlist([])
    } catch (error: any) {
      console.error("Error loading wishlist:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Function to load customs from Supabase
  const refreshCustoms = async () => {
    try {
      setLoading(true)
      // Mock data for now
      setCustoms([])
    } catch (error: any) {
      console.error("Error loading customs:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Function to delete a figure
  const deleteFigure = async (id: string | number) => {
    try {
      // Mock deletion
      setFigures(figures.filter((figure) => figure.id !== id))
      toast({
        title: "Deleted",
        description: "Figure has been deleted from the database.",
      })
    } catch (error: any) {
      console.error("Error deleting figure:", error)
      toast({
        title: "Error",
        description: "Failed to delete figure. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to delete a wishlist item
  const deleteWishlistItem = async (id: string | number) => {
    try {
      // Mock deletion
      setWishlist(wishlist.filter((item) => item.id !== id))
      toast({
        title: "Deleted",
        description: "Wishlist item has been deleted from the database.",
      })
    } catch (error: any) {
      console.error("Error deleting wishlist item:", error)
      toast({
        title: "Error",
        description: "Failed to delete wishlist item. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to delete a custom item
  const deleteCustomItem = async (id: string | number) => {
    try {
      // Mock deletion
      setCustoms(customs.filter((item) => item.id !== id))
      toast({
        title: "Deleted",
        description: "Custom item has been deleted from the database.",
      })
    } catch (error: any) {
      console.error("Error deleting custom item:", error)
      toast({
        title: "Error",
        description: "Failed to delete custom item. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <SupabaseCollectionContext.Provider
      value={{
        figures,
        wishlist,
        customs,
        loading,
        error,
        refreshFigures,
        refreshWishlist,
        refreshCustoms,
        deleteFigure,
        deleteWishlistItem,
        deleteCustomItem,
      }}
    >
      {children}
    </SupabaseCollectionContext.Provider>
  )
}

// Hook to use the context
export function useSupabaseCollection() {
  const context = useContext(SupabaseCollectionContext)
  if (context === undefined) {
    throw new Error("useSupabaseCollection must be used within a SupabaseCollectionProvider")
  }
  return context
}
