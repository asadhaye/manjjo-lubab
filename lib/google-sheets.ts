// Google Sheets API Integration for Manjjo Restaurant
// This file handles fetching menu data and saving order data to Google Sheets

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || 'YOUR_GOOGLE_SHEETS_ID_HERE'

export interface GoogleSheetsConfig {
  spreadsheetId: string
  serviceAccountKey: string
}

export interface MenuItem {
  id: number
  name: string
  basePrice: number
  image: string
  description?: string
  category: string
  variations?: {
    sizes?: Array<{
      name: string
      price: number
      description?: string
    }>
    spiceLevels?: Array<{
      name: string
      price: number
      description?: string
    }>
    toppings?: Array<{
      name: string
      price: number
      available?: boolean
    }>
  }
}

export interface OrderData {
  orderId: string
  customerName?: string
  phoneNumber?: string
  deliveryAddress?: string
  deliveryTime?: string
  branchId?: string
  branchName?: string
  branchAddress?: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    variations?: string
  }>
  totalPrice: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  timestamp: string
}

// Fetch menu data from Google Sheets
export async function fetchMenuData(): Promise<MenuItem[]> {
  try {
    console.log('Fetching menu data from Google Sheets...')
    
    // For now, we'll use a public API endpoint approach
    // In production, this should go through a Next.js API route to keep credentials secure
    const response = await fetch(`/api/menu`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch menu data')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching menu data:', error)
    throw new Error('Failed to fetch menu data from Google Sheets')
  }
}

// Save order data to Google Sheets
export async function saveOrderData(orderData: OrderData): Promise<void> {
  try {
    console.log('Saving order data to Google Sheets...', orderData)
    
    // Call Next.js API route to save order
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to save order')
    }
    
    console.log('Order saved successfully')
  } catch (error) {
    console.error('Error saving order data:', error)
    throw new Error('Failed to save order data to Google Sheets')
  }
}

// Update order status in Google Sheets
export async function updateOrderStatus(orderId: string, status: OrderData['status']): Promise<void> {
  try {
    console.log(`Updating order ${orderId} status to ${status}`)
    
    // Call Next.js API route to update status
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    })
    
    if (!response.ok) {
      throw new Error('Failed to update order status')
    }
    
    console.log('Order status updated successfully')
  } catch (error) {
    console.error('Error updating order status:', error)
    throw new Error('Failed to update order status in Google Sheets')
  }
}

// Helper function to generate unique order ID
export function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}
