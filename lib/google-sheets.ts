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
  try {
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
          "dateAdded",
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
          "dateAdded",
        ])
      } else if (sheetName === SHEETS.CUSTOMS) {
        await sheet.setHeaderRow([
          "id",
          "name",
          "type",
          "franchise",
          "head",
          "body",
          "logo",
          "tagline",
          "comments",
          "dateAdded",
        ])
      }
    }

    return sheet
  } catch (error) {
    console.error(`Error getting sheet ${sheetName}:`, error)
    throw error
  }
}

/**
 * Add a row to a specific sheet
 */
export async function addRow(sheetName: string, rowData: any) {
  try {
    const sheet = await getSheet(sheetName)

    // Add dateAdded field if it doesn't exist
    if (!rowData.dateAdded) {
      rowData.dateAdded = new Date().toISOString()
    }

    return await sheet.addRow(rowData)
  } catch (error) {
    console.error(`Error adding row to ${sheetName}:`, error)
    throw error
  }
}

/**
 * Get all rows from a specific sheet
 */
export async function getRows(sheetName: string) {
  try {
    const sheet = await getSheet(sheetName)
    return await sheet.getRows()
  } catch (error) {
    console.error(`Error getting rows from ${sheetName}:`, error)
    throw error
  }
}

/**
 * Update a row in a specific sheet
 */
export async function updateRow(sheetName: string, rowIndex: number, rowData: any) {
  try {
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
  } catch (error) {
    console.error(`Error updating row in ${sheetName}:`, error)
    throw error
  }
}

/**
 * Delete a row from a specific sheet
 */
export async function deleteRow(sheetName: string, rowIndex: number) {
  try {
    const sheet = await getSheet(sheetName)
    const rows = await sheet.getRows()

    if (rowIndex >= 0 && rowIndex < rows.length) {
      await rows[rowIndex].delete()
      return true
    }

    throw new Error(`Row index ${rowIndex} out of bounds`)
  } catch (error) {
    console.error(`Error deleting row from ${sheetName}:`, error)
    throw error
  }
}

/**
 * Find a row by ID
 */
export async function findRowById(sheetName: string, id: string): Promise<GoogleSpreadsheetRow | null> {
  try {
    const sheet = await getSheet(sheetName)
    const rows = await sheet.getRows()

    for (const row of rows) {
      if (row.id === id) {
        return row
      }
    }

    return null
  } catch (error) {
    console.error(`Error finding row by ID in ${sheetName}:`, error)
    throw error
  }
}

/**
 * Delete a row by ID
 */
export async function deleteRowById(sheetName: string, id: string): Promise<boolean> {
  try {
    const row = await findRowById(sheetName, id)

    if (row) {
      await row.delete()
      return true
    }

    return false
  } catch (error) {
    console.error(`Error deleting row by ID from ${sheetName}:`, error)
    throw error
  }
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
      // Add dateAdded field if it doesn't exist
      if (!item.dateAdded) {
        item.dateAdded = new Date().toISOString()
      }

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

/**
 * Create a test row in a sheet (for testing the connection)
 */
export async function createTestRow(sheetName: string): Promise<boolean> {
  try {
    const sheet = await getSheet(sheetName)

    const testData = {
      id: `test-${Date.now()}`,
      name: "Test Item",
      dateAdded: new Date().toISOString(),
    }

    // Add other required fields based on sheet type
    if (sheetName === SHEETS.FIGURES) {
      testData["type"] = "figures"
      testData["franchise"] = "Test"
      testData["brand"] = "Test Brand"
      testData["yearReleased"] = "2023"
      testData["condition"] = "New"
      testData["price"] = "100"
      testData["yearPurchase"] = "2023"
    } else if (sheetName === SHEETS.WISHLIST) {
      testData["type"] = "figures"
      testData["franchise"] = "Test"
      testData["brand"] = "Test Brand"
      testData["yearReleased"] = "2023"
      testData["price"] = "100"
      testData["released"] = "false"
      testData["buy"] = "false"
    } else if (sheetName === SHEETS.CUSTOMS) {
      testData["type"] = "figures"
      testData["franchise"] = "Test"
      testData["head"] = "Test Head"
      testData["body"] = "Test Body"
    }

    await sheet.addRow(testData)
    return true
  } catch (error) {
    console.error(`Error creating test row in ${sheetName}:`, error)
    throw error
  }
}
