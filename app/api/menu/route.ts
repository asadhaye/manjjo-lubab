import { NextResponse } from 'next/server'
import { google } from 'googleapis'

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || 'YOUR_GOOGLE_SHEETS_ID_HERE'

function getCredentials() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!key || key === 'your_service_account_key_json_here' || key.length < 100) { // Added length check for more robust validation
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not set in environment variables')
  }
  try {
    return JSON.parse(key)
  } catch {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON. ' +
      'You must paste the entire service account key JSON file content, including all fields, ' +
      'not just the private key portion. The JSON should look like: ' +
      '{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
    )
  }
}

async function getGoogleSheetsClient() {
  const credentials = getCredentials()
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  })
  const sheets = google.sheets({ version: 'v4', auth })
  return sheets
}

export async function GET() {
  try {
    const sheets = await getGoogleSheetsClient()

    // Fetch menu data from the "Menu" sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Menu!A2:Z', // Start from row 2 to skip headers
    })

    const rows = response.data.values || []

    // Convert rows to menu items
    const menuData = rows.map((row, index) => {
      const parseJSON = (value: any) => {
        if (!value || value === '' || value === '[]' || value === '{}') return []
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      }

      // Parse sizes from columns G-J (name/price pairs)
      const sizes = []
      if (row[6] && row[7]) {
        sizes.push({ name: row[6], price: parseFloat(row[7]) || 0 })
      }
      if (row[8] && row[9]) {
        sizes.push({ name: row[8], price: parseFloat(row[9]) || 0 })
      }

      return {
        id: parseInt(row[0]) || index + 1,
        name: row[1] || '',
        basePrice: parseFloat(row[2]) || 0,
        image: row[3] || '/images/menu/default.jpg',
        description: row[4] || '',
        category: row[5] || 'other',
        variations: {
          sizes: sizes,
          spiceLevels: parseJSON(row[10]),
          toppings: parseJSON(row[11])
        }
      }
    })

    return NextResponse.json(menuData)
  } catch (error) {
    console.error('Error fetching menu data from Google Sheets:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch menu data from Google Sheets', details: message },
      { status: 500 }
    )
  }
}
