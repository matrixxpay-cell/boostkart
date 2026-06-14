import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Headphones,
  Wallet,
  Star,
  Bitcoin,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Icon from '../components/Icon.jsx'
import { categories } from '../data/products.js'
import { useProducts } from '../context/ProductsContext.jsx'

const stats = [
  { label: 'Orders delivered', value: '128K+' },
  { label: 'Avg. delivery', value: '2 min' },
  { label: 'Happy customers', value: '47K+' },
  { label: 'Uptime', value: '99.9%' },
]

const perks = [
  { icon: Zap, title: 'Instant Delivery', desc: 'Automated fulfilment the moment your payment is confirmed.' },
  { icon: ShieldCheck, title: 'Warranty Included', desc: 'Every order is covered for its full duration. No surprises.' },
  { icon: Wallet, title: 'Crypto & UPI', desc: 'Pay with BTC, ETH, USDT, LTC, SOL or INR via UPI.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Real humans on Discord, ready whenever you need them.' },
]

export default function Home() {
  const { products } = useProducts()
  const featured = products.slice(0, 6)
  const trending = products.filter((p) => ['Hot', 'Best Seller', 'Best Value'].includes(p.badge)).slice(0, 3)

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-nebula-primary/20 blur-[140px]" />
        <div className="container-page relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="chip mb-6 border-nebula-primary/40 bg-nebula-primary/10 text-nebula-secondary"
            >
              <Sparkles className="h-3.5 w-3.5" /> Premium digital goods, light-speed delivery
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Upgrade your <span className="gradient-text">digital life</span> for less.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 max-w-xl text-lg text-slate-400"
            >
              Spotify, YouTube, Netflix, Discord server boosts, Nitro and more — at a fraction of retail.
              Pay with crypto or UPI and get delivery in minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link to="/products" className="btn-primary text-base">
                Browse Store <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/products?cat=discord" className="btn-ghost text-base">
                <Icon name="Rocket" className="h-4 w-4" /> Discord Boosts
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400"
            >
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-300 text-amber-300" /> 4.9/5 from 12,000+ reviews
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bitcoin className="h-4 w-4 text-nebula-cyan" /> Crypto accepted
              </span>
            </motion.div>
          </div>

          {/* Floating preview cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto hidden h-[420px] w-full max-w-md lg:block"
          >
            <div className="absolute inset-0 rounded-3xl border border-white/10 bg-gradient-to-br from-nebula-card/80 to-nebula-surface/40 backdrop-blur-xl" />
            <div className="animate-spin-slow absolute -right-10 -top-10 h-40 w-40 rounded-full border border-dashed border-nebula-primary/30" />
            {featured[0] && <FloatingCard className="left-6 top-8" product={featured[0]} delay={0} />}
            {featured[3] && <FloatingCard className="right-6 top-28" product={featured[3]} delay={0.6} />}
            {featured[2] && <FloatingCard className="left-10 bottom-10" product={featured[2]} delay={1.2} />}
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="container-page relative">
          <div className="grid grid-cols-2 divide-x divide-white/5 rounded-2xl border border-white/10 bg-white/[0.02] py-6 backdrop-blur-xl sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-4 text-center">
                <div className="font-display text-2xl font-bold gradient-text sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs text-slate-400 sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-page mt-24">
        <Reveal>
          <SectionHeader
            eyebrow="Shop by category"
            title="Everything you stream, play & boost"
            desc="Hand-picked digital goods across every platform you love."
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <Link
                to={`/products?cat=${c.id}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-nebula-border/70 bg-nebula-card/40 p-5 text-center transition hover:-translate-y-1 hover:border-nebula-primary/50 hover:shadow-glow"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-nebula-primary/20 to-nebula-cyan/20 text-nebula-secondary transition group-hover:scale-110">
                  <Icon name={c.icon} className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-slate-200">{c.name}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-page mt-24">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Featured"
              title="Most-loved products"
              desc="Top picks our community keeps coming back for."
            />
            <Link to="/products" className="btn-ghost hidden shrink-0 sm:inline-flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* PERKS */}
      <section className="container-page mt-24">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-nebula-card/60 to-nebula-surface/30 p-8 backdrop-blur-xl sm:p-12">
          <Reveal>
            <SectionHeader
              center
              eyebrow="Why Nebula Market"
              title="Built for speed, trust & savings"
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-nebula-primary/40">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-nebula-primary to-nebula-cyan text-white shadow-glow transition group-hover:scale-110">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="container-page mt-24">
        <Reveal>
          <SectionHeader
            eyebrow={<span className="inline-flex items-center gap-1.5"><TrendingUp className="h-4 w-4" /> Trending now</span>}
            title="Selling fast this week"
          />
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {trending.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page mt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-nebula-primary/20 via-nebula-violet/10 to-nebula-cyan/20 p-10 text-center sm:p-16">
            <div className="absolute inset-0 bg-grid opacity-40" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Ready to <span className="gradient-text">level up</span>?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-300">
                Join thousands who save every month on the subscriptions and boosts they actually use.
              </p>
              <Link to="/products" className="btn-primary mt-8 text-base">
                Start shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

function FloatingCard({ product, className, delay }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, delay, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute w-44 rounded-2xl border border-white/10 bg-nebula-card/90 p-4 shadow-card backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-3">
        <span
          className="grid h-9 w-9 place-items-center rounded-lg"
          style={{ background: `${product.color}22`, color: product.color }}
        >
          <Icon name={product.icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{product.name}</p>
          <p className="text-xs text-nebula-cyan">from ${product.price}</p>
        </div>
      </div>
    </motion.div>
  )
}

function SectionHeader({ eyebrow, title, desc, center }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <span className="text-sm font-semibold uppercase tracking-widest text-nebula-secondary">{eyebrow}</span>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {desc && <p className="mt-3 text-slate-400">{desc}</p>}
    </div>
  )
}
