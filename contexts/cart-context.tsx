"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { WhatsAppCart } from "@/lib/whatsapp-order"

interface CartContextType {
  cart: WhatsAppCart
  addToCart: (product: { id: number; name: string; price: number }) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getItems: () => any[]
  clearCart: () => void
  shareToWhatsApp: (customerInfo?: { phone: string; address: string; deliveryTime: string; branchId: string }) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart] = useState(() => new WhatsAppCart())
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const forceUpdate = () => setUpdateTrigger(prev => prev + 1)

  const addToCart = (product: { id: number; name: string; price: number }) => {
    cart.addItem(product)
    forceUpdate()
  }

  const removeFromCart = (productId: number) => {
    cart.removeItem(productId)
    forceUpdate()
  }

  const updateQuantity = (productId: number, quantity: number) => {
    cart.updateQuantity(productId, quantity)
    forceUpdate()
  }

  const getItems = () => cart.getItems()
  const getTotalItems = () => cart.getTotalItems()
  const getTotalPrice = () => cart.getTotalPrice()
  const clearCart = () => {
    cart.clear()
    forceUpdate()
  }

  const shareToWhatsApp = async (customerInfo?: { phone: string; address: string; deliveryTime: string; branchId: string }) => {
    const whatsappUrl = await cart.generateWhatsAppMessage(undefined, customerInfo)
    window.open(whatsappUrl, '_blank')
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalItems,
      getTotalPrice,
      getItems,
      clearCart,
      shareToWhatsApp
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
