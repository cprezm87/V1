import { GoogleSpreadsheet, type GoogleSpreadsheetRow } from "google-spreadsheet"
import { JWT } from "google-auth-library"

// Environment variables for Google Sheets API
const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n")
const GOOGLE_SHEETS_DOCUMENT_ID = process.env.GOOGLE_SHEETS_DOCUMENT_ID

// Sheet names
export const SHEETS = {
  FIGURES: "Figures",
  WISHLIST: "Wishlist",
  CUSTOMS: "Customs",
}

/**
 * Initialize and authenticate with Google Sheets
 */
export async function getSpreadsheet() {
  try {
    if (!GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEETS_PRIVATE_KEY || !GOOGLE_SHEETS_DOCUMENT_ID) {
      throw new Error("Google Sheets credentials are missing")
    }

    const serviceAccountAuth = new JWT({
      email: GOOGLE_SHEETS_CLIENT_EMAIL,
      key: GOOGLE_SHEETS_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const doc = new GoogleSpreadsheet(GOOGLE_SHEETS_DOCUMENT_ID, serviceAccountAuth)
    await doc.loadInfo()
    return doc
  } catch (error) {
    console.error("Error initializing Google Sheets:", error)
    throw error
  }
}

/**
 * Get a specific sheet by name, create it if it doesn't exist
 */
export async function getSheet(sheetName: string) {
  const doc = await getSpreadsheet()

  // Try to find the sheet
  let sheet = doc.sheetsByTitle[sheetName]

  // If sheet doesn't exist, create it
  if (!sheet) {
    sheet = await doc.addSheet({ title: sheetName })

    // Set up headers based on sheet type
    if (sheetName === SHEETS.FIGURES) {
      await sheet.setHeaderRow([
        "id",
        "name",
        "type",
        "franchise",
        "brand",
        "serie",
        "yearReleased",
        "condition",
        "price",
        "yearPurchase",
        "upc",
        "logo",
        "photo",
        "tagline",
        "review",
        "shelf",
        "display",
        "ranking",
        "comments",
      ])
    } else if (sheetName === SHEETS.WISHLIST) {
      await sheet.setHeaderRow([
        "id",
        "name",
        "type",
        "franchise",
        "brand",
        "serie",
        "yearReleased",
        "price",
        "logo",
        "photo",
        "tagline",
        "review",
        "released",
        "buy",
        "comments",
      ])
    } else if (sheetName === SHEETS.CUSTOMS) {
      await sheet.setHeaderRow(["id", "name", "type", "franchise", "head", "body", "logo", "tagline", "comments"])
    }
  }

  return sheet
}

/**
 * Add a row to a specific sheet
 */
export async function addRow(sheetName: string, rowData: any) {
  const sheet = await getSheet(sheetName)
  return await sheet.addRow(rowData)
}

/**
 * Get all rows from a specific sheet
 */
export async function getRows(sheetName: string) {
  const sheet = await getSheet(sheetName)
  return await sheet.getRows()
}

/**
 * Update a row in a specific sheet
 */
export async function updateRow(sheetName: string, rowIndex: number, rowData: any) {
  const sheet = await getSheet(sheetName)
  const rows = await sheet.getRows()

  if (rowIndex >= 0 && rowIndex < rows.length) {
    const row = rows[rowIndex]
    Object.keys(rowData).forEach((key) => {
      row[key] = rowData[key]
    })
    await row.save()
    return row
  }

  throw new Error(`Row index ${rowIndex} out of bounds`)
}

/**
 * Delete a row from a specific sheet
 */
export async function deleteRow(sheetName: string, rowIndex: number) {
  const sheet = await getSheet(sheetName)
  const rows = await sheet.getRows()

  if (rowIndex >= 0 && rowIndex < rows.length) {
    await rows[rowIndex].delete()
    return true
  }

  throw new Error(`Row index ${rowIndex} out of bounds`)
}

/**
 * Find a row by ID
 */
export async function findRowById(sheetName: string, id: string): Promise<GoogleSpreadsheetRow | null> {
  const sheet = await getSheet(sheetName)
  const rows = await sheet.getRows()

  for (const row of rows) {
    if (row.id === id) {
      return row
    }
  }

  return null
}

/**
 * Delete a row by ID
 */
export async function deleteRowById(sheetName: string, id: string): Promise<boolean> {
  const row = await findRowById(sheetName, id)

  if (row) {
    await row.delete()
    return true
  }

  return false
}

/**
 * Sync local data with Google Sheets
 */
export async function syncLocalDataWithSheets(sheetName: string, localData: any[]): Promise<void> {
  try {
    const sheet = await getSheet(sheetName)

    // Get existing rows
    const existingRows = await sheet.getRows()

    // Create a map of existing IDs
    const existingIds = new Map()
    existingRows.forEach((row, index) => {
      existingIds.set(row.id, { row, index })
    })

    // Process local data
    for (const item of localData) {
      if (existingIds.has(item.id)) {
        // Update existing row
        const { row } = existingIds.get(item.id)
        Object.keys(item).forEach((key) => {
          // Handle boolean values
          if (typeof item[key] === "boolean") {
            row[key] = item[key].toString()
          } else {
            row[key] = item[key]
          }
        })
        await row.save()
        existingIds.delete(item.id)
      } else {
        // Add new row
        const newRowData = { ...item }
        // Convert boolean values to strings
        Object.keys(newRowData).forEach((key) => {
          if (typeof newRowData[key] === "boolean") {
            newRowData[key] = newRowData[key].toString()
          }
        })
        await sheet.addRow(newRowData)
      }
    }

    // Delete rows that no longer exist in local data
    for (const { row } of existingIds.values()) {
      await row.delete()
    }
  } catch (error) {
    console.error(`Error syncing ${sheetName} data:`, error)
    throw error
  }
}
