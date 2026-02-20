"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CartSheet } from "./cart-sheet"
import { ReservationModal } from "./reservation-modal"

const NAV_LINKS = ["Home", "About", "Menu", "Reviews", "Contact"]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("Home")

  useEffect(() => {
    const h = () => {
      setScrolled(window.scrollY > 60)
      // Highlight active section
      const sections = NAV_LINKS.map((l) => document.getElementById(l.toLowerCase()))
      const found = sections.find((s) => {
        if (!s) return false
        const r = s.getBoundingClientRect()
        return r.top <= 100 && r.bottom >= 100
      })
      if (found) setActive(found.id.charAt(0).toUpperCase() + found.id.slice(1))
    }
    window.addEventListener("scroll", h, { passive: true })
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 transition-all duration-500"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={
        scrolled
          ? {
            background: "rgba(4,3,12,0.75)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(200,160,40,0.15)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
          }
          : { background: "transparent" }
      }
    >
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Brand */}
        <a href="#home" className="group flex items-center gap-1">
          <span
            className="text-xl md:text-2xl font-black font-heading tracking-wider transition-all group-hover:scale-105"
            style={{ color: "#ffd700", textShadow: "0 0 20px rgba(200,160,40,0.35)" }}
          >
            MARS
          </span>
          <span
            className="text-xl md:text-2xl font-black font-heading tracking-wider ml-1 transition-all group-hover:scale-105"
            style={{ color: "rgba(240,225,180,0.8)" }}
          >
            BITES
          </span>
          {/* Gold dot accent */}
          <span
            className="w-1.5 h-1.5 rounded-full ml-0.5 self-start mt-1"
            style={{ background: "#ffd700", boxShadow: "0 0 6px rgba(200,160,40,0.8)" }}
          />
        </a>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => {
            const isActive = active === item
            return (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-xs tracking-[0.2em] uppercase font-body transition-all duration-200 hover:opacity-100 group"
                style={{ color: isActive ? "#ffd700" : "rgba(200,160,40,0.45)", opacity: isActive ? 1 : 0.8 }}
              >
                {item}
                {/* Animated underline */}
                <span
                  className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                  style={{
                    width: isActive ? "100%" : "0%",
                    background: "linear-gradient(90deg, #b8860b, #ffd700)",
                  }}
                />
                <span
                  className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: "linear-gradient(90deg, #b8860b, #ffd700)", opacity: isActive ? 0 : 1 }}
                />
              </a>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <CartSheet />
          <ReservationModal>
            <motion.button
              whileTap={{ scale: 0.93 }}
              className="px-5 py-2.5 rounded-full font-black font-heading text-xs tracking-widest transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #b8860b, #ffd700, #b8860b)",
                backgroundSize: "200% auto",
                animation: "gold-shimmer 3s linear infinite",
                color: "#0a0800",
                boxShadow: "0 0 20px rgba(200,160,40,0.25)",
              }}
            >
              Reserve
            </motion.button>
          </ReservationModal>
        </div>
      </div>
    </motion.nav>
  )
}
