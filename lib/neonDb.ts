import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string from environment variables
// Try different possible environment variable names
const connectionString =
  process.env.NEON_NEON_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_POSTGRES_URL

if (!connectionString) {
  console.error(
    "No Neon database connection string found in environment variables. Please check your environment variables.",
  )
}

// Create the SQL client
export const sql = neon(connectionString || "")

// Function to execute SQL queries with better error handling
export async function executeQuery(query: string, params: any[] = []) {
  try {
    if (!connectionString) {
      throw new Error("Database connection string is not configured. Please check your environment variables.")
    }

    // Use the sql.query method for parameterized queries
    const result = await sql.query(query, params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Function to execute SQL queries using tagged template literals
export function sqlTemplate(strings: TemplateStringsArray, ...values: any[]) {
  try {
    if (!connectionString) {
      throw new Error("Database connection string is not configured. Please check your environment variables.")
    }

    // Use the sql tagged template function
    return sql(strings, ...values)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
