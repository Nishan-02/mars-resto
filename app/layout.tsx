import type React from "react"
import type { Metadata } from "next"
import { Cinzel, Cinzel_Decorative, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/sonner"

// Cinzel — elegant serif for all headings (feel opulent/cosmic)
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-heading",
})

// Cinzel Decorative — for special large display text
const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
})

// Cormorant Garamond — elegant body text
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "Mars Bites — Taste Beyond Earth",
  description: "The first fine-dining restaurant beyond Earth. Interplanetary cuisine crafted in the heart of Valles Marineris, Mars.",
  keywords: ["Mars restaurant", "space dining", "interplanetary cuisine", "futuristic restaurant"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ scrollBehavior: "smooth" }}>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={`${cinzel.variable} ${cinzelDecorative.variable} ${cormorant.variable} font-body bg-background text-foreground antialiased overflow-x-hidden`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        <CartProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(14,11,2,0.95)",
                border: "1px solid rgba(200,160,40,0.3)",
                color: "rgba(240,225,180,0.9)",
                backdropFilter: "blur(20px)",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  )
}