"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ─────────────────────────────────────────────────────────────
//  SOLAR SYSTEM LANDING PAGE
//  Phases: "orbiting" → "zooming" → "welcome" → "done"
//
//  KEY FIX: Proper painter's algorithm depth sorting
//  Order: orbit rings → back-half planets → Sun → front-half planets
// ─────────────────────────────────────────────────────────────

interface SolarSystemLandingProps {
    onEnter: () => void
}

// Planet definitions — distance is fraction of maxOrbitR
const PLANETS = [
    { name: "Mercury", distance: 0.13, size: 5, speed: 4.10, color: "#c8c8c8", shadowColor: "#707070" },
    { name: "Venus", distance: 0.21, size: 8, speed: 1.62, color: "#e8d090", shadowColor: "#b89040" },
    {
        name: "Earth", distance: 0.30, size: 9, speed: 1.00, color: "#4a9eff", shadowColor: "#1a4499",
        hasOcean: true, label: "You Are Here"
    },
    {
        name: "Mars", distance: 0.40, size: 7, speed: 0.53, color: "#d94f2b", shadowColor: "#8a2000",
        isTarget: true, label: "DESTINATION"
    },
    {
        name: "Jupiter", distance: 0.55, size: 22, speed: 0.084, color: "#d4b070", shadowColor: "#7a5820",
        isBanded: true
    },
    {
        name: "Saturn", distance: 0.68, size: 16, speed: 0.034, color: "#e8d89a", shadowColor: "#9a8050",
        hasRing: true
    },
    { name: "Uranus", distance: 0.80, size: 12, speed: 0.012, color: "#7de8e8", shadowColor: "#3aacac" },
    { name: "Neptune", distance: 0.92, size: 10, speed: 0.006, color: "#2255e8", shadowColor: "#1030a0" },
]

// Perspective tilt ratio for the orbital ellipses
const TILT = 0.44

