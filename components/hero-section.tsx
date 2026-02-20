"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ReservationModal } from "./reservation-modal"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  const scrollToMenu = () =>
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })

  return (
    <motion.section
      id="home"
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-24"
      style={{ y: heroY, opacity: heroOpacity }}
    >
      {/* Central gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 60%, rgba(200,160,40,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Main hero content — fades in directly, no second intro sequence */}
      <motion.div
        className="text-center px-4 space-y-6 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Breadcrumb line */}
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.15, duration: 0.9 }}
        >
          <span
            className="h-px w-16"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(200,160,40,0.5))",
            }}
          />
          <span
            className="text-[10px] tracking-[0.55em] uppercase font-body"
            style={{ color: "rgba(200,160,40,0.6)" }}
          >
            Est. 2095 · Valles Marineris · Mars
          </span>
          <span
            className="h-px w-16"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(200,160,40,0.5))",
            }}
          />
        </motion.div>

        {/* MARS — huge gold shimmer letters */}
        <div>
          <div className="flex justify-center overflow-hidden leading-none">
            {"MARS".split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block font-heading font-black"
                style={{
                  fontSize: "clamp(5.5rem, 20vw, 15rem)",
                  lineHeight: 0.9,
                  background:
                    "linear-gradient(135deg, #b8860b 0%, #ffd700 35%, #fffacd 52%, #ffd700 70%, #b8860b 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "gold-shimmer 4s linear infinite",
                  animationDelay: `${i * 0.3}s`,
                }}
                initial={{ opacity: 0, y: 60, rotateX: -35 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.1 + i * 0.08,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Gold separator */}
          <motion.div
            className="mx-auto my-1"
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(200,160,40,0.7), rgba(255,250,200,0.9), rgba(200,160,40,0.7), transparent)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.45, duration: 1, ease: "easeOut" }}
          />

          {/* BITES */}
          <motion.div
            className="font-heading font-black tracking-[0.25em] text-white"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              textShadow: "0 0 30px rgba(255,255,255,0.15)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
          >
            BITES
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.p
          className="text-sm md:text-lg tracking-[0.4em] uppercase font-body"
          style={{ color: "rgba(200,160,40,0.6)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Taste&nbsp;Beyond&nbsp;Earth
        </motion.p>

        <motion.p
          className="text-sm md:text-base max-w-xl mx-auto leading-relaxed font-body"
          style={{ color: "rgba(240,230,200,0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.8 }}
        >
          The first fine-dining restaurant beyond Earth — where cosmic cuisine
          meets the golden sands of Mars.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          <ReservationModal>
            <button
              className="relative px-10 py-4 rounded-full font-black tracking-widest font-heading text-sm overflow-hidden group transition-all hover:scale-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, #b8860b, #ffd700, #b8860b)",
                backgroundSize: "200% auto",
                animation: "gold-shimmer 3s linear infinite",
                color: "#0a0800",
                boxShadow:
                  "0 0 30px rgba(200,160,40,0.35), 0 4px 20px rgba(200,160,40,0.2)",
              }}
            >
              RESERVE YOUR TABLE
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/15 rounded-full" />
            </button>
          </ReservationModal>

          <button
            onClick={scrollToMenu}
            className="relative px-10 py-4 rounded-full font-black tracking-widest font-heading text-sm transition-all hover:scale-105 active:scale-95"
            style={{
              border: "1px solid rgba(200,160,40,0.45)",
              color: "rgba(200,160,40,0.9)",
              boxShadow: "0 0 20px rgba(200,160,40,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(200,160,40,0.08)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
            }}
          >
            EXPLORE MENU
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex justify-center gap-10 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[
            { label: "Guests Served", value: "2,500+" },
            { label: "Unique Dishes", value: "150+" },
            { label: "Galactic Rating", value: "★ 5.0" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-xl md:text-2xl font-black font-heading"
                style={{ color: "#ffd700" }}
              >
                {s.value}
              </p>
              <p
                className="text-[9px] tracking-widest uppercase font-body"
                style={{ color: "rgba(200,160,40,0.45)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer flex flex-col items-center gap-2"
        onClick={scrollToMenu}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] } as any}
        transition={{
          opacity: { delay: 1.5, duration: 0.8 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
        }}
      >
        <span
          className="text-[9px] tracking-[0.5em] uppercase font-body"
          style={{ color: "rgba(200,160,40,0.35)" }}
        >
          Descend
        </span>
        <div
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1px solid rgba(200,160,40,0.3)" }}
        >
          <motion.div
            className="w-1 h-1.5 rounded-full"
            style={{ background: "#ffd700" }}
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.section>
  )
}
