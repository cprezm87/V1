"use server"

import { executeQuery } from "@/lib/neonDb"
import { revalidatePath } from "next/cache"

// Type definition for a wishlist item
interface WishlistItem {
  id: string
  name: string
  type: string
  franchise: string
  brand: string
  serie: string
  yearReleased: string
  price: string
  logo: string
  photo: string
  tagline: string
  review: string
  released: boolean
  buy: boolean
  comments: string
  trackingNumber?: string
}

// Get all wishlist items from the database
export async function getWishlistItems() {
  try {
    const result = await executeQuery(`SELECT * FROM wishlist ORDER BY id DESC`)
    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching wishlist items:", error)
    return { success: false, error: "Failed to fetch wishlist items from database" }
  }
}

// Get a single wishlist item by ID
export async function getWishlistItemById(id: string) {
  try {
    const result = await executeQuery(`SELECT * FROM wishlist WHERE id = $1`, [id])
    if (result.length === 0) {
      return { success: false, error: "Wishlist item not found" }
    }
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error fetching wishlist item:", error)
    return { success: false, error: "Failed to fetch wishlist item from database" }
  }
}

// Update a wishlist item in the database
export async function updateWishlistItem(id: string, item: Partial<WishlistItem>) {
  try {
    // Create SET clause dynamically based on provided fields
    const fields = Object.keys(item)
    const setClause = fields
      .map((field, index) => {
        // Convert camelCase to snake_case for database column names
        const dbField =
          field === "trackingNumber"
            ? "trackingnumber"
            : field === "yearReleased"
              ? "yearreleased"
              : field.toLowerCase()
        return `${dbField} = $${index + 2}`
      })
      .join(", ")

    const values = fields.map((field) => item[field as keyof typeof item])

    const query = `UPDATE wishlist SET ${setClause} WHERE id = $1`
    await executeQuery(query, [id, ...values])

    revalidatePath("/wishlist")
    return { success: true }
  } catch (error) {
    console.error("Error updating wishlist item:", error)
    return { success: false, error: "Failed to update wishlist item in database" }
  }
}

// Delete a wishlist item from the database
export async function deleteWishlistItem(id: string) {
  try {
    await executeQuery(`DELETE FROM wishlist WHERE id = $1`, [id])
    revalidatePath("/wishlist")
    return { success: true }
  } catch (error) {
    console.error("Error deleting wishlist item:", error)
    return { success: false, error: "Failed to delete wishlist item from database" }
  }
}

// Move a wishlist item to the figures table
export async function moveWishlistItemToFigures(wishlistItem: WishlistItem) {
  try {
    // First, insert into figures table
    await executeQuery(
      `INSERT INTO figures (
        name, type, franchise, brand, serie, yearreleased, condition, price, 
        yearpurchase, logo, photo, tagline, review, shelf, display, ranking, comments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
      [
        wishlistItem.name,
        wishlistItem.type,
        wishlistItem.franchise,
        wishlistItem.brand,
        wishlistItem.serie,
        wishlistItem.yearReleased,
        "New", // Default condition
        wishlistItem.price,
        new Date()
          .getFullYear()
          .toString(), // Current year
        wishlistItem.logo,
        wishlistItem.photo,
        wishlistItem.tagline,
        wishlistItem.review,
        "Eins", // Default shelf
        "Silent Horrors", // Default display
        0, // Default ranking
        wishlistItem.comments,
      ],
    )

    // Then, delete from wishlist table
    await executeQuery(`DELETE FROM wishlist WHERE id = $1`, [wishlistItem.id])

    revalidatePath("/wishlist")
    revalidatePath("/checklist")
    return { success: true }
  } catch (error) {
    console.error("Error moving wishlist item to figures:", error)
    return { success: false, error: "Failed to move wishlist item to figures" }
  }
}
