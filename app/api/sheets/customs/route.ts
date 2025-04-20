import { type NextRequest, NextResponse } from "next/server"
import { getRows, addRow, deleteRowById, SHEETS } from "@/lib/google-sheets"

export async function GET() {
  try {
    const rows = await getRows(SHEETS.CUSTOMS)

    // Convert rows to plain objects
    const customItems = rows.map((row) => {
      const item: any = {}
      row._sheet.headerValues.forEach((header) => {
        item[header] = row[header]
      })
      return item
    })

    return NextResponse.json({ success: true, data: customItems })
  } catch (error) {
    console.error("Error fetching customs from Google Sheets:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch customs", error: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const customItem = await request.json()
    await addRow(SHEETS.CUSTOMS, customItem)
    return NextResponse.json({ success: true, message: "Custom item added successfully" })
  } catch (error) {
    console.error("Error adding custom item to Google Sheets:", error)
    return NextResponse.json(
      { success: false, message: "Failed to add custom item", error: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const success = await deleteRowById(SHEETS.CUSTOMS, id)

    if (success) {
      return NextResponse.json({ success: true, message: "Custom item deleted successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Custom item not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting custom item from Google Sheets:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete custom item", error: (error as Error).message },
      { status: 500 },
    )
  }
}
