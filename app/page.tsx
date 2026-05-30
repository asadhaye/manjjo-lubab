import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import ProductGrid from "@/components/product-grid"
import { Footer } from "@/components/footer"
import { BottomNav } from "@/components/bottom-nav"

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        <Header />
        <Hero />
        <ProductGrid />
        <Footer />
      </main>
      <BottomNav />
    </>
  )
}
