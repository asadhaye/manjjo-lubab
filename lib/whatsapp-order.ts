import { saveOrderData, generateOrderId, OrderData } from './google-sheets'
import { getBranchById } from './branches'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export class WhatsAppCart {
  private items: CartItem[] = []
  private readonly STORAGE_KEY = 'manjjo-cart'
  private readonly STORAGE_VERSION = '1.0'
  private readonly VERSION_KEY = 'manjjo-cart-version'

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        // Check if this is a new version or first-time visitor
        const currentVersion = localStorage.getItem(this.VERSION_KEY)
        
        // If version doesn't match or doesn't exist, clear old data
        if (currentVersion !== this.STORAGE_VERSION) {
          this.clearStorage()
          localStorage.setItem(this.VERSION_KEY, this.STORAGE_VERSION)
          return
        }

        const stored = localStorage.getItem(this.STORAGE_KEY)
        if (stored) {
          const parsedItems = JSON.parse(stored)
          // Validate that stored data is valid cart items
          if (Array.isArray(parsedItems) && parsedItems.every(item => 
            typeof item.id === 'number' && 
            typeof item.name === 'string' && 
            typeof item.price === 'number' && 
            typeof item.quantity === 'number'
          )) {
            this.items = parsedItems
          } else {
            // Clear invalid data
            this.clearStorage()
          }
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error)
        this.clearStorage()
      }
    }
  }

  private clearStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY)
    }
    this.items = []
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items))
        localStorage.setItem(this.VERSION_KEY, this.STORAGE_VERSION)
      } catch (error) {
        console.error('Failed to save cart to storage:', error)
      }
    }
  }

  addItem(product: { id: number; name: string; price: number }) {
    const existingItem = this.items.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.items.push({ ...product, quantity: 1 })
    }
    this.saveToStorage()
  }

  removeItem(productId: number) {
    this.items = this.items.filter(item => item.id !== productId)
    this.saveToStorage()
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.items.find(item => item.id === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
      this.saveToStorage()
    }
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0)
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  getItems(): CartItem[] {
    return [...this.items]
  }

  clear() {
    this.items = []
    this.saveToStorage()
  }

  async generateWhatsAppMessage(phoneNumber: string = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || 'YOUR_WHATSAPP_NUMBER_HERE', customerInfo?: { phone: string; address: string; deliveryTime: string; branchId: string }): Promise<string> {
    if (this.items.length === 0) return ''

    const orderId = generateOrderId()
    const branch = customerInfo?.branchId ? await getBranchById(customerInfo.branchId) : undefined
    
    const orderData: OrderData = {
      orderId,
      customerName: '',
      phoneNumber: customerInfo?.phone || '',
      deliveryAddress: customerInfo?.address || '',
      deliveryTime: customerInfo?.deliveryTime || 'ASAP',
      branchId: customerInfo?.branchId,
      branchName: branch?.name,
      branchAddress: branch?.address,
      items: this.items,
      totalPrice: this.getTotalPrice(),
      status: 'pending',
      timestamp: new Date().toISOString()
    }
    
    // Save order to Google Sheets
    saveOrderData(orderData).catch(error => {
      console.error('Failed to save order to Google Sheets:', error)
    })

    const message = [
      '🍔 *Manjjo Food Order*',
      '',
      '🏪 *Branch:*',
      branch ? `${branch.name} (${branch.area})` : '[Branch not selected]',
      '',
      '📋 *Order Details:*',
      ...this.items.map(item => 
        `• ${item.name} x${item.quantity} = Rs. ${item.price * item.quantity}`
      ),
      '',
      `💰 *Total: Rs. ${this.getTotalPrice()}*`,
      '',
      '📍 *Delivery Address:*',
      customerInfo?.address || '[Please add your address]',
      '',
      '📞 *Contact Number:*',
      customerInfo?.phone || '[Please add your phone number]',
      '',
      '⏰ *Delivery Time:*',
      customerInfo?.deliveryTime || 'ASAP',
      '',
      `🆔 *Order ID:* ${orderId}`
    ].join('\n')

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    return message
  }
}
