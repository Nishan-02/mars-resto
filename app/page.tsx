"use client"

import { useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section"
import { Navbar } from "@/components/navbar"
import { AboutSection } from "@/components/about-section"
import { MenuSection } from "@/components/menu-section"
import { ContactSection } from "@/components/contact-section"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"
import { MarsDivider } from "@/components/mars-divider"

// Dynamically import canvas-based components (client-side only)
const SpaceBackground = dynamic(
  () => import("@/components/space-background").then((mod) => mod.SpaceBackground),
  { ssr: false }
)

const FloatingPlanets = dynamic(
  () => import("@/components/floating-planets").then((mod) => mod.FloatingPlanets),
  { ssr: false }
)

const SolarSystemLanding = dynamic(
  () => import("@/components/solar-system-landing").then((mod) => mod.SolarSystemLanding),
  { ssr: false }
)

export default function Home() {
  const [showSite, setShowSite] = useState(false)
  const [showLanding, setShowLanding] = useState(true)

  // Always start at the top of the page (Hero section)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const handleLandingComplete = useCallback(() => {
    setShowLanding(false)
    setShowSite(true)
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  return (
    <>
      {/* Solar System Landing Intro */}
      {showLanding && (
        <SolarSystemLanding onEnter={handleLandingComplete} />
      )}

      {/* Main Site — revealed after landing */}
      {showSite && (
        <main className="relative z-0">
          <SpaceBackground />
          <FloatingPlanets />
          <Navbar />
          <HeroSection />
          <MarsDivider />
          <AboutSection />
          <MarsDivider />
          <MenuSection />
          <ReviewsSection />
          <ContactSection />
          <Footer />
        </main>
      )}
    </>
  )
}