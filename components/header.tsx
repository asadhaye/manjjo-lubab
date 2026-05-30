"use client"

import Image from "next/image"
import Link from "next/link"
import { WhatsAppCartButton } from "@/components/whatsapp-cart"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { Menu } from "lucide-react"

export function Header() {
  const handleMenuClick = () => {
    const menuSection = document.getElementById('menu-section')
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#FFAE42' }}>
      <div className="flex items-center justify-between relative px-4 py-3">
        {/* Menu Button - left */}
        <button
          onClick={handleMenuClick}
          className="flex items-center gap-2 text-black hover:text-gray-800 transition-colors"
        >
          <Menu className="w-6 h-6" />
          <span className="text-sm font-medium">Menu</span>
        </button>

        {/* Logo - centered */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <div className="overflow-hidden rounded-lg px-3 py-1.5">
            <Image
              src="/images/manjjo-lubab.jpeg"
              alt="Manjjo Logo"
              width={147}
              height={47}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Right side - Install App and Cart */}
        <div className="flex items-center gap-3">
          <PWAInstallPrompt />
          <WhatsAppCartButton />
        </div>
      </div>
    </header>
  )
}
