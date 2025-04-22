"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/components/ui/use-toast"

// Definir interfaces para los tipos de datos
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

// Definir el tipo para el contexto
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

// Crear el contexto
const SupabaseCollectionContext = createContext<SupabaseCollectionContextType | undefined>(undefined)

// Proveedor del contexto
export function SupabaseCollectionProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [figures, setFigures] = useState<FigureItem[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [customs, setCustoms] = useState<CustomItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos al montar el componente
  useEffect(() => {
    refreshFigures()
    refreshWishlist()
    refreshCustoms()
  }, [])

  // Función para cargar figuras desde Supabase
  const refreshFigures = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("figures").select("*").order("id", { ascending: false })

      if (error) throw error
      setFigures(data || [])
    } catch (error: any) {
      console.error("Error loading figures:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para cargar wishlist desde Supabase
  const refreshWishlist = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("wishlist").select("*").order("id", { ascending: false })

      if (error) throw error
      setWishlist(data || [])
    } catch (error: any) {
      console.error("Error loading wishlist:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para cargar customs desde Supabase
  const refreshCustoms = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("customs").select("*").order("id", { ascending: false })

      if (error) throw error
      setCustoms(data || [])
    } catch (error: any) {
      console.error("Error loading customs:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para eliminar una figura
  const deleteFigure = async (id: string | number) => {
    try {
      const { error } = await supabase.from("figures").delete().eq("id", id)

      if (error) throw error

      // Actualizar el estado local
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

  // Función para eliminar un item de wishlist
  const deleteWishlistItem = async (id: string | number) => {
    try {
      const { error } = await supabase.from("wishlist").delete().eq("id", id)

      if (error) throw error

      // Actualizar el estado local
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

  // Función para eliminar un custom item
  const deleteCustomItem = async (id: string | number) => {
    try {
      const { error } = await supabase.from("customs").delete().eq("id", id)

      if (error) throw error

      // Actualizar el estado local
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

// Hook para usar el contexto
export function useSupabaseCollection() {
  const context = useContext(SupabaseCollectionContext)
  if (context === undefined) {
    throw new Error("useSupabaseCollection must be used within a SupabaseCollectionProvider")
  }
  return context
}
