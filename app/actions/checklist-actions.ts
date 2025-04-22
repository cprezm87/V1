"use server"

import { executeQuery } from "@/lib/neonDb"
import { revalidatePath } from "next/cache"

// Type definition for a figure item
interface FigureItem {
  id: string
  name: string
  type: string
  franchise: string
  brand: string
  serie: string
  yearReleased: string
  condition: string
  price: string
  yearPurchase: string
  upc: string
  logo: string
  photo: string
  tagline: string
  review: string
  shelf: string
  display: string
  ranking: number
  comments: string
}

// Get all figures from the database
export async function getFigures() {
  try {
    const result = await executeQuery(`SELECT * FROM figures ORDER BY id DESC`)
    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching figures:", error)
    return { success: false, error: "Failed to fetch figures from database" }
  }
}

// Get a single figure by ID
export async function getFigureById(id: string) {
  try {
    const result = await executeQuery(`SELECT * FROM figures WHERE id = $1`, [id])
    if (result.length === 0) {
      return { success: false, error: "Figure not found" }
    }
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error fetching figure:", error)
    return { success: false, error: "Failed to fetch figure from database" }
  }
}

// Update a figure in the database
export async function updateFigure(id: string, figure: Partial<FigureItem>) {
  try {
    // Create SET clause dynamically based on provided fields
    const fields = Object.keys(figure)
    const setClause = fields.map((field, index) => `${field.toLowerCase()} = $${index + 2}`).join(", ")
    const values = fields.map((field) => figure[field as keyof typeof figure])

    const query = `UPDATE figures SET ${setClause} WHERE id = $1`
    await executeQuery(query, [id, ...values])

    revalidatePath("/checklist")
    return { success: true }
  } catch (error) {
    console.error("Error updating figure:", error)
    return { success: false, error: "Failed to update figure in database" }
  }
}

// Delete a figure from the database
export async function deleteFigure(id: string) {
  try {
    await executeQuery(`DELETE FROM figures WHERE id = $1`, [id])
    revalidatePath("/checklist")
    return { success: true }
  } catch (error) {
    console.error("Error deleting figure:", error)
    return { success: false, error: "Failed to delete figure from database" }
  }
}
