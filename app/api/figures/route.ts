import { NextResponse } from "next/server"
import { addFigure, getFigures, deleteFigure } from "@/lib/db-operations"
import { createTablesIfNotExist } from "@/lib/migrations"

export async function GET(request: Request) {
  try {
    // Asegurar que las tablas existen
    await createTablesIfNotExist()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const figures = await getFigures(userId)
    return NextResponse.json({ figures })
  } catch (error) {
    console.error("Error in GET /api/figures:", error)
    return NextResponse.json({ error: "Failed to get figures" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Asegurar que las tablas existen
    await createTablesIfNotExist()

    const data = await request.json()

    if (!data.userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const figure = await addFigure(data)
    return NextResponse.json({ figure })
  } catch (error) {
    console.error("Error in POST /api/figures:", error)
    return NextResponse.json({ error: "Failed to add figure" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const figure = await deleteFigure(Number(id))
    return NextResponse.json({ figure })
  } catch (error) {
    console.error("Error in DELETE /api/figures:", error)
    return NextResponse.json({ error: "Failed to delete figure" }, { status: 500 })
  }
}
