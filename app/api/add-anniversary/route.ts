import { type NextRequest, NextResponse } from "next/server"
import { sheets, spreadsheetId } from "@/lib/google-sheets"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const values = [[data.movieTitle, data.releaseDate, data.poster, data.trailer, data.comments]]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "anniversary movies",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    })

    return NextResponse.json({ message: "Anniversary item added successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error adding anniversary item to Google Sheets:", error)
    return NextResponse.json({ error: "Failed to add anniversary item" }, { status: 500 })
  }
}
