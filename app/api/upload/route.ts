import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar token (en una aplicación real, verificarías el token con Firebase)
    const token = authHeader.split("Bearer ")[1]
    if (!token) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 })
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo no debe superar los 5MB" }, { status: 400 })
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
