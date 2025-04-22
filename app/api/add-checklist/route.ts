import { type NextRequest, NextResponse } from "next/server"
import { sheets, spreadsheetId } from "@/lib/google-sheets"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const values = [
      [
        data.id,
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
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "checklist",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    })

    return NextResponse.json({ message: "Checklist item added successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error adding checklist item to Google Sheets:", error)
    return NextResponse.json({ error: "Failed to add checklist item" }, { status: 500 })
  }
}
