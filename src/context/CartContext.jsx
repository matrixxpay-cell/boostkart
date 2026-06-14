import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'nebula-cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product, duration, qty = 1) {
    setItems((prev) => {
      const key = `${product.id}::${duration.label}`
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          icon: product.icon,
          color: product.color,
          durationLabel: duration.label,
          price: duration.price,
          qty,
        },
      ]
    })
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function updateQty(key, qty) {
    if (qty < 1) return removeItem(key)
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)))
  }

  function clearCart() {
    setItems([])
  }

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items])
  const subtotal = useMemo(() => items.reduce((n, i) => n + i.price * i.qty, 0), [items])

  const value = { items, addItem, removeItem, updateQty, clearCart, count, subtotal }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
