"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the browser from showing the default install prompt
      e.preventDefault()
      // Store the event for later use
      setDeferredPrompt(e)
      // Show our custom install button
      setShowInstallButton(true)
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app is already installed
    const checkInstalled = () => {
      setShowInstallButton(false)
    }

    window.addEventListener('appinstalled', checkInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', checkInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // Log the outcome
    console.log(`User response to install prompt: ${outcome}`)

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setShowInstallButton(false)
  }

  if (!showInstallButton) return null

  return (
    <button
      onClick={handleInstallClick}
      className="p-2 text-black hover:text-gray-700 transition-colors"
      aria-label="Install app"
    >
      <Download className="w-6 h-6" />
    </button>
  )
}