export function SolarSystemLanding({ onEnter }: SolarSystemLandingProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [phase, setPhase] = useState<"orbiting" | "zooming" | "welcome" | "done">("orbiting")
    const [showWelcome, setShowWelcome] = useState(false)
    const [showSkip, setShowSkip] = useState(false)
    const animRef = useRef<number>(0)
    const phaseRef = useRef<"orbiting" | "zooming" | "welcome" | "done">("orbiting")
    const zoomRef = useRef(0)

    useEffect(() => { phaseRef.current = phase }, [phase])
    useEffect(() => { setTimeout(() => setShowSkip(true), 1500) }, [])

    // Phase timeline
    useEffect(() => {
        const t1 = setTimeout(() => setPhase("zooming"), 4000)
        const t2 = setTimeout(() => { setPhase("welcome"); setShowWelcome(true) }, 6800)
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

        // Stars
        interface Star { x: number; y: number; r: number; brightness: number; twinkleOff: number }
        const stars: Star[] = Array.from({ length: 800 }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.4 + 0.2,
            brightness: 0.35 + Math.random() * 0.65,
            twinkleOff: Math.random() * Math.PI * 2,
        }))

        // Starting angles spread evenly so planets are visible from frame 1
        const angles = PLANETS.map((_, i) => (i / PLANETS.length) * Math.PI * 2)

        let frame = 0
        const BASE_SPEED = 0.002

        const draw = () => {
            frame++
            const W = canvas.width
            const H = canvas.height
            const cx = W / 2
            const minDim = Math.min(W, H)
            const ph = phaseRef.current
            const zoom = zoomRef.current

            // Sun sits at ~42% from top in orbiting, slides down during zoom
            const baseSunY = H * 0.42
            const zoomOffsetY = ph === "zooming" ? zoom * H * 0.65 : 0
            const sunX = cx
            const sunY = baseSunY + zoomOffsetY

            // Orbit scale expands + sun scale grows during zoom
            const orbitScale = ph === "zooming" ? 1 + zoom * 1.8 : 1
            const maxOrbitR = minDim * 0.47 * orbitScale
            const sunVisualR = minDim * 0.058 * (ph === "zooming" ? 1 + zoom * 3.5 : 1)
            const orbitOpacity = ph === "zooming" ? Math.max(0, 0.20 - zoom * 0.22) : 0.20

            // ── Background ──
            ctx.clearRect(0, 0, W, H)
            const bgG = ctx.createRadialGradient(cx, baseSunY, 0, cx, baseSunY, Math.max(W, H))
            bgG.addColorStop(0, "#0c0820")
            bgG.addColorStop(0.4, "#050310")
            bgG.addColorStop(1, "#020208")
            ctx.fillStyle = bgG
            ctx.fillRect(0, 0, W, H)

            // ── Stars ──
            stars.forEach(s => {
                const br = s.brightness * (0.65 + 0.35 * Math.sin(frame * 0.028 + s.twinkleOff))
                ctx.beginPath()
                ctx.fillStyle = `rgba(210,205,255,${br})`
                ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2)
                ctx.fill()
            })

            // ── Nebula glows ──
            const nebulas = [
                { rx: 0.10, ry: 0.15, size: 0.32, c: "50,20,100" },
                { rx: 0.88, ry: 0.68, size: 0.30, c: "90,40,10" },
                { rx: 0.55, ry: 0.90, size: 0.22, c: "10,25,90" },
                { rx: 0.28, ry: 0.06, size: 0.26, c: "70,10,70" },
            ]
            nebulas.forEach(n => {
                const ng = ctx.createRadialGradient(n.rx * W, n.ry * H, 0, n.rx * W, n.ry * H, n.size * minDim)
                ng.addColorStop(0, `rgba(${n.c},0.13)`)
                ng.addColorStop(1, `rgba(${n.c},0)`)
                ctx.fillStyle = ng
                ctx.beginPath()
                ctx.arc(n.rx * W, n.ry * H, n.size * minDim, 0, Math.PI * 2)
                ctx.fill()
            })

            // ── Advance planet angles ──
            PLANETS.forEach((pl, i) => {
                angles[i] += BASE_SPEED * pl.speed * (ph === "zooming" ? 0.12 : 1)
            })

            // ── Compute all planet screen positions ──
            type PD = {
                pl: typeof PLANETS[number]
                px: number; py: number; pSize: number; angle: number; orbitR: number
            }
            const pds: PD[] = PLANETS.map((pl, i) => {
                const orbitR = pl.distance * maxOrbitR
                const px = sunX + Math.cos(angles[i]) * orbitR
                const py = sunY + Math.sin(angles[i]) * orbitR * TILT
                // Depth-based size: planets at bottom of ellipse (closer) appear ~20% larger
                const depthFactor = 1 + (Math.sin(angles[i]) * 0.18)
                const pSize = pl.size * (minDim / 780) * depthFactor * (ph === "zooming" ? 1 + zoom * 0.5 : 1)
                return { pl, px, py, pSize, angle: angles[i], orbitR }
            })

            // ════════════════════════════════════════════════
            // PAINTER'S ALGORITHM — draw order:
            //   1. All orbit rings
            //   2. Back-half planets  (sin < 0  → upper arc → behind sun)
            //   3. Sun
            //   4. Front-half planets (sin >= 0 → lower arc → in front of sun)
            // ════════════════════════════════════════════════

            // ── 1. Orbit rings ──
            if (orbitOpacity > 0) {
                pds.forEach(({ orbitR }) => {
                    ctx.beginPath()
                    ctx.ellipse(sunX, sunY, orbitR, orbitR * TILT, 0, 0, Math.PI * 2)
                    ctx.strokeStyle = `rgba(180,160,100,${orbitOpacity})`
                    ctx.lineWidth = 0.7
                    ctx.setLineDash([4, 12])
                    ctx.stroke()
                    ctx.setLineDash([])
                })
            }

            // ── 2. Back-half planets (sin < 0) — sort closest orbit first (smallest orbitR drawn first) ──
            const backPlanets = pds.filter(d => Math.sin(d.angle) < 0).sort((a, b) => a.orbitR - b.orbitR)
            backPlanets.forEach(d => renderPlanet(ctx, d.pl, d.px, d.py, d.pSize, d.angle, frame, ph))

            // ── 3. Sun ──
            drawSun(ctx, sunX, sunY, sunVisualR, frame)

            // ── 4. Front-half planets (sin >= 0) — sort by orbitR descending so farther ones go first ──
            const frontPlanets = pds.filter(d => Math.sin(d.angle) >= 0).sort((a, b) => b.orbitR - a.orbitR)
            frontPlanets.forEach(d => renderPlanet(ctx, d.pl, d.px, d.py, d.pSize, d.angle, frame, ph))

            // ── Zoom: dark vignette + warp streaks ──
            if (ph === "zooming") {
                const vg = ctx.createRadialGradient(cx, H / 2, 0, cx, H / 2, Math.max(W, H) * 0.8)
                vg.addColorStop(0, "rgba(0,0,0,0)")
                vg.addColorStop(0.5, "rgba(0,0,0,0)")
                vg.addColorStop(1, `rgba(4,2,14,${zoom * 0.95})`)
                ctx.fillStyle = vg
                ctx.fillRect(0, 0, W, H)

                if (zoom > 0.2) {
                    for (let si = 0; si < 70; si++) {
                        const ang = (si / 70) * Math.PI * 2
                        const inner = minDim * 0.10 + zoom * minDim * 0.10
                        const outer = inner + zoom * minDim * 0.30 * (0.3 + 0.7 * ((si * 41) % 97) / 97)
                        const alpha = zoom * 0.40 * (0.15 + 0.85 * ((si * 67 % 100) / 100))
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(255,220,130,${alpha})`
                        ctx.lineWidth = 0.5 + zoom * 0.5
                        ctx.moveTo(sunX + Math.cos(ang) * inner, sunY + Math.sin(ang) * inner)
                        ctx.lineTo(sunX + Math.cos(ang) * outer, sunY + Math.sin(ang) * outer)
                        ctx.stroke()
                    }
                }
            }

            animRef.current = requestAnimationFrame(draw)
        }

        draw()

        // Zoom ramp
        let zStart: number | null = null
        const ZOOM_DUR = 2800
        const syncZoom = (ts: number) => {
            if (phaseRef.current !== "zooming") { zStart = null; zoomRef.current = 0; return }
            if (!zStart) zStart = ts
            zoomRef.current = Math.min(1, (ts - zStart) / ZOOM_DUR)
            requestAnimationFrame(syncZoom)
        }
        const zoomInterval = setInterval(() => {
            if (phaseRef.current === "zooming") { clearInterval(zoomInterval); requestAnimationFrame(syncZoom) }
        }, 50)

        return () => {
            cancelAnimationFrame(animRef.current)
            clearInterval(zoomInterval)
            window.removeEventListener("resize", resize)
        }
    }, [])

    const handleEnter = useCallback(() => { setPhase("done"); setTimeout(onEnter, 800) }, [onEnter])
    const handleSkip = useCallback(() => { setPhase("done"); setTimeout(onEnter, 600) }, [onEnter])

    return (
        <AnimatePresence>
            {phase !== "done" && (
                <motion.div
                    className="fixed inset-0 z-[9999] overflow-hidden"
                    style={{ backgroundColor: "#050310" }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                    {/* ── ORBITING header ── */}
                    <AnimatePresence>
                        {phase === "orbiting" && (
                            <motion.div
                                className="absolute top-0 left-0 right-0 flex flex-col items-center pt-8 gap-2 pointer-events-none"
                                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.7 }}
                            >
                                <div className="flex items-center gap-3" style={{ color: "rgba(200,160,40,0.50)" }}>
                                    <motion.div className="w-1.5 h-1.5 rounded-full bg-amber-400"
                                        animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.1, repeat: Infinity }} />
                                    <span className="text-[10px] tracking-[0.55em] uppercase font-body">
                                        Solar Navigation System · Active
                                    </span>
                                    <motion.div className="w-1.5 h-1.5 rounded-full bg-amber-400"
                                        animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.1, repeat: Infinity, delay: 0.5 }} />
                                </div>
                                <p className="text-[9px] tracking-[0.5em] uppercase font-body" style={{ color: "rgba(200,160,40,0.28)" }}>
                                    Destination: Mars · Sector IV · Valles Marineris
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── ZOOMING overlay ── */}
                    <AnimatePresence>
                        {phase === "zooming" && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="text-center space-y-3"
                                    initial={{ scale: 0.75, opacity: 0 }}
                                    animate={{ scale: [0.75, 1.05, 1], opacity: [0, 1, 0.85] }}
                                    transition={{ duration: 2.6, times: [0, 0.35, 1] }}
                                >
                                    <div className="text-5xl md:text-7xl font-black font-heading tracking-widest"
                                        style={{ color: "#FFD700", textShadow: "0 0 60px rgba(255,150,30,0.85), 0 0 120px rgba(200,80,0,0.5)" }}>
                                        APPROACHING
                                    </div>
                                    <div className="text-xs tracking-[0.8em] uppercase font-body"
                                        style={{ color: "rgba(255,200,100,0.65)" }}>
                                        Mars · Valles Marineris
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── WELCOME card ── */}
                    <AnimatePresence>
                        {showWelcome && phase === "welcome" && (
                            <motion.div
                                className="absolute inset-0 flex flex-col items-center justify-center"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0 }}
                            >
                                <motion.div
                                    className="relative flex flex-col items-center gap-6 px-12 py-10 mx-4 max-w-lg w-full text-center"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(10,7,2,0.90) 0%, rgba(6,4,1,0.96) 100%)",
                                        border: "1px solid rgba(200,160,40,0.22)",
                                        borderRadius: "2px",
                                        backdropFilter: "blur(30px)",
                                        boxShadow: "0 0 80px rgba(200,80,20,0.18), 0 0 160px rgba(200,80,20,0.06), inset 0 1px 0 rgba(255,215,0,0.10)",
                                    }}
                                    initial={{ scale: 0.85, opacity: 0, y: 30 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    {/* Corner accents */}
                                    {[["top-0 left-0", "border-t border-l"], ["top-0 right-0", "border-t border-r"],
                                    ["bottom-0 left-0", "border-b border-l"], ["bottom-0 right-0", "border-b border-r"]
                                    ].map(([pos, bdr], i) => (
                                        <motion.div key={i} className={`absolute ${pos} w-5 h-5 ${bdr}`}
                                            style={{ borderColor: "rgba(200,160,40,0.55)" }}
                                            initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.45 }} />
                                    ))}

                                    {/* Est. */}
                                    <motion.div className="flex items-center gap-3"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                        <span className="h-px w-10" style={{ background: "linear-gradient(to right,transparent,rgba(200,160,40,0.5))" }} />
                                        <span className="text-[9px] tracking-[0.65em] uppercase font-body" style={{ color: "rgba(200,160,40,0.55)" }}>
                                            Est. 2095 · Valles Marineris
                                        </span>
                                        <span className="h-px w-10" style={{ background: "linear-gradient(to left,transparent,rgba(200,160,40,0.5))" }} />
                                    </motion.div>

                                    {/* MARS BITES */}
                                    <motion.div className="leading-none"
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                                        <div className="font-heading font-black"
                                            style={{
                                                fontSize: "clamp(3.5rem,12vw,6.5rem)", lineHeight: 0.9,
                                                background: "linear-gradient(135deg,#b8860b 0%,#ffd700 35%,#fffacd 52%,#ffd700 70%,#b8860b 100%)",
                                                backgroundSize: "200% auto", WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent", backgroundClip: "text",
                                                animation: "gold-shimmer 4s linear infinite",
                                            }}>MARS</div>
                                        <div className="h-px w-full my-2" style={{ background: "linear-gradient(90deg,transparent,rgba(200,160,40,0.7),rgba(255,250,200,0.9),rgba(200,160,40,0.7),transparent)" }} />
                                        <div className="font-heading font-black tracking-[0.3em]"
                                            style={{ fontSize: "clamp(1.5rem,5vw,3rem)", color: "rgba(240,230,200,0.9)", textShadow: "0 0 30px rgba(255,255,255,0.10)" }}>
                                            BITES
                                        </div>
                                    </motion.div>

                                    <motion.p className="text-[11px] tracking-[0.5em] uppercase font-body"
                                        style={{ color: "rgba(200,160,40,0.55)" }}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                                        Taste Beyond Earth
                                    </motion.p>

                                    <motion.p className="text-sm leading-relaxed font-body max-w-xs"
                                        style={{ color: "rgba(240,225,190,0.42)" }}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
                                        The first fine-dining experience beyond Earth — interplanetary cuisine crafted in the heart of Mars.
                                    </motion.p>

                                    {/* Enter button */}
                                    <motion.button onClick={handleEnter}
                                        className="relative px-12 py-4 overflow-hidden group"
                                        id="solar-landing-enter-btn"
                                        style={{
                                            background: "linear-gradient(135deg,#b8860b,#ffd700,#b8860b)",
                                            backgroundSize: "200% auto", animation: "gold-shimmer 3s linear infinite",
                                            color: "#0a0800", fontFamily: "var(--font-heading)", fontWeight: 900,
                                            fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase",
                                            borderRadius: "2px", boxShadow: "0 0 40px rgba(200,160,40,0.4),0 4px 24px rgba(200,160,40,0.2)",
                                            cursor: "pointer",
                                        }}
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                                        Enter the Restaurant
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/15 rounded-sm" />
                                    </motion.button>

                                    {/* Planet dots */}
                                    <motion.div className="flex items-center gap-2 mt-1"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                                        {["Mercury", "Venus", "Earth", "Mars", "Jupiter"].map((name, i) => (
                                            <motion.div key={name} className="rounded-full"
                                                style={{
                                                    width: [3, 4, 5, 4, 8][i], height: [3, 4, 5, 4, 8][i],
                                                    backgroundColor: ["#c8c8c8", "#e8d090", "#4a9eff", "#d94f2b", "#d4b070"][i],
                                                    boxShadow: i === 3 ? "0 0 8px rgba(220,80,40,0.7)" : "none",
                                                }}
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.22 }} />
                                        ))}
                                        <span className="text-[8px] tracking-wider font-body ml-1" style={{ color: "rgba(200,160,40,0.30)" }}>
                                            4th rock from the Sun
                                        </span>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Skip button */}
                    <AnimatePresence>
                        {showSkip && phase !== "done" && phase !== "welcome" && (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                                onClick={handleSkip} id="solar-landing-skip-btn"
                                className="absolute top-6 right-6 text-xs font-body tracking-widest uppercase px-5 py-2.5 rounded-full"
                                style={{
                                    background: "rgba(200,160,40,0.08)", border: "1px solid rgba(200,160,40,0.22)",
                                    color: "rgba(200,160,40,0.55)", cursor: "pointer",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,160,40,0.16)"; e.currentTarget.style.color = "#FFD700" }}
                                onMouseLeave={e => { e.currentTarget.style.background = "rgba(200,160,40,0.08)"; e.currentTarget.style.color = "rgba(200,160,40,0.55)" }}
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

// ═════════════════════════════════════════════════════════════
//  PLANET RENDERER — called once per planet per frame
// ═════════════════════════════════════════════════════════════
function renderPlanet(
    ctx: CanvasRenderingContext2D,
    pl: typeof PLANETS[number],
    px: number, py: number, pSize: number,
    angle: number, frame: number, phase: string
) {
    // Saturn ring — back half (drawn BEFORE the planet body)
    const hasSaturnRing = (pl as any).hasRing
    if (hasSaturnRing) {
        // Back half of ring (arc from π to 2π)
        ctx.save()
        ctx.translate(px, py)
        ctx.scale(1, 0.30)
        ctx.beginPath()
        ctx.ellipse(0, 0, pSize * 2.8, pSize * 2.8, 0, Math.PI, Math.PI * 2)
        ctx.strokeStyle = `rgba(210,180,90,0.38)`
        ctx.lineWidth = pSize * 0.70
        ctx.stroke()
        ctx.restore()
    }

    // ── Planet body ──
    const pGrad = ctx.createRadialGradient(
        px - pSize * 0.32, py - pSize * 0.32, 0,
        px, py, pSize
    )
    if ((pl as any).isBanded) {
        // Jupiter bands
        pGrad.addColorStop(0, "#e8d090")
        pGrad.addColorStop(0.28, "#c8a868")
        pGrad.addColorStop(0.50, "#b08040")
        pGrad.addColorStop(0.70, "#d8b870")
        pGrad.addColorStop(1, "#7a5820")
    } else {
        pGrad.addColorStop(0, lighten(pl.color, 0.42))
        pGrad.addColorStop(0.45, pl.color)
        pGrad.addColorStop(1, pl.shadowColor)
    }
    ctx.beginPath()
    ctx.fillStyle = pGrad
    ctx.arc(px, py, pSize, 0, Math.PI * 2)
    ctx.fill()

    // Earth cloud-like blue swirl overlay
    if ((pl as any).hasOcean) {
        const cloudG = ctx.createRadialGradient(px - pSize * 0.2, py - pSize * 0.2, 0, px, py, pSize)
        cloudG.addColorStop(0, "rgba(100,180,255,0.18)")
        cloudG.addColorStop(0.6, "rgba(30,100,200,0.06)")
        cloudG.addColorStop(1, "rgba(0,0,0,0)")
        ctx.beginPath()
        ctx.fillStyle = cloudG
        ctx.arc(px, py, pSize, 0, Math.PI * 2)
        ctx.fill()
    }

    // Terminator shadow (dark side)
    const shadowGrad = ctx.createRadialGradient(
        px + pSize * 0.4, py + pSize * 0.1, 0,
        px, py, pSize * 1.1
    )
    shadowGrad.addColorStop(0, "rgba(0,0,0,0)")
    shadowGrad.addColorStop(0.55, "rgba(0,0,0,0.08)")
    shadowGrad.addColorStop(1, "rgba(0,0,0,0.68)")
    ctx.beginPath()
    ctx.fillStyle = shadowGrad
    ctx.arc(px, py, pSize, 0, Math.PI * 2)
    ctx.fill()

    // Specular highlight
    const specG = ctx.createRadialGradient(
        px - pSize * 0.36, py - pSize * 0.36, 0,
        px - pSize * 0.18, py - pSize * 0.18, pSize * 0.5
    )
    specG.addColorStop(0, "rgba(255,255,255,0.30)")
    specG.addColorStop(1, "rgba(255,255,255,0)")
    ctx.beginPath()
    ctx.fillStyle = specG
    ctx.arc(px, py, pSize, 0, Math.PI * 2)
    ctx.fill()

    // Saturn ring — front half (drawn AFTER planet body)
    if (hasSaturnRing) {
        ctx.save()
        ctx.translate(px, py)
        ctx.scale(1, 0.30)
        ctx.beginPath()
        ctx.ellipse(0, 0, pSize * 2.8, pSize * 2.8, 0, 0, Math.PI)
        ctx.strokeStyle = `rgba(220,190,100,0.60)`
        ctx.lineWidth = pSize * 0.70
        ctx.stroke()
        ctx.restore()
    }

    // Mars target pulse rings
    if ((pl as any).isTarget && phase !== "zooming") {
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.07)
        ctx.beginPath()
        ctx.arc(px, py, pSize * 2.4, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(220,80,40,${0.22 * pulse})`
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(px, py, pSize * 3.5, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(220,80,40,${0.09 * pulse})`
        ctx.lineWidth = 1
        ctx.stroke()
    }

    // Planet name labels (orbiting phase only)
    if (phase === "orbiting" && pSize > 3.5) {
        const labelY = py - pSize - 7
        ctx.textAlign = "center"
        ctx.font = `${Math.max(10, pSize * 1.1)}px serif`
        ctx.fillStyle = (pl as any).isTarget ? "rgba(255,140,80,0.95)" : "rgba(210,200,170,0.65)"
        ctx.fillText(pl.name, px, labelY)
        if ((pl as any).label) {
            ctx.font = `${Math.max(8, pSize * 0.78)}px serif`
            ctx.fillStyle = (pl as any).isTarget ? "rgba(255,210,120,0.85)" : "rgba(140,190,255,0.60)"
            ctx.fillText((pl as any).label, px, labelY - 13)
        }
    }
}

// ═════════════════════════════════════════════════════════════
//  SUN RENDERER
// ═════════════════════════════════════════════════════════════
function drawSun(ctx: CanvasRenderingContext2D, sx: number, sy: number, sr: number, frame: number) {
    // Corona rings
    ;[4.2, 3.0, 2.1, 1.45].forEach((mult, i) => {
        const cr = sr * mult
        const cg = ctx.createRadialGradient(sx, sy, sr * 0.4, sx, sy, cr)
        const pulse = 0.11 * Math.sin(frame * 0.018 + i * 0.8)
        cg.addColorStop(0, `rgba(255,215,70,${0.22 - i * 0.04 + pulse})`)
        cg.addColorStop(0.5, `rgba(255,140,20,${0.09 - i * 0.018 + pulse * 0.4})`)
        cg.addColorStop(1, "rgba(255,60,0,0)")
        ctx.fillStyle = cg
        ctx.beginPath()
        ctx.arc(sx, sy, cr, 0, Math.PI * 2)
        ctx.fill()
    })

    // Surface
    const sg = ctx.createRadialGradient(sx - sr * 0.30, sy - sr * 0.30, 0, sx, sy, sr)
    sg.addColorStop(0, "#fffde8")
    sg.addColorStop(0.22, "#ffe050")
    sg.addColorStop(0.60, "#ffaa18")
    sg.addColorStop(1, "#ff6000")
    ctx.beginPath()
    ctx.fillStyle = sg
    ctx.arc(sx, sy, sr, 0, Math.PI * 2)
    ctx.fill()

    // Flares
    for (let fi = 0; fi < 8; fi++) {
        const fa = (fi / 8) * Math.PI * 2 + frame * 0.007
        const fl = sr * (0.25 + 0.20 * Math.sin(frame * 0.034 + fi * 1.4))
        const fx = sx + Math.cos(fa) * (sr * 0.88 + fl)
        const fy = sy + Math.sin(fa) * (sr * 0.88 + fl)
        const fg = ctx.createRadialGradient(sx + Math.cos(fa) * sr * 0.75, sy + Math.sin(fa) * sr * 0.75, 0, fx, fy, fl * 0.9)
        fg.addColorStop(0, "rgba(255,210,40,0.52)")
        fg.addColorStop(1, "rgba(255,80,0,0)")
        ctx.fillStyle = fg
        ctx.beginPath()
        ctx.arc(fx, fy, fl * 0.9, 0, Math.PI * 2)
        ctx.fill()
    }
}

// ─────────────────────────────────────────────────────────────
function lighten(hex: string, amount: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgb(${Math.min(255, Math.round(r + (255 - r) * amount))},${Math.min(255, Math.round(g + (255 - g) * amount))},${Math.min(255, Math.round(b + (255 - b) * amount))})`
}
