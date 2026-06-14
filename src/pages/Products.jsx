import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Icon from '../components/Icon.jsx'
import { products, categories } from '../data/products.js'

const sorts = [
  { id: 'popular', label: 'Most popular' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
]

export default function Products() {
  const [params, setParams] = useSearchParams()
  const initialCat = params.get('cat') || 'all'
  const initialQ = params.get('q') || ''

  const [cat, setCat] = useState(initialCat)
  const [q, setQ] = useState(initialQ)
  const [sort, setSort] = useState('popular')

  useEffect(() => {
    setCat(params.get('cat') || 'all')
    setQ(params.get('q') || '')
  }, [params])

  const filtered = useMemo(() => {
    let list = [...products]
    if (cat !== 'all') list = list.filter((p) => p.category === cat)
    if (q.trim()) {
      const t = q.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(t) || p.tagline.toLowerCase().includes(t),
      )
    }
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      default:
        list.sort((a, b) => b.reviews - a.reviews)
    }
    return list
  }, [cat, q, sort])

  function selectCat(id) {
    setCat(id)
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('cat')
    else next.set('cat', id)
    setParams(next, { replace: true })
  }

  return (
    <div className="container-page py-12">
      <Reveal>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-widest text-nebula-secondary">The Store</span>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Browse <span className="gradient-text">premium goods</span>
          </h1>
          <p className="max-w-2xl text-slate-400">
            {filtered.length} products · instant & manual delivery · crypto and UPI accepted.
          </p>
        </div>
      </Reveal>

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <CatBtn active={cat === 'all'} onClick={() => selectCat('all')} icon="LayoutGrid" label="All" />
          {categories.map((c) => (
            <CatBtn key={c.id} active={cat === c.id} onClick={() => selectCat(c.id)} icon={c.icon} label={c.name} />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="input pl-10 pr-9" />
            {q && (
              <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="input cursor-pointer pl-10 pr-8">
              {sorts.map((s) => (
                <option key={s.id} value={s.id} className="bg-nebula-surface">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <p className="text-lg font-semibold text-white">No products found</p>
          <p className="mt-1 text-slate-400">Try a different search or category.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

function CatBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
        active
          ? 'border-transparent bg-gradient-to-r from-nebula-primary to-nebula-cyan text-white shadow-glow'
          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-nebula-primary/40 hover:text-white'
      }`}
    >
      <Icon name={icon} className="h-4 w-4" /> {label}
    </button>
  )
}
