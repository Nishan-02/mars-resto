"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const timelineItems = [
  { year: "2087", title: "Discovery", desc: "Humanity sets foot on Mars. The volcanic soil reveals unprecedented agricultural potential.", icon: "🔭" },
  { year: "2089", title: "Foundation", desc: "First pressurized colony dome erected in Valles Marineris. 300 pioneers call it home.", icon: "🏗️" },
  { year: "2092", title: "Innovation", desc: "Chef Aiko Tanaka develops zero-gravity cooking techniques. Mars Bites concept is born.", icon: "🧑‍🍳" },
  { year: "2095", title: "Launch", desc: "Mars Bites opens the solar system's first off-world fine-dining restaurant.", icon: "🚀" },
]

const stats = [
  { label: "Guests Served", value: "2,500+" },
  { label: "Dishes Created", value: "150+" },
  { label: "Years Operating", value: "3" },
  { label: "Galactic Rating", value: "5★" },
]

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

  return (
    <motion.section id="about" ref={sectionRef} className="py-24 md:py-40 relative overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute bottom-0 left-0 right-0 h-[40%]" style={{ background: "linear-gradient(to top, rgba(60,38,5,0.06) 0%, transparent 100%)" }} />
      </motion.div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-[10px] tracking-[0.6em] uppercase font-body mb-4" style={{ color: "rgba(200,160,40,0.45)" }}>
              — Mission Briefing —
            </p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter font-heading" style={{ color: "rgba(240,225,180,0.95)" }}>
              ABOUT <span className="text-gold-shimmer">MARS BITES</span>
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" style={{ background: "linear-gradient(90deg, transparent, rgba(200,160,40,0.6), transparent)" }} />
          </motion.div>
        </div>

        {/* Story + Stats */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: "easeOut" }} className="space-y-6">
            <p className="text-lg leading-loose font-body" style={{ color: "rgba(220,200,160,0.65)" }}>
              Mars Bites stands as a testament to human innovation and the boundless possibilities of interplanetary cuisine. Founded in the heart of{" "}
              <span className="font-bold" style={{ color: "#ffd700" }}>Valles Marineris</span>, our establishment bridges Earth's culinary traditions with Martian futurism.
            </p>
            <p className="text-lg leading-loose font-body" style={{ color: "rgba(220,200,160,0.65)" }}>
              Every dish is crafted using hydroponic ingredients grown in our{" "}
              <span className="font-bold" style={{ color: "rgba(200,160,40,0.9)" }}>zero-gravity gardens</span>, combined with imported delicacies from Earth. Our chefs pioneer a new culinary frontier.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-px w-8" style={{ background: "rgba(200,160,40,0.4)" }} />
              <p className="text-xs tracking-widest uppercase font-body" style={{ color: "rgba(200,160,40,0.35)" }}>Certified by the Martian Culinary Authority, 2095</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: "easeOut" }} className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.06, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="rounded-2xl p-6 text-center relative overflow-hidden group cursor-default"
                style={{ background: "rgba(12,10,2,0.65)", border: "1px solid rgba(200,160,40,0.15)", backdropFilter: "blur(12px)" }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(ellipse at center, rgba(200,160,40,0.1) 0%, transparent 70%)" }} />
                <p className="text-4xl font-black font-heading mb-1" style={{ color: "#ffd700", textShadow: "0 0 20px rgba(200,160,40,0.4)" }}>{s.value}</p>
                <p className="text-xs tracking-widest uppercase font-body" style={{ color: "rgba(200,160,40,0.45)" }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Timeline */}
        <div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
            <h3 className="text-3xl md:text-4xl font-black font-heading" style={{ color: "rgba(240,225,180,0.9)" }}>
              The <span className="text-gold-shimmer">Journey</span> to Mars
            </h3>
            <p className="text-sm font-body mt-2" style={{ color: "rgba(200,160,40,0.35)" }}>A brief history of the impossible</p>
          </motion.div>

          <div className="relative">
            <motion.div
              className="absolute top-8 left-0 right-0 h-px hidden md:block"
              style={{ background: "linear-gradient(90deg, transparent, rgba(200,160,40,0.35), rgba(255,215,0,0.5), rgba(200,160,40,0.35), transparent)" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />

            <div className="grid md:grid-cols-4 gap-6">
              {timelineItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="relative group"
                >
                  {/* Node */}
                  <div className="flex justify-center mb-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl relative z-10"
                      style={{
                        background: "rgba(14,11,2,0.95)",
                        border: "1px solid rgba(200,160,40,0.35)",
                        boxShadow: "0 0 20px rgba(200,160,40,0.12), inset 0 0 15px rgba(200,160,40,0.04)",
                      }}
                    >
                      {item.icon}
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-6 h-full transition-all duration-300"
                    style={{ background: "rgba(12,10,2,0.75)", border: "1px solid rgba(200,160,40,0.1)", backdropFilter: "blur(16px)" }}
                  >
                    <p className="text-3xl font-black font-heading mb-1" style={{ color: "#ffd700", textShadow: "0 0 16px rgba(200,160,40,0.4)" }}>{item.year}</p>
                    <p className="font-bold font-heading mb-2 tracking-wide" style={{ color: "rgba(200,160,40,0.7)" }}>{item.title}</p>
                    <p className="text-sm leading-relaxed font-body" style={{ color: "rgba(200,160,40,0.4)" }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
