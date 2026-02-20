"use client"

import { useState, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { toast } from "sonner"
import { X, User, Users, Calendar, Clock, Mail, Phone, ChevronDown, Star, CheckCircle2, Rocket } from "lucide-react"

// -------------------------------------------------------
//  RESERVATION MODAL
//  Click the trigger → the booking card flies in
// -------------------------------------------------------

interface FormState {
    name: string
    email: string
    phone: string
    guests: string
    date: string
    time: string
    occasion: string
    seat: string
    notes: string
}

const TIMES = [
    "17:00 MT", "17:30 MT", "18:00 MT", "18:30 MT",
    "19:00 MT", "19:30 MT", "20:00 MT", "20:30 MT",
    "21:00 MT", "21:30 MT", "22:00 MT",
]

const OCCASIONS = ["None", "Birthday", "Anniversary", "Business", "Galactic Milestone", "Proposal", "Other"]
const SEATS = ["Standard Dome", "Mars View Window", "Private Chamber", "Chef's Counter", "Observation Deck VIP"]
const GUESTS_OPTIONS = ["1", "2", "3", "4", "5", "6", "7—10 (Group)", "11+ (Event)"]

function InputField({
    label, icon, type = "text", value, onChange, placeholder,
}: {
    label: string; icon: ReactNode; type?: string; value: string;
    onChange: (v: string) => void; placeholder?: string
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] tracking-[0.4em] uppercase font-body font-bold" style={{ color: "rgba(200,160,40,0.7)" }}>
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(200,160,40,0.5)" }}>
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-body outline-none transition-all"
                    style={{
                        background: "rgba(20,16,4,0.7)",
                        border: "1px solid rgba(200,160,40,0.18)",
                        color: "rgba(240,225,180,0.9)",
                        caretColor: "#ffd700",
                    }}
                    onFocus={(e) => { e.target.style.border = "1px solid rgba(200,160,40,0.55)"; e.target.style.boxShadow = "0 0 16px rgba(200,160,40,0.1)" }}
                    onBlur={(e) => { e.target.style.border = "1px solid rgba(200,160,40,0.18)"; e.target.style.boxShadow = "none" }}
                />
            </div>
        </div>
    )
}

