import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/db"
import { createTablesIfNotExist } from "@/lib/migrations"

export async function GET() {
  try {
    // Verificar la conexión a la base de datos
    const connectionStatus = await checkDatabaseConnection()
    console.log("Database connection status:", connectionStatus)

    // Si la conexión es exitosa, intentar crear las tablas si no existen
    if (connectionStatus.connected) {
      try {
        await createTablesIfNotExist()
        console.log("Tables created successfully")
      } catch (error) {
        console.error("Error creating tables:", error)
        return NextResponse.json({
          connected: true,
          tablesCreated: false,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return NextResponse.json({
      connected: connectionStatus.connected,
      error: connectionStatus.error,
      tablesCreated: connectionStatus.connected,
    })
  } catch (error) {
    console.error("Error in db-status API route:", error)
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
