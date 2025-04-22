import { google } from "googleapis"

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

export const sheets = google.sheets({ version: "v4", auth })

export const spreadsheetId = process.env.GOOGLE_SHEETS_DOCUMENT_ID

export async function createSheet(title: string) {
  try {
    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title,
              },
            },
          },
        ],
      },
    })

    return response.data
  } catch (error) {
    console.error("Error creating sheet:", error)
    throw error
  }
}

export async function addHeaders(sheetTitle: string, headers: string[]) {
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetTitle}!A1:${String.fromCharCode(64 + headers.length)}1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [headers],
      },
    })

    return response.data
  } catch (error) {
    console.error("Error adding headers:", error)
    throw error
  }
}
