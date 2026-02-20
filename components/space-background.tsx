"use client"

import { useEffect, useRef } from "react"

/**
 * Animated space background:
 * - Warp-speed gold/white stars
 * - Violet-gold nebulas
 * - Background CSS transitions from deep space → Mars red as user scrolls
 */
export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  // Scroll-based color change via direct DOM manipulation (no re-renders)
  useEffect(() => {
    const handleScroll = () => {
      const el = bgRef.current
      if (!el) return
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const progress = Math.min(1, window.scrollY / (maxScroll * 0.7))

      // Interpolate: deep space navy-black → deep Martian crimson-red
      const r = Math.round(4 + progress * 100)  // 4 → 104
      const g = Math.round(3 + progress * 8)    // 3 → 11
      const b = Math.round(12 - progress * 10)   // 12 → 2
      el.style.backgroundColor = `rgb(${r},${g},${b})`

      // Also add a warm red atmospheric glow at bottom as you scroll
      el.style.backgroundImage = progress > 0.1
        ? `radial-gradient(ellipse 120% 40% at 50% 110%, rgba(180,30,0,${progress * 0.35}) 0%, transparent 70%)`
        : "none"
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // init
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Canvas star warp
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    interface Star { x: number; y: number; z: number; pz: number; color: string; size: number }
    const stars: Star[] = []
    const N = 380

    // Gold, white, pale champagne palette
    const COLORS = [
      "255,255,240", "255,225,130", "255,215,0",
      "230,210,255", "255,255,255", "255,200,100",
    ]

    for (let i = 0; i < N; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width,
        y: (Math.random() - 0.5) * canvas.height,
        z: Math.random() * canvas.width,
        pz: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 1.6 + 0.3,
      })
    }

    let tick = 0
    let animId: number

    // Nebulas (violet + gold-amber)
    const NEBULAS = [
      { x: 0.18, y: 0.22, r: 0.38, c: "50,20,100" },
      { x: 0.82, y: 0.72, r: 0.32, c: "100,60,10" },
      { x: 0.5, y: 0.5, r: 0.22, c: "25,15,70" },
      { x: 0.12, y: 0.78, r: 0.2, c: "80,45,5" },
    ]

    function drawNebulas() {
      NEBULAS.forEach((n) => {
        const nx = n.x * canvas.width
        const ny = n.y * canvas.height
        const nr = n.r * Math.min(canvas.width, canvas.height)
        const g = ctx!.createRadialGradient(nx, ny, 0, nx, ny, nr)
        g.addColorStop(0, `rgba(${n.c},0.13)`)
        g.addColorStop(1, `rgba(${n.c},0)`)
        ctx!.fillStyle = g
        ctx!.beginPath()
        ctx!.arc(nx, ny, nr, 0, Math.PI * 2)
        ctx!.fill()
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      tick++
      const speed = Math.min(4, 1.5 + tick * 0.0035)
      const cx = canvas.width / 2
      const cy = canvas.height / 2

      // Semi-transparent fill for trail effect
      ctx.fillStyle = "rgba(4,3,12,0.32)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawNebulas()

      stars.forEach((s) => {
        s.pz = s.z
        s.z -= speed
        if (s.z <= 0) {
          s.x = (Math.random() - 0.5) * canvas.width
          s.y = (Math.random() - 0.5) * canvas.height
          s.z = canvas.width
          s.pz = canvas.width
        }
        const sx = (s.x / s.z) * canvas.width + cx
        const sy = (s.y / s.z) * canvas.height + cy
        const px = (s.x / s.pz) * canvas.width + cx
        const py = (s.y / s.pz) * canvas.height + cy
        const w = s.size * (1 - s.z / canvas.width) * 2.8
        const bright = Math.min(1, (1 - s.z / canvas.width) * 2.4)

        // Star streak
        ctx.beginPath()
        ctx.strokeStyle = `rgba(${s.color},${bright * 0.55})`
        ctx.lineWidth = w
        ctx.moveTo(px, py)
        ctx.lineTo(sx, sy)
        ctx.stroke()

        // Bright core
        ctx.beginPath()
        ctx.fillStyle = `rgba(${s.color},${bright})`
        ctx.arc(sx, sy, w * 0.55, 0, Math.PI * 2)
        ctx.fill()

        // Gold glow halo
        if (bright > 0.65) {
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 5)
          glow.addColorStop(0, `rgba(${s.color},${bright * 0.28})`)
          glow.addColorStop(1, `rgba(${s.color},0)`)
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(sx, sy, w * 5, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animId = requestAnimationFrame(animate)
    }

    animate()

    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize) }
  }, [])

  return (
    <>
      {/* Scroll-reactive background div */}
      <div
        ref={bgRef}
        className="fixed inset-0"
        style={{ zIndex: -20, backgroundColor: "rgb(4,3,12)", transition: "background-color 0.4s ease" }}
      />
      {/* Star canvas */}
      <canvas ref={canvasRef} className="fixed inset-0" style={{ zIndex: -10 }} />
    </>
  )
}