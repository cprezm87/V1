export interface CollectionItem {
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

export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  settings?: UserSettings
}

export interface UserSettings {
  theme: "light" | "dark" | "system"
  currency: string
  language: string
  notifications: boolean
  logoUrl?: string
}
