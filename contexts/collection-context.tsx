"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import type { CollectionItem } from "../types/collection"
import { supabase } from "@/lib/supabase"

interface CollectionContextType {
  items: CollectionItem[]
  loading: boolean
  error: string | null
  stats: any
  addNewItem: (item: CollectionItem) => Promise<string>
  updateExistingItem: (id: string, item: Partial<CollectionItem>) => Promise<void>
  removeItem: (id: string) => Promise<void>
  getItemById: (id: string) => Promise<CollectionItem | null>
  refreshItems: (filter?: any) => Promise<void>
  refreshStats: () => Promise<void>
  isDatabaseInitialized: boolean
  checkDatabaseInitialization: () => Promise<boolean>
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined)

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [isDatabaseInitialized, setIsDatabaseInitialized] = useState<boolean>(false)

  // Verificar si la base de datos está inicializada
  const checkDatabaseInitialization = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from("checklist_items").select("id").limit(1)

      // Si no hay error o el error es que no se encontraron resultados, la tabla existe
      if (!error || error.code === "PGRST116") {
        setIsDatabaseInitialized(true)
        return true
      }

      // Si el error es que la tabla no existe
      if (error.message.includes("does not exist")) {
        setIsDatabaseInitialized(false)
        return false
      }

      // Otros errores (conexión, etc.)
      console.error("Error checking database:", error)
      setIsDatabaseInitialized(false)
      return false
    } catch (err) {
      console.error("Error checking database initialization:", err)
      setIsDatabaseInitialized(false)
      return false
    }
  }

  // Cargar items cuando el usuario cambia
  useEffect(() => {
    if (user) {
      checkDatabaseInitialization().then((isInitialized) => {
        refreshItems()
        refreshStats()
      })
    } else {
      setItems([])
      setStats(null)
    }
  }, [user])

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (user) {
      const subscription = supabase
        .channel("checklist-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "checklist_items",
            filter: `user_id=eq.${user.uid}`,
          },
          (payload) => {
            console.log("Cambio en tiempo real:", payload)
            refreshItems()
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(subscription)
      }
    }
  }, [user])

  const refreshItems = async (filter?: any) => {
    if (!user) return

    setLoading(true)
    try {
      // Intentar obtener datos de Supabase primero
      if (isDatabaseInitialized) {
        let query = supabase.from("checklist_items").select("*").eq("user_id", user.uid)

        // Aplicar filtros si existen
        if (filter) {
          if (filter.inCollection !== undefined) {
            // No aplicamos este filtro en Supabase ya que no existe esta columna
          }
          if (filter.inWishlist !== undefined) {
            // No aplicamos este filtro en Supabase ya que no existe esta columna
          }
          if (filter.isCustom !== undefined) {
            // No aplicamos este filtro en Supabase ya que no existe esta columna
          }
          if (filter.category) {
            query = query.eq("category", filter.category)
          }
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching from Supabase:", error)
          throw error
        }

        // Convertir los datos de Supabase al formato de CollectionItem
        const formattedItems: CollectionItem[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          category: item.type, // Mapear type a category
          series: item.serie,
          releaseDate: item.year_released,
          purchaseDate: item.year_purchase,
          price: item.price,
          condition: item.condition,
          notes: item.comments,
          imageUrl: item.photo,
          inWishlist: false, // Por defecto
          inCollection: true, // Por defecto
          isCustom: false, // Por defecto
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          userId: item.user_id,
        }))

        setItems(formattedItems)
        setError(null)
      } else {
        // Fallback a localStorage si Supabase no está disponible
        const storedItems = localStorage.getItem(`items_${user.uid}`)
        let userItems: CollectionItem[] = storedItems ? JSON.parse(storedItems) : []

        // Aplicar filtros si existen
        if (filter) {
          if (filter.inCollection !== undefined) {
            userItems = userItems.filter((item) => item.inCollection === filter.inCollection)
          }
          if (filter.inWishlist !== undefined) {
            userItems = userItems.filter((item) => item.inWishlist === filter.inWishlist)
          }
          if (filter.isCustom !== undefined) {
            userItems = userItems.filter((item) => item.isCustom === filter.isCustom)
          }
          if (filter.category) {
            userItems = userItems.filter((item) => item.category === filter.category)
          }
        }

        // Ordenar por fecha de actualización
        userItems.sort((a, b) => {
          const dateA = new Date(a.updatedAt).getTime()
          const dateB = new Date(b.updatedAt).getTime()
          return dateB - dateA
        })

        setItems(userItems)
        setError(null)
      }
    } catch (err: any) {
      console.error("Error fetching items:", err)
      setError(err?.message || "Error al cargar los items. Por favor, intenta de nuevo.")

      // Fallback a localStorage en caso de error
      const storedItems = localStorage.getItem(`items_${user.uid}`)
      if (storedItems) {
        setItems(JSON.parse(storedItems))
      }
    } finally {
      setLoading(false)
    }
  }

  const refreshStats = async () => {
    if (!user) return

    try {
      // Calcular estadísticas basadas en los items
      const collectionCount = items.filter((item) => item.inCollection).length
      const wishlistCount = items.filter((item) => item.inWishlist).length
      const customCount = items.filter((item) => item.isCustom).length

      const brands = [...new Set(items.map((item) => item.brand))]
      const categories = [...new Set(items.map((item) => item.category))]

      const brandCounts = brands
        .map((brand) => ({
          brand,
          count: items.filter((item) => item.brand === brand && item.inCollection).length,
        }))
        .sort((a, b) => b.count - a.count)

      const categoryCounts = categories
        .map((category) => ({
          category,
          count: items.filter((item) => item.category === category && item.inCollection).length,
        }))
        .sort((a, b) => b.count - a.count)

      // Calcular valor total de la colección
      const totalValue = items
        .filter((item) => item.inCollection && item.price)
        .reduce((sum, item) => sum + (item.price || 0), 0)

      setStats({
        collectionCount,
        wishlistCount,
        customCount,
        brandCounts,
        categoryCounts,
        totalValue,
      })
    } catch (err) {
      console.error("Error fetching stats:", err)
    }
  }

  const addNewItem = async (item: CollectionItem): Promise<string> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      // Preparar el item para guardar
      const itemWithUser = {
        ...item,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      let newItemId = ""

      // Intentar guardar en Supabase primero
      if (isDatabaseInitialized) {
        // Convertir el item al formato de Supabase
        const supabaseItem = {
          user_id: user.uid,
          name: item.name,
          type: item.category, // Mapear category a type
          franchise: item.series, // Mapear series a franchise
          brand: item.brand,
          serie: item.series,
          year_released: item.releaseDate,
          condition: item.condition,
          price: item.price,
          year_purchase: item.purchaseDate,
          upc: "",
          logo: "",
          photo: item.imageUrl,
          tagline: "",
          review: "",
          shelf: "Eins", // Valor por defecto
          display: "Silent Horrors", // Valor por defecto
          ranking: 0,
          comments: item.notes,
        }

        const { data, error } = await supabase.from("checklist_items").insert(supabaseItem).select()

        if (error) {
          console.error("Error saving to Supabase:", error)
          throw error
        }

        if (data && data.length > 0) {
          newItemId = data[0].id
        }
      }

      // Como respaldo, también guardar en localStorage
      // Generar un ID único si no se obtuvo de Supabase
      if (!newItemId) {
        newItemId = Date.now().toString()
      }

      const itemWithId = { ...itemWithUser, id: newItemId }

      // Obtener items existentes
      const storedItems = localStorage.getItem(`items_${user.uid}`)
      const existingItems: CollectionItem[] = storedItems ? JSON.parse(storedItems) : []

      // Añadir nuevo item
      const updatedItems = [...existingItems, itemWithId]
      localStorage.setItem(`items_${user.uid}`, JSON.stringify(updatedItems))

      await refreshItems()
      await refreshStats()
      return newItemId
    } catch (err) {
      console.error("Error adding item:", err)
      throw err
    }
  }

  const updateExistingItem = async (id: string, item: Partial<CollectionItem>): Promise<void> => {
    try {
      // Intentar actualizar en Supabase primero
      if (isDatabaseInitialized) {
        // Convertir el item al formato de Supabase
        const supabaseItem: any = {}

        if (item.name) supabaseItem.name = item.name
        if (item.category) supabaseItem.type = item.category
        if (item.brand) supabaseItem.brand = item.brand
        if (item.series) {
          supabaseItem.serie = item.series
          supabaseItem.franchise = item.series
        }
        if (item.releaseDate) supabaseItem.year_released = item.releaseDate
        if (item.purchaseDate) supabaseItem.year_purchase = item.purchaseDate
        if (item.price !== undefined) supabaseItem.price = item.price
        if (item.condition) supabaseItem.condition = item.condition
        if (item.notes) supabaseItem.comments = item.notes
        if (item.imageUrl) supabaseItem.photo = item.imageUrl

        supabaseItem.updated_at = new Date().toISOString()

        const { error } = await supabase.from("checklist_items").update(supabaseItem).eq("id", id)

        if (error) {
          console.error("Error updating in Supabase:", error)
          throw error
        }
      }

      // Como respaldo, también actualizar en localStorage
      const storedItems = localStorage.getItem(`items_${user?.uid}`)
      if (!storedItems) return

      const existingItems: CollectionItem[] = JSON.parse(storedItems)

      // Actualizar el item específico
      const updatedItems = existingItems.map((existingItem) =>
        existingItem.id === id ? { ...existingItem, ...item, updatedAt: new Date() } : existingItem,
      )

      localStorage.setItem(`items_${user?.uid}`, JSON.stringify(updatedItems))

      await refreshItems()
      await refreshStats()
    } catch (err) {
      console.error("Error updating item:", err)
      throw err
    }
  }

  const removeItem = async (id: string): Promise<void> => {
    try {
      // Intentar eliminar de Supabase primero
      if (isDatabaseInitialized) {
        const { error } = await supabase.from("checklist_items").delete().eq("id", id)

        if (error) {
          console.error("Error deleting from Supabase:", error)
          throw error
        }
      }

      // Como respaldo, también eliminar de localStorage
      const storedItems = localStorage.getItem(`items_${user?.uid}`)
      if (!storedItems) return

      const existingItems: CollectionItem[] = JSON.parse(storedItems)

      // Filtrar el item a eliminar
      const updatedItems = existingItems.filter((item) => item.id !== id)

      localStorage.setItem(`items_${user?.uid}`, JSON.stringify(updatedItems))

      await refreshItems()
      await refreshStats()
    } catch (err) {
      console.error("Error deleting item:", err)
      throw err
    }
  }

  const getItemById = async (id: string): Promise<CollectionItem | null> => {
    try {
      // Intentar obtener de Supabase primero
      if (isDatabaseInitialized) {
        const { data, error } = await supabase.from("checklist_items").select("*").eq("id", id).single()

        if (error) {
          console.error("Error getting item from Supabase:", error)
          throw error
        }

        if (data) {
          // Convertir el item al formato de CollectionItem
          return {
            id: data.id,
            name: data.name,
            brand: data.brand,
            category: data.type,
            series: data.serie,
            releaseDate: data.year_released,
            purchaseDate: data.year_purchase,
            price: data.price,
            condition: data.condition,
            notes: data.comments,
            imageUrl: data.photo,
            inWishlist: false,
            inCollection: true,
            isCustom: false,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            userId: data.user_id,
          }
        }
      }

      // Fallback a localStorage
      const storedItems = localStorage.getItem(`items_${user?.uid}`)
      if (!storedItems) return null

      const existingItems: CollectionItem[] = JSON.parse(storedItems)

      // Encontrar el item por ID
      const item = existingItems.find((item) => item.id === id)

      return item || null
    } catch (err) {
      console.error("Error getting item:", err)
      throw err
    }
  }

  const value = {
    items,
    loading,
    error,
    stats,
    addNewItem,
    updateExistingItem,
    removeItem,
    getItemById,
    refreshItems,
    refreshStats,
    isDatabaseInitialized,
    checkDatabaseInitialization,
  }

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
}

export function useCollection() {
  const context = useContext(CollectionContext)
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider")
  }
  return context
}
