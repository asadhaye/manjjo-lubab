import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { OrderData } from '@/lib/google-sheets'

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
      'not just the private key portion.'
    )
  }
}

async function getGoogleSheetsClient() {
  const credentials = getCredentials()
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  })
  const sheets = google.sheets({ version: 'v4', auth })
  return sheets
}

export async function POST(request: Request) {
  try {
    const orderData: OrderData = await request.json()
    const sheets = await getGoogleSheetsClient()

    console.log('Saving order to Google Sheets:', orderData)

    // Append order to the "Orders" sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Orders!A:L',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            orderData.orderId,
            orderData.customerName || '',
            orderData.phoneNumber || '',
            orderData.deliveryAddress || '',
            orderData.deliveryTime || 'ASAP',
            orderData.branchId || '',
            orderData.branchName || '',
            orderData.branchAddress || '',
            JSON.stringify(orderData.items),
            orderData.totalPrice,
            orderData.status,
            orderData.timestamp
          ]
        ]
      }
    })

    console.log('Order saved successfully to Google Sheets')

    return NextResponse.json({
      success: true,
      orderId: orderData.orderId,
      message: 'Order saved successfully'
    })
  } catch (error) {
    console.error('Error saving order to Google Sheets:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to save order to Google Sheets', details: message },
      { status: 500 }
    )
  }
}
