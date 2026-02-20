"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { Plus, Flame, Star, Eye, ChevronDown } from "lucide-react"

// ---- DISH DATA WITH REAL UNSPLASH IMAGES ----
const menuData = {
  mains: [
    {
      name: "Martian Fusion Burger",
      description: "Hydroponic wagyu patty aged 30 sols in a pressurized cave, topped with zero-gravity cheese foam, volcanic-dust seasoning, and solar-flare aioli on a mineral-water-infused brioche bun.",
      price: "45 Credits",
      icon: "🍔",
      badge: "Bestseller",
      badgeColor: "#FFD700",
      spice: 2,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      tags: ["Mars Grown", "Cave-Aged"],
    },
    {
      name: "Meteor Steak",
      description: "280g prime rib-eye aged 90 Martian sols in cave vaults, finished with an ion-infused golden crust. Served with asteroid-potato mash and 3-ATM truffle reduction.",
      price: "85 Credits",
      icon: "🥩",
      badge: "Chef's Signature",
      badgeColor: "#FFD700",
      spice: 1,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
      tags: ["Premium", "Gluten-Free"],
    },
    {
      name: "Alien Platter",
      description: "Bioluminescent Europa squid, hydroponic chicken sous-vide in liquid nitrogen, and crater-roasted mushrooms from Dome 12. Three Martian dipping sauces included.",
      price: "72 Credits",
      icon: "🍽️",
      badge: "Serves 2–3",
      badgeColor: "#C8A040",
      spice: 2,
      image: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=600&auto=format&fit=crop&q=80",
      tags: ["Share", "Gluten-Free"],
    },
    {
      name: "Cosmic Pasta",
      description: "Hand-pulled noodles spun in a low-gravity chamber for silken texture, tossed in 48-hour solar flare tomato sauce with Phobos-truffle shavings and edible asteroid mineral crumb.",
      price: "38 Credits",
      icon: "🍝",
      badge: null,
      badgeColor: "",
      spice: 1,
      image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&auto=format&fit=crop&q=80",
      tags: ["Vegetarian"],
    },
    {
      name: "Zero-G Salmon",
      description: "Atlantic salmon cured 12 hours in Martian mineral salt, poached in champagne. Served on microgreens from orange-lamp farms with caviar from Europa deep-sea aquaculture.",
      price: "62 Credits",
      icon: "🐟",
      badge: "New",
      badgeColor: "#C8A040",
      spice: 0,
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80",
      tags: ["Seafood", "Light"],
    },
    {
      name: "Dome-Grown Risotto",
      description: "Arborio rice from Dome 7 hydroponic gardens, slow-cooked 40 minutes in Martian mineral broth, finished with 24-karat edible gold leaf and Earth-imported aged Parmesan.",
      price: "48 Credits",
      icon: "🍚",
      badge: null,
      badgeColor: "",
      spice: 0,
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop&q=80",
      tags: ["Vegetarian", "Gold Leaf"],
    },
  ],
  drinks: [
    {
      name: "Zero-G Smoothie",
      description: "Levitating blend of Martian scarlet berries from Hellas Planitia, cryogenic ice crystals, Phobos-cultured algae protein and Earth honey — sealed in a zero-pressure glass.",
      price: "18 Credits",
      icon: "🥤",
      badge: "Fan Fave",
      badgeColor: "#C8A040",
      spice: 0,
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80",
      tags: ["No Alcohol"],
    },
    {
      name: "Nebula Cocktail",
      description: "Earth-imported gin fused with blue spirulina algae, compressed Martian mineral water, 2 parts stardust bitters. Bioluminescent — it glows for 10 seconds when stirred.",
      price: "32 Credits",
      icon: "🍹",
      badge: "Glows",
      badgeColor: "#8080FF",
      spice: 0,
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80",
      tags: ["Signature", "Alcohol"],
    },
    {
      name: "Martian Sunrise",
      description: "Layered cocktail of hydroponic orange, Martian pomegranate grenadine, and aged tequila from Earth's finest distilleries — stratified to recreate Mars's twilight sky.",
      price: "28 Credits",
      icon: "🌅",
      badge: null,
      badgeColor: "",
      spice: 0,
      image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80",
      tags: ["Layered", "Alcohol"],
    },
  ],
  desserts: [
    {
      name: "Eclipse Dessert",
      description: "A perfect molecular chocolate sphere crafted over 3 hours, filled with liquid salted caramel and nitrogen-cooled core. Shattered tableside with a meteorite hammer. 24k gold sugar cage.",
      price: "28 Credits",
      icon: "🍫",
      badge: "Theatrical",
      badgeColor: "#C8A040",
      spice: 0,
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80",
      tags: ["Tableside", "Signature"],
    },
    {
      name: "Stardust Soufflé",
      description: "Weightless vanilla soufflé dusted with edible silver stardust and crushed Martian gemstone sugar. Risen in a pressurized dome — collapses after exactly 90 seconds, like a dying star.",
      price: "24 Credits",
      icon: "✨",
      badge: "Limited Daily",
      badgeColor: "#C8A040",
      spice: 0,
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=80",
      tags: ["Egg-Free Option"],
    },
  ],
}

