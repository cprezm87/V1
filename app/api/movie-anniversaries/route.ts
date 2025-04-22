import { NextResponse } from "next/server"
import { addMovieAnniversary, getMovieAnniversaries, deleteMovieAnniversary } from "@/lib/db-operations"
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

    const anniversaries = await getMovieAnniversaries(userId)
    return NextResponse.json({ anniversaries })
  } catch (error) {
    console.error("Error in GET /api/movie-anniversaries:", error)
    return NextResponse.json({ error: "Failed to get movie anniversaries" }, { status: 500 })
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

    const anniversary = await addMovieAnniversary(data)
    return NextResponse.json({ anniversary })
  } catch (error) {
    console.error("Error in POST /api/movie-anniversaries:", error)
    return NextResponse.json({ error: "Failed to add movie anniversary" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const anniversary = await deleteMovieAnniversary(Number(id))
    return NextResponse.json({ anniversary })
  } catch (error) {
    console.error("Error in DELETE /api/movie-anniversaries:", error)
    return NextResponse.json({ error: "Failed to delete movie anniversary" }, { status: 500 })
  }
}
