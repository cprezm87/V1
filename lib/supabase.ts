import { createClient } from "@supabase/supabase-js"

// Crear un singleton para el cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Cliente para el lado del cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para el lado del servidor
export const createServerSupabaseClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")
}
