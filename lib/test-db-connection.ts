import { sql } from "@neondatabase/serverless"

export async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...")

    // Intentar ejecutar una consulta simple
    const result = await sql`SELECT 1 as connected`
    console.log("Database connection successful:", result)

    // Verificar si las tablas existen
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log("Existing tables:", tables)

    return {
      connected: true,
      tables: tables.map((t: any) => t.table_name),
    }
  } catch (error) {
    console.error("Database connection failed:", error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
