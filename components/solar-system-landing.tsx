"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ─────────────────────────────────────────────────────────────
//  SOLAR SYSTEM LANDING PAGE
//  Cinematic welcome screen with a live canvas solar system
//  Phases: "orbiting" → "zooming" → "welcome" → "done"
// ─────────────────────────────────────────────────────────────

interface SolarSystemLandingProps {
    onEnter: () => void
}

// Planet definitions
const PLANETS = [
    { name: "Mercury", distance: 0.12, size: 4, speed: 4.1, color: "#b5b5b5", shadowColor: "#888" },
    { name: "Venus", distance: 0.19, size: 7, speed: 1.6, color: "#e8cda0", shadowColor: "#c4a86a" },
    {
        name: "Earth", distance: 0.27, size: 8, speed: 1.0, color: "#4a9eff", shadowColor: "#2255aa",
        hasRing: false, ringColor: null, label: "You Are Here"
    },
    {
        name: "Mars", distance: 0.36, size: 6, speed: 0.53, color: "#d94f2b", shadowColor: "#8a2000",
        isTarget: true, label: "Destination"
    },
    {
        name: "Jupiter", distance: 0.52, size: 20, speed: 0.084, color: "#c8a96e", shadowColor: "#7a5820",
        bands: ["#c8a96e", "#b0845a", "#daba84", "#aa7848", "#d0a870"]
    },
    {
        name: "Saturn", distance: 0.66, size: 15, speed: 0.034, color: "#e4d09a", shadowColor: "#9a8050",
        hasRing: true, ringColor: "rgba(200,170,80,0.5)"
    },
    { name: "Uranus", distance: 0.79, size: 11, speed: 0.012, color: "#7de8e8", shadowColor: "#3aacac" },
    { name: "Neptune", distance: 0.92, size: 10, speed: 0.006, color: "#3a7ef5", shadowColor: "#1a40a0" },
]

