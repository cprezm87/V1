import { NextResponse } from "next/server"
import { sql } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Obtener la estructura de la tabla movie_anniversaries
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'movie_anniversaries'
      ORDER BY ordinal_position
    `

    // Verificar si la tabla existe
    if (tableInfo.length === 0) {
      return NextResponse.json({
        exists: false,
        message: "Table 'movie_anniversaries' does not exist",
      })
    }

    // Obtener algunos datos de ejemplo
    const sampleData = await sql`
      SELECT * FROM movie_anniversaries LIMIT 5
    `

    return NextResponse.json({
      exists: true,
      structure: tableInfo,
      sampleData: sampleData,
    })
  } catch (error) {
    console.error("Error checking table structure:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
