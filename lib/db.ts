import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Verificar que DATABASE_URL existe
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set")
}

// Crear el cliente SQL
export const sql = neon(process.env.DATABASE_URL || "")

// Crear el cliente Drizzle
export const db = drizzle(sql)

// Función para verificar la conexión a la base de datos
export async function checkDatabaseConnection() {
  try {
    // Ejecutar una consulta simple para verificar la conexión
    const result = await sql`SELECT 1 as connected`
    return { connected: result[0]?.connected === 1, error: null }
  } catch (error) {
    console.error("Error checking database connection:", error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
