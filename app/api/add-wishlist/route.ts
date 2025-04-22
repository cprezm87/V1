import { type NextRequest, NextResponse } from "next/server"
import { sheets, spreadsheetId } from "@/lib/google-sheets"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const values = [
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
        data.trackingNumber,
        data.comments,
      ],
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "wishlist",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    })

    return NextResponse.json({ message: "Wishlist item added successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error adding wishlist item to Google Sheets:", error)
    return NextResponse.json({ error: "Failed to add wishlist item" }, { status: 500 })
  }
}
