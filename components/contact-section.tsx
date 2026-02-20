"use client"

import { motion } from "framer-motion"
import { ReservationModal } from "./reservation-modal"
import { Rocket, MapPin, Clock, Phone } from "lucide-react"

// Helper: gold ripple
function addRipple(e: React.MouseEvent<HTMLElement>, color = "rgba(200,160,40,0.45)") {
  const el = e.currentTarget
  const r = document.createElement("span")
  const rect = el.getBoundingClientRect()
  const sz = Math.max(rect.width, rect.height) * 2.5
  Object.assign(r.style, {
    position: "absolute",
    width: sz + "px", height: sz + "px",
    borderRadius: "50%",
    background: color,
    left: e.clientX - rect.left - sz / 2 + "px",
    top: e.clientY - rect.top - sz / 2 + "px",
    pointerEvents: "none",
    transform: "scale(0)",
    animation: "ripple-gold 0.55s ease-out forwards",
    zIndex: "10",
  })
  el.appendChild(r)
  setTimeout(() => r.remove(), 580)
}

const INFO = [
  { icon: <MapPin className="w-5 h-5" />, label: "Location", value: "Dome 7, Valles Marineris, Mars" },
  { icon: <Clock className="w-5 h-5" />, label: "Hours", value: "Daily 17:00 – 24:00 Mars Time" },
  { icon: <Phone className="w-5 h-5" />, label: "Comm Line", value: "+SOL-1-800-MARS-EAT" },
]

export function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-40 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(100,30,0,0.07) 0%, transparent 70%)" }} />

      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <p className="text-[10px] tracking-[0.6em] uppercase font-body" style={{ color: "rgba(200,160,40,0.45)" }}>
            — Secure Your Seat Among the Stars —
          </p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter font-heading" style={{ color: "#F0E1B4" }}>
            RESERVE <span className="text-gold-shimmer">YOUR TABLE</span>
          </h2>
          <div className="w-24 h-px mx-auto" style={{ background: "linear-gradient(90deg,transparent,rgba(200,160,40,0.6),transparent)" }} />
          <p className="text-base font-body max-w-xl mx-auto leading-relaxed" style={{ color: "#C8A96E" }}>
            Interstellar dining awaits. Reserve your private dome table — complimentary welcome drink included.
          </p>
        </motion.div>

        {/* Content grid */}
        <div className="grid md:grid-cols-2 gap-10 items-stretch">
          {/* Left — info + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {/* Info cards */}
            {INFO.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] group"
                style={{
                  background: "rgba(12,9,1,0.65)",
                  border: "1px solid rgba(200,160,40,0.15)",
                  backdropFilter: "blur(12px)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(200,160,40,0.38)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(200,160,40,0.07)" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(200,160,40,0.15)"; e.currentTarget.style.boxShadow = "none" }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(200,160,40,0.1)", color: "#FFD700", border: "1px solid rgba(200,160,40,0.25)" }}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase font-body mb-1" style={{ color: "rgba(200,160,40,0.5)" }}>{item.label}</p>
                  <p className="text-base font-body font-semibold" style={{ color: "#D4B870" }}>{item.value}</p>
                </div>
              </div>
            ))}

            {/* What's Included */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(12,9,1,0.65)", border: "1px solid rgba(200,160,40,0.15)", backdropFilter: "blur(12px)" }}
            >
              <p className="text-[10px] tracking-[0.45em] uppercase font-body mb-4" style={{ color: "rgba(200,160,40,0.55)" }}>Every Reservation Includes</p>
              {[
                "🥂  Complimentary welcome drink",
                "💎  Priority dome seating",
                "📡  Digital boarding pass",
                "🌌  Telescope view of Phobos",
                "🎵  Live Martian jazz ensemble",
              ].map((feat) => (
                <p key={feat} className="text-sm font-body py-1.5" style={{ color: "#B89050", borderBottom: "1px solid rgba(200,160,40,0.07)" }}>
                  {feat}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Right — CTA card with the same card-flip modal */}
          <motion.div
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex flex-col"
          >
            <div
              className="flex-1 rounded-3xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group"
              style={{
                background: "linear-gradient(145deg, rgba(22,17,3,0.95) 0%, rgba(10,7,1,0.98) 100%)",
                border: "1px solid rgba(200,160,40,0.28)",
                boxShadow: "0 0 60px rgba(200,160,40,0.06)",
              }}
            >
              {/* Top gold shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,#FFD700,rgba(255,250,200,1),#FFD700,transparent)" }} />

              {/* Animated gold glow bg */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(200,160,40,0.07) 0%, transparent 65%)" }} />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl mb-6"
              >
                🚀
              </motion.div>

              <p className="text-[10px] tracking-[0.55em] uppercase font-body mb-3" style={{ color: "rgba(200,160,40,0.5)" }}>
                One click to Mars
              </p>
              <h3 className="text-3xl md:text-4xl font-black font-heading mb-3" style={{ color: "#FFD700" }}>
                Book Your<br />Mission
              </h3>
              <p className="text-sm font-body mb-8 max-w-xs leading-relaxed" style={{ color: "#A07838" }}>
                Fill in a 2-step form and your Martian table is confirmed instantly. No deposit required.
              </p>

              {/* The big CTA — triggers the same card-flip modal */}
              <ReservationModal>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={(e) => addRipple(e as any, "rgba(255,215,0,0.35)")}
                  className="relative px-12 py-5 rounded-full font-black font-heading text-base tracking-widest overflow-hidden group/btn w-full max-w-xs"
                  style={{
                    background: "linear-gradient(135deg,#b8860b,#FFD700,#b8860b)",
                    backgroundSize: "200% auto",
                    animation: "gold-shimmer 3s linear infinite",
                    color: "#0a0800",
                    boxShadow: "0 0 40px rgba(200,160,40,0.4), 0 8px 30px rgba(200,160,40,0.25)",
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Rocket className="w-5 h-5" />
                    RESERVE YOUR TABLE
                  </span>
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity" style={{ background: "rgba(255,255,255,0.12)" }} />
                </motion.button>
              </ReservationModal>

              <p className="text-[10px] font-body mt-5" style={{ color: "rgba(200,160,40,0.28)" }}>
                Free cancellation up to 48 hours before · No deposit needed
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}