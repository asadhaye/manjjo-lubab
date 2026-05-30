"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, X, ImageOff } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { fetchMenuData, MenuItem } from "@/lib/google-sheets"

// Convert Google Drive File IDs or sharing links to reliable thumbnail URLs
function getImageUrl(src: string | undefined): string {
  if (!src) return "/placeholder.svg"

  // If it's already a direct image URL, use it
  if (src.includes("googleusercontent.com") || src.includes("/thumbnail?id=")) {
    return src
  }

  // Extract Google Drive File ID from sharing link or plain ID
  const driveMatch = src.match(/([a-zA-Z0-9_-]{25,})/)
  if (driveMatch) {
    // Use Google Drive thumbnail API - works for publicly shared images
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`
  }

  return src
}

// ProductImage component with error fallback
function ProductImage({ src, alt }: { src: string | undefined; alt: string }) {
  const [error, setError] = useState(false)
  const imageUrl = getImageUrl(src)

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
        <ImageOff className="w-8 h-8 mb-2" />
        <span className="text-xs text-center px-2">{alt}</span>
      </div>
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-300"
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      onError={() => setError(true)}
    />
  )
}

interface Product {
  id: number
  name: string
  basePrice: number
  image: string
  description?: string
  category?: string
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

interface Category {
  id: string
  name: string
  products: Product[]
}

export default function ProductGrid() {
  const [menuData, setMenuData] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('')

  useEffect(() => {
    async function loadMenuData() {
      try {
        setLoading(true)
        const items: MenuItem[] = await fetchMenuData()
        
        // Group items by category (trim whitespace to avoid duplicates)
        const groupedData = items.reduce((acc: Category[], item) => {
          const categoryName = (item.category || 'other').trim().toLowerCase()
          const existingCategory = acc.find(cat => cat.id === categoryName)
          
          if (existingCategory) {
            existingCategory.products.push(item)
          } else {
            acc.push({
              id: categoryName,
              name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
              products: [item]
            })
          }
          
          return acc
        }, [])
        
        setMenuData(groupedData)
        if (groupedData.length > 0) {
          setActiveCategory(groupedData[0].id)
        }
      } catch (err) {
        console.error('Error loading menu data:', err)
        setError('Failed to load menu data')
      } finally {
        setLoading(false)
      }
    }

    loadMenuData()

    // Listen for category changes from bottom nav
    const handleCategoryChange = (event: CustomEvent) => {
      setActiveCategory(event.detail)
    }

    window.addEventListener('categoryChange', handleCategoryChange as EventListener)

    return () => {
      window.removeEventListener('categoryChange', handleCategoryChange as EventListener)
    }
  }, [])

  if (loading) {
    return (
      <section className="bg-[#F9F9F9] py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manjjo-red mx-auto"></div>
            <p className="mt-4 text-manjjo-gray">Loading menu...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-[#F9F9F9] py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  const currentCategory = menuData.find((cat) => cat.id === activeCategory) || menuData[0]

  const handlePrevCategory = () => {
    const currentIndex = menuData.findIndex(cat => cat.id === activeCategory)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuData.length - 1
    setActiveCategory(menuData[prevIndex].id)
    window.dispatchEvent(new CustomEvent('categoryChange', { detail: menuData[prevIndex].id }))
  }

  const handleNextCategory = () => {
    const currentIndex = menuData.findIndex(cat => cat.id === activeCategory)
    const nextIndex = currentIndex < menuData.length - 1 ? currentIndex + 1 : 0
    setActiveCategory(menuData[nextIndex].id)
    window.dispatchEvent(new CustomEvent('categoryChange', { detail: menuData[nextIndex].id }))
  }

  return (
    <section id="menu-section" className="bg-[#F9F9F9] py-8 px-4 md:px-8 pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Our Menu
          </h2>
          
          {/* Category Selector with Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevCategory}
              className="w-10 h-10 rounded-full bg-white border-2 border-manjjo-gray flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Previous category"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="bg-white border-2 border-manjjo-gray rounded-full px-6 py-2 min-w-[150px] text-center">
              <span className="font-semibold text-black">
                {currentCategory?.name || 'Menu'}
              </span>
            </div>
            
            <button
              onClick={handleNextCategory}
              className="w-10 h-10 rounded-full bg-white border-2 border-manjjo-gray flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Next category"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCategory?.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [showVariationModal, setShowVariationModal] = useState(false)
  const [selectedSize, setSelectedSize] = useState('Regular')
  const [selectedSpice, setSelectedSpice] = useState('Medium')

  const handleAddToCart = () => {
    const finalPrice = calculateFinalPrice(product.basePrice, selectedSize, selectedSpice)
    addToCart({
      id: product.id,
      name: `${product.name} (${selectedSize}, ${selectedSpice})`,
      price: finalPrice
    })
    setShowVariationModal(false)
  }

  const calculateFinalPrice = (basePrice: number, size: string, spice: string) => {
    let sizeMultiplier = 1
    let spiceMultiplier = 1

    // Size pricing
    if (Array.isArray(product.variations?.sizes)) {
      const sizeOption = product.variations.sizes.find(s => s.name === size)
      if (sizeOption) {
        sizeMultiplier = sizeOption.price / basePrice
      }
    }

    // Spice pricing
    if (Array.isArray(product.variations?.spiceLevels)) {
      const spiceOption = product.variations.spiceLevels.find(s => s.name === spice)
      if (spiceOption) {
        spiceMultiplier = spiceOption.price / basePrice
      }
    }

    return Math.round(basePrice * sizeMultiplier * spiceMultiplier)
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden relative group hover:shadow-xl transition-shadow duration-300">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <ProductImage src={product.image} alt={product.name} />
          {/* Badge for new/popular items */}
          {(product.id <= 5 || product.basePrice >= 1000) && (
            <div className="absolute top-2 left-2 bg-manjjo-yellow text-black text-xs font-bold px-2 py-1 rounded-full">
              {product.id <= 5 ? "NEW" : "POPULAR"}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-black text-lg leading-tight flex-1">{product.name}</h3>
            <div className="flex items-center gap-1">
              <span className="text-xs text-manjjo-gray bg-manjjo-light px-2 py-1 rounded-full font-medium">
                {product.category || "Fast Food"}
              </span>
            </div>
          </div>
          {product.description && (
            <p className="text-manjjo-gray text-sm mt-2 leading-snug">{product.description}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <p className="text-manjjo-red font-bold text-xl">Rs. {product.basePrice.toLocaleString()}</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-manjjo-yellow rounded-full animate-pulse" />
              <span className="text-xs text-manjjo-gray font-medium">In Stock</span>
            </div>
          </div>
          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={() => setShowVariationModal(true)}
            className="w-full mt-4 bg-manjjo-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
      </div>

      {/* Variation Modal */}
      {showVariationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Customize {product.name}</h2>
              <button 
                onClick={() => setShowVariationModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Size Selection */}
              {Array.isArray(product.variations?.sizes) && product.variations.sizes.length > 0 && (
                <div>
                  <h3 className="font-medium text-manjjo-red mb-2">Choose Size</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {product.variations.sizes.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size.name)}
                        className={`p-3 border-2 rounded-lg transition-colors ${
                          selectedSize === size.name
                            ? "border-manjjo-red bg-manjjo-red text-white"
                            : "border-manjjo-gray hover:border-manjjo-red"
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-medium">{size.name}</div>
                          <div className="text-sm text-manjjo-gray">+Rs. {size.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Spice Level Selection */}
              {Array.isArray(product.variations?.spiceLevels) && product.variations.spiceLevels.length > 0 && (
                <div>
                  <h3 className="font-medium text-manjjo-red mb-2">Choose Spice Level</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variations.spiceLevels.map((spice) => (
                      <button
                        key={spice.name}
                        onClick={() => setSelectedSpice(spice.name)}
                        className={`p-3 border-2 rounded-lg transition-colors ${
                          selectedSpice === spice.name
                            ? "border-manjjo-red bg-manjjo-red text-white"
                            : "border-manjjo-gray hover:border-manjjo-red"
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-medium">{spice.name}</div>
                          <div className="text-sm text-manjjo-gray">+Rs. {spice.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowVariationModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-manjjo-red text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Add to Cart - Rs. {calculateFinalPrice(product.basePrice, selectedSize, selectedSpice)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
