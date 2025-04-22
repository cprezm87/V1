import { NextResponse } from "next/server"
import { sheets, spreadsheetId } from "@/lib/google-sheets"

export async function GET() {
  try {
    // Get all rows from the checklist sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "checklist!A:A", // Get only the ID column
    })

    const values = response.data.values || []

    // Skip the header row and get all IDs
    const ids = values.slice(1).map((row) => row[0])

    // Find the highest ID
    let maxId = 0
    ids.forEach((id) => {
      if (id && !isNaN(Number.parseInt(id))) {
        const numId = Number.parseInt(id)
        if (numId > maxId) {
          maxId = numId
        }
      }
    })

    // Next ID is the highest ID + 1
    const nextId = maxId + 1

    // Format with leading zeros
    const formattedNextId = String(nextId).padStart(3, "0")

    return NextResponse.json({ nextId: formattedNextId })
  } catch (error) {
    console.error("Error getting next ID:", error)
    return NextResponse.json({ error: "Failed to get next ID" }, { status: 500 })
  }
}