function SelectField({
    label, icon, value, onChange, options,
}: {
    label: string; icon: ReactNode; value: string;
    onChange: (v: string) => void; options: string[]
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] tracking-[0.4em] uppercase font-body font-bold" style={{ color: "rgba(200,160,40,0.7)" }}>
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10" style={{ color: "rgba(200,160,40,0.5)" }}>
                    {icon}
                </div>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 rounded-xl text-sm font-body outline-none appearance-none transition-all cursor-pointer"
                    style={{
                        background: "rgba(20,16,4,0.7)",
                        border: "1px solid rgba(200,160,40,0.18)",
                        color: value ? "rgba(240,225,180,0.9)" : "rgba(200,160,40,0.4)",
                    }}
                    onFocus={(e) => { e.target.style.border = "1px solid rgba(200,160,40,0.55)"; e.target.style.boxShadow = "0 0 16px rgba(200,160,40,0.1)" }}
                    onBlur={(e) => { e.target.style.border = "1px solid rgba(200,160,40,0.18)"; e.target.style.boxShadow = "none" }}
                >
                    <option value="" style={{ background: "#0a0800" }}>— Select —</option>
                    {options.map((o) => (
                        <option key={o} value={o} style={{ background: "#0a0800", color: "rgba(240,225,180,0.9)" }}>{o}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(200,160,40,0.5)" }} />
            </div>
        </div>
    )
}

// Success card shown after submission
function SuccessCard({ name, date, time, guests, seat, onClose }: {
    name: string; date: string; time: string; guests: string; seat: string; onClose: () => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.7, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-center px-8 py-10"
        >
            {/* Animated checkmark */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-6"
            >
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                        background: "linear-gradient(135deg, rgba(180,135,0,0.2), rgba(220,180,40,0.15))",
                        border: "2px solid rgba(200,160,40,0.5)",
                        boxShadow: "0 0 40px rgba(200,160,40,0.25)",
                    }}
                >
                    <CheckCircle2 className="w-10 h-10" style={{ color: "#ffd700" }} />
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <div
                    className="h-px w-32 mx-auto mb-6"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(200,160,40,0.6), transparent)" }}
                />
                <p className="text-[10px] tracking-[0.5em] uppercase font-body mb-2" style={{ color: "rgba(200,160,40,0.55)" }}>
                    Reservation Confirmed
                </p>
                <h3 className="text-3xl font-black font-heading mb-1" style={{ color: "#ffd700" }}>
                    Welcome, {name}
                </h3>
                <p className="text-sm font-body mb-8" style={{ color: "rgba(200,160,40,0.5)" }}>
                    Your table on Mars has been secured.
                </p>

                {/* Booking summary */}
                <div
                    className="rounded-2xl p-5 mb-6 text-left space-y-3"
                    style={{ background: "rgba(20,16,4,0.5)", border: "1px solid rgba(200,160,40,0.15)" }}
                >
                    {[
                        { label: "📅 Date", value: date || "To be confirmed" },
                        { label: "⏱ Time", value: time || "To be confirmed" },
                        { label: "👥 Party Size", value: guests || "—" },
                        { label: "🪑 Seating", value: seat || "Standard Dome" },
                    ].map((row) => (
                        <div key={row.label} className="flex justify-between items-center">
                            <span className="text-xs font-body" style={{ color: "rgba(200,160,40,0.5)" }}>{row.label}</span>
                            <span className="text-xs font-bold font-body" style={{ color: "rgba(240,225,180,0.85)" }}>{row.value}</span>
                        </div>
                    ))}
                </div>

                <p className="text-xs font-body mb-6" style={{ color: "rgba(200,160,40,0.35)" }}>
                    A confirmation has been transmitted to your communication module.<br />
                    Boarding pass will be delivered 24 hours before your arrival.
                </p>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-10 py-3 rounded-full font-black font-heading text-sm"
                    style={{
                        background: "linear-gradient(135deg, #b8860b, #ffd700, #b8860b)",
                        color: "#0a0800",
                        boxShadow: "0 0 24px rgba(200,160,40,0.3)",
                    }}
                >
                    <Rocket className="inline w-4 h-4 mr-2" />
                    Prepare for Launch
                </motion.button>
            </motion.div>
        </motion.div>
    )
}

