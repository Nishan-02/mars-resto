"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type CartItem = {
  name: string
  description: string
  price: string
  icon: string
  quantity: number
}

type CartContextType = {
  cart: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (name: string) => void
  updateQuantity: (name: string, quantity: number) => void
  clearCart: () => void
  totalPrice: number
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.name === item.name)
      if (existingItem) {
        return prevCart.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (name: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.name !== name))
  }

  const updateQuantity = (name: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(name)
      return
    }
    setCart((prevCart) =>
      prevCart.map((i) => (i.name === name ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => setCart([])

  const totalPrice = cart.reduce((total, item) => {
    const priceVal = parseInt(item.price.split(" ")[0])
    return total + priceVal * item.quantity
  }, 0)

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