const CATEGORIES = [
  { id: "mains", label: "Main Courses", icon: "🌌" },
  { id: "drinks", label: "Drinks", icon: "🧊" },
  { id: "desserts", label: "Desserts", icon: "✨" },
]

type CategoryId = keyof typeof menuData
type DishItem = (typeof menuData.mains)[0]

// ── Ripple helper ──
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

// ── Spice indicator ──
function SpiceBar({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[0, 1, 2].map((i) => (
        <Flame key={i} className="w-3 h-3" style={{ color: i < level ? "#FFD700" : "rgba(200,160,40,0.15)" }} />
      ))}
    </div>
  )
}

// ── Individual dish card ──
function DishCard({ item, idx }: { item: DishItem; idx: number }) {
  const { addItem } = useCart()
  const [flipped, setFlipped] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    addRipple(e, "rgba(200,160,40,0.15)")
    // toggle flip only if not clicking the Add button
    if ((e.target as HTMLElement).closest("button")) return
    setFlipped((p) => !p)
  }

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    addRipple(e, "rgba(255,215,0,0.5)")
    // Glow burst
    const btn = e.currentTarget
    btn.classList.add("click-burst")
    setTimeout(() => btn.classList.remove("click-burst"), 460)
    addItem({ name: item.name, description: item.description, price: item.price, icon: item.icon })
    toast.success(`${item.name} added!`, { description: "Your cosmic tray has been updated." })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleCardClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer card-press"
      style={{
        height: "380px",
        position: "relative",
        overflow: "hidden",
      }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.97, y: 2 }}
    >
      <AnimatePresence mode="wait">
        {!flipped ? (
          /* ── FRONT (image + info) ── */
          <motion.div
            key="front"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, rotateY: 90, scale: 0.92 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 flex flex-col"
          >
            {/* Dish image */}
            <div className="relative h-48 overflow-hidden flex-shrink-0 img-shimmer">
              {!imgError ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={() => setImgError(true)}
                />
              ) : (
                /* Fallback gradient visual */
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "radial-gradient(ellipse at 35% 35%, rgba(120,80,20,0.9) 0%, rgba(40,20,5,1) 100%)" }}
                >
                  <span style={{ fontSize: "4rem", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.7))" }}>{item.icon}</span>
                </div>
              )}

              {/* Dark overlay for text legibility */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,6,1,1) 0%, rgba(8,6,1,0.25) 55%, rgba(0,0,0,0.1) 100%)" }} />

              {/* Badge */}
              {item.badge && (
                <div
                  className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full font-heading"
                  style={{
                    background: item.badgeColor === "#8080FF" ? "rgba(80,80,200,0.85)" : "linear-gradient(135deg,rgba(160,120,0,0.92),rgba(220,175,20,0.92))",
                    color: "#0a0800",
                    boxShadow: `0 2px 12px ${item.badgeColor}55`,
                  }}
                >
                  {item.badge}
                </div>
              )}

              {/* Tap hint */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: "rgba(200,160,40,0.8)" }}>
                <Eye className="w-3 h-3" />
                <span className="text-[8px] uppercase tracking-widest font-body">Tap for story</span>
              </div>
            </div>

            {/* Card info */}
            <div
              className="flex-1 p-5 flex flex-col"
              style={{ background: "rgba(8,6,1,0.97)", borderLeft: "1px solid rgba(200,160,40,0.1)", borderRight: "1px solid rgba(200,160,40,0.1)", borderBottom: "1px solid rgba(200,160,40,0.1)", borderRadius: "0 0 1rem 1rem" }}
            >
              <h3 className="font-black font-heading text-base leading-tight mb-2" style={{ color: "#F0E1B4" }}>
                {item.name}
              </h3>

              <div className="flex items-center gap-3 mb-3">
                {item.spice > 0 && <SpiceBar level={item.spice} />}
                <div className="flex gap-1.5 flex-wrap">
                  {item.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider font-body" style={{ background: "rgba(200,160,40,0.1)", color: "rgba(200,160,40,0.7)", border: "1px solid rgba(200,160,40,0.2)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-auto">
                <span className="text-2xl font-black font-heading" style={{ color: "#FFD700", textShadow: "0 0 12px rgba(200,160,40,0.4)" }}>
                  {item.price}
                </span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleAdd}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black font-heading relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg,rgba(160,120,0,0.22),rgba(220,175,20,0.16))",
                    border: "1px solid rgba(200,160,40,0.45)",
                    color: "#FFD700",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(200,160,40,0.32),rgba(255,215,0,0.22))" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(160,120,0,0.22),rgba(220,175,20,0.16))" }}
                >
                  <Plus className="w-3 h-3" /> Add
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── BACK (full description) ── */
          <motion.div
            key="back"
            initial={{ opacity: 0, rotateY: -90, scale: 0.92 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col justify-between rounded-2xl p-6"
            style={{
              background: "linear-gradient(145deg,rgba(22,17,3,0.99) 0%,rgba(10,7,1,0.99) 100%)",
              border: "1px solid rgba(200,160,40,0.3)",
            }}
          >
            <div>
              {/* Gold separator */}
              <div className="h-0.5 w-full mb-5 rounded-full" style={{ background: "linear-gradient(90deg,transparent,#FFD700,transparent)" }} />
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-black font-heading text-lg mb-3" style={{ color: "#FFD700" }}>{item.name}</h3>
              <p className="text-sm leading-relaxed font-body" style={{ color: "rgba(220,195,140,0.8)" }}>{item.description}</p>
            </div>

            <div>
              <div className="flex justify-between items-center pt-4 mb-1" style={{ borderTop: "1px solid rgba(200,160,40,0.15)" }}>
                <span className="text-xl font-black font-heading" style={{ color: "#FFD700" }}>{item.price}</span>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black font-heading relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg,#b8860b,#FFD700)", color: "#0a0800", boxShadow: "0 0 20px rgba(200,160,40,0.35)" }}
                >
                  <Plus className="w-3.5 h-3.5" /> Add to Tray
                </motion.button>
              </div>
              <p className="text-[9px] text-center font-body mt-2" style={{ color: "rgba(200,160,40,0.3)" }}>Tap anywhere to flip back</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: "inset 0 0 0 1px rgba(200,160,40,0.35), 0 0 28px rgba(200,160,40,0.07)" }}
      />
    </motion.div>
  )
}

