import { createContext, useContext, useEffect, useState } from 'react'
import { products as seedProducts } from '../data/products.js'

// Editable product catalog. Seeds from the static defaults on first load,
// then persists admin changes (add/edit/delete) to localStorage so the
// storefront and admin stay in sync (demo only — no backend).
const KEY = 'nebula-products'
const ProductsContext = createContext(null)

function slug(s) {
  return String(s || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function genProductId(name) {
  return `${slug(name)}-${Math.random().toString(36).slice(2, 6)}`
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) return JSON.parse(raw)
    } catch {
      /* ignore */
    }
    return seedProducts
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(products))
  }, [products])

  function addProduct(p) {
    const product = { ...p, id: p.id || genProductId(p.name) }
    setProducts((prev) => [product, ...prev])
    return product
  }
  function updateProduct(id, patch) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }
  function removeProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }
  function resetProducts() {
    setProducts(seedProducts)
  }
  function getProduct(id) {
    return products.find((p) => p.id === id)
  }

  const value = { products, addProduct, updateProduct, removeProduct, resetProducts, getProduct }
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}

// Delivery / fulfillment types a product can use.
export const FULFILLMENT_TYPES = [
  { id: 'serial', label: 'Serial / License key' },
  { id: 'account', label: 'Account login' },
  { id: 'download', label: 'Downloadable link' },
  { id: 'manual', label: 'Manual / Other' },
]