// ---- MAIN MODAL ----
export function ReservationModal({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<1 | 2>(1) // 2-step form
    const [form, setForm] = useState<FormState>({
        name: "", email: "", phone: "",
        guests: "", date: "", time: "",
        occasion: "", seat: "", notes: "",
    })

    const set = (k: keyof FormState) => (v: string) => setForm((p) => ({ ...p, [k]: v }))

    const handleOpen = () => { setOpen(true); setSubmitted(false); setStep(1) }
    const handleClose = () => { setOpen(false); setSubmitted(false); setStep(1) }

    const canStep1 = form.name.trim() && form.email.trim()
    const canStep2 = form.guests && form.date && form.time && form.seat

    const handleSubmit = async () => {
        if (!canStep2) return
        setLoading(true)
        await new Promise((r) => setTimeout(r, 1800))
        setLoading(false)
        setSubmitted(true)
        toast("🚀 Booking confirmed!", { description: `See you on Mars, ${form.name}!` })
    }

    const modal = (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 cursor-pointer"
                        style={{ background: "rgba(2,1,8,0.85)", backdropFilter: "blur(10px)" }}
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* THE CARD — flies in like a card flip */}
                    <motion.div
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl"
                        style={{
                            background: "linear-gradient(155deg, rgba(14,11,2,0.99) 0%, rgba(8,6,1,0.99) 100%)",
                            border: "1px solid rgba(200,160,40,0.28)",
                            boxShadow: "0 0 80px rgba(200,160,40,0.12), 0 40px 80px rgba(0,0,0,0.8)",
                        }}
                        initial={{ opacity: 0, scale: 0.65, rotateY: -80, y: 40 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7, rotateY: 80, y: 40 }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Top gold shimmer bar */}
                        <div
                            className="h-0.5 w-full rounded-t-3xl"
                            style={{ background: "linear-gradient(90deg, transparent, #ffd700, rgba(255,250,200,0.9), #ffd700, transparent)" }}
                        />

                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <SuccessCard
                                    key="success"
                                    name={form.name}
                                    date={form.date}
                                    time={form.time}
                                    guests={form.guests}
                                    seat={form.seat}
                                    onClose={handleClose}
                                />
                            ) : (
                                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {/* Header */}
                                    <div className="px-8 pt-7 pb-5">
                                        <button
                                            onClick={handleClose}
                                            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                            style={{ background: "rgba(200,160,40,0.1)", border: "1px solid rgba(200,160,40,0.2)", color: "rgba(200,160,40,0.7)" }}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        <p className="text-[10px] tracking-[0.5em] uppercase font-body mb-2" style={{ color: "rgba(200,160,40,0.55)" }}>
                                            — Reserve Your Module —
                                        </p>
                                        <h2 className="text-2xl md:text-3xl font-black font-heading" style={{ color: "#ffd700" }}>
                                            Book Your Table<br />
                                            <span style={{ color: "rgba(240,225,180,0.55)", fontSize: "0.6em", letterSpacing: "0.1em" }}>
                                                on Mars
                                            </span>
                                        </h2>

                                        {/* Step indicator */}
                                        <div className="flex items-center gap-3 mt-5">
                                            {[1, 2].map((s) => (
                                                <div key={s} className="flex items-center gap-2">
                                                    <div
                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black font-heading transition-all duration-300"
                                                        style={
                                                            step >= s
                                                                ? { background: "linear-gradient(135deg,#b8860b,#ffd700)", color: "#0a0800" }
                                                                : { background: "rgba(200,160,40,0.1)", border: "1px solid rgba(200,160,40,0.25)", color: "rgba(200,160,40,0.4)" }
                                                        }
                                                    >
                                                        {s}
                                                    </div>
                                                    <span className="text-[9px] uppercase tracking-widest font-body hidden sm:inline" style={{ color: step >= s ? "rgba(200,160,40,0.7)" : "rgba(200,160,40,0.25)" }}>
                                                        {s === 1 ? "Guest Info" : "Booking Details"}
                                                    </span>
                                                    {s < 2 && (
                                                        <div className="h-px w-8" style={{ background: step > 1 ? "rgba(200,160,40,0.4)" : "rgba(200,160,40,0.12)" }} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="px-8 pb-8 space-y-5">
                                        <AnimatePresence mode="wait">
                                            {step === 1 ? (
                                                <motion.div
                                                    key="step1"
                                                    initial={{ opacity: 0, x: 30 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -30 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="space-y-4"
                                                >
                                                    <InputField label="Full Name" icon={<User className="w-4 h-4" />} value={form.name} onChange={set("name")} placeholder="Astronaut Jane Smith" />
                                                    <InputField label="Email" icon={<Mail className="w-4 h-4" />} type="email" value={form.email} onChange={set("email")} placeholder="you@spacemail.sol" />
                                                    <InputField label="Phone / Comm Channel" icon={<Phone className="w-4 h-4" />} type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 (000) 000-0000" />

                                                    {/* VIP features teaser */}
                                                    <div
                                                        className="rounded-xl p-4 mt-2"
                                                        style={{ background: "rgba(200,160,40,0.04)", border: "1px solid rgba(200,160,40,0.1)" }}
                                                    >
                                                        <p className="text-[10px] tracking-widest uppercase font-body mb-2" style={{ color: "rgba(200,160,40,0.5)" }}>What's included</p>
                                                        {["Complimentary welcome drink", "Martian mineral water flight", "Priority Mars View seating", "Digital boarding pass"].map((f) => (
                                                            <div key={f} className="flex items-center gap-2 py-1">
                                                                <Star className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(200,160,40,0.55)" }} />
                                                                <span className="text-xs font-body" style={{ color: "rgba(200,160,40,0.55)" }}>{f}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <motion.button
                                                        whileTap={{ scale: 0.96 }}
                                                        disabled={!canStep1}
                                                        onClick={() => setStep(2)}
                                                        className="w-full py-4 rounded-2xl font-black font-heading text-sm tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                        style={canStep1 ? {
                                                            background: "linear-gradient(135deg, #b8860b, #ffd700, #b8860b)",
                                                            backgroundSize: "200% auto",
                                                            animation: "gold-shimmer 3s linear infinite",
                                                            color: "#0a0800",
                                                            boxShadow: "0 0 30px rgba(200,160,40,0.3)",
                                                        } : { background: "rgba(200,160,40,0.08)", border: "1px solid rgba(200,160,40,0.2)", color: "rgba(200,160,40,0.35)" }}
                                                    >
                                                        Continue to Booking →
                                                    </motion.button>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="step2"
                                                    initial={{ opacity: 0, x: 30 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -30 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="space-y-4"
                                                >
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <SelectField label="Party Size" icon={<Users className="w-4 h-4" />} value={form.guests} onChange={set("guests")} options={GUESTS_OPTIONS} />
                                                        <SelectField label="Seating" icon={<Star className="w-4 h-4" />} value={form.seat} onChange={set("seat")} options={SEATS} />
                                                    </div>
                                                    <InputField label="Date (Martian Calendar)" icon={<Calendar className="w-4 h-4" />} type="date" value={form.date} onChange={set("date")} />
                                                    <SelectField label="Preferred Arrival Time" icon={<Clock className="w-4 h-4" />} value={form.time} onChange={set("time")} options={TIMES} />
                                                    <SelectField label="Special Occasion" icon={<Star className="w-4 h-4" />} value={form.occasion} onChange={set("occasion")} options={OCCASIONS} />

                                                    {/* Notes */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] tracking-[0.4em] uppercase font-body font-bold" style={{ color: "rgba(200,160,40,0.7)" }}>
                                                            Special Requests / Dietary Notes
                                                        </label>
                                                        <textarea
                                                            rows={3}
                                                            value={form.notes}
                                                            onChange={(e) => set("notes")(e.target.value)}
                                                            placeholder="Allergies, dietary requirements, surprise requests..."
                                                            className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none resize-none transition-all"
                                                            style={{
                                                                background: "rgba(20,16,4,0.7)",
                                                                border: "1px solid rgba(200,160,40,0.18)",
                                                                color: "rgba(240,225,180,0.9)",
                                                                caretColor: "#ffd700",
                                                            }}
                                                            onFocus={(e) => { e.target.style.border = "1px solid rgba(200,160,40,0.55)"; e.target.style.boxShadow = "0 0 16px rgba(200,160,40,0.1)" }}
                                                            onBlur={(e) => { e.target.style.border = "1px solid rgba(200,160,40,0.18)"; e.target.style.boxShadow = "none" }}
                                                        />
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => setStep(1)}
                                                            className="px-5 py-4 rounded-2xl font-heading font-black text-sm transition-all hover:scale-105"
                                                            style={{ background: "rgba(200,160,40,0.08)", border: "1px solid rgba(200,160,40,0.2)", color: "rgba(200,160,40,0.6)" }}
                                                        >
                                                            ← Back
                                                        </button>
                                                        <motion.button
                                                            whileTap={{ scale: 0.96 }}
                                                            disabled={!canStep2 || loading}
                                                            onClick={handleSubmit}
                                                            className="flex-1 py-4 rounded-2xl font-black font-heading text-sm tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                            style={canStep2 && !loading ? {
                                                                background: "linear-gradient(135deg, #b8860b, #ffd700, #b8860b)",
                                                                backgroundSize: "200% auto",
                                                                animation: "gold-shimmer 3s linear infinite",
                                                                color: "#0a0800",
                                                                boxShadow: "0 0 30px rgba(200,160,40,0.3)",
                                                            } : { background: "rgba(200,160,40,0.08)", border: "1px solid rgba(200,160,40,0.2)", color: "rgba(200,160,40,0.35)" }}
                                                        >
                                                            {loading ? (
                                                                <>
                                                                    <motion.div
                                                                        animate={{ rotate: 360 }}
                                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                        className="w-4 h-4 rounded-full border-2 border-t-transparent"
                                                                        style={{ borderColor: "rgba(10,8,0,0.3)", borderTopColor: "transparent" }}
                                                                    />
                                                                    Launching...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Rocket className="w-4 h-4" />
                                                                    CONFIRM LAUNCH
                                                                </>
                                                            )}
                                                        </motion.button>
                                                    </div>

                                                    <p className="text-center text-[9px] font-body" style={{ color: "rgba(200,160,40,0.25)" }}>
                                                        No deposit required · Free cancellation 48 hours before
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )

    return (
        <>
            <span onClick={handleOpen}>{children}</span>
            {typeof document !== "undefined" && createPortal(modal, document.body)}
        </>
    )
}
