import { type NextRequest, NextResponse } from "next/server"
import { sheets, spreadsheetId } from "@/lib/google-sheets"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const values = [
      [data.name, data.type, data.franchise, data.head, data.body, data.logo, data.tagline, data.comments],
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "customs",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    })

    return NextResponse.json({ message: "Customs item added successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error adding customs item to Google Sheets:", error)
    return NextResponse.json({ error: "Failed to add customs item" }, { status: 500 })
  }
}
