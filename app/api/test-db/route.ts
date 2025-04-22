import { NextResponse } from "next/server"
import { testDatabaseConnection } from "@/lib/test-db-connection"
import { createTablesIfNotExist } from "@/lib/migrations"

export async function GET() {
  try {
    // Probar la conexión a la base de datos
    const connectionResult = await testDatabaseConnection()

    // Si la conexión es exitosa, intentar crear las tablas
    if (connectionResult.connected) {
      try {
        await createTablesIfNotExist()
        return NextResponse.json({
          ...connectionResult,
          tablesCreated: true,
        })
      } catch (error) {
        console.error("Error creating tables:", error)
        return NextResponse.json({
          ...connectionResult,
          tablesCreated: false,
          creationError: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return NextResponse.json(connectionResult)
  } catch (error) {
    console.error("Error in test-db API route:", error)
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
