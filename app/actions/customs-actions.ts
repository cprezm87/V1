"use server"

import { executeQuery } from "@/lib/neonDb"
import { revalidatePath } from "next/cache"

// Type definition for a custom item
interface CustomItem {
  id: string
  name: string
  type: string
  franchise: string
  head: string
  body: string
  logo: string
  tagline: string
  comments: string
}

// Get all custom items from the database
export async function getCustomItems() {
  try {
    const result = await executeQuery(`SELECT * FROM customs ORDER BY id DESC`)
    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching custom items:", error)
    return { success: false, error: "Failed to fetch custom items from database" }
  }
}

// Get a single custom item by ID
export async function getCustomItemById(id: string) {
  try {
    const result = await executeQuery(`SELECT * FROM customs WHERE id = $1`, [id])
    if (result.length === 0) {
      return { success: false, error: "Custom item not found" }
    }
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Error fetching custom item:", error)
    return { success: false, error: "Failed to fetch custom item from database" }
  }
}

// Update a custom item in the database
export async function updateCustomItem(id: string, item: Partial<CustomItem>) {
  try {
    // Create SET clause dynamically based on provided fields
    const fields = Object.keys(item)
    const setClause = fields.map((field, index) => `${field.toLowerCase()} = $${index + 2}`).join(", ")
    const values = fields.map((field) => item[field as keyof typeof item])

    const query = `UPDATE customs SET ${setClause} WHERE id = $1`
    await executeQuery(query, [id, ...values])

    revalidatePath("/customs")
    return { success: true }
  } catch (error) {
    console.error("Error updating custom item:", error)
    return { success: false, error: "Failed to update custom item in database" }
  }
}

// Delete a custom item from the database
export async function deleteCustomItem(id: string) {
  try {
    await executeQuery(`DELETE FROM customs WHERE id = $1`, [id])
    revalidatePath("/customs")
    return { success: true }
  } catch (error) {
    console.error("Error deleting custom item:", error)
    return { success: false, error: "Failed to delete custom item from database" }
  }
}
