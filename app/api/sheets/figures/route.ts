import { type NextRequest, NextResponse } from "next/server"
import { getRows, addRow, deleteRowById, SHEETS } from "@/lib/google-sheets"

export async function GET() {
  try {
    const rows = await getRows(SHEETS.FIGURES)

    // Convert rows to plain objects and handle boolean values
    const figures = rows.map((row) => {
      const figure: any = {}
      row._sheet.headerValues.forEach((header) => {
        if (header === "ranking") {
          figure[header] = Number.parseInt(row[header] || "0", 10)
        } else if (row[header] === "true" || row[header] === "false") {
          figure[header] = row[header] === "true"
        } else {
          figure[header] = row[header]
        }
      })
      return figure
    })

    return NextResponse.json({ success: true, data: figures })
  } catch (error) {
    console.error("Error fetching figures from Google Sheets:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch figures", error: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const figure = await request.json()
    await addRow(SHEETS.FIGURES, figure)
    return NextResponse.json({ success: true, message: "Figure added successfully" })
  } catch (error) {
    console.error("Error adding figure to Google Sheets:", error)
    return NextResponse.json(
      { success: false, message: "Failed to add figure", error: (error as Error).message },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const success = await deleteRowById(SHEETS.FIGURES, id)

    if (success) {
      return NextResponse.json({ success: true, message: "Figure deleted successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Figure not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting figure from Google Sheets:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete figure", error: (error as Error).message },
      { status: 500 },
    )
  }
}
