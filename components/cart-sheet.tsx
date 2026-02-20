"use client"

import { useCart } from "@/lib/cart-context"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Trash2, Plus, Minus, Rocket } from "lucide-react"
import { toast } from "sonner"

export function CartSheet() {
    const { cart, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart()

    const handleCheckout = () => {
        toast.success("Initiating Launch Sequence...", {
            description: "Your order is being prepared for immediate interplanetary delivery.",
            icon: <Rocket className="w-4 h-4 text-primary" />,
        })
        clearCart()
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="relative p-2 hover:bg-primary/10 rounded-full transition-colors group">
                    <ShoppingCart className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                    {totalItems > 0 && (
                        <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-stellar-pulse">
                            {totalItems}
                        </span>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent className="bg-background/95 backdrop-blur-xl border-l border-primary/20 w-full sm:max-w-md flex flex-col">
                <SheetHeader className="pb-6 border-b border-primary/10">
                    <SheetTitle className="text-2xl font-black tracking-tighter font-heading flex items-center gap-2">
                        <span className="text-primary">COSMIC</span> <span className="text-accent">TRAY</span>
                    </SheetTitle>
                </SheetHeader>

                {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <ShoppingCart className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <p className="text-lg font-bold font-heading">Your tray is empty</p>
                            <p className="text-sm">The martian base is waiting for your order.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-6 py-6 font-body">
                                {cart.map((item) => (
                                    <div key={item.name} className="flex gap-4 group">
                                        <div className="text-3xl bg-secondary/10 w-16 h-16 rounded-xl flex items-center justify-center border border-secondary/20 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-accent truncate">{item.name}</h4>
                                                <button
                                                    onClick={() => removeItem(item.name)}
                                                    className="text-foreground/40 hover:text-destructive transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-foreground/60 mb-2 truncate">{item.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-primary font-bold">{item.price}</span>
                                                <div className="flex items-center gap-3 bg-card/50 rounded-lg p-1 border border-primary/20">
                                                    <button
                                                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                                                        className="p-1 hover:bg-primary/20 rounded-md transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3 text-primary" />
                                                    </button>
                                                    <span className="text-xs font-bold min-w-[20px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.name, item.quantity + 1)}
                                                        className="p-1 hover:bg-primary/20 rounded-md transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3 text-primary" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="pt-6 border-t border-primary/10 space-y-4">
                            <div className="flex justify-between items-center text-lg font-heading">
                                <span>TOTAL</span>
                                <span className="text-primary">{totalPrice} Credits</span>
                            </div>
                            <Button
                                onClick={handleCheckout}
                                className="w-full h-14 text-lg font-black tracking-widest bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform font-heading rounded-xl shadow-lg shadow-primary/20"
                            >
                                PROCEED TO LAUNCH
                            </Button>
                            <p className="text-[10px] text-center text-foreground/40 italic">
                                * Prices include atmosphere extraction and zero-G packaging.
                            </p>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
