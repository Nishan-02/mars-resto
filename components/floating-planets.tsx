"use client"

import { useEffect, useRef } from "react"

export function FloatingPlanets() {
  const marsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = () => {
      if (!marsRef.current) return
      const y = window.scrollY
      marsRef.current.style.transform = `translateY(${y * 0.12}px) rotate(${y * 0.018}deg)`
    }
    window.addEventListener("scroll", h, { passive: true })
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -5 }}>
      {/* Mars — large, with gold-tinted atmosphere */}
      <div
        ref={marsRef}
        className="absolute"
        style={{ top: "-100px", right: "-160px", width: "500px", height: "500px" }}
      >
        <div
          className="w-full h-full rounded-full relative"
          style={{
            background: `radial-gradient(
              circle at 28% 22%,
              rgba(200, 140, 80, 0.85) 0%,
              rgba(150, 80, 30, 0.8) 30%,
              rgba(90, 40, 10, 0.9) 60%,
              rgba(20, 8, 2, 1) 100%
            )`,
            boxShadow: `
              inset -55px -40px 90px rgba(0,0,0,0.85),
              inset 25px 25px 70px rgba(200,140,60,0.2),
              0 0 80px rgba(200,150,60,0.1),
              0 0 200px rgba(150,100,20,0.05)
            `,
          }}
        >
          {/* Surface texture */}
          <div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: `repeating-linear-gradient(
                20deg, transparent, transparent 20px,
                rgba(200,130,50,0.12) 20px, rgba(200,130,50,0.12) 22px
              )`,
            }}
          />
          {/* Valles Marineris */}
          <div
            className="absolute rounded-full"
            style={{
              top: "40%", left: "12%", width: "55%", height: "7%",
              background: "rgba(50,20,5,0.65)",
              filter: "blur(10px)", transform: "rotate(-10deg)",
            }}
          />
          {/* Gold atmosphere glow ring */}
          <div
            className="absolute -inset-4 rounded-full"
            style={{
              border: "2px solid rgba(200,150,50,0.08)",
              boxShadow: "0 0 40px rgba(200,150,50,0.1), 0 0 80px rgba(180,120,30,0.05)",
            }}
          />
        </div>
      </div>

      {/* Distant moon — gold-tinted */}
      <div
        className="absolute animate-float"
        style={{ top: "11%", right: "30%", width: "26px", height: "26px", animationDuration: "14s" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 30%, rgba(200,170,120,0.9), rgba(80,60,30,0.95))",
            boxShadow: "inset -5px -4px 10px rgba(0,0,0,0.75), 0 0 8px rgba(200,160,60,0.08)",
          }}
        />
      </div>

      {/* Small gold particle clusters — stardust */}
      {[
        { top: "30%", left: "8%", size: 3, delay: "0s" },
        { top: "55%", left: "3%", size: 2, delay: "1.5s" },
        { top: "70%", right: "6%", size: 2.5, delay: "3s" },
        { top: "18%", left: "20%", size: 2, delay: "0.8s" },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-pulse-glow"
          style={{
            top: p.top, left: "left" in p ? p.left : undefined, right: "right" in p ? (p as any).right : undefined,
            width: p.size + "px", height: p.size + "px",
            background: "rgba(200,160,40,0.7)",
            boxShadow: "0 0 6px rgba(200,160,40,0.5)",
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}
