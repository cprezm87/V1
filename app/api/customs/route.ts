import { NextResponse } from "next/server"
import { addCustomItem, getCustomItems, deleteCustomItem } from "@/lib/db-operations"
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

    const items = await getCustomItems(userId)
    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error in GET /api/customs:", error)
    return NextResponse.json({ error: "Failed to get custom items" }, { status: 500 })
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

    const item = await addCustomItem(data)
    return NextResponse.json({ item })
  } catch (error) {
    console.error("Error in POST /api/customs:", error)
    return NextResponse.json({ error: "Failed to add custom item" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const item = await deleteCustomItem(Number(id))
    return NextResponse.json({ item })
  } catch (error) {
    console.error("Error in DELETE /api/customs:", error)
    return NextResponse.json({ error: "Failed to delete custom item" }, { status: 500 })
  }
}