// ── Main Section ──
export function MenuSection() {
  const [active, setActive] = useState<CategoryId>("mains")
  const items = menuData[active]

  const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    addRipple(e, "rgba(200,160,40,0.3)")
    setActive(id as CategoryId)
  }

  return (
    <section id="menu" className="py-24 md:py-40 relative mars-dust-bottom">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none -z-10" style={{ background: "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(80,20,0,0.08) 0%, transparent 65%)" }} />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-center mb-14 space-y-3"
        >
          <p className="text-[10px] tracking-[0.7em] uppercase font-body" style={{ color: "rgba(200,160,40,0.45)" }}>— Galactic Cuisine —</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter font-heading" style={{ color: "#F0E1B4" }}>
            MENU &amp; <span className="text-gold-shimmer">EXPERIENCES</span>
          </h2>
          <div className="w-24 h-px mx-auto" style={{ background: "linear-gradient(90deg,transparent,rgba(200,160,40,0.6),transparent)" }} />
          <p className="text-sm font-body" style={{ color: "rgba(200,160,40,0.4)" }}>Tap any dish to reveal its full story</p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="flex justify-center gap-3 mb-12 flex-wrap"
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.id
            return (
              <button
                key={cat.id}
                onClick={(e) => handleTabClick(e, cat.id)}
                className="px-7 py-3 rounded-full text-sm font-black font-heading transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden"
                style={
                  isActive
                    ? { background: "linear-gradient(135deg,rgba(160,120,0,0.28),rgba(220,175,20,0.18))", border: "1px solid rgba(200,160,40,0.65)", color: "#FFD700", boxShadow: "0 0 24px rgba(200,160,40,0.22)" }
                    : { background: "rgba(12,9,1,0.55)", border: "1px solid rgba(200,160,40,0.14)", color: "rgba(200,160,40,0.5)" }
                }
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            )
          })}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.32 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((item, idx) => (
              <DishCard key={item.name} item={item as DishItem} idx={idx} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-14 text-[10px] tracking-widest uppercase font-body"
          style={{ color: "rgba(200,160,40,0.22)" }}
        >
          All prices in Martian Standard Credits (MSC) · Menu updated every Martian season (90 Sols)
        </motion.p>
      </div>
    </section>
  )
}