"use client"

import { useState, useEffect } from "react"
import { fetchMenuData, MenuItem } from "@/lib/google-sheets"

interface Category {
  id: string
  name: string
  icon: string
  products: any[]
}

const categoryIcons: Record<string, string> = {
  burger: "🍔",
  pizza: "🍕",
  sandwich: "🥪",
  wrap: "🌯",
  shawarma: "🥙",
  fries: "🍟",
  other: "🍽️"
}

export function BottomNav() {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState('')

  useEffect(() => {
    async function loadMenuData() {
      try {
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
              icon: categoryIcons[categoryName] || categoryIcons.other,
              products: [item]
            })
          }
          
          return acc
        }, [])
        
        setCategories(groupedData)
        if (groupedData.length > 0) {
          setActiveCategory(groupedData[0].id)
        }
      } catch (err) {
        console.error('Error loading menu data:', err)
      }
    }

    loadMenuData()

    // Listen for category changes from ProductGrid
    const handleCategoryChange = (event: CustomEvent) => {
      setActiveCategory(event.detail)
    }

    window.addEventListener('categoryChange', handleCategoryChange as EventListener)

    return () => {
      window.removeEventListener('categoryChange', handleCategoryChange as EventListener)
    }
  }, [])

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    // Dispatch custom event to notify ProductGrid
    window.dispatchEvent(new CustomEvent('categoryChange', { detail: categoryId }))
    const menuSection = document.getElementById('menu-section')
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/20 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]" style={{ backgroundColor: '#FFAE42' }}>
      <div className="max-w-md mx-auto md:max-w-2xl">
        {/* Category Tabs */}
        <div className="flex gap-4 overflow-x-auto pb-3 pt-3 px-4 scrollbar-hide justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl transition-all duration-200 flex items-center justify-center border-2 ${
                activeCategory === category.id
                  ? "bg-white border-black shadow-lg scale-110"
                  : "bg-white/80 border-black/50 hover:bg-white hover:border-black hover:scale-105"
              }`}
              title={category.name}
            >
              <span className="text-3xl sm:text-4xl">{category.icon}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
