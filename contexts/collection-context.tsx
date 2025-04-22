"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

interface CollectionItem {
  id?: string
  name: string
  brand: string
  category: string
  series: string
  releaseDate?: string
  purchaseDate?: string
  price?: number
  condition?: string
  notes?: string
  imageUrl?: string
  inWishlist: boolean
  inCollection: boolean
  isCustom: boolean
  createdAt: Date | string
  updatedAt: Date | string
  userId: string
}

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

export function CollectionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)

  // Load items when user changes
  useEffect(() => {
    if (user) {
      refreshItems()
      refreshStats()
    } else {
      setItems([])
      setStats(null)
    }
    // We're intentionally not including refreshItems and refreshStats in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const refreshItems = async (filter?: any) => {
    if (!user) return

    setLoading(true)
    try {
      // Get items from localStorage
      const storedItems = localStorage.getItem(`items_${user.uid}`)
      let userItems: CollectionItem[] = storedItems ? JSON.parse(storedItems) : []

      // Apply filters if they exist
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

      // Sort by update date
      userItems.sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime()
        const dateB = new Date(b.updatedAt).getTime()
        return dateB - dateA
      })

      setItems(userItems)
      setError(null)
    } catch (err: any) {
      console.error("Error fetching items:", err)
      setError(err?.message || "Error loading items. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const refreshStats = async () => {
    if (!user) return

    try {
      // Calculate stats based on items
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

      // Calculate total collection value
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
    if (!user) throw new Error("User not authenticated")

    try {
      const itemWithUser = {
        ...item,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Generate a unique ID
      const id = Date.now().toString()
      const itemWithId = { ...itemWithUser, id }

      // Get existing items
      const storedItems = localStorage.getItem(`items_${user.uid}`)
      const existingItems: CollectionItem[] = storedItems ? JSON.parse(storedItems) : []

      // Add new item
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
      // Get existing items
      const storedItems = localStorage.getItem(`items_${user?.uid}`)
      if (!storedItems) return

      const existingItems: CollectionItem[] = JSON.parse(storedItems)

      // Update the specific item
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
      // Get existing items
      const storedItems = localStorage.getItem(`items_${user?.uid}`)
      if (!storedItems) return

      const existingItems: CollectionItem[] = JSON.parse(storedItems)

      // Filter out the item to remove
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
      // Get existing items
      const storedItems = localStorage.getItem(`items_${user?.uid}`)
      if (!storedItems) return null

      const existingItems: CollectionItem[] = JSON.parse(storedItems)

      // Find the item by ID
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
