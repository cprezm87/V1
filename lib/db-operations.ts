import { sql } from "@neondatabase/serverless"

// Operaciones para la tabla figures
export async function addFigure(figure: any) {
  try {
    const result = await sql`
      INSERT INTO figures (
        original_id, name, type, franchise, brand, serie, year_released, 
        condition, price, year_purchase, upc, logo, photo, tagline, 
        review, shelf, display, ranking, comments, user_id
      ) 
      VALUES (
        ${figure.originalId}, ${figure.name}, ${figure.type}, ${figure.franchise}, 
        ${figure.brand}, ${figure.serie}, ${figure.yearReleased}, ${figure.condition}, 
        ${figure.price}, ${figure.yearPurchase}, ${figure.upc}, ${figure.logo}, 
        ${figure.photo}, ${figure.tagline}, ${figure.review}, ${figure.shelf}, 
        ${figure.display}, ${figure.ranking}, ${figure.comments}, ${figure.userId}
      )
      RETURNING *
    `
    console.log("Figure added successfully:", result)
    return result.rows[0]
  } catch (error) {
    console.error("Error adding figure:", error)
    throw error
  }
}

export async function getFigures(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM figures 
      WHERE user_id = ${userId}
      ORDER BY id DESC
    `
    return result.rows
  } catch (error) {
    console.error("Error getting figures:", error)
    throw error
  }
}

export async function deleteFigure(id: number) {
  try {
    const result = await sql`
      DELETE FROM figures 
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error("Error deleting figure:", error)
    throw error
  }
}

// Operaciones para la tabla wishlist
export async function addWishlistItem(item: any) {
  try {
    const result = await sql`
      INSERT INTO wishlist (
        original_id, name, type, franchise, brand, serie, year_released, 
        price, logo, photo, tagline, review, released, buy, 
        comments, tracking_number, user_id
      ) 
      VALUES (
        ${item.originalId}, ${item.name}, ${item.type}, ${item.franchise}, 
        ${item.brand}, ${item.serie}, ${item.yearReleased}, ${item.price}, 
        ${item.logo}, ${item.photo}, ${item.tagline}, ${item.review}, 
        ${item.released}, ${item.buy}, ${item.comments}, ${item.trackingNumber}, 
        ${item.userId}
      )
      RETURNING *
    `
    console.log("Wishlist item added successfully:", result)
    return result.rows[0]
  } catch (error) {
    console.error("Error adding wishlist item:", error)
    throw error
  }
}

export async function getWishlistItems(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM wishlist 
      WHERE user_id = ${userId}
      ORDER BY id DESC
    `
    return result.rows
  } catch (error) {
    console.error("Error getting wishlist items:", error)
    throw error
  }
}

export async function deleteWishlistItem(id: number) {
  try {
    const result = await sql`
      DELETE FROM wishlist 
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error("Error deleting wishlist item:", error)
    throw error
  }
}

// Operaciones para la tabla customs
export async function addCustomItem(item: any) {
  try {
    const result = await sql`
      INSERT INTO customs (
        original_id, name, type, franchise, head, body, 
        logo, tagline, comments, user_id
      ) 
      VALUES (
        ${item.originalId}, ${item.name}, ${item.type}, ${item.franchise}, 
        ${item.head}, ${item.body}, ${item.logo}, ${item.tagline}, 
        ${item.comments}, ${item.userId}
      )
      RETURNING *
    `
    console.log("Custom item added successfully:", result)
    return result.rows[0]
  } catch (error) {
    console.error("Error adding custom item:", error)
    throw error
  }
}

export async function getCustomItems(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM customs 
      WHERE user_id = ${userId}
      ORDER BY id DESC
    `
    return result.rows
  } catch (error) {
    console.error("Error getting custom items:", error)
    throw error
  }
}

export async function deleteCustomItem(id: number) {
  try {
    const result = await sql`
      DELETE FROM customs 
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error("Error deleting custom item:", error)
    throw error
  }
}

// Operaciones para la tabla movie_anniversaries
export async function addMovieAnniversary(anniversary: any) {
  try {
    const result = await sql`
      INSERT INTO movie_anniversaries (
        original_id, title, release_date, poster, 
        trailer, comments, user_id
      ) 
      VALUES (
        ${anniversary.originalId}, ${anniversary.title}, ${anniversary.releaseDate}, 
        ${anniversary.poster}, ${anniversary.trailer}, ${anniversary.comments}, 
        ${anniversary.userId}
      )
      RETURNING *
    `
    console.log("Movie anniversary added successfully:", result)
    return result.rows[0]
  } catch (error) {
    console.error("Error adding movie anniversary:", error)
    throw error
  }
}

export async function getMovieAnniversaries(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM movie_anniversaries 
      WHERE user_id = ${userId}
      ORDER BY release_date DESC
    `
    return result.rows
  } catch (error) {
    console.error("Error getting movie anniversaries:", error)
    throw error
  }
}

export async function deleteMovieAnniversary(id: number) {
  try {
    const result = await sql`
      DELETE FROM movie_anniversaries 
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error("Error deleting movie anniversary:", error)
    throw error
  }
}
