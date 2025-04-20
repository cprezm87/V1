import { NextResponse } from "next/server"
import { getSpreadsheet, createTestRow, SHEETS } from "@/lib/google-sheets"

export async function GET() {
  try {
    // First, test if we can connect to the spreadsheet
    const doc = await getSpreadsheet()

    // Get spreadsheet info
    const info = {
      title: doc.title,
      sheetCount: doc.sheetCount,
      sheets: doc.sheetsByIndex.map((sheet) => sheet.title),
    }

    // Try to create a test row in each sheet
    const testResults = {
      figures: false,
      wishlist: false,
      customs: false,
    }

    try {
      testResults.figures = await createTestRow(SHEETS.FIGURES)
    } catch (error) {
      console.error("Error testing Figures sheet:", error)
    }

    try {
      testResults.wishlist = await createTestRow(SHEETS.WISHLIST)
    } catch (error) {
      console.error("Error testing Wishlist sheet:", error)
    }

    try {
      testResults.customs = await createTestRow(SHEETS.CUSTOMS)
    } catch (error) {
      console.error("Error testing Customs sheet:", error)
    }

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Google Sheets",
      spreadsheetInfo: info,
      testResults,
    })
  } catch (error) {
    console.error("Error testing Google Sheets connection:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to Google Sheets",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
