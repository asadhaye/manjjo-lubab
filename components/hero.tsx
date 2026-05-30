import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-burger.jpg"
          alt="Delicious burger"
          fill
          priority
          className="object-cover"
        />
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-4 text-balance text-5xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl">
          Cravings Met?
        </h1>
        <p className="mb-8 text-pretty text-lg font-medium text-white/90 md:text-xl">
          Best Fast Food in Lahore
        </p>
        <Button
          size="lg"
          className="bg-manjjo-yellow px-8 py-6 text-lg font-bold text-black shadow-lg transition-all hover:bg-manjjo-yellow/90 hover:shadow-xl active:scale-95"
        >
          Order Now
        </Button>
      </div>
    </section>
  )
}
