import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convierte una URL de Google Drive en una URL directa para mostrar imágenes
 * @param url URL de Google Drive
 * @returns URL directa para mostrar la imagen
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url

  // Si ya es una URL directa, devolverla
  if (url.includes("drive.google.com/uc?")) return url

  // Patrones de URL de Google Drive
  const fileIdRegex = /\/d\/([a-zA-Z0-9_-]+)/
  const fileIdRegex2 = /id=([a-zA-Z0-9_-]+)/
  const fileIdRegex3 = /\/file\/d\/([a-zA-Z0-9_-]+)/

  let fileId = null

  // Intentar extraer el ID del archivo
  if (fileIdRegex.test(url)) {
    const match = url.match(fileIdRegex)
    fileId = match ? match[1] : null
  } else if (fileIdRegex2.test(url)) {
    const match = url.match(fileIdRegex2)
    fileId = match ? match[1] : null
  } else if (fileIdRegex3.test(url)) {
    const match = url.match(fileIdRegex3)
    fileId = match ? match[1] : null
  }

  // Si se encontró un ID, construir la URL directa
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }

  // Si no se pudo extraer el ID, devolver la URL original
  return url
}
