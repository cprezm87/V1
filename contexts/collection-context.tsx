"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import type { CollectionItem } from "../types/collection"

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
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined)

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)

  // Cargar items cuando el usuario cambia
  useEffect(() => {
    if (user) {
      refreshItems()
      refreshStats()
    } else {
      setItems([])
      setStats(null)
    }
  }, [user])

  const refreshItems = async (filter?: any) => {
    if (!user) return

    setLoading(true)
    try {
      // Obtener items del localStorage
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
    } catch (err: any) {
      console.error("Error fetching items:", err)
      setError(err?.message || "Error al cargar los items. Por favor, intenta de nuevo.")
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
      const itemWithUser = {
        ...item,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Generar un ID único
      const id = Date.now().toString()
      const itemWithId = { ...itemWithUser, id }

      // Obtener items existentes
      const storedItems = localStorage.getItem(`items_${user.uid}`)
      const existingItems: CollectionItem[] = storedItems ? JSON.parse(storedItems) : []

      // Añadir nuevo item
      const updatedItems = [...existingItems, itemWithId]
      localStorage.setItem(`items_${user.uid}`, JSON.stringify(updatedItems))

      await refreshItems()
      await refreshStats()
      return id
    } catch (err) {
      console.error("Error adding item:", err)
      throw err
    }
  }

  const updateExistingItem = async (id: string, item: Partial<CollectionItem>): Promise<void> => {
    try {
      // Obtener items existentes
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
      // Obtener items existentes
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
      // Obtener items existentes
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