export function SolarSystemLanding({ onEnter }: SolarSystemLandingProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [phase, setPhase] = useState<"orbiting" | "zooming" | "welcome" | "done">("orbiting")
    const [showWelcome, setShowWelcome] = useState(false)
    const [showSkip, setShowSkip] = useState(false)
    const animRef = useRef<number>(0)
    const phaseRef = useRef<"orbiting" | "zooming" | "welcome" | "done">("orbiting")
    const zoomRef = useRef(0) // 0→1 during zoom

    // Update phaseRef on phase changes
    useEffect(() => { phaseRef.current = phase }, [phase])

    // Show skip after 1.5s
    useEffect(() => { setTimeout(() => setShowSkip(true), 1500) }, [])

    // Phase timeline: 3.5s orbiting → 2.5s zoom → welcome
    useEffect(() => {
        const t1 = setTimeout(() => setPhase("zooming"), 3500)
        const t2 = setTimeout(() => { setPhase("welcome"); setShowWelcome(true) }, 6200)
        return () => { [t1, t2].forEach(clearTimeout) }
    }, [])

    // ── Canvas Engine ──
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener("resize", resize)

        // Star field — 3 layers (parallax depth)
        interface Star { x: number; y: number; r: number; brightness: number; twinkleOffset: number; layer: number }
        const stars: Star[] = Array.from({ length: 700 }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.5 + 0.2,
            brightness: 0.4 + Math.random() * 0.6,
            twinkleOffset: Math.random() * Math.PI * 2,
            layer: Math.floor(Math.random() * 3), // 0=far, 1=mid, 2=near
        }))

        // Angle trackers for each planet
        const angles = PLANETS.map((p, i) => (i * 0.78) + Math.PI * 0.3)

        let frame = 0
        const BASE_SPEED = 0.0025

        const draw = () => {
            frame++
            const W = canvas.width
            const H = canvas.height
            const cx = W / 2
            const cy = H / 2
            const minDim = Math.min(W, H)
            const p = phaseRef.current
            const zoom = zoomRef.current

            // ── Background ──
            ctx.clearRect(0, 0, W, H)
            const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.9)
            bgGrad.addColorStop(0, "#070412")
            bgGrad.addColorStop(0.5, "#04030c")
            bgGrad.addColorStop(1, "#02020a")
            ctx.fillStyle = bgGrad
            ctx.fillRect(0, 0, W, H)

            // ── Stars ──
            const twinkle = (s: Star) => s.brightness * (0.7 + 0.3 * Math.sin(frame * 0.03 + s.twinkleOffset))
            stars.forEach(s => {
                const layerParallax = p === "zooming" ? zoom * [0.01, 0.04, 0.09][s.layer] : 0
                const sx = ((s.x + layerParallax) % 1) * W
                const sy = s.y * H
                const br = twinkle(s)
                ctx.beginPath()
                ctx.fillStyle = `rgba(220,210,255,${br})`
                ctx.arc(sx, sy, s.r, 0, Math.PI * 2)
                ctx.fill()
            })

            // ── Nebula clouds ──
            const nebulas = [
                { rx: 0.15, ry: 0.25, size: 0.28, r: 45, g: 20, b: 90 },
                { rx: 0.82, ry: 0.65, size: 0.25, r: 80, g: 35, b: 10 },
                { rx: 0.55, ry: 0.8, size: 0.18, r: 10, g: 30, b: 80 },
                { rx: 0.35, ry: 0.1, size: 0.22, r: 60, g: 15, b: 60 },
            ]
            nebulas.forEach(n => {
                const nx = n.rx * W
                const ny = n.ry * H
                const nr = n.size * minDim
                const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr)
                ng.addColorStop(0, `rgba(${n.r},${n.g},${n.b},0.12)`)
                ng.addColorStop(1, `rgba(${n.r},${n.g},${n.b},0)`)
                ctx.fillStyle = ng
                ctx.beginPath()
                ctx.arc(nx, ny, nr, 0, Math.PI * 2)
                ctx.fill()
            })

            // ── Sun ──
            const zoomScale = p === "zooming" ? 1 + zoom * 2.5 : 1
            const zoomOffsetY = p === "zooming" ? zoom * H * 0.55 : 0

            const sunR = minDim * 0.055 * zoomScale
            const sunX = cx
            const sunY = cy + zoomOffsetY

                // Corona layers
                ;[3.5, 2.5, 1.8, 1.3].forEach((mult, i) => {
                    const coronaR = sunR * mult
                    const cg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, coronaR)
                    const pulseAmp = 0.12 * Math.sin(frame * 0.02 + i)
                    cg.addColorStop(0, `rgba(255,200,60,${0.18 - i * 0.04 + pulseAmp})`)
                    cg.addColorStop(1, "rgba(255,100,0,0)")
                    ctx.fillStyle = cg
                    ctx.beginPath()
                    ctx.arc(sunX, sunY, coronaR, 0, Math.PI * 2)
                    ctx.fill()
                })

            // Sun surface
            const sunGrad = ctx.createRadialGradient(
                sunX - sunR * 0.28, sunY - sunR * 0.28, 0,
                sunX, sunY, sunR
            )
            sunGrad.addColorStop(0, "#fffde0")
            sunGrad.addColorStop(0.3, "#ffe878")
            sunGrad.addColorStop(0.65, "#ffa020")
            sunGrad.addColorStop(1, "#ff6800")
            ctx.beginPath()
            ctx.fillStyle = sunGrad
            ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2)
            ctx.fill()

            // Solar flares
            for (let fi = 0; fi < 6; fi++) {
                const flareAngle = (fi / 6) * Math.PI * 2 + frame * 0.008
                const flareLen = sunR * (0.3 + 0.25 * Math.sin(frame * 0.04 + fi * 1.1))
                const fx = sunX + Math.cos(flareAngle) * (sunR + flareLen)
                const fy = sunY + Math.sin(flareAngle) * (sunR + flareLen)
                const flareGrad = ctx.createRadialGradient(
                    sunX + Math.cos(flareAngle) * sunR,
                    sunY + Math.sin(flareAngle) * sunR,
                    0, fx, fy, flareLen * 0.7
                )
                flareGrad.addColorStop(0, "rgba(255,180,30,0.55)")
                flareGrad.addColorStop(1, "rgba(255,80,0,0)")
                ctx.fillStyle = flareGrad
                ctx.beginPath()
                ctx.arc(fx, fy, flareLen * 0.7, 0, Math.PI * 2)
                ctx.fill()
            }

            // ── Planets & Orbits ──
            const maxOrbitR = minDim * 0.48

            PLANETS.forEach((planet, i) => {
                // Update angle
                angles[i] += BASE_SPEED * planet.speed * (p === "zooming" ? 0.2 : 1)

                const orbitR = planet.distance * maxOrbitR * (p === "zooming" ? (1 + zoom * 1.2) : 1)
                const px = sunX + Math.cos(angles[i]) * orbitR
                const py = sunY + zoomOffsetY + Math.sin(angles[i]) * orbitR * 0.38 // elliptical

                const pSize = planet.size * (minDim / 800) * (p === "zooming" ? (1 + zoom * 0.8) : 1)

                // ── Orbit ring ──
                const orbitOpacity = p === "zooming" ? Math.max(0, 0.12 - zoom * 0.12) : 0.12
                if (orbitOpacity > 0) {
                    ctx.beginPath()
                    ctx.ellipse(sunX, sunY + zoomOffsetY, orbitR, orbitR * 0.38, 0, 0, Math.PI * 2)
                    ctx.strokeStyle = `rgba(200,180,120,${orbitOpacity})`
                    ctx.lineWidth = 0.5
                    ctx.setLineDash([4, 8])
                    ctx.stroke()
                    ctx.setLineDash([])
                }

                // ── Saturn's ring behind planet ──
                if ((planet as any).hasRing) {
                    ctx.save()
                    ctx.translate(px, py)
                    ctx.scale(1, 0.35)
                    ctx.beginPath()
                    ctx.ellipse(0, 0, pSize * 2.6, pSize * 2.6, 0, 0, Math.PI * 2)
                    ctx.strokeStyle = `rgba(200,170,80,0.45)`
                    ctx.lineWidth = pSize * 0.55
                    ctx.stroke()
                    ctx.restore()
                }

                // ── Planet body ──
                const pGrad = ctx.createRadialGradient(
                    px - pSize * 0.3, py - pSize * 0.3, 0,
                    px, py, pSize
                )

                if (planet.name === "Jupiter" && (planet as any).bands) {
                    // Jupiter — banded gradient
                    pGrad.addColorStop(0, "#ddc890")
                    pGrad.addColorStop(0.3, "#c8a96e")
                    pGrad.addColorStop(0.55, "#b08448")
                    pGrad.addColorStop(0.75, "#daba84")
                    pGrad.addColorStop(1, "#7a5820")
                } else {
                    pGrad.addColorStop(0, lighten(planet.color, 0.4))
                    pGrad.addColorStop(0.45, planet.color)
                    pGrad.addColorStop(1, planet.shadowColor)
                }

                ctx.beginPath()
                ctx.fillStyle = pGrad
                ctx.arc(px, py, pSize, 0, Math.PI * 2)
                ctx.fill()

                // Planet atmosphere glow
                const atmGrad = ctx.createRadialGradient(px, py, pSize * 0.7, px, py, pSize * 1.6)
                atmGrad.addColorStop(0, "rgba(0,0,0,0)")
                atmGrad.addColorStop(1, `rgba(0,0,0,0.55)`)
                ctx.beginPath()
                ctx.fillStyle = atmGrad
                ctx.arc(px, py, pSize * 1.6, 0, Math.PI * 2)
                ctx.fill()

                // Highlight specular
                const specGrad = ctx.createRadialGradient(
                    px - pSize * 0.35, py - pSize * 0.35, 0,
                    px - pSize * 0.2, py - pSize * 0.2, pSize * 0.5
                )
                specGrad.addColorStop(0, "rgba(255,255,255,0.25)")
                specGrad.addColorStop(1, "rgba(255,255,255,0)")
                ctx.beginPath()
                ctx.fillStyle = specGrad
                ctx.arc(px, py, pSize, 0, Math.PI * 2)
                ctx.fill()

                // ── Earth ring glow for target Mars ──
                if (planet.isTarget && p !== "zooming") {
                    const ringPulse = 0.5 + 0.5 * Math.sin(frame * 0.06)
                    ctx.beginPath()
                    ctx.arc(px, py, pSize * 2.2, 0, Math.PI * 2)
                    ctx.strokeStyle = `rgba(220,80,40,${0.2 * ringPulse})`
                    ctx.lineWidth = 2
                    ctx.stroke()
                    ctx.beginPath()
                    ctx.arc(px, py, pSize * 3.2, 0, Math.PI * 2)
                    ctx.strokeStyle = `rgba(220,80,40,${0.08 * ringPulse})`
                    ctx.lineWidth = 1.5
                    ctx.stroke()
                }

                // ── Planet label (orbiting phase only) ──
                if (p === "orbiting" && pSize > 3) {
                    ctx.font = `${Math.max(9, pSize * 1.1)}px 'serif'`
                    ctx.fillStyle = planet.isTarget ? "rgba(255,150,80,0.95)" : "rgba(200,190,160,0.6)"
                    ctx.textAlign = "center"
                    ctx.fillText(planet.name, px, py - pSize - 6)
                    if ((planet as any).label) {
                        ctx.font = `${Math.max(7, pSize * 0.8)}px 'serif'`
                        ctx.fillStyle = planet.isTarget ? "rgba(255,200,120,0.8)" : "rgba(150,200,255,0.6)"
                        ctx.fillText((planet as any).label, px, py - pSize - 18)
                    }
                }
            })

            // ── Zoom vignette ──
            if (p === "zooming") {
                const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.7)
                vg.addColorStop(0, "rgba(0,0,0,0)")
                vg.addColorStop(0.6, "rgba(0,0,0,0)")
                vg.addColorStop(1, `rgba(4,3,12,${zoom * 0.85})`)
                ctx.fillStyle = vg
                ctx.fillRect(0, 0, W, H)

                // Center-pull warp streaks
                if (zoom > 0.3) {
                    for (let si = 0; si < 40; si++) {
                        const streakAngle = (si / 40) * Math.PI * 2
                        const streakLen = zoom * 0.2 * minDim
                        const streakAlpha = zoom * 0.5 * (0.3 + 0.7 * Math.random())
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(255,215,100,${streakAlpha})`
                        ctx.lineWidth = 0.7
                        ctx.moveTo(cx + Math.cos(streakAngle) * streakLen * 0.4, cy + Math.sin(streakAngle) * streakLen * 0.4)
                        ctx.lineTo(cx + Math.cos(streakAngle) * streakLen, cy + Math.sin(streakAngle) * streakLen)
                        ctx.stroke()
                    }
                }
            }

            animRef.current = requestAnimationFrame(draw)
        }

        draw()

        // Zoom animation (2.5s smooth)
        let zoomStart: number | null = null
        const zoomDuration = 2700

        const syncZoom = (ts: number) => {
            if (phaseRef.current !== "zooming") {
                zoomStart = null
                zoomRef.current = 0
                return
            }
            if (!zoomStart) zoomStart = ts
            const elapsed = ts - zoomStart
            zoomRef.current = Math.min(1, elapsed / zoomDuration)
            requestAnimationFrame(syncZoom)
        }

        const zoomObserver = setInterval(() => {
            if (phaseRef.current === "zooming") {
                clearInterval(zoomObserver)
                requestAnimationFrame(syncZoom)
            }
        }, 50)

        return () => {
            cancelAnimationFrame(animRef.current)
            clearInterval(zoomObserver)
            window.removeEventListener("resize", resize)
        }
    }, [])

    const handleEnter = useCallback(() => {
        setPhase("done")
        setTimeout(onEnter, 800)
    }, [onEnter])

    const handleSkip = useCallback(() => {
        setPhase("done")
        setTimeout(onEnter, 600)
    }, [onEnter])

    return (
        <AnimatePresence>
            {phase !== "done" && (
                <motion.div
                    className="fixed inset-0 z-[9999] overflow-hidden"
                    style={{ backgroundColor: "#04030c" }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: "easeInOut" }}
                >
                    {/* Canvas */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full"
                    />

                    {/* ── ORBITING PHASE — Top header ── */}
                    <AnimatePresence>
                        {phase === "orbiting" && (
                            <motion.div
                                className="absolute top-0 left-0 right-0 flex flex-col items-center pt-10 gap-2 pointer-events-none"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.7 }}
                            >
                                <div className="flex items-center gap-3" style={{ color: "rgba(200,160,40,0.45)" }}>
                                    <motion.div
                                        className="w-1.5 h-1.5 rounded-full bg-amber-400"
                                        animate={{ opacity: [1, 0.2, 1] }}
                                        transition={{ duration: 1.1, repeat: Infinity }}
                                    />
                                    <span className="text-[10px] tracking-[0.55em] uppercase font-body">
                                        Solar Navigation System · Active
                                    </span>
                                    <motion.div
                                        className="w-1.5 h-1.5 rounded-full bg-amber-400"
                                        animate={{ opacity: [1, 0.2, 1] }}
                                        transition={{ duration: 1.1, repeat: Infinity, delay: 0.5 }}
                                    />
                                </div>
                                <p className="text-[9px] tracking-[0.5em] uppercase font-body" style={{ color: "rgba(200,160,40,0.25)" }}>
                                    Destination: Mars · Sector IV · Valles Marineris
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── ZOOMING PHASE — Warp notification ── */}
                    <AnimatePresence>
                        {phase === "zooming" && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    className="text-center space-y-3"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: [0.8, 1.05, 1], opacity: [0, 1, 0.8] }}
                                    transition={{ duration: 2.5, times: [0, 0.4, 1] }}
                                >
                                    <div
                                        className="text-5xl md:text-7xl font-black font-heading tracking-widest"
                                        style={{
                                            color: "#FFD700",
                                            textShadow: "0 0 60px rgba(255,150,30,0.8), 0 0 120px rgba(200,80,0,0.4)",
                                        }}
                                    >
                                        APPROACHING
                                    </div>
                                    <div
                                        className="text-xs tracking-[0.8em] uppercase font-body"
                                        style={{ color: "rgba(255,200,100,0.6)" }}
                                    >
                                        Mars · Valles Marineris
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── WELCOME PHASE — Restaurant welcome overlay ── */}
                    <AnimatePresence>
                        {showWelcome && phase === "welcome" && (
                            <motion.div
                                className="absolute inset-0 flex flex-col items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.0 }}
                            >
                                {/* Glassmorphism card */}
                                <motion.div
                                    className="relative flex flex-col items-center gap-6 px-12 py-10 mx-4 max-w-lg w-full text-center"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(10,7,2,0.88) 0%, rgba(6,4,1,0.95) 100%)",
                                        border: "1px solid rgba(200,160,40,0.2)",
                                        borderRadius: "2px",
                                        backdropFilter: "blur(28px)",
                                        boxShadow: "0 0 80px rgba(200,80,20,0.15), 0 0 160px rgba(200,80,20,0.05), inset 0 1px 0 rgba(255,215,0,0.1)",
                                    }}
                                    initial={{ scale: 0.85, opacity: 0, y: 30 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    {/* Corner accents */}
                                    {[["top-0 left-0", "border-t border-l"], ["top-0 right-0", "border-t border-r"],
                                    ["bottom-0 left-0", "border-b border-l"], ["bottom-0 right-0", "border-b border-r"]
                                    ].map(([pos, bdr], i) => (
                                        <motion.div
                                            key={i}
                                            className={`absolute ${pos} w-5 h-5 ${bdr}`}
                                            style={{ borderColor: "rgba(200,160,40,0.5)" }}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                        />
                                    ))}

                                    {/* Est. line */}
                                    <motion.div
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <span className="h-px w-10" style={{ background: "linear-gradient(to right, transparent, rgba(200,160,40,0.5))" }} />
                                        <span className="text-[9px] tracking-[0.65em] uppercase font-body" style={{ color: "rgba(200,160,40,0.5)" }}>
                                            Est. 2095 · Valles Marineris
                                        </span>
                                        <span className="h-px w-10" style={{ background: "linear-gradient(to left, transparent, rgba(200,160,40,0.5))" }} />
                                    </motion.div>

                                    {/* MARS */}
                                    <motion.div
                                        className="leading-none"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <div
                                            className="font-heading font-black"
                                            style={{
                                                fontSize: "clamp(3.5rem, 12vw, 6.5rem)",
                                                lineHeight: 0.9,
                                                background: "linear-gradient(135deg, #b8860b 0%, #ffd700 35%, #fffacd 52%, #ffd700 70%, #b8860b 100%)",
                                                backgroundSize: "200% auto",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text",
                                                animation: "gold-shimmer 4s linear infinite",
                                            }}
                                        >
                                            MARS
                                        </div>
                                        <div
                                            className="h-px w-full my-2"
                                            style={{ background: "linear-gradient(90deg, transparent, rgba(200,160,40,0.7), rgba(255,250,200,0.9), rgba(200,160,40,0.7), transparent)" }}
                                        />
                                        <div
                                            className="font-heading font-black tracking-[0.3em]"
                                            style={{
                                                fontSize: "clamp(1.5rem, 5vw, 3rem)",
                                                color: "rgba(240,230,200,0.9)",
                                                textShadow: "0 0 30px rgba(255,255,255,0.12)",
                                            }}
                                        >
                                            BITES
                                        </div>
                                    </motion.div>

                                    {/* Tagline */}
                                    <motion.p
                                        className="text-[11px] tracking-[0.5em] uppercase font-body"
                                        style={{ color: "rgba(200,160,40,0.55)" }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.9 }}
                                    >
                                        Taste Beyond Earth
                                    </motion.p>

                                    {/* Description */}
                                    <motion.p
                                        className="text-sm leading-relaxed font-body max-w-xs"
                                        style={{ color: "rgba(240,225,190,0.45)" }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.05 }}
                                    >
                                        The first fine-dining experience beyond Earth — interplanetary cuisine crafted in the heart of Mars.
                                    </motion.p>

                                    {/* ENTER button */}
                                    <motion.button
                                        onClick={handleEnter}
                                        className="relative px-12 py-4 overflow-hidden group"
                                        style={{
                                            background: "linear-gradient(135deg, #b8860b, #ffd700, #b8860b)",
                                            backgroundSize: "200% auto",
                                            animation: "gold-shimmer 3s linear infinite",
                                            color: "#0a0800",
                                            fontFamily: "var(--font-heading)",
                                            fontWeight: 900,
                                            fontSize: "0.75rem",
                                            letterSpacing: "0.3em",
                                            textTransform: "uppercase",
                                            borderRadius: "2px",
                                            boxShadow: "0 0 40px rgba(200,160,40,0.4), 0 4px 24px rgba(200,160,40,0.2)",
                                            cursor: "pointer",
                                        }}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        id="solar-landing-enter-btn"
                                    >
                                        Enter the Restaurant
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/15 rounded-sm" />
                                    </motion.button>

                                    {/* Orbit dots decoration */}
                                    <motion.div
                                        className="flex items-center gap-2 mt-1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.5 }}
                                    >
                                        {["Mercury", "Venus", "Earth", "Mars", "Jupiter"].map((name, i) => (
                                            <div key={name} className="flex flex-col items-center gap-1">
                                                <motion.div
                                                    className="rounded-full"
                                                    style={{
                                                        width: [3, 4, 4, 4, 7][i],
                                                        height: [3, 4, 4, 4, 7][i],
                                                        backgroundColor: ["#b5b5b5", "#e8cda0", "#4a9eff", "#d94f2b", "#c8a96e"][i],
                                                        boxShadow: i === 3 ? "0 0 6px rgba(220,80,40,0.6)" : "none",
                                                    }}
                                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                                />
                                            </div>
                                        ))}
                                        <span className="text-[8px] tracking-wider font-body ml-1" style={{ color: "rgba(200,160,40,0.3)" }}>
                                            ·· 4th rock from the Sun
                                        </span>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── SKIP BUTTON ── */}
                    <AnimatePresence>
                        {showSkip && phase !== "done" && phase !== "welcome" && (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                onClick={handleSkip}
                                id="solar-landing-skip-btn"
                                className="absolute top-6 right-6 text-xs font-body tracking-widest uppercase px-5 py-2.5 rounded-full transition-all"
                                style={{
                                    background: "rgba(200,160,40,0.08)",
                                    border: "1px solid rgba(200,160,40,0.22)",
                                    color: "rgba(200,160,40,0.55)",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = "rgba(200,160,40,0.16)"
                                    e.currentTarget.style.color = "#FFD700"
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = "rgba(200,160,40,0.08)"
                                    e.currentTarget.style.color = "rgba(200,160,40,0.55)"
                                }}
                            >
                                Skip Intro
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ── Helpers ──
function lighten(hex: string, amount: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const lr = Math.min(255, Math.round(r + (255 - r) * amount))
    const lg = Math.min(255, Math.round(g + (255 - g) * amount))
    const lb = Math.min(255, Math.round(b + (255 - b) * amount))
    return `rgb(${lr},${lg},${lb})`
}
