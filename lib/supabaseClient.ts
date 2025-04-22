import { createClient } from "@supabase/supabase-js"

// Obtener las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a singleton instance for the browser
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const supabase = (() => {
  if (typeof window === "undefined") {
    // Server-side: Create a new instance each time
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  if (!supabaseInstance) {
    // Client-side: Create the instance once
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
})()
