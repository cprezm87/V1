import { type NextRequest, NextResponse } from "next/server"
import { getRows, addRow, deleteRowById, SHEETS } from "@/lib/google-sheets"

export async function GET() {
  try {
    const rows = await getRows(SHEETS.WISHLIST)

    // Convert rows to plain objects and handle boolean values
    const wishlistItems = rows.map((row) => {
      const item: any = {}
      row._sheet.headerValues.forEach((header) => {
        if (header === "released" || header === "buy") {
          item[header] = row[header] === "true"
        } else {
          item[header] = row[header]
        }
      })
      return item
    })

    return NextResponse.json({ success: true, data: wishlistItems })
  } catch (error) {
    console.error("Error fetching wishlist from Google Sheets:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch wishlist", error: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const wishlistItem = await request.json()

    // Convert boolean values to strings for Google Sheets
    if (typeof wishlistItem.released === "boolean") {
      wishlistItem.released = wishlistItem.released.toString()
    }
    if (typeof wishlistItem.buy === "boolean") {
      wishlistItem.buy = wishlistItem.buy.toString()
    }

    await addRow(SHEETS.WISHLIST, wishlistItem)
    return NextResponse.json({ success: true, message: "Wishlist item added successfully" })
  } catch (error) {
    console.error("Error adding wishlist item to Google Sheets:", error)
    return NextResponse.json(
      { success: false, message: "Failed to add wishlist item", error: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const success = await deleteRowById(SHEETS.WISHLIST, id)

    if (success) {
      return NextResponse.json({ success: true, message: "Wishlist item deleted successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Wishlist item not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting wishlist item from Google Sheets:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete wishlist item", error: (error as Error).message },
      { status: 500 },
    )
  }
}
