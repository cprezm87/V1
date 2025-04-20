import { createClient } from "@supabase/supabase-js"

// Inicializar el cliente de Supabase
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Tipos de datos actualizados según la nueva estructura de tablas
export interface FigureItem {
  id?: string
  name: string
  franchise: string
  brand: string
  serie?: string
  year_released?: string
  price?: string
  year_purchase?: string
  tagline?: string
  review?: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface WishlistItem {
  id?: string
  name: string
  franchise: string
  brand: string
  serie?: string
  year_released?: string
  tagline?: string
  review?: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface CustomItem {
  id?: string
  name: string
  franchise: string
  tagline?: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

// Función para convertir snake_case a camelCase
export function snakeToCamel<T>(obj: any): T {
  const newObj: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      newObj[camelKey] = obj[key]
    }
  }
  return newObj as T
}

// Función para convertir camelCase a snake_case
export function camelToSnake<T>(obj: any): T {
  const newObj: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      newObj[snakeKey] = obj[key]
    }
  }
  return newObj as T
}
