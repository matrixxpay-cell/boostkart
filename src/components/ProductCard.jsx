import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Zap, ArrowRight } from 'lucide-react'
import Icon from './Icon.jsx'
import { formatUSD } from '../data/products.js'

export default function ProductCard({ product }) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl border border-nebula-border/70 bg-nebula-card/50 p-5 backdrop-blur-xl"
    >
      {/* glow accent */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-30 blur-3xl transition-opacity duration-300 group-hover:opacity-60"
        style={{ background: product.color }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className="grid h-12 w-12 place-items-center rounded-xl border border-white/10"
          style={{ background: `${product.color}22`, color: product.color }}
        >
          <Icon name={product.icon} className="h-6 w-6" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-gradient-to-r from-nebula-primary to-nebula-pink px-2.5 py-0.5 text-[11px] font-bold text-white">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="chip text-emerald-300">-{discount}%</span>
          )}
        </div>
      </div>

      <div className="relative mt-4">
        <h3 className="font-display text-lg font-semibold text-white">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-400">{product.tagline}</p>
      </div>

      <div className="relative mt-4 flex items-center gap-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1 text-amber-300">
          <Star className="h-3.5 w-3.5 fill-amber-300" /> {product.rating}
        </span>
        <span>·</span>
        <span>{product.reviews.toLocaleString()} reviews</span>
        <span className="ml-auto inline-flex items-center gap-1 text-nebula-cyan">
          <Zap className="h-3.5 w-3.5" /> {product.delivery}
        </span>
      </div>

      <div className="relative mt-5 flex items-end justify-between border-t border-white/5 pt-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">{formatUSD(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-slate-500 line-through">{formatUSD(product.oldPrice)}</span>
            )}
          </div>
          <span className="text-[11px] text-slate-500">from / starting price</span>
        </div>
        <Link
          to={`/product/${product.id}`}
          className="inline-flex items-center gap-1 rounded-xl bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-gradient-to-r group-hover:from-nebula-primary group-hover:to-nebula-cyan"
        >
          View <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  )
}
