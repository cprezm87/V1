/**
 * Servicio para manejar la integración con Zapier
 */

// URL del webhook de Zapier
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/22623944/2xlyjjw/"

// Tipos de datos
export interface FigureData {
  id: string
  name: string
  type: string
  franchise: string
  brand: string
  serie?: string
  yearReleased?: string | number
  condition?: string
  price?: string | number
  yearPurchase?: string | number
  upc?: string | number
  logo?: string
  photo?: string
  tagline?: string
  review?: string
  shelf?: string
  display?: string
  ranking?: number
  comments?: string
}

export interface SyncResult {
  success: boolean
  message: string
  data?: any
  error?: any
}

/**
 * Envía un item a Zapier
 * @param data Datos del item a enviar
 * @returns Resultado de la operación
 */
export async function sendItemToZapier(data: FigureData): Promise<SyncResult> {
  try {
    // Formatear los datos para Zapier
    const formattedData = {
      Id: data.id,
      Name: data.name,
      Type: data.type,
      Franchise: data.franchise,
      Brand: data.brand,
      Serie: data.serie || "",
      YearReleased: data.yearReleased || "",
      Condition: data.condition || "",
      Price: data.price || 0,
      YearPurchase: data.yearPurchase || "",
      UPC: data.upc || "",
      Logo: data.logo || "",
      Photo: data.photo || "",
      Tagline: data.tagline || "",
      Review: data.review || "",
      Shelf: data.shelf || "",
      Display: data.display || "",
      Ranking: data.ranking || 0,
      Comments: data.comments || "",
    }

    // Realizar la solicitud a Zapier
    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    })

    // Verificar si la solicitud fue exitosa
    if (!response.ok) {
      throw new Error(`Error al enviar datos a Zapier: ${response.status} ${response.statusText}`)
    }

    // Obtener la respuesta
    const responseData = await response.json()

    return {
      success: true,
      message: "Datos enviados correctamente a Zapier",
      data: responseData,
    }
  } catch (error) {
    console.error("Error en la integración con Zapier:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido al enviar datos a Zapier",
      error,
    }
  }
}

/**
 * Envía múltiples items a Zapier
 * @param items Lista de items a enviar
 * @param onProgress Callback para reportar progreso
 * @returns Resultado de la operación
 */
export async function bulkSendToZapier(
  items: FigureData[],
  onProgress?: (current: number, total: number) => void,
): Promise<SyncResult> {
  try {
    const results = []
    let successCount = 0
    let failCount = 0

    for (let i = 0; i < items.length; i++) {
      // Reportar progreso
      if (onProgress) {
        onProgress(i + 1, items.length)
      }

      // Enviar item actual
      const result = await sendItemToZapier(items[i])
      results.push(result)

      // Contar éxitos y fallos
      if (result.success) {
        successCount++
      } else {
        failCount++
      }

      // Pequeña pausa para no sobrecargar el webhook
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    return {
      success: failCount === 0,
      message: `Sincronización completada: ${successCount} éxitos, ${failCount} fallos`,
      data: results,
    }
  } catch (error) {
    console.error("Error en la sincronización masiva con Zapier:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido en la sincronización masiva",
      error,
    }
  }
}
