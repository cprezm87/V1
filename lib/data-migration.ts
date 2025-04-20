import { addItem, getUserItems } from "./firestore"
import type { CollectionItem } from "@/types/collection"

/**
 * Migra los datos de localStorage a Firestore
 * @param userId ID del usuario actual
 * @returns Número de elementos migrados
 */
export async function migrateLocalStorageToFirestore(userId: string): Promise<number> {
  try {
    // Verificar si ya hay datos en Firestore
    const existingItems = await getUserItems(userId)

    // Si ya hay datos, no migrar para evitar duplicados
    if (existingItems.length > 0) {
      console.log("Ya existen datos en Firestore, omitiendo migración")
      return 0
    }

    // Obtener datos de localStorage
    const figureItemsStr = localStorage.getItem("figureItems")
    const wishlistItemsStr = localStorage.getItem("wishlistItems")
    const customItemsStr = localStorage.getItem("customItems")

    let migratedCount = 0

    // Migrar figureItems
    if (figureItemsStr) {
      const figureItems: CollectionItem[] = JSON.parse(figureItemsStr)

      // Añadir userId a cada item y guardar en Firestore
      for (const item of figureItems) {
        const itemWithUser = {
          ...item,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        await addItem(itemWithUser)
        migratedCount++
      }
    }

    // Aquí podrías añadir código similar para migrar wishlistItems y customItems
    // dependiendo de cómo estén estructurados en tu base de datos

    console.log(`Migración completada: ${migratedCount} elementos migrados`)
    return migratedCount
  } catch (error) {
    console.error("Error durante la migración:", error)
    throw error
  }
}
