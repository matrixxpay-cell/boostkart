import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Star,
  Zap,
  ShieldCheck,
  Check,
  Minus,
  Plus,
  ShoppingCart,
  ChevronRight,
  Package,
  RefreshCw,
  Lock,
} from 'lucide-react'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { formatUSD } from '../data/products.js'
import { useProducts } from '../context/ProductsContext.jsx'
import { useCart } from '../context/CartContext.jsx'

const sampleReviews = [
  { name: 'Aarav K.', rating: 5, text: 'Delivered in under 2 minutes. Exactly as described, will buy again.' },
  { name: 'Mia R.', rating: 5, text: 'Cheapest price I found anywhere and it just works. Support was super fast on Discord.' },
  { name: 'Diego S.', rating: 4, text: 'Smooth checkout with crypto. Took ~10 min but no issues at all.' },
]

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, getProduct } = useProducts()
  const product = getProduct(id)
  const { addItem } = useCart()
  const [durationIdx, setDurationIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Product not found</h1>
        <Link to="/products" className="btn-primary mt-6">Back to store</Link>
      </div>
    )
  }

  const duration = product.durations[durationIdx]
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  const discount = product.oldPrice ? Math.round((1 - duration.price / product.oldPrice) * 100) : 0

  function handleAdd() {
    addItem(product, duration, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  function buyNow() {
    addItem(product, duration, qty)
    navigate('/checkout')
  }

  return (
    <div className="container-page py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link to="/" className="hover:text-white">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/products?cat=${product.category}`} className="capitalize hover:text-white">{product.category}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-300">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* Visual */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-nebula-card/70 to-nebula-surface/30 p-10">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-40 blur-3xl"
              style={{ background: product.color }}
            />
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="relative flex min-h-[320px] flex-col items-center justify-center text-center">
              <motion.span
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="grid h-28 w-28 place-items-center rounded-3xl border border-white/10 shadow-glow"
                style={{ background: `${product.color}22`, color: product.color }}
              >
                <Icon name={product.icon} className="h-14 w-14" />
              </motion.span>
              <h2 className="mt-6 font-display text-2xl font-bold text-white">{product.name}</h2>
              <p className="mt-2 max-w-sm text-sm text-slate-400">{product.tagline}</p>
            </div>
            <div className="relative mt-6 grid grid-cols-3 gap-3">
              <MiniStat icon={Zap} label="Delivery" value={product.delivery} />
              <MiniStat icon={Package} label="In stock" value={product.stock} />
              <MiniStat icon={ShieldCheck} label="Warranty" value="Full" />
            </div>
          </div>
        </Reveal>

        {/* Buy box */}
        <Reveal delay={0.1}>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              {product.badge && (
                <span className="rounded-full bg-gradient-to-r from-nebula-primary to-nebula-pink px-3 py-1 text-xs font-bold text-white">
                  {product.badge}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-sm text-amber-300">
                <Star className="h-4 w-4 fill-amber-300" /> {product.rating}
                <span className="text-slate-500">({product.reviews.toLocaleString()})</span>
              </span>
            </div>

            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
            <p className="mt-3 text-slate-400">{product.description}</p>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-4xl font-bold gradient-text">{formatUSD(duration.price)}</span>
              {product.oldPrice && (
                <span className="mb-1 text-lg text-slate-500 line-through">{formatUSD(product.oldPrice)}</span>
              )}
              {discount > 0 && (
                <span className="mb-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-sm font-semibold text-emerald-300">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Durations */}
            <div className="mt-6">
              <span className="label">Choose plan</span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                {product.durations.map((d, i) => (
                  <button
                    key={d.label}
                    onClick={() => setDurationIdx(i)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                      durationIdx === i
                        ? 'border-nebula-primary bg-nebula-primary/10 shadow-glow'
                        : 'border-white/10 bg-white/[0.02] hover:border-nebula-primary/40'
                    }`}
                  >
                    <span className="font-medium text-white">{d.label}</span>
                    <span className="font-semibold text-nebula-cyan">{formatUSD(d.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.02]">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center text-slate-300 hover:text-white">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold text-white">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-11 w-11 place-items-center text-slate-300 hover:text-white">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button onClick={handleAdd} className="btn-ghost h-11 flex-1 min-w-[140px]">
                {added ? (
                  <><Check className="h-4 w-4 text-emerald-400" /> Added!</>
                ) : (
                  <><ShoppingCart className="h-4 w-4" /> Add to cart</>
                )}
              </button>
              <button onClick={buyNow} className="btn-primary h-11 flex-1 min-w-[140px]">
                <Zap className="h-4 w-4" /> Buy now · {formatUSD(duration.price * qty)}
              </button>
            </div>

            {/* Trust row */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4 text-nebula-cyan" /> Secure checkout</span>
              <span className="inline-flex items-center gap-1.5"><RefreshCw className="h-4 w-4 text-nebula-primary" /> Replacement warranty</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-nebula-pink" /> {product.delivery} delivery</span>
            </div>

            {/* Features */}
            <div className="mt-8 card-surface p-6">
              <h3 className="font-display text-lg font-semibold text-white">What's included</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <Reveal>
          <h2 className="font-display text-2xl font-bold">Customer reviews</h2>
        </Reveal>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {sampleReviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.08}>
              <div className="card-surface h-full p-6">
                <div className="flex items-center gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className={`h-4 w-4 ${k < r.rating ? 'fill-amber-300' : 'text-slate-600'}`} />
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-300">"{r.text}"</p>
                <p className="mt-4 text-sm font-semibold text-white">{r.name}</p>
                <span className="text-xs text-emerald-400">Verified purchase</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <h2 className="font-display text-2xl font-bold">You might also like</h2>
          </Reveal>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function MiniStat({ icon: I, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
      <I className="mx-auto h-4 w-4 text-nebula-cyan" />
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  )
}
