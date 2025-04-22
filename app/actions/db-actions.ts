"use server"

import { executeQuery } from "@/lib/neonDb"
import { revalidatePath } from "next/cache"

// Movie Anniversaries
export async function createMovieAnniversary(data: {
  title: string
  releaseDate: Date
  poster: string
  trailer: string
  comments: string
}) {
  try {
    const result = await executeQuery(
      `INSERT INTO movie_anniversaries (title, release_date, poster, trailer, comments) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id`,
      [data.title, data.releaseDate, data.poster, data.trailer, data.comments],
    )

    revalidatePath("/rewind")
    return { success: true, id: result[0]?.id }
  } catch (error) {
    console.error("Error creating movie anniversary:", error)
    return { success: false, error: "Failed to save movie anniversary. Database connection issue." }
  }
}

// Checklist Items
export async function createChecklistItem(data: any) {
  try {
    const result = await executeQuery(
      `INSERT INTO checklist (
        name, type, franchise, brand, serie, year_released, condition, price, 
        year_purchase, upc, logo, photo, tagline, review, shelf, display, ranking, comments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
      RETURNING id`,
      [
        data.name,
        data.type,
        data.franchise,
        data.brand,
        data.serie,
        data.yearReleased,
        data.condition,
        data.price,
        data.yearPurchase,
        data.upc,
        data.logo,
        data.photo,
        data.tagline,
        data.review,
        data.shelf,
        data.display,
        data.ranking,
        data.comments,
      ],
    )

    revalidatePath("/checklist")
    return { success: true, id: result[0]?.id }
  } catch (error) {
    console.error("Error creating checklist item:", error)
    return { success: false, error: "Failed to save checklist item. Database connection issue." }
  }
}

// Wishlist Items
export async function createWishlistItem(data: any) {
  try {
    const result = await executeQuery(
      `INSERT INTO wishlist (
        name, type, franchise, brand, serie, year_released, price, logo, photo, 
        tagline, review, released, buy, comments, tracking_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
      RETURNING id`,
      [
        data.name,
        data.type,
        data.franchise,
        data.brand,
        data.serie,
        data.yearReleased,
        data.price,
        data.logo,
        data.photo,
        data.tagline,
        data.review,
        data.released,
        data.buy,
        data.comments,
        data.trackingNumber,
      ],
    )

    revalidatePath("/wishlist")
    return { success: true, id: result[0].id }
  } catch (error) {
    console.error("Error creating wishlist item:", error)
    return { success: false, error: "Failed to save wishlist item" }
  }
}

// Custom Items
export async function createCustomItem(data: any) {
  try {
    const result = await executeQuery(
      `INSERT INTO customs (
        name, type, franchise, head, body, logo, tagline, comments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id`,
      [data.name, data.type, data.franchise, data.head, data.body, data.logo, data.tagline, data.comments],
    )

    revalidatePath("/customs")
    return { success: true, id: result[0].id }
  } catch (error) {
    console.error("Error creating custom item:", error)
    return { success: false, error: "Failed to save custom item" }
  }
}
