"use client"

import { useState, useEffect, useCallback } from "react"
import { ShoppingCart, X, MessageCircle, ArrowRight } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { validateDeliveryAddress } from "@/lib/geocoding"
import { getBranches, Branch } from "@/lib/branches"

export function WhatsAppCartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    phone: '',
    address: '',
    deliveryTime: 'ASAP',
    branchId: ''
  })
  const [mounted, setMounted] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [addressError, setAddressError] = useState('')
  const { getTotalItems, getTotalPrice, getItems, removeFromCart, updateQuantity, shareToWhatsApp, clearCart } = useCart()

    useEffect(() => {
    setMounted(true)
    const loadData = async () => {
      const loadedBranches = await getBranches();
      setBranches(loadedBranches);
    };
    loadData();
  }, [])

  // Debounced address validation
  const debouncedValidation = useCallback(
    (address: string) => {
      const validation = validateDeliveryAddress(address)
      setAddressError(validation.valid ? '' : validation.message)
    },
    []
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (customerInfo.address) {
        debouncedValidation(customerInfo.address)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [customerInfo.address, debouncedValidation])

  const items = getItems()
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  const handleCustomerInfoSubmit = async () => {
    // Validate branch selection
    if (!customerInfo.branchId) {
      alert('Please select your nearest branch')
      return
    }
    
    // Validate phone number (Pakistani format: 03XXXXXXXXX)
    const phoneRegex = /^03[0-9]{9}$/
    const cleanedPhone = customerInfo.phone.replace(/[\s-]/g, '')
    
    if (!cleanedPhone) {
      alert('Please enter your phone number')
      return
    }
    
    if (!phoneRegex.test(cleanedPhone)) {
      alert('Please enter a valid Pakistani phone number (format: 03XXXXXXXXX)')
      return
    }
    
    // Validate address
    if (!customerInfo.address.trim()) {
      alert('Please enter your delivery address')
      return
    }
    
    if (customerInfo.address.trim().length < 10) {
      alert('Please enter a complete delivery address (at least 10 characters)')
      return
    }
    
    // Tehsil-based validation for Lahore (no API required)
    const validation = validateDeliveryAddress(customerInfo.address)
    
    if (!validation.valid) {
      setAddressError(validation.message)
      return
    }
    
    // Address is valid, proceed with order
    await shareToWhatsApp({ ...customerInfo, phone: cleanedPhone })
  }

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 transition-transform hover:scale-105 active:scale-95"
        aria-label={`Shopping cart with ${totalItems} items`}
      >
        <ShoppingCart className="h-6 w-6 text-black" />
        {mounted && totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-manjjo-yellow text-xs font-bold text-black animate-pulse">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </button>

      {/* Cart Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Your Order</h2>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button 
                    onClick={() => {
                      if (confirm('Clear all items from cart?')) {
                        clearCart()
                        setShowCustomerForm(false)
                      }
                    }}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Clear Cart
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-manjjo-red font-semibold">Rs. {item.price * item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-white border hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-white border hover:bg-gray-100"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-manjjo-red">Rs. {totalPrice}</span>
                </div>
                
                {!showCustomerForm ? (
                  <button
                    onClick={() => setShowCustomerForm(true)}
                    className="w-full bg-manjjo-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Branch *
                      </label>
                      <select
                        value={customerInfo.branchId}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, branchId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-manjjo-red focus:border-transparent"
                      >
                        <option value="">Choose nearest branch</option>
                        {branches.map(branch => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name} - {branch.area}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="0300 1234567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-manjjo-red focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Address *
                      </label>
                      <textarea
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="House #123, Street XYZ, Lahore"
                        rows={2}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-manjjo-red focus:border-transparent ${
                          addressError ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {addressError && (
                        <p className="mt-1 text-sm text-red-600">{addressError}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Time
                      </label>
                      <select
                        value={customerInfo.deliveryTime}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, deliveryTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-manjjo-red focus:border-transparent"
                      >
                        <option value="ASAP">ASAP</option>
                        <option value="30 minutes">30 minutes</option>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        <option value="Custom">Custom time</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCustomerForm(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleCustomerInfoSubmit}
                        className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Order on WhatsApp
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
