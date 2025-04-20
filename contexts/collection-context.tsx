"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import type { CollectionItem } from "../types/collection"
import { addItem, updateItem, deleteItem, getItem, getUserItems, getCollectionStats } from "../lib/firestore"

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
      const userItems = await getUserItems(user.uid, filter)
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
      const collectionStats = await getCollectionStats(user.uid)
      setStats(collectionStats)
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

      const id = await addItem(itemWithUser)
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
      await updateItem(id, item)
      await refreshItems()
      await refreshStats()
    } catch (err) {
      console.error("Error updating item:", err)
      throw err
    }
  }

  const removeItem = async (id: string): Promise<void> => {
    try {
      await deleteItem(id)
      await refreshItems()
      await refreshStats()
    } catch (err) {
      console.error("Error deleting item:", err)
      throw err
    }
  }

  const getItemById = async (id: string): Promise<CollectionItem | null> => {
    try {
      return await getItem(id)
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
