import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  Search,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Sparkles,
  ExternalLink,
  MoreVertical,
  Wallet,
  Zap,
  Save,
  Lock,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Key,
  Send,
  Check,
  ShieldCheck,
} from 'lucide-react'
import Icon from '../components/Icon.jsx'
import { categories, cryptoMethods, formatUSD } from '../data/products.js'
import { loadPaymentSettings, savePaymentSettings } from '../data/settings.js'
import { useProducts, FULFILLMENT_TYPES } from '../context/ProductsContext.jsx'

// ---- admin auth (client-side demo gate) ----
const PIN_KEY = 'nebula-admin-pin'
const DEFAULT_PIN = 'admin123'
function getPin() {
  return localStorage.getItem(PIN_KEY) || DEFAULT_PIN
}

// ---- demo data helpers ----
function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem('nebula-orders') || '[]')
  } catch {
    return []
  }
}
function saveOrders(o) {
  localStorage.setItem('nebula-orders', JSON.stringify(o))
}

// Seed a few demo orders so the panel never looks empty.
const SEED = [
  { id: 'NBL-A1B2C3', email: 'liam@mail.com', method: 'BTC', total: 15.99, totalINR: 1334, status: 'verified', items: [{ name: 'Spotify Premium', durationLabel: '12 Months', qty: 1, price: 15.99 }], createdAt: new Date(Date.now() - 3600e3).toISOString() },
  { id: 'NBL-D4E5F6', email: 'sara@mail.com', method: 'UPI / INR', total: 9.99, totalINR: 833, status: 'pending', items: [{ name: 'Discord Server Boost ×14', durationLabel: '1 Month — 14x', qty: 1, price: 9.99 }], createdAt: new Date(Date.now() - 1200e3).toISOString() },
  { id: 'NBL-G7H8I9', email: 'noah@mail.com', method: 'USDT', total: 14.99, totalINR: 1250, status: 'verified', items: [{ name: 'Discord Nitro (Full)', durationLabel: '12 Months', qty: 1, price: 14.99 }], createdAt: new Date(Date.now() - 7200e3).toISOString() },
  { id: 'NBL-J1K2L3', email: 'emma@mail.com', method: 'ETH', total: 3.49, totalINR: 291, status: 'rejected', items: [{ name: 'Netflix 4K Ultra HD', durationLabel: '1 Month', qty: 1, price: 3.49 }], createdAt: new Date(Date.now() - 86400e3).toISOString() },
  { id: 'NBL-M4N5O6', email: 'olivia@mail.com', method: 'SOL', total: 7.99, totalINR: 666, status: 'pending', items: [{ name: 'ChatGPT Plus', durationLabel: '1 Month', qty: 1, price: 7.99 }], createdAt: new Date(Date.now() - 600e3).toISOString() },
]

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const STATUS_META = {
  pending: { label: 'Pending', color: 'text-amber-300', dot: 'bg-amber-400', bg: 'bg-amber-400/10' },
  confirming: { label: 'Confirming', color: 'text-sky-300', dot: 'bg-sky-400', bg: 'bg-sky-400/10' },
  verified: { label: 'Verified', color: 'text-emerald-400', dot: 'bg-emerald-400', bg: 'bg-emerald-400/10' },
  rejected: { label: 'Rejected', color: 'text-rose-400', dot: 'bg-rose-400', bg: 'bg-rose-400/10' },
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('nebula-admin-authed') === '1')
  const [tab, setTab] = useState('dashboard')
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const existing = loadOrders()
    if (existing.length === 0) {
      saveOrders(SEED)
      setOrders(SEED)
    } else {
      setOrders(existing)
    }
  }, [])

  function setStatus(id, status) {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, status } : o))
      saveOrders(next)
      return next
    })
  }

  // Attach delivered credentials to an order and mark it verified.
  function deliverOrder(id, delivery) {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === id ? { ...o, delivery: { ...delivery, deliveredAt: new Date().toISOString() }, status: 'verified' } : o,
      )
      saveOrders(next)
      return next
    })
  }

  function logout() {
    sessionStorage.removeItem('nebula-admin-authed')
    setAuthed(false)
  }

  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} />

  return (
    <div className="flex min-h-screen bg-nebula-bg">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-nebula-surface/40 p-5 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-nebula-primary to-nebula-cyan shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="font-display text-sm font-bold leading-tight">Nebula<span className="gradient-text">Market</span></p>
            <p className="text-[11px] text-slate-500">Admin Console</p>
          </div>
        </Link>

        <nav className="mt-8 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                tab === n.id ? 'bg-gradient-to-r from-nebula-primary/20 to-nebula-cyan/10 text-white shadow-glow' : 'text-slate-400 hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <n.icon className="h-4.5 w-4.5" /> {n.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-gradient-to-br from-nebula-primary/15 to-nebula-cyan/10 p-4">
          <p className="text-sm font-semibold text-white">Pro tip</p>
          <p className="mt-1 text-xs text-slate-400">Verify crypto payments by matching the TX hash on-chain before delivering.</p>
        </div>
        <Link to="/" className="mt-4 flex items-center gap-2 text-xs text-slate-500 hover:text-white">
          <ExternalLink className="h-3.5 w-3.5" /> View storefront
        </Link>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/5 bg-nebula-bg/80 px-4 backdrop-blur-xl sm:px-6">
          <div>
            <h1 className="font-display text-lg font-bold capitalize">{tab}</h1>
            <p className="hidden text-xs text-slate-500 sm:block">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input placeholder="Search…" className="input w-56 pl-10" />
            </div>
            <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03]">
              <Bell className="h-5 w-5 text-slate-300" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-nebula-pink" />
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-1.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-nebula-primary to-nebula-pink text-xs font-bold text-white">A</span>
              <span className="hidden text-sm font-medium sm:inline">Admin</span>
            </div>
            <button onClick={logout} title="Log out" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:border-rose-400/40 hover:text-rose-300">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Mobile tab switcher */}
        <div className="flex gap-1 overflow-x-auto border-b border-white/5 px-4 py-2 lg:hidden">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${tab === n.id ? 'bg-white/10 text-white' : 'text-slate-400'}`}
            >
              <n.icon className="h-3.5 w-3.5" /> {n.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {tab === 'dashboard' && <Dashboard orders={orders} />}
          {tab === 'orders' && <Orders orders={orders} setStatus={setStatus} deliverOrder={deliverOrder} />}
          {tab === 'products' && <ProductsAdmin />}
          {tab === 'customers' && <Customers orders={orders} />}
          {tab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Auth gate ---------------- */
function AdminLogin({ onAuth }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (pin === getPin()) {
      sessionStorage.setItem('nebula-admin-authed', '1')
      onAuth()
    } else {
      setError(true)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-nebula-bg bg-grid px-4">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-br from-nebula-card/80 to-nebula-surface/40 p-8 backdrop-blur-xl"
      >
        <div className="flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-nebula-primary to-nebula-cyan shadow-glow">
            <Lock className="h-7 w-7 text-white" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold">Admin access</h1>
          <p className="mt-2 text-sm text-slate-400">Enter your PIN to open the console.</p>
        </div>

        <div className="mt-6">
          <label className="label">Admin PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value)
              setError(false)
            }}
            placeholder="••••••••"
            autoFocus
            className="input text-center tracking-widest"
          />
          {error && <p className="mt-2 text-center text-xs text-rose-400">Incorrect PIN. Try again.</p>}
        </div>

        <button type="submit" className="btn-primary mt-5 w-full">
          <ShieldCheck className="h-4 w-4" /> Unlock console
        </button>

        <p className="mt-4 text-center text-[11px] text-slate-600">
          Demo PIN: <code className="text-slate-400">{DEFAULT_PIN}</code> · change it in Settings
        </p>
        <Link to="/" className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-white">
          <ExternalLink className="h-3.5 w-3.5" /> Back to storefront
        </Link>
      </motion.form>
    </div>
  )
}

/* ---------------- Dashboard ---------------- */
function Dashboard({ orders }) {
  const { products } = useProducts()
  const revenue = orders.filter((o) => o.status === 'verified').reduce((s, o) => s + o.total, 0)
  const pending = orders.filter((o) => o.status === 'pending').length
  const verified = orders.filter((o) => o.status === 'verified').length

  const stats = [
    { label: 'Revenue', value: formatUSD(revenue), change: '+12.4%', up: true, icon: DollarSign },
    { label: 'Orders', value: orders.length, change: '+8.1%', up: true, icon: ShoppingCart },
    { label: 'Pending verification', value: pending, change: pending > 2 ? 'Action needed' : 'On track', up: pending <= 2, icon: Clock },
    { label: 'Conversion', value: '4.7%', change: '-0.3%', up: false, icon: TrendingUp },
  ]

  // Build a simple 7-day bar chart from order timestamps (demo).
  const chart = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return { label: d.toLocaleDateString('en', { weekday: 'short' }), value: 0 }
    })
    orders.forEach((o) => {
      const diff = Math.floor((Date.now() - new Date(o.createdAt)) / 86400e3)
      if (diff >= 0 && diff < 7) days[6 - diff].value += o.total
    })
    // add baseline so bars are visible in demo
    return days.map((d, i) => ({ ...d, value: d.value + 20 + ((i * 37) % 60) }))
  }, [orders])
  const maxVal = Math.max(...chart.map((c) => c.value), 1)

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card-surface p-5"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-nebula-primary/20 to-nebula-cyan/20 text-nebula-secondary">
                <s.icon className="h-5 w-5" />
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${s.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {s.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {s.change}
              </span>
            </div>
            <p className="mt-4 font-display text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-slate-400">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="card-surface p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">Revenue this week</h3>
              <p className="text-sm text-slate-400">Verified orders, last 7 days</p>
            </div>
            <span className="chip text-emerald-300"><TrendingUp className="h-3.5 w-3.5" /> Trending up</span>
          </div>
          <div className="mt-8 flex h-48 items-end justify-between gap-3">
            {chart.map((c, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(c.value / maxVal) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.6, ease: 'easeOut' }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-nebula-primary/40 to-nebula-cyan/80"
                />
                <span className="text-xs text-slate-500">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification queue summary */}
        <div className="card-surface p-6">
          <h3 className="font-display text-lg font-semibold text-white">Verification queue</h3>
          <div className="mt-6 space-y-4">
            <QueueRow icon={Clock} color="text-amber-300" label="Awaiting review" value={orders.filter((o) => o.status === 'pending').length} />
            <QueueRow icon={CheckCircle2} color="text-emerald-400" label="Verified today" value={verified} />
            <QueueRow icon={XCircle} color="text-rose-400" label="Rejected" value={orders.filter((o) => o.status === 'rejected').length} />
          </div>
          <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200/90">
            {pending > 0 ? `${pending} order(s) need manual verification.` : 'All caught up — no pending orders.'}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="card-surface p-6">
        <h3 className="font-display text-lg font-semibold text-white">Top products</h3>
        <div className="mt-4 space-y-3">
          {products.slice(0, 5).map((p, i) => (
            <div key={p.id} className="flex items-center gap-4">
              <span className="w-5 text-sm font-bold text-slate-500">{i + 1}</span>
              <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${p.color}22`, color: p.color }}>
                <Icon name={p.icon} className="h-5 w-5" />
              </span>
              <span className="flex-1 text-sm font-medium text-white">{p.name}</span>
              <div className="hidden h-2 w-32 overflow-hidden rounded-full bg-white/5 sm:block">
                <div className="h-full rounded-full bg-gradient-to-r from-nebula-primary to-nebula-cyan" style={{ width: `${100 - i * 16}%` }} />
              </div>
              <span className="w-14 text-right text-sm text-slate-400">{p.reviews.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function QueueRow({ icon: I, color, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-slate-300"><I className={`h-4 w-4 ${color}`} /> {label}</span>
      <span className="font-display text-lg font-bold text-white">{value}</span>
    </div>
  )
}

/* ---------------- Orders ---------------- */
function Orders({ orders, setStatus, deliverOrder }) {
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')
  const [openId, setOpenId] = useState(null)

  const openOrder = orders.find((o) => o.id === openId) || null

  const filtered = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false
    if (q && !`${o.id} ${o.email}`.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'verified', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                filter === f ? 'bg-gradient-to-r from-nebula-primary to-nebula-cyan text-white' : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order / email…" className="input pl-10 sm:w-64" />
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-500">No orders match this filter.</td></tr>
              )}
              {filtered.map((o) => {
                const meta = STATUS_META[o.status] || STATUS_META.pending
                return (
                  <tr key={o.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <p className="font-mono font-semibold text-white">{o.id}</p>
                      <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{o.email}</td>
                    <td className="px-5 py-4 text-slate-400">
                      {o.items.map((it) => `${it.name} ×${it.qty}`).join(', ')}
                    </td>
                    <td className="px-5 py-4"><span className="chip">{o.method}</span></td>
                    <td className="px-5 py-4 font-semibold text-white">{formatUSD(o.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.bg} ${meta.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} /> {meta.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setOpenId(o.id)} className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10">
                          {o.delivery ? <Eye className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />} {o.delivery ? 'View' : 'Deliver'}
                        </button>
                        {o.status !== 'rejected' && (
                          <button onClick={() => setStatus(o.id, 'rejected')} className="inline-flex items-center gap-1 rounded-lg bg-rose-500/15 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/25">
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {openOrder && (
          <OrderDrawer
            order={openOrder}
            onClose={() => setOpenId(null)}
            onDeliver={(delivery) => {
              deliverOrder(openOrder.id, delivery)
              setOpenId(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------- Order delivery drawer ---------------- */
function OrderDrawer({ order, onClose, onDeliver }) {
  const existing = order.delivery
  const [type, setType] = useState(existing?.type || 'serial')
  const [content, setContent] = useState(existing?.content || '')

  const typeMeta = FULFILLMENT_TYPES.find((t) => t.id === type) || FULFILLMENT_TYPES[0]
  const placeholder =
    type === 'serial'
      ? 'XXXXX-XXXXX-XXXXX-XXXXX'
      : type === 'account'
        ? 'email: user@mail.com\npassword: ••••••••'
        : type === 'download'
          ? 'https://files.nebula.market/your-download.zip'
          : 'Delivery instructions or notes for the customer…'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 40 }}
        animate={{ x: 0 }}
        exit={{ x: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-nebula-surface p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Order {order.id}</h3>
            <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <DrawerField label="Customer" value={order.email || '—'} />
          <DrawerField label="Payment" value={order.method} />
          <DrawerField label="Total" value={`${formatUSD(order.total)} · ₹${order.totalINR?.toLocaleString('en-IN')}`} />
          <DrawerField label="Status" value={(STATUS_META[order.status] || STATUS_META.pending).label} />
        </div>
        {order.discord && <div className="mt-3"><DrawerField label="Discord / invite" value={order.discord} /></div>}
        {order.txid && <div className="mt-3"><DrawerField label="TX / UTR" value={order.txid} /></div>}

        <div className="mt-5">
          <p className="label">Items</p>
          <ul className="space-y-2">
            {order.items.map((it, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                <span className="text-slate-200">{it.name} <span className="text-slate-500">· {it.durationLabel} ×{it.qty}</span></span>
                <span className="text-slate-300">{formatUSD(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-nebula-cyan" />
            <h4 className="font-semibold text-white">{existing ? 'Delivered credentials' : 'Deliver credentials'}</h4>
          </div>
          <p className="mt-1 text-xs text-slate-500">Sent to the customer and shown on their order page once verified.</p>

          <div className="mt-4">
            <label className="label">Delivery type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="input">
              {FULFILLMENT_TYPES.map((t) => (
                <option key={t.id} value={t.id} className="bg-nebula-surface">{t.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <label className="label">{typeMeta.label} content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={type === 'account' ? 4 : 3}
              placeholder={placeholder}
              className="input font-mono text-xs"
            />
          </div>

          <button
            onClick={() => onDeliver({ type, content })}
            disabled={!content.trim()}
            className="btn-primary mt-4 w-full"
          >
            <Send className="h-4 w-4" /> {existing ? 'Update & re-deliver' : 'Deliver & mark verified'}
          </button>
        </div>

        {order.status !== 'rejected' && (
          <button onClick={onClose} className="mt-3 text-center text-xs text-slate-500 hover:text-white">Close without delivering</button>
        )}
      </motion.div>
    </motion.div>
  )
}

function DrawerField({ label, value }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 break-words font-medium text-slate-200">{value}</p>
    </div>
  )
}

/* ---------------- Products (CRUD) ---------------- */
const blankProduct = {
  name: '',
  category: 'streaming',
  tagline: '',
  description: '',
  price: 0,
  oldPrice: '',
  stock: 100,
  delivery: 'Instant',
  badge: '',
  color: '#7c5cff',
  icon: 'Box',
  rating: 5,
  reviews: 0,
  fulfillmentType: 'serial',
  durations: [{ label: '1 Month', price: 0 }],
  features: [],
}

const FULFILLMENT_LABEL = FULFILLMENT_TYPES.reduce((a, t) => ({ ...a, [t.id]: t.label }), {})

function ProductsAdmin() {
  const { products, addProduct, updateProduct, removeProduct, resetProducts } = useProducts()
  const [editing, setEditing] = useState(null) // product or {} for new
  const [confirmDelete, setConfirmDelete] = useState(null)

  function handleSave(data) {
    if (data.id) updateProduct(data.id, data)
    else addProduct(data)
    setEditing(null)
  }

  return (
    <div className="space-y-4">
      <div className="card-surface overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
          <h3 className="font-display text-lg font-semibold text-white">Catalog ({products.length})</h3>
          <div className="flex gap-2">
            <button onClick={resetProducts} className="btn-ghost text-xs">Reset to defaults</button>
            <button onClick={() => setEditing({ ...blankProduct })} className="btn-primary"><Plus className="h-4 w-4" /> Add product</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Fulfillment</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">No products. Add one to get started.</td></tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${p.color}22`, color: p.color }}>
                        <Icon name={p.icon} className="h-5 w-5" />
                      </span>
                      <span className="font-medium text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 capitalize text-slate-400">{p.category}</td>
                  <td className="px-5 py-4"><span className="chip">{FULFILLMENT_LABEL[p.fulfillmentType] || 'Manual'}</span></td>
                  <td className="px-5 py-4 font-semibold text-white">{formatUSD(p.price)}</td>
                  <td className="px-5 py-4">
                    <span className={`chip ${p.stock < 80 ? 'text-amber-300' : 'text-emerald-300'}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing(p)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-slate-300 hover:text-white"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setConfirmDelete(p)} className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {editing && <ProductForm initial={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-white/10 bg-nebula-surface p-6 text-center">
              <Trash2 className="mx-auto h-8 w-8 text-rose-400" />
              <h3 className="mt-3 font-display text-lg font-bold text-white">Delete “{confirmDelete.name}”?</h3>
              <p className="mt-1 text-sm text-slate-400">This removes it from the storefront. You can reset to defaults later.</p>
              <div className="mt-5 flex gap-2">
                <button onClick={() => setConfirmDelete(null)} className="btn-ghost flex-1">Cancel</button>
                <button onClick={() => { removeProduct(confirmDelete.id); setConfirmDelete(null) }} className="btn flex-1 bg-rose-500 text-white hover:bg-rose-600">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(() => ({ ...blankProduct, ...initial, oldPrice: initial.oldPrice ?? '' }))
  const set = (patch) => setF((s) => ({ ...s, ...patch }))

  function setDuration(i, patch) {
    setF((s) => ({ ...s, durations: s.durations.map((d, idx) => (idx === i ? { ...d, ...patch } : d)) }))
  }
  function addDuration() {
    setF((s) => ({ ...s, durations: [...s.durations, { label: '', price: 0 }] }))
  }
  function removeDuration(i) {
    setF((s) => ({ ...s, durations: s.durations.filter((_, idx) => idx !== i) }))
  }

  function submit(e) {
    e.preventDefault()
    const durations = f.durations.filter((d) => d.label.trim()).map((d) => ({ label: d.label.trim(), price: Number(d.price) || 0 }))
    const cleaned = {
      ...f,
      name: f.name.trim() || 'Untitled product',
      price: Number(f.price) || 0,
      oldPrice: f.oldPrice === '' ? null : Number(f.oldPrice),
      stock: Number(f.stock) || 0,
      rating: Number(f.rating) || 5,
      reviews: Number(f.reviews) || 0,
      badge: f.badge.trim() || null,
      icon: f.icon.trim() || 'Box',
      durations: durations.length ? durations : [{ label: '1 Month', price: Number(f.price) || 0 }],
      features: Array.isArray(f.features)
        ? f.features
        : String(f.features || '').split('\n').map((s) => s.trim()).filter(Boolean),
    }
    onSave(cleaned)
  }

  const featuresText = Array.isArray(f.features) ? f.features.join('\n') : f.features

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit}
        initial={{ x: 40 }} animate={{ x: 0 }} exit={{ x: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-white/10 bg-nebula-surface p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">{f.id ? 'Edit product' : 'New product'}</h3>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="label">Name</label>
            <input value={f.name} onChange={(e) => set({ name: e.target.value })} required className="input" placeholder="e.g. Spotify Premium" />
          </div>
          <div>
            <label className="label">Tagline</label>
            <input value={f.tagline} onChange={(e) => set({ tagline: e.target.value })} className="input" placeholder="Short one-liner" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={f.description} onChange={(e) => set({ description: e.target.value })} rows={3} className="input" placeholder="Full description" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select value={f.category} onChange={(e) => set({ category: e.target.value })} className="input">
                {categories.map((c) => <option key={c.id} value={c.id} className="bg-nebula-surface">{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Fulfillment type</label>
              <select value={f.fulfillmentType} onChange={(e) => set({ fulfillmentType: e.target.value })} className="input">
                {FULFILLMENT_TYPES.map((t) => <option key={t.id} value={t.id} className="bg-nebula-surface">{t.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Price (USD)</label>
              <input type="number" step="0.01" min="0" value={f.price} onChange={(e) => set({ price: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Compare-at price (optional)</label>
              <input type="number" step="0.01" min="0" value={f.oldPrice} onChange={(e) => set({ oldPrice: e.target.value })} className="input" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Stock</label>
              <input type="number" min="0" value={f.stock} onChange={(e) => set({ stock: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Delivery</label>
              <input value={f.delivery} onChange={(e) => set({ delivery: e.target.value })} className="input" placeholder="Instant" />
            </div>
            <div>
              <label className="label">Badge</label>
              <input value={f.badge} onChange={(e) => set({ badge: e.target.value })} className="input" placeholder="Hot" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Icon (Lucide)</label>
              <input value={f.icon} onChange={(e) => set({ icon: e.target.value })} className="input" placeholder="Music" />
            </div>
            <div>
              <label className="label">Accent color</label>
              <input type="color" value={f.color} onChange={(e) => set({ color: e.target.value })} className="input h-[42px] p-1" />
            </div>
            <div>
              <label className="label">Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={f.rating} onChange={(e) => set({ rating: e.target.value })} className="input" />
            </div>
          </div>

          {/* Durations / plans */}
          <div>
            <div className="flex items-center justify-between">
              <label className="label mb-0">Plans / durations</label>
              <button type="button" onClick={addDuration} className="text-xs font-semibold text-nebula-secondary hover:underline">+ Add plan</button>
            </div>
            <div className="mt-2 space-y-2">
              {f.durations.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <input value={d.label} onChange={(e) => setDuration(i, { label: e.target.value })} placeholder="1 Month" className="input flex-1" />
                  <input type="number" step="0.01" min="0" value={d.price} onChange={(e) => setDuration(i, { price: e.target.value })} placeholder="0.00" className="input w-28" />
                  <button type="button" onClick={() => removeDuration(i)} className="grid w-10 shrink-0 place-items-center rounded-xl border border-white/10 text-slate-500 hover:text-rose-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Features (one per line)</label>
            <textarea
              value={featuresText}
              onChange={(e) => set({ features: e.target.value.split('\n') })}
              rows={4}
              className="input"
              placeholder={'Ad-free listening\nOffline downloads'}
            />
          </div>
        </div>

        <div className="sticky bottom-0 mt-6 flex gap-2 bg-nebula-surface pt-2">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1"><Save className="h-4 w-4" /> {f.id ? 'Save changes' : 'Create product'}</button>
        </div>
      </motion.form>
    </motion.div>
  )
}

/* ---------------- Customers ---------------- */
function Customers({ orders }) {
  // Aggregate customers from orders.
  const map = {}
  orders.forEach((o) => {
    const k = o.email || 'unknown'
    if (!map[k]) map[k] = { email: k, orders: 0, spent: 0 }
    map[k].orders += 1
    if (o.status === 'verified') map[k].spent += o.total
  })
  const customers = Object.values(map)

  return (
    <div className="card-surface overflow-hidden">
      <div className="border-b border-white/10 p-5">
        <h3 className="font-display text-lg font-semibold text-white">Customers ({customers.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Orders</th>
              <th className="px-5 py-3 font-medium">Lifetime spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.length === 0 && (
              <tr><td colSpan={3} className="px-5 py-12 text-center text-slate-500">No customers yet.</td></tr>
            )}
            {customers.map((c) => (
              <tr key={c.email} className="transition hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-nebula-primary to-nebula-pink text-xs font-bold uppercase text-white">
                      {c.email.slice(0, 2)}
                    </span>
                    <span className="text-slate-200">{c.email}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-300">{c.orders}</td>
                <td className="px-5 py-4 font-semibold text-white">{formatUSD(c.spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------------- Settings ---------------- */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-gradient-to-r from-nebula-primary to-nebula-cyan' : 'bg-white/10'}`}
      aria-pressed={checked}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

function SettingsPanel() {
  const [settings, setSettings] = useState(loadPaymentSettings)
  const [saved, setSaved] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [pinSaved, setPinSaved] = useState(false)

  function savePin() {
    if (newPin.trim().length < 4) return
    localStorage.setItem(PIN_KEY, newPin.trim())
    setNewPin('')
    setPinSaved(true)
    setTimeout(() => setPinSaved(false), 1800)
  }

  function update(patch) {
    setSettings((s) => ({ ...s, ...patch }))
  }
  function updateCoin(id, patch) {
    setSettings((s) => ({ ...s, coins: { ...s.coins, [id]: { ...s.coins[id], ...patch } } }))
  }
  function save() {
    savePaymentSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const meta = (id) => cryptoMethods.find((c) => c.id === id) || {}

  return (
    <div className="space-y-6">
      {/* Admin security */}
      <div className="card-surface p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-nebula-pink/20 to-nebula-primary/20 text-nebula-pink">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Admin security</h3>
            <p className="text-sm text-slate-400">Change the PIN used to unlock this console.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="label">New PIN (min 4 characters)</label>
            <input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="New admin PIN" className="input" />
          </div>
          <button onClick={savePin} disabled={newPin.trim().length < 4} className="btn-primary">
            {pinSaved ? <><Check className="h-4 w-4" /> Updated</> : <><Save className="h-4 w-4" /> Update PIN</>}
          </button>
        </div>
      </div>

      {/* Auto-processing */}
      <div className="card-surface p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-nebula-cyan/20 text-emerald-300">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Crypto auto-processing</h3>
            <p className="text-sm text-slate-400">Confirm crypto payments automatically — no manual review.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
            <div>
              <p className="font-medium text-white">Auto-confirm crypto payments</p>
              <p className="text-xs text-slate-500">When on, orders verify & deliver after on-chain confirmations.</p>
            </div>
            <Toggle checked={settings.autoConfirmCrypto} onChange={(v) => update({ autoConfirmCrypto: v })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Confirmations required</label>
              <input
                type="number"
                min={1}
                max={12}
                value={settings.confirmationsRequired}
                onChange={(e) => update({ confirmationsRequired: Math.max(1, Number(e.target.value) || 1) })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Avg. confirmation time (seconds)</label>
              <input
                type="number"
                min={1}
                value={settings.simulatedConfirmSeconds}
                onChange={(e) => update({ simulatedConfirmSeconds: Math.max(1, Number(e.target.value) || 1) })}
                className="input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Crypto wallets */}
      <div className="card-surface p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-nebula-primary/20 to-nebula-cyan/20 text-nebula-secondary">
            <Wallet className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Crypto wallets</h3>
            <p className="text-sm text-slate-400">Receiving addresses shown to customers at checkout.</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {cryptoMethods.map((c) => {
            const cfg = settings.coins[c.id]
            return (
              <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg text-xs font-bold" style={{ background: `${c.color}22`, color: c.color }}>
                    {c.symbol[0]}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-white">{c.name} <span className="text-slate-500">· {cfg.network}</span></p>
                  </div>
                  <span className={`text-xs font-semibold ${cfg.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>{cfg.enabled ? 'Enabled' : 'Disabled'}</span>
                  <Toggle checked={cfg.enabled} onChange={(v) => updateCoin(c.id, { enabled: v })} />
                </div>
                <input
                  value={cfg.address}
                  onChange={(e) => updateCoin(c.id, { address: e.target.value })}
                  placeholder={`${c.symbol} receiving address`}
                  className="input mt-3 font-mono text-xs"
                  disabled={!cfg.enabled}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* INR / UPI */}
      <div className="card-surface p-6">
        <h3 className="font-display text-lg font-semibold text-white">UPI / INR</h3>
        <p className="text-sm text-slate-400">Indian Rupee payments are verified manually.</p>
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
            <p className="font-medium text-white">Accept UPI / INR</p>
            <Toggle checked={settings.inr.enabled} onChange={(v) => update({ inr: { ...settings.inr, enabled: v } })} />
          </div>
          <div>
            <label className="label">UPI ID</label>
            <input
              value={settings.inr.upiId}
              onChange={(e) => update({ inr: { ...settings.inr, upiId: e.target.value } })}
              className="input font-mono text-sm"
              disabled={!settings.inr.enabled}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} className="btn-primary">
          {saved ? <><Check className="h-4 w-4" /> Saved</> : <><Save className="h-4 w-4" /> Save payment settings</>}
        </button>
        <span className="text-xs text-slate-500">Changes apply to the checkout immediately.</span>
      </div>
    </div>
  )
}
