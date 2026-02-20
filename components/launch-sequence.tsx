"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ─────────────────────────────────────────────
//  LAUNCH SEQUENCE — cinematic intro overlay
//  Phases: 0=launchpad  1=liftoff  2=warp  3=mars approach  4=done
// ─────────────────────────────────────────────

const COUNTDOWN = [5, 4, 3, 2, 1]
const PHASE_DURATIONS = { launchpad: 5200, liftoff: 2800, warp: 3500, approach: 3200 }

interface LaunchSequenceProps {
    onComplete: () => void
}

export function LaunchSequence({ onComplete }: LaunchSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [phase, setPhase] = useState<"launchpad" | "liftoff" | "warp" | "approach" | "done">("launchpad")
    const [countdown, setCountdown] = useState(5)
    const [showSkip, setShowSkip] = useState(false)
    const animRef = useRef<number>(0)

    // Show skip button after 1.5s
    useEffect(() => { setTimeout(() => setShowSkip(true), 1500) }, [])

    // Master phase sequence
    useEffect(() => {
        // Countdown ticks
        const interval = setInterval(() => {
            setCountdown((c) => (c > 0 ? c - 1 : 0))
        }, 1000)
        setTimeout(() => clearInterval(interval), 5200)

        // Phase transitions
        const TOTAL = PHASE_DURATIONS.launchpad + PHASE_DURATIONS.liftoff + PHASE_DURATIONS.warp + PHASE_DURATIONS.approach
        const t1 = setTimeout(() => setPhase("liftoff"), PHASE_DURATIONS.launchpad)
        const t2 = setTimeout(() => setPhase("warp"), PHASE_DURATIONS.launchpad + PHASE_DURATIONS.liftoff)
        const t3 = setTimeout(() => setPhase("approach"), PHASE_DURATIONS.launchpad + PHASE_DURATIONS.liftoff + PHASE_DURATIONS.warp)
        // Fade to black first (600ms), then call onComplete so the site appears AFTER the overlay is gone
        const t4 = setTimeout(() => setPhase("done"), TOTAL)
        const t5 = setTimeout(() => onComplete(), TOTAL + 650)

        return () => { clearInterval(interval);[t1, t2, t3, t4, t5].forEach(clearTimeout) }
    }, [onComplete])

    // ── Canvas animation ──
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
        resize()
        window.addEventListener("resize", resize)

        // Stars
        interface Star { x: number; y: number; z: number; pz: number }
        const stars: Star[] = Array.from({ length: 500 }, () => ({
            x: (Math.random() - 0.5) * window.innerWidth,
            y: (Math.random() - 0.5) * window.innerHeight,
            z: Math.random() * window.innerWidth,
            pz: 0,
        }))

        // Particles (rocket exhaust)
        interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; r: number; bright: number }
        const particles: Particle[] = []
        let frame = 0
        let currentPhase = "launchpad"

        const phaseRef = { current: "launchpad" }

        const tick = () => {
            frame++
            const W = canvas.width
            const H = canvas.height
            const cx = W / 2
            const cy = H / 2

            const p = phaseRef.current

            // Clear
            ctx.fillStyle = p === "approach"
                ? `rgba(6,2,1,0.85)`
                : "rgba(4,3,12,0.35)"
            ctx.fillRect(0, 0, W, H)

            // ── WARP stars ──
            if (p === "warp" || p === "approach") {
                const speed = p === "warp" ? 18 : Math.max(2, 18 - (frame % 180) * 0.08)
                stars.forEach((s) => {
                    s.pz = s.z
                    s.z -= speed
                    if (s.z <= 0) {
                        s.x = (Math.random() - 0.5) * W
                        s.y = (Math.random() - 0.5) * H
                        s.z = W
                        s.pz = W
                    }
                    const sx = (s.x / s.z) * W + cx
                    const sy = (s.y / s.z) * H + cy
                    const px = (s.x / s.pz) * W + cx
                    const py = (s.y / s.pz) * H + cy
                    const bright = Math.min(1, 1 - s.z / W)
                    const w = bright * 2.5
                    ctx.beginPath()
                    ctx.strokeStyle = `rgba(255,230,180,${bright * 0.8})`
                    ctx.lineWidth = w
                    ctx.moveTo(px, py)
                    ctx.lineTo(sx, sy)
                    ctx.stroke()
                })
            } else {
                // Static twinkling stars for launchpad/liftoff
                stars.slice(0, 200).forEach((s, i) => {
                    const sx = ((s.x / s.z) * W + cx + W) % W
                    const sy = ((s.y / s.z) * H + cy + H) % H
                    const twinkle = 0.3 + 0.5 * Math.sin(frame * 0.05 + i)
                    ctx.beginPath()
                    ctx.fillStyle = `rgba(255,230,180,${twinkle})`
                    ctx.arc(sx, sy, 0.8 + Math.random() * 0.5, 0, Math.PI * 2)
                    ctx.fill()
                })
            }

            // ── MARS ball (approach) ──
            if (p === "approach") {
                const prog = Math.min(1, (frame % 200) / 160) // grows 0→1 during approach
                const marsR = 40 + prog * Math.min(W, H) * 1.4
                const marsX = cx
                const marsY = -marsR * 0.2

                // Atmosphere glow rim
                const atmo = ctx.createRadialGradient(marsX, marsY, marsR * 0.9, marsX, marsY, marsR * 1.4)
                atmo.addColorStop(0, "rgba(180,60,0,0.0)")
                atmo.addColorStop(0.5, "rgba(180,60,0,0.25)")
                atmo.addColorStop(1, "rgba(180,60,0,0)")
                ctx.beginPath(); ctx.fillStyle = atmo; ctx.arc(marsX, marsY, marsR * 1.4, 0, Math.PI * 2); ctx.fill()

                // Mars surface
                const mg = ctx.createRadialGradient(marsX - marsR * 0.3, marsY - marsR * 0.3, 0, marsX, marsY, marsR)
                mg.addColorStop(0, "rgba(220,120,60,0.95)")
                mg.addColorStop(0.4, "rgba(160,60,20,0.95)")
                mg.addColorStop(0.75, "rgba(100,30,8,1)")
                mg.addColorStop(1, "rgba(30,8,2,1)")
                ctx.beginPath(); ctx.fillStyle = mg; ctx.arc(marsX, marsY, marsR, 0, Math.PI * 2); ctx.fill()

                // Shadow
                const shadow = ctx.createRadialGradient(marsX + marsR * 0.5, marsY + marsR * 0.2, 0, marsX, marsY, marsR)
                shadow.addColorStop(0, "rgba(0,0,0,0)")
                shadow.addColorStop(0.7, "rgba(0,0,0,0)")
                shadow.addColorStop(1, "rgba(0,0,0,0.6)")
                ctx.beginPath(); ctx.fillStyle = shadow; ctx.arc(marsX, marsY, marsR, 0, Math.PI * 2); ctx.fill()
            }

            // ── ROCKET EXHAUST PARTICLES ──
            if (p === "liftoff" || p === "warp") {
                // Spawn particles
                const count = p === "liftoff" ? 22 : 8
                for (let i = 0; i < count; i++) {
                    const spread = p === "liftoff" ? 28 : 12
                    particles.push({
                        x: cx + (Math.random() - 0.5) * spread,
                        y: H * 0.72 + (Math.random() - 0.5) * 10,
                        vx: (Math.random() - 0.5) * 3.5,
                        vy: 4 + Math.random() * 8,
                        life: 0,
                        maxLife: 25 + Math.random() * 35,
                        r: 6 + Math.random() * 18,
                        bright: 0.6 + Math.random() * 0.4,
                    })
                }
                // Draw particles
                for (let i = particles.length - 1; i >= 0; i--) {
                    const pp = particles[i]
                    pp.x += pp.vx; pp.y += pp.vy * (1 + pp.life / pp.maxLife)
                    pp.life++
                    if (pp.life > pp.maxLife) { particles.splice(i, 1); continue }
                    const t2 = pp.life / pp.maxLife
                    const ex = ctx.createRadialGradient(pp.x, pp.y, 0, pp.x, pp.y, pp.r)
                    const alpha = pp.bright * (1 - t2)
                    if (t2 < 0.3) {
                        ex.addColorStop(0, `rgba(255,255,220,${alpha})`)
                        ex.addColorStop(0.35, `rgba(255,180,30,${alpha * 0.8})`)
                        ex.addColorStop(1, `rgba(255,80,0,0)`)
                    } else {
                        ex.addColorStop(0, `rgba(255,120,20,${alpha * 0.7})`)
                        ex.addColorStop(0.4, `rgba(180,50,10,${alpha * 0.4})`)
                        ex.addColorStop(1, `rgba(80,20,5,0)`)
                    }
                    ctx.beginPath(); ctx.fillStyle = ex; ctx.arc(pp.x, pp.y, pp.r, 0, Math.PI * 2); ctx.fill()
                }
            }

            animRef.current = requestAnimationFrame(tick)
        }

        // Sync phase
        const observer = new MutationObserver(() => { })
        // Use a ref proxy — we'll update via setInterval check
        const syncInterval = setInterval(() => {
            const el = document.getElementById("__phase_tracker__")
            if (el) phaseRef.current = el.dataset.phase || "launchpad"
        }, 50)

        animRef.current = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(animRef.current)
            clearInterval(syncInterval)
            window.removeEventListener("resize", resize)
        }
    }, [])

    // Keep the phase ref in sync via a hidden DOM element
    useEffect(() => {
        const el = document.getElementById("__phase_tracker__")
        if (el) el.dataset.phase = phase
    }, [phase])

    const handleSkip = useCallback(() => {
        setPhase("done")
        // Wait for the black fade-out (650ms) then reveal site
        setTimeout(onComplete, 700)
    }, [onComplete])

    return (
        <AnimatePresence>
            {phase !== "done" && (
                <motion.div
                    className="fixed inset-0 z-[9999] overflow-hidden"
                    style={{ backgroundColor: "#04030c" }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeIn" }}
                >
                    {/* Hidden phase tracker */}
                    <div id="__phase_tracker__" data-phase={phase} style={{ display: "none" }} />

                    {/* Canvas for stars / particles / mars */}
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                    {/* ════════════════ LAUNCHPAD PHASE ════════════════ */}
                    <AnimatePresence>
                        {phase === "launchpad" && (
                            <motion.div
                                className="absolute inset-0 flex flex-col items-center justify-end pb-24"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6 }}
                            >
                                {/* Status text */}
                                <motion.div
                                    className="absolute top-16 left-1/2 -translate-x-1/2 text-center space-y-3"
                                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                >
                                    <div
                                        className="flex items-center gap-3 justify-center"
                                        style={{ color: "rgba(200,160,40,0.5)" }}
                                    >
                                        <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400"
                                            animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                                        />
                                        <span className="text-[10px] tracking-[0.55em] uppercase font-body">
                                            Mission Control · Systems Nominal
                                        </span>
                                        <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400"
                                            animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                                        />
                                    </div>
                                    <p className="text-xs tracking-[0.4em] uppercase font-body" style={{ color: "rgba(200,160,40,0.3)" }}>
                                        Valles Marineris · Flight MBX-2095
                                    </p>
                                </motion.div>

                                {/* ── ROCKET SVG ── */}
                                <div className="relative flex flex-col items-center">
                                    {/* Launchpad gantry */}
                                    <svg width="320" height="60" viewBox="0 0 320 60" className="absolute bottom-0 opacity-50">
                                        {/* Gantry arms */}
                                        <rect x="100" y="0" width="8" height="60" fill="rgba(150,120,60,0.6)" />
                                        <rect x="208" y="0" width="8" height="60" fill="rgba(150,120,60,0.6)" />
                                        <rect x="100" y="10" width="118" height="6" fill="rgba(150,120,60,0.4)" />
                                        <rect x="100" y="30" width="118" height="4" fill="rgba(150,120,60,0.4)" />
                                        {/* Ground */}
                                        <rect x="60" y="52" width="200" height="8" rx="2" fill="rgba(100,80,30,0.7)" />
                                    </svg>

                                    {/* The rocket */}
                                    <RocketSVG phase={phase} />

                                    {/* Countdown ring */}
                                    <motion.div
                                        className="absolute -bottom-16 flex flex-col items-center gap-1"
                                        initial={{ opacity: 0, scale: 0.7 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <div className="relative w-20 h-20 flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                <circle cx="40" cy="40" r="34" strokeWidth="2" stroke="rgba(200,160,40,0.15)" fill="none" />
                                                <motion.circle
                                                    cx="40" cy="40" r="34" strokeWidth="2"
                                                    stroke="#FFD700" fill="none"
                                                    strokeDasharray={213.6}
                                                    animate={{ strokeDashoffset: 213.6 - (213.6 * (5 - countdown) / 5) }}
                                                    transition={{ duration: 0.9, ease: "linear" }}
                                                />
                                            </svg>
                                            <motion.span
                                                key={countdown}
                                                initial={{ scale: 1.6, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.35 }}
                                                className="text-4xl font-black font-heading"
                                                style={{ color: countdown <= 2 ? "#FF6030" : "#FFD700" }}
                                            >
                                                {countdown === 0 ? "🚀" : countdown}
                                            </motion.span>
                                        </div>
                                        <span className="text-[9px] tracking-[0.6em] uppercase font-body" style={{ color: "rgba(200,160,40,0.4)" }}>
                                            T-minus
                                        </span>
                                    </motion.div>
                                </div>

                                {/* System checks */}
                                <StatusRow frame={0} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ════════════════ LIFTOFF PHASE ════════════════ */}
                    <AnimatePresence>
                        {phase === "liftoff" && (
                            <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {/* Rocket animates up and out */}
                                <motion.div
                                    className="flex flex-col items-center"
                                    initial={{ y: "40vh", scale: 1 }}
                                    animate={{ y: "-120vh", scale: 0.3 }}
                                    transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <RocketSVG phase="liftoff" />
                                </motion.div>

                                {/* LIFTOFF Text */}
                                <motion.div
                                    className="absolute text-center"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.1, 1, 0.8] }}
                                    transition={{ times: [0, 0.3, 0.7, 1], duration: 2.8 }}
                                >
                                    <div className="text-7xl md:text-9xl font-black font-heading" style={{ color: "#FFD700", textShadow: "0 0 80px rgba(255,150,30,0.8), 0 0 160px rgba(255,100,0,0.4)" }}>
                                        LIFTOFF
                                    </div>
                                    <div className="text-sm tracking-[0.8em] uppercase font-body mt-2" style={{ color: "rgba(255,200,100,0.7)" }}>
                                        Flight MBX-2095 · Destination: Mars
                                    </div>
                                </motion.div>

                                {/* Screen shake simulation */}
                                <motion.div
                                    className="absolute inset-0 pointer-events-none"
                                    animate={{ x: [0, -4, 6, -3, 5, -2, 4, 0], y: [0, 3, -5, 4, -3, 2, -4, 0] }}
                                    transition={{ duration: 1.2, repeat: 2, repeatType: "reverse" }}
                                    style={{ background: "transparent" }}
                                />

                                {/* Orange ground flash */}
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0"
                                    initial={{ height: "35vh", opacity: 0.9 }}
                                    animate={{ height: "0vh", opacity: 0 }}
                                    transition={{ duration: 1.8, ease: "easeOut" }}
                                    style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(255,140,30,0.9) 0%, rgba(255,60,0,0.7) 40%, transparent 75%)" }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ════════════════ WARP PHASE ════════════════ */}
                    <AnimatePresence>
                        {phase === "warp" && (
                            <motion.div className="absolute inset-0 flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {/* Speed lines overlay */}
                                <div className="absolute inset-0 pointer-events-none">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute top-1/2 left-1/2 origin-left"
                                            style={{
                                                width: `${30 + Math.random() * 40}vw`,
                                                height: "1px",
                                                background: `rgba(255,${180 + Math.floor(Math.random() * 60)},${80 + Math.floor(Math.random() * 80)},${0.3 + Math.random() * 0.5})`,
                                                rotate: `${(i / 20) * 360}deg`,
                                            }}
                                            initial={{ scaleX: 0, opacity: 0 }}
                                            animate={{ scaleX: [0, 1, 0], opacity: [0, 0.7, 0] }}
                                            transition={{ duration: 0.8 + Math.random() * 0.6, delay: Math.random() * 1.5, repeat: 3 }}
                                        />
                                    ))}
                                </div>

                                {/* Tiny rocket in warp */}
                                <motion.div
                                    initial={{ scale: 0.2, opacity: 0 }}
                                    animate={{ scale: [0.2, 0.08, 0.04], opacity: [0, 1, 0.5] }}
                                    transition={{ duration: 3, ease: "easeIn" }}
                                >
                                    <RocketSVG phase="warp" />
                                </motion.div>

                                {/* Warp text */}
                                <motion.div
                                    className="absolute bottom-24 text-center space-y-2"
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <p className="text-xs tracking-[0.7em] uppercase font-body" style={{ color: "rgba(200,160,40,0.55)" }}>
                                        Approaching at 18,000 km/s
                                    </p>
                                    <div className="flex justify-center gap-2">
                                        {["FUEL: NOMINAL", "O₂: 100%", "HULL: SECURE"].map((s) => (
                                            <span key={s} className="text-[9px] tracking-wider uppercase font-body px-2 py-1 rounded" style={{ background: "rgba(200,160,40,0.08)", color: "rgba(200,160,40,0.5)", border: "1px solid rgba(200,160,40,0.15)" }}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ════════════════ APPROACH PHASE ════════════════ */}
                    <AnimatePresence>
                        {phase === "approach" && (
                            <motion.div className="absolute inset-0 flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.08 }} transition={{ exit: { duration: 1 } }}>

                                {/* Red atmosphere tinted vignette */}
                                <motion.div
                                    className="absolute inset-0 pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.5, 0.8] }}
                                    transition={{ duration: 3, times: [0, 0.5, 1] }}
                                    style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(180,50,0,0.4) 0%, rgba(100,20,0,0.2) 40%, transparent 70%)" }}
                                />

                                {/* Atmospheric entry text */}
                                <motion.div
                                    className="text-center space-y-4 z-10"
                                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: [0, 1, 1, 0], y: [30, 0, 0, -20] }}
                                    transition={{ duration: 3, times: [0, 0.25, 0.75, 1] }}
                                >
                                    <p className="text-[10px] tracking-[0.7em] uppercase font-body" style={{ color: "rgba(255,100,30,0.6)" }}>
                                        ── Entering Martian Atmosphere ──
                                    </p>
                                    <div className="text-6xl md:text-8xl font-black font-heading tracking-tighter" style={{ color: "#FFD700", textShadow: "0 0 60px rgba(255,100,30,0.6), 0 0 120px rgba(200,60,0,0.3)" }}>
                                        MARS
                                    </div>
                                    <p className="text-sm font-body" style={{ color: "rgba(240,200,120,0.65)" }}>
                                        Valles Marineris · Welcome Aboard
                                    </p>
                                </motion.div>

                                {/* Heat shield glow at top = entry effect */}
                                <motion.div
                                    className="absolute top-0 left-0 right-0 pointer-events-none"
                                    initial={{ opacity: 0, height: "0%" }}
                                    animate={{ opacity: [0, 0.7, 0.3], height: ["0%", "55%", "25%"] }}
                                    transition={{ duration: 3.2, ease: "easeOut" }}
                                    style={{ background: "linear-gradient(to bottom, rgba(255,80,0,0.5) 0%, rgba(200,40,0,0.3) 40%, transparent 100%)" }}
                                />

                                {/* Mars BITES Reveal */}
                                <motion.div
                                    className="absolute bottom-20 text-center"
                                    initial={{ opacity: 0, y: 20, scale: 0.85 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: 1.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div className="text-lg md:text-2xl font-black font-heading tracking-[0.35em]" style={{ color: "rgba(240,220,160,0.85)" }}>
                                        MARS <span style={{ color: "#FFD700" }}>BITES</span>
                                    </div>
                                    <p className="text-[10px] tracking-widest uppercase font-body mt-1" style={{ color: "rgba(200,160,40,0.4)" }}>
                                        Taste Beyond Earth · Loading…
                                    </p>
                                    {/* Loading bar */}
                                    <div className="mt-3 h-0.5 w-48 mx-auto rounded-full overflow-hidden" style={{ background: "rgba(200,160,40,0.15)" }}>
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ background: "linear-gradient(90deg,#b8860b,#FFD700)" }}
                                            initial={{ width: "0%" }} animate={{ width: "100%" }}
                                            transition={{ delay: 1.8, duration: 1.3, ease: "easeOut" }}
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── SKIP BUTTON ── */}
                    <AnimatePresence>
                        {showSkip && phase !== "done" && (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                onClick={handleSkip}
                                className="absolute top-6 right-6 text-xs font-body tracking-widest uppercase px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95"
                                style={{
                                    background: "rgba(200,160,40,0.1)",
                                    border: "1px solid rgba(200,160,40,0.25)",
                                    color: "rgba(200,160,40,0.6)",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,160,40,0.18)"; e.currentTarget.style.color = "#FFD700" }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(200,160,40,0.1)"; e.currentTarget.style.color = "rgba(200,160,40,0.6)" }}
                            >
                                Skip Mission
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ── Reusable Rocket SVG ──
function RocketSVG({ phase }: { phase: string }) {
    const isWarp = phase === "warp"
    return (
        <div className="relative select-none" style={{ width: isWarp ? 60 : 120, height: isWarp ? 120 : 240 }}>
            <svg viewBox="0 0 120 240" width={isWarp ? 60 : 120} height={isWarp ? 120 : 240} style={{ filter: "drop-shadow(0 0 18px rgba(255,150,50,0.5))" }}>
                {/* Body */}
                <defs>
                    <linearGradient id="rocketBody" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#d0d0e0" />
                        <stop offset="40%" stopColor="#f5f5ff" />
                        <stop offset="70%" stopColor="#c8c8d8" />
                        <stop offset="100%" stopColor="#9090a8" />
                    </linearGradient>
                    <linearGradient id="rocketNose" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#e8e8f8" />
                        <stop offset="50%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#b0b0c8" />
                    </linearGradient>
                    <linearGradient id="finGrad" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="#b8860b" />
                        <stop offset="100%" stopColor="#6b4a00" />
                    </linearGradient>
                    <radialGradient id="windowGlow">
                        <stop offset="0%" stopColor="#aaddff" stopOpacity="1" />
                        <stop offset="60%" stopColor="#4488cc" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#1133aa" stopOpacity="0.5" />
                    </radialGradient>
                </defs>

                {/* Main body */}
                <rect x="35" y="70" width="50" height="130" rx="6" fill="url(#rocketBody)" />

                {/* Cone nose */}
                <path d="M60,10 L85,70 L35,70 Z" fill="url(#rocketNose)" />
                {/* Nose tip */}
                <ellipse cx="60" cy="10" rx="4" ry="5" fill="rgba(200,200,220,0.8)" />

                {/* Gold accent stripe */}
                <rect x="35" y="115" width="50" height="8" fill="url(#finGrad)" opacity="0.85" />

                {/* Porthole window */}
                <circle cx="60" cy="92" r="12" fill="rgba(30,50,80,0.9)" />
                <circle cx="60" cy="92" r="10" fill="url(#windowGlow)" />
                <circle cx="56" cy="88" r="3" fill="rgba(255,255,255,0.5)" />

                {/* Left fin */}
                <path d="M35,160 L12,200 L35,190 Z" fill="url(#finGrad)" />
                {/* Right fin */}
                <path d="M85,160 L108,200 L85,190 Z" fill="url(#finGrad)" />

                {/* Engine nozzle */}
                <path d="M42,200 L40,220 L80,220 L78,200 Z" fill="rgba(80,80,100,0.85)" />
                <ellipse cx="60" cy="220" rx="20" ry="5" fill="rgba(50,50,70,1)" />

                {/* MARS BITES branding on body */}
                <text x="60" y="150" textAnchor="middle" fontSize="7" fill="rgba(200,160,40,0.8)" fontFamily="serif" letterSpacing="1">MARS BITES</text>
                <text x="60" y="160" textAnchor="middle" fontSize="5" fill="rgba(200,160,40,0.5)" fontFamily="serif" letterSpacing="1.5">MBX-2095</text>
            </svg>

            {/* Animated thruster flames */}
            {(phase === "liftoff" || phase === "warp") && (
                <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: isWarp ? "-20px" : "-40px", width: "40px" }}>
                    {/* Outer flame */}
                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{ width: 36, height: 70, borderRadius: "50% 50% 60% 60%", transformOrigin: "top center", background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,200,0.95) 0%, rgba(255,160,30,0.85) 30%, rgba(255,60,0,0.6) 60%, rgba(180,30,0,0) 100%)" }}
                        animate={{ scaleX: [0.8, 1.2, 0.9], scaleY: [1, 1.15, 0.95], opacity: [0.9, 1, 0.85] }}
                        transition={{ duration: 0.12, repeat: Infinity, repeatType: "reverse" }}
                    />
                    {/* Inner bright core */}
                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{ width: 16, height: 45, borderRadius: "50% 50% 60% 60%", transformOrigin: "top center", background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,1) 0%, rgba(255,240,150,0.9) 40%, rgba(255,180,30,0) 100%)" }}
                        animate={{ scaleX: [0.9, 1.1, 0.85], scaleY: [1, 1.1, 0.9] }}
                        transition={{ duration: 0.08, repeat: Infinity, repeatType: "reverse" }}
                    />
                </div>
            )}

            {/* Idle engine glow (launchpad) */}
            {phase === "launchpad" && (
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 rounded-full"
                    style={{ bottom: "-6px", width: "30px", height: "12px", background: "radial-gradient(ellipse, rgba(255,150,30,0.5) 0%, rgba(255,60,0,0) 100%)" }}
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.15, 0.9] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                />
            )}
        </div>
    )
}

// ── System status row (launchpad) ──
function StatusRow({ frame }: { frame: number }) {
    const checks = [
        { label: "Thrusters", ok: true },
        { label: "Life Support", ok: true },
        { label: "Navigation", ok: true },
        { label: "Comms", ok: true },
        { label: "Fuel Load", ok: true },
    ]
    return (
        <motion.div
            className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 flex-wrap px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        >
            {checks.map((c, i) => (
                <motion.div
                    key={c.label}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.15 }}
                    className="flex items-center gap-1.5"
                >
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#22c55e" }}
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.17 }}
                    />
                    <span className="text-[9px] tracking-widest uppercase font-body" style={{ color: "rgba(200,160,40,0.45)" }}>
                        {c.label}
                    </span>
                </motion.div>
            ))}
        </motion.div>
    )
}
