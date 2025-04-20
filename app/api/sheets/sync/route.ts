import { type NextRequest, NextResponse } from "next/server"
import { syncLocalDataWithSheets, SHEETS } from "@/lib/google-sheets"

export async function POST(request: NextRequest) {
  try {
    const { figures, wishlist, customs } = await request.json()

    // Sync each collection with its respective sheet
    if (figures) {
      await syncLocalDataWithSheets(SHEETS.FIGURES, figures)
    }

    if (wishlist) {
      await syncLocalDataWithSheets(SHEETS.WISHLIST, wishlist)
    }

    if (customs) {
      await syncLocalDataWithSheets(SHEETS.CUSTOMS, customs)
    }

    return NextResponse.json({ success: true, message: "Data synced successfully" })
  } catch (error) {
    console.error("Error syncing data with Google Sheets:", error)
    return NextResponse.json(
      { success: false, message: "Failed to sync data", error: (error as Error).message },
      { status: 500 },
    )
  }
}
