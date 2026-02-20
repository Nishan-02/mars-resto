"use client"

import { motion } from "framer-motion"
import { Twitter, Instagram, Youtube, Rss, MapPin, Mail, Clock, Radio } from "lucide-react"

const NAV_LINKS = ["Home", "About", "Menu", "Reviews", "Contact"]

const SOCIALS = [
  { icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
  { icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
  { icon: <Youtube className="w-4 h-4" />, label: "Youtube" },
  { icon: <Rss className="w-4 h-4" />, label: "Feed" },
]

const INFO = [
  { icon: <MapPin className="w-4 h-4" />, text: "Dome 7, Valles Marineris, Mars" },
  { icon: <span className="text-sm">🌍</span>, text: "13.9°S · 59.2°W (Martian Grid)" },
  { icon: <Mail className="w-4 h-4" />, text: "mars.bites@spacemail.sol" },
  { icon: <Clock className="w-4 h-4" />, text: "Open 17:00 – 24:00 MT, Every Sol" },
]

export function Footer() {
  const ripple = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement
    const r = document.createElement("span")
    const rect = el.getBoundingClientRect()
    const sz = Math.max(rect.width, rect.height) * 2
    Object.assign(r.style, {
      position: "absolute",
      width: sz + "px", height: sz + "px",
      borderRadius: "50%",
      background: "rgba(200,160,40,0.25)",
      left: e.clientX - rect.left - sz / 2 + "px",
      top: e.clientY - rect.top - sz / 2 + "px",
      pointerEvents: "none",
      transform: "scale(0)",
      animation: "ripple-gold 0.55s ease-out forwards",
    })
    el.style.position = "relative"
    el.style.overflow = "hidden"
    el.appendChild(r)
    setTimeout(() => r.remove(), 560)
  }

  return (
    <footer
      className="relative overflow-hidden pt-20 pb-10"
      style={{
        background: "linear-gradient(to bottom, transparent 0%, rgba(8,4,1,0.7) 100%)",
        borderTop: "1px solid rgba(200,160,40,0.25)",
      }}
    >
      {/* Bright gold glow at top edge */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-1 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.6), rgba(255,250,200,1), rgba(255,215,0,0.6), transparent)", filter: "blur(1px)" }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,160,40,0.1) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-14">

          {/* ── Brand column ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <h3 className="text-3xl font-black font-heading mb-4">
              <span style={{ color: "#FFD700", textShadow: "0 0 24px rgba(255,215,0,0.5)" }}>MARS</span>
              <span style={{ color: "#F5E6C8" }}> BITES</span>
            </h3>
            <p className="text-sm leading-7 mb-6 font-body" style={{ color: "#C8A96E" }}>
              The first fine-dining restaurant beyond Earth. Serving the cosmos one extraordinary plate at a time since 2095.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  onClick={ripple as any}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{
                    background: "rgba(200,160,40,0.12)",
                    border: "1px solid rgba(200,160,40,0.35)",
                    color: "#C8A060",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = "rgba(255,215,0,0.2)"
                    el.style.color = "#FFD700"
                    el.style.boxShadow = "0 0 16px rgba(255,215,0,0.3)"
                    el.style.borderColor = "rgba(255,215,0,0.6)"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = "rgba(200,160,40,0.12)"
                    el.style.color = "#C8A060"
                    el.style.boxShadow = "none"
                    el.style.borderColor = "rgba(200,160,40,0.35)"
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Navigation column ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-xs tracking-[0.5em] uppercase font-body font-bold mb-6" style={{ color: "#D4A840" }}>
              Quick Navigation
            </p>
            <ul className="space-y-4">
              {NAV_LINKS.map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    onClick={ripple as any}
                    className="text-base font-body flex items-center gap-3 group transition-all duration-200"
                    style={{ color: "#B89050", position: "relative", overflow: "hidden" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#FFD700" }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#B89050" }}
                  >
                    {/* Arrow that slides in */}
                    <span
                      className="h-px transition-all duration-300 group-hover:w-6"
                      style={{ width: 0, background: "linear-gradient(90deg, #B8860B, #FFD700)", display: "inline-block", marginTop: "1px" }}
                    />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Mission Control column ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-xs tracking-[0.5em] uppercase font-body font-bold mb-6" style={{ color: "#D4A840" }}>
              Mission Control
            </p>
            <ul className="space-y-4">
              {INFO.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-0.5" style={{ color: "#C8A040" }}>{item.icon}</span>
                  <span className="text-sm font-body leading-relaxed" style={{ color: "#C8A96E" }}>{item.text}</span>
                </li>
              ))}
            </ul>

            {/* Live signal */}
            <div className="flex items-center gap-3 mt-6 p-3 rounded-xl" style={{ background: "rgba(200,160,40,0.06)", border: "1px solid rgba(200,160,40,0.18)" }}>
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: "#FFD700", boxShadow: "0 0 10px rgba(255,215,0,0.8)" }}
              />
              <div>
                <p className="text-xs font-body font-bold" style={{ color: "#FFD700" }}>Signal Live</p>
                <p className="text-[10px] font-body" style={{ color: "#9A7830" }}>Transmitting from Mars · Sol 10,623</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center gap-3 pt-8"
          style={{ borderTop: "1px solid rgba(200,160,40,0.2)" }}
        >
          <p className="text-sm font-body" style={{ color: "#907040" }}>
            © 2095 – 2127 Mars Bites Corp. All rights reserved across all inhabited planets.
          </p>
          <p className="text-sm font-body" style={{ color: "#7A5E30" }}>
            Taste Beyond Earth™ · Martian Culinary Authority Certified
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
