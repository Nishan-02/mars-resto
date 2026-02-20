"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Star, Quote } from "lucide-react"

const reviews = [
    {
        name: "Dr. Aris Thorne",
        role: "Astrobiologist, NASA-M",
        content:
            "The Martian Fusion Burger is a biological masterpiece. The hydroponic tomatoes carry a subtle cosmic sweetness unlike anything grown on Earth. I have dined at three-Michelin-starred establishments — Mars Bites transcends them all.",
        rating: 5,
        avatar: "👨‍🚀",
        origin: "Earth, USA",
    },
    {
        name: "Captain Elara Vance",
        role: "Commander, Hermes-7 Shuttle",
        content:
            "Best zero-gravity smoothie in the quadrant — it actually stays in the glass! A mandatory pilgrimage for every long-haul crew. The view of Olympus Mons at sunset through the observation dome is absolutely unrivalled.",
        rating: 5,
        avatar: "👩‍🚀",
        origin: "Europa Colony",
    },
    {
        name: "Zorgon the Traveler",
        role: "Interstellar Tourist",
        content:
            "Human cuisine is surprisingly edible when served with such spectacular theatrical ambiance. The Meteor Steak was particularly tender. The Eclipse Dessert sphere exceeded my dimensional expectations considerably.",
        rating: 4,
        avatar: "👽",
        origin: "Proxima System, Alpha Centauri",
    },
]

export function ReviewsSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
    const bgX = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"])
    const bgXR = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"])

    return (
        <motion.section id="reviews" ref={sectionRef} className="py-24 md:py-40 relative overflow-hidden">
            {/* Parallax ambient */}
            <motion.div className="absolute -left-32 top-1/3 w-80 h-80 rounded-full pointer-events-none -z-10" style={{ x: bgX, background: "radial-gradient(circle, rgba(200,160,40,0.05) 0%, transparent 70%)" }} />
            <motion.div className="absolute -right-20 bottom-1/4 w-72 h-72 rounded-full pointer-events-none -z-10" style={{ x: bgXR, background: "radial-gradient(circle, rgba(200,150,30,0.04) 0%, transparent 70%)" }} />

            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 space-y-4"
                >
                    <p className="text-[10px] tracking-[0.6em] uppercase font-body" style={{ color: "rgba(200,160,40,0.45)" }}>
                        — Transmission Log —
                    </p>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter font-heading" style={{ color: "rgba(240,225,180,0.95)" }}>
                        Traveler <span className="text-gold-shimmer">Logs</span>
                    </h2>
                    <div className="w-24 h-px mx-auto" style={{ background: "linear-gradient(90deg, transparent, rgba(200,160,40,0.6), transparent)" }} />
                    <p className="text-sm font-body max-w-md mx-auto" style={{ color: "rgba(200,160,40,0.4)" }}>
                        Authenticated transmissions received from across the solar system.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {reviews.map((r, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 60, rotateX: 10 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="relative group rounded-2xl overflow-hidden"
                            style={{
                                background: "linear-gradient(150deg, rgba(14,11,2,0.92) 0%, rgba(8,6,1,0.97) 100%)",
                                border: "1px solid rgba(200,160,40,0.12)",
                                backdropFilter: "blur(20px)",
                            }}
                        >
                            {/* Gold top bar */}
                            <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, rgba(200,160,40,0.4), rgba(255,215,0,0.7), rgba(200,160,40,0.4))" }} />

                            <div className="p-7">
                                <Quote className="absolute top-7 right-7 w-9 h-9 opacity-[0.05] group-hover:opacity-[0.09] transition-opacity" style={{ color: "#ffd700" }} />

                                {/* Stars */}
                                <div className="flex gap-1 mb-5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5" style={i < r.rating ? { color: "#ffd700", fill: "#ffd700" } : { color: "rgba(200,160,40,0.12)", fill: "rgba(200,160,40,0.12)" }} />
                                    ))}
                                </div>

                                <p className="text-sm leading-relaxed mb-7 font-body italic group-hover:opacity-90 transition-opacity" style={{ color: "rgba(220,200,160,0.65)" }}>
                                    "{r.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3" style={{ borderTop: "1px solid rgba(200,160,40,0.1)", paddingTop: "1.2rem" }}>
                                    <div className="text-2xl w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(200,160,40,0.08)", border: "1px solid rgba(200,160,40,0.18)" }}>
                                        {r.avatar}
                                    </div>
                                    <div>
                                        <p className="font-black font-heading text-sm" style={{ color: "#ffd700" }}>{r.name}</p>
                                        <p className="text-[10px] uppercase tracking-widest font-body mt-0.5" style={{ color: "rgba(200,160,40,0.4)" }}>{r.role}</p>
                                        <p className="text-[10px] font-body" style={{ color: "rgba(200,160,40,0.3)" }}>📍 {r.origin}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Hover ambient glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(200,160,40,0.06) 0%, transparent 60%)" }} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}
