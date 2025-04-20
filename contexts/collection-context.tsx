"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import {
  supabase,
  type FigureItem,
  type WishlistItem,
  type CustomItem,
  snakeToCamel,
  camelToSnake,
} from "@/lib/supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface CollectionContextType {
  figureItems: FigureItem[]
  wishlistItems: WishlistItem[]
  customItems: CustomItem[]
  loading: {
    figures: boolean
    wishlist: boolean
    customs: boolean
  }
  error: string | null
  stats: any
  addFigureItem: (item: FigureItem) => Promise<string>
  updateFigureItem: (id: string, item: Partial<FigureItem>) => Promise<void>
  deleteFigureItem: (id: string) => Promise<void>
  getFigureItemById: (id: string) => Promise<FigureItem | null>
  addWishlistItem: (item: WishlistItem) => Promise<string>
  updateWishlistItem: (id: string, item: Partial<WishlistItem>) => Promise<void>
  deleteWishlistItem: (id: string) => Promise<void>
  getWishlistItemById: (id: string) => Promise<WishlistItem | null>
  moveWishlistToFigure: (wishlistItem: WishlistItem) => Promise<void>
  addCustomItem: (item: CustomItem) => Promise<string>
  updateCustomItem: (id: string, item: Partial<CustomItem>) => Promise<void>
  deleteCustomItem: (id: string) => Promise<void>
  getCustomItemById: (id: string) => Promise<CustomItem | null>
  refreshStats: () => Promise<void>
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined)

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [figureItems, setFigureItems] = useState<FigureItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [customItems, setCustomItems] = useState<CustomItem[]>([])
  const [loading, setLoading] = useState({
    figures: true,
    wishlist: true,
    customs: true,
  })
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [subscriptions, setSubscriptions] = useState<RealtimeChannel[]>([])

  // Cargar items cuando el usuario cambia
  useEffect(() => {
    if (user) {
      fetchFigureItems()
      fetchWishlistItems()
      fetchCustomItems()
      setupRealtimeSubscriptions()
    } else {
      setFigureItems([])
      setWishlistItems([])
      setCustomItems([])
      setStats(null)
      // Limpiar suscripciones
      subscriptions.forEach((subscription) => subscription.unsubscribe())
      setSubscriptions([])
    }

    return () => {
      // Limpiar suscripciones al desmontar
      subscriptions.forEach((subscription) => subscription.unsubscribe())
    }
  }, [user])

  // Configurar suscripciones en tiempo real
  const setupRealtimeSubscriptions = () => {
    if (!user) return

    // Limpiar suscripciones existentes
    subscriptions.forEach((subscription) => subscription.unsubscribe())

    // Suscribirse a cambios en figure_items
    const figureSubscription = supabase
      .channel("figure_items_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "figure_items",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Cambio en figure_items:", payload)
          fetchFigureItems()
        },
      )
      .subscribe()

    // Suscribirse a cambios en wishlist_items
    const wishlistSubscription = supabase
      .channel("wishlist_items_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wishlist_items",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Cambio en wishlist_items:", payload)
          fetchWishlistItems()
        },
      )
      .subscribe()

    // Suscribirse a cambios en custom_items
    const customSubscription = supabase
      .channel("custom_items_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "custom_items",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Cambio en custom_items:", payload)
          fetchCustomItems()
        },
      )
      .subscribe()

    setSubscriptions([figureSubscription, wishlistSubscription, customSubscription])
  }

  // Obtener items de figure_items
  const fetchFigureItems = async () => {
    if (!user) return

    setLoading((prev) => ({ ...prev, figures: true }))
    setError(null)

    try {
      const { data, error } = await supabase
        .from("figure_items")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) {
        throw error
      }

      // Convertir snake_case a camelCase
      const formattedData = data.map((item) => snakeToCamel<FigureItem>(item))
      setFigureItems(formattedData)
    } catch (err: any) {
      console.error("Error fetching figure items:", err)
      setError(err?.message || "Error al cargar los items. Por favor, intenta de nuevo.")
    } finally {
      setLoading((prev) => ({ ...prev, figures: false }))
    }
  }

  // Obtener items de wishlist_items
  const fetchWishlistItems = async () => {
    if (!user) return

    setLoading((prev) => ({ ...prev, wishlist: true }))
    setError(null)

    try {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) {
        throw error
      }

      // Convertir snake_case a camelCase
      const formattedData = data.map((item) => snakeToCamel<WishlistItem>(item))
      setWishlistItems(formattedData)
    } catch (err: any) {
      console.error("Error fetching wishlist items:", err)
      setError(err?.message || "Error al cargar los items. Por favor, intenta de nuevo.")
    } finally {
      setLoading((prev) => ({ ...prev, wishlist: false }))
    }
  }

  // Obtener items de custom_items
  const fetchCustomItems = async () => {
    if (!user) return

    setLoading((prev) => ({ ...prev, customs: true }))
    setError(null)

    try {
      const { data, error } = await supabase
        .from("custom_items")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) {
        throw error
      }

      // Convertir snake_case a camelCase
      const formattedData = data.map((item) => snakeToCamel<CustomItem>(item))
      setCustomItems(formattedData)
    } catch (err: any) {
      console.error("Error fetching custom items:", err)
      setError(err?.message || "Error al cargar los items. Por favor, intenta de nuevo.")
    } finally {
      setLoading((prev) => ({ ...prev, customs: false }))
    }
  }

  // Añadir un nuevo item a figure_items
  const addFigureItem = async (item: FigureItem): Promise<string> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      // Convertir camelCase a snake_case y añadir user_id
      const formattedItem = camelToSnake<any>({
        ...item,
        user_id: user.id,
      })

      const { data, error } = await supabase.from("figure_items").insert(formattedItem).select().single()

      if (error) {
        throw error
      }

      // Actualizar el estado local
      await fetchFigureItems()
      await refreshStats()

      return data.id
    } catch (err) {
      console.error("Error adding figure item:", err)
      throw err
    }
  }

  // Actualizar un item existente en figure_items
  const updateFigureItem = async (id: string, item: Partial<FigureItem>): Promise<void> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      // Convertir camelCase a snake_case
      const formattedItem = camelToSnake<any>({
        ...item,
        updated_at: new Date().toISOString(),
      })

      const { error } = await supabase.from("figure_items").update(formattedItem).eq("id", id).eq("user_id", user.id)

      if (error) {
        throw error
      }

      // Actualizar el estado local
      await fetchFigureItems()
      await refreshStats()
    } catch (err) {
      console.error("Error updating figure item:", err)
      throw err
    }
  }

  // Eliminar un item de figure_items
  const deleteFigureItem = async (id: string): Promise<void> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      const { error } = await supabase.from("figure_items").delete().eq("id", id).eq("user_id", user.id)

      if (error) {
        throw error
      }

      // Actualizar el estado local
      await fetchFigureItems()
      await refreshStats()
    } catch (err) {
      console.error("Error deleting figure item:", err)
      throw err
    }
  }

  // Obtener un item específico de figure_items
  const getFigureItemById = async (id: string): Promise<FigureItem | null> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      const { data, error } = await supabase
        .from("figure_items")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

      if (error) {
        throw error
      }

      return snakeToCamel<FigureItem>(data)
    } catch (err) {
      console.error("Error getting figure item:", err)
      throw err
    }
  }

  // Añadir un nuevo item a wishlist_items
  const addWishlistItem = async (item: WishlistItem): Promise<string> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      // Convertir camelCase a snake_case y añadir user_id
      const formattedItem = camelToSnake<any>({
        ...item,
        user_id: user.id,
      })

      const { data, error } = await supabase.from("wishlist_items").insert(formattedItem).select().single()

      if (error) {
        throw error
      }

      // Actualizar el estado local
      await fetchWishlistItems()
      await refreshStats()

      return data.id
    } catch (err) {
      console.error("Error adding wishlist item:", err)
      throw err
    }
  }

  // Actualizar un item existente en wishlist_items
  const updateWishlistItem = async (id: string, item: Partial<WishlistItem>): Promise<void> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      // Convertir camelCase a snake_case
      const formattedItem = camelToSnake<any>({
        ...item,
        updated_at: new Date().toISOString(),
      })

      const { error } = await supabase.from("wishlist_items").update(formattedItem).eq("id", id).eq("user_id", user.id)

      if (error) {
        throw error
      }

      // Actualizar el estado local
      await fetchWishlistItems()
      await refreshStats()
    } catch (err) {
      console.error("Error updating wishlist item:", err)
      throw err
    }
  }

  // Eliminar un item de wishlist_items
  const deleteWishlistItem = async (id: string): Promise<void> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      const { error } = await supabase.from("wishlist_items").delete().eq("id", id).eq("user_id", user.id)

      if (error) {
        throw error
      }

      // Actualizar el estado local
      await fetchWishlistItems()
      await refreshStats()
    } catch (err) {
      console.error("Error deleting wishlist item:", err)
      throw err
    }
  }

  // Obtener un item específico de wishlist_items
  const getWishlistItemById = async (id: string): Promise<WishlistItem | null> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

      if (error) {
        throw error
      }

      return snakeToCamel<WishlistItem>(data)
    } catch (err) {
      console.error("Error getting wishlist item:", err)
      throw err
    }
  }

  // Mover un item de wishlist a figure
  const moveWishlistToFigure = async (wishlistItem: WishlistItem): Promise<void> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      // Crear un nuevo figure item a partir del wishlist item
      const figureItem: FigureItem = {
        name: wishlistItem.name,
        type: wishlistItem.type,
        franchise: wishlistItem.franchise,
        brand: wishlistItem.brand,
        serie: wishlistItem.serie,
        year_released: wishlistItem.year_released,
        condition: "New", // Valor por defecto
        price: wishlistItem.price,
        year_purchase: new Date().getFullYear().toString(), // Año actual
        logo: wishlistItem.logo,
        photo: wishlistItem.photo,
        tagline: wishlistItem.tagline,
        review: wishlistItem.review,
        shelf: "Eins", // Valor por defecto
        display: "Silent Horrors", // Valor por defecto
        ranking: 0,
        comments: wishlistItem.comments,
        user_id: user.id,
      }

      // Añadir a figure_items
      await addFigureItem(figureItem)

      // Eliminar de wishlist_items
      if (wishlistItem.id) {
        await deleteWishlistItem(wishlistItem.id)
      }

      // Actualizar el estado local
      await fetchFigureItems()
      await fetchWishlistItems()
      await refreshStats()
    } catch (err) {
      console.error("Error moving wishlist item to figure:", err)
      throw err
    }
  }

  // Añadir un nuevo item a custom_items
  const addCustomItem = async (item: CustomItem): Promise<string> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      // Convertir camelCase a snake_case y añadir user_id
      const formattedItem = camelToSnake<any>({
        ...item,
        user_id: user.id,
      })

      const { data, error } = await supabase.from("custom_items").insert(formattedItem).select().single()

      if (error) {
        throw error
      }

      // Actualizar el estado local
      await fetchCustomItems()
      await refreshStats()

      return data.id
    } catch (err) {
      console.error("Error adding custom item:", err)
      throw err
    }
  }

  // Actualizar un item existente en custom_items
  const updateCustomItem = async (id: string, item: Partial<CustomItem>): Promise<void> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      // Convertir camelCase a snake_case
      const formattedItem = camelToSnake<any>({
        ...item,
        updated_at: new Date().toISOString(),
      })

      const { error } = await supabase.from("custom_items").update(formattedItem).eq("id", id).eq("user_id", user.id)

      if (error) {
        throw error
      }

      // Actualizar el estado local
      await fetchCustomItems()
      await refreshStats()
    } catch (err) {
      console.error("Error updating custom item:", err)
      throw err
    }
  }

  // Eliminar un item de custom_items
  const deleteCustomItem = async (id: string): Promise<void> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      const { error } = await supabase.from("custom_items").delete().eq("id", id).eq("user_id", user.id)

      if (error) {
        throw error
      }

      // Actualizar el estado local
      await fetchCustomItems()
      await refreshStats()
    } catch (err) {
      console.error("Error deleting custom item:", err)
      throw err
    }
  }

  // Obtener un item específico de custom_items
  const getCustomItemById = async (id: string): Promise<CustomItem | null> => {
    if (!user) throw new Error("Usuario no autenticado")

    try {
      const { data, error } = await supabase
        .from("custom_items")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

      if (error) {
        throw error
      }

      return snakeToCamel<CustomItem>(data)
    } catch (err) {
      console.error("Error getting custom item:", err)
      throw err
    }
  }

  // Actualizar estadísticas
  const refreshStats = async () => {
    if (!user) return

    try {
      // Calcular estadísticas basadas en los items
      const collectionCount = figureItems.length
      const wishlistCount = wishlistItems.length
      const customCount = customItems.length

      const brands = [...new Set(figureItems.map((item) => item.brand))]
      const categories = [...new Set(figureItems.map((item) => item.type))]

      const brandCounts = brands
        .map((brand) => ({
          brand,
          count: figureItems.filter((item) => item.brand === brand).length,
        }))
        .sort((a, b) => b.count - a.count)

      const categoryCounts = categories
        .map((category) => ({
          category,
          count: figureItems.filter((item) => item.type === category).length,
        }))
        .sort((a, b) => b.count - a.count)

      // Calcular valor total de la colección
      const totalValue = figureItems
        .filter((item) => item.price)
        .reduce((sum, item) => {
          const price = item.price ? Number.parseFloat(item.price) : 0
          return sum + price
        }, 0)

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

  const value = {
    figureItems,
    wishlistItems,
    customItems,
    loading,
    error,
    stats,
    addFigureItem,
    updateFigureItem,
    deleteFigureItem,
    getFigureItemById,
    addWishlistItem,
    updateWishlistItem,
    deleteWishlistItem,
    getWishlistItemById,
    moveWishlistToFigure,
    addCustomItem,
    updateCustomItem,
    deleteCustomItem,
    getCustomItemById,
    refreshStats,
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
