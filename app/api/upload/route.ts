import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // Generar un nombre de archivo único
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
    const contentType = file.type

    // Subir a Vercel Blob
    const { url } = await put(`collection-images/${filename}`, file, {
      access: "public",
      contentType,
    })

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error al subir archivo:", error)
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
