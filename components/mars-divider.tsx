"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

/**
 * Cinematic Mars terrain SVG divider between sections.
 */
export function MarsDivider() {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
    const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])

    return (
        <div ref={ref} className="relative h-[35vh] overflow-hidden pointer-events-none select-none" aria-hidden>
            {/* Sky gradient */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(60,40,5,0.08) 60%, rgba(80,50,8,0.15) 100%)" }} />

            {/* Parallax terrain */}
            <motion.div className="absolute bottom-0 left-0 right-0" style={{ y }}>
                <svg viewBox="0 0 1440 180" preserveAspectRatio="none" className="w-full h-[180px]">
                    {/* Far hills */}
                    <path
                        d="M0,165 Q100,110 200,140 Q320,80 450,125 Q580,70 720,115 Q850,65 980,105 Q1110,55 1240,100 Q1360,75 1440,115 L1440,180 L0,180 Z"
                        fill="rgba(50,30,5,0.3)"
                    />
                    {/* Mid hills */}
                    <path
                        d="M0,175 Q120,145 240,160 Q380,120 520,150 Q660,115 800,148 Q940,112 1080,142 Q1220,115 1440,145 L1440,180 L0,180 Z"
                        fill="rgba(70,42,6,0.4)"
                    />
                    {/* Gold-tinted craters */}
                    <ellipse cx="280" cy="177" rx="38" ry="5" fill="rgba(30,18,3,0.35)" />
                    <ellipse cx="750" cy="178" rx="26" ry="4" fill="rgba(30,18,3,0.3)" />
                    <ellipse cx="1080" cy="176" rx="33" ry="4" fill="rgba(30,18,3,0.3)" />
                </svg>
            </motion.div>

            {/* Gold dust particles */}
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: `${1.5 + (i % 3)}px`, height: `${1.5 + (i % 3)}px`,
                        background: `rgba(200, ${140 + i * 6}, ${30 + i * 3}, 0.35)`,
                        left: `${(i / 10) * 100}%`,
                        bottom: `${15 + (i % 5) * 12}%`,
                    }}
                    animate={{ x: [0, (i % 2 === 0 ? 18 : -18), 0], y: [0, -8, 0], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
                />
            ))}

            {/* Center story annotation */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
            >
                <div className="text-center space-y-2">
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-px w-40 mx-auto"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(200,160,40,0.5), transparent)" }}
                    />
                    <p className="text-[9px] tracking-[0.6em] uppercase font-body" style={{ color: "rgba(200,160,40,0.35)" }}>
                        Martian Surface · 75.9 million km from Earth
                    </p>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-px w-40 mx-auto"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(200,160,40,0.3), transparent)" }}
                    />
                </div>
            </motion.div>
        </div>
    )
}
