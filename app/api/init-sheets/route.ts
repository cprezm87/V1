import { NextResponse } from "next/server"
import { sheets, spreadsheetId, createSheet, addHeaders } from "@/lib/google-sheets"

export async function GET() {
  try {
    // Get the list of existing sheets
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    })

    const existingSheets = response.data.sheets?.map((sheet) => sheet.properties?.title) || []

    // Define the sheets we need with their headers
    const requiredSheets = [
      {
        title: "checklist",
        headers: [
          "Id",
          "Name",
          "Type",
          "Franchise",
          "Brand",
          "Serie",
          "Year Released",
          "Condition",
          "Price",
          "Year Purchase",
          "UPC",
          "Logo",
          "Photo",
          "Tagline",
          "Review",
          "Shelf",
          "Display",
          "Ranking",
          "Comments",
        ],
      },
      {
        title: "wishlist",
        headers: [
          "Name",
          "Type",
          "Franchise",
          "Brand",
          "Serie",
          "Year Released",
          "Price",
          "Logo",
          "Photo",
          "Tagline",
          "Review",
          "Released",
          "Buy",
          "Tracking Number",
          "Comments",
        ],
      },
      {
        title: "customs",
        headers: ["Name", "Type", "Franchise", "Head", "Body", "Logo", "Tagline", "Comments"],
      },
      {
        title: "anniversary movies",
        headers: ["Movie title", "Release Date", "Poster", "Trailer", "Comments"],
      },
    ]

    // Create sheets and add headers if they don't exist
    const results = await Promise.all(
      requiredSheets.map(async (sheet) => {
        if (!existingSheets.includes(sheet.title)) {
          // Create the sheet
          await createSheet(sheet.title)
          // Add headers
          await addHeaders(sheet.title, sheet.headers)
          return `Created sheet "${sheet.title}" with headers`
        } else {
          // Check if headers exist
          const headerResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheet.title}!A1:Z1`,
          })

          const existingHeaders = headerResponse.data.values?.[0] || []

          // If no headers or incomplete headers, add them
          if (existingHeaders.length === 0 || existingHeaders.length < sheet.headers.length) {
            await addHeaders(sheet.title, sheet.headers)
            return `Added headers to existing sheet "${sheet.title}"`
          }

          return `Sheet "${sheet.title}" already exists with headers`
        }
      }),
    )

    return NextResponse.json({
      message: "Sheets initialization completed",
      details: results,
    })
  } catch (error) {
    console.error("Error initializing sheets:", error)
    return NextResponse.json({ error: "Failed to initialize sheets" }, { status: 500 })
  }
}
