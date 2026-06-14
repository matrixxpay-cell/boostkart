import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, CheckCircle2, Clock, XCircle, ShieldCheck, ArrowRight, Mail, MessageCircle, Key, Copy, Check, Download, ExternalLink } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import { formatUSD } from '../data/products.js'

const DELIVERY_LABEL = {
  serial: 'Serial / License key',
  account: 'Account login',
  download: 'Download link',
  manual: 'Delivery details',
}

const STATUS = {
  pending: { label: 'Awaiting verification', icon: Clock, color: 'text-amber-300', bg: 'bg-amber-400/10 border-amber-400/20' },
  confirming: { label: 'Confirming on-chain', icon: Clock, color: 'text-sky-300', bg: 'bg-sky-400/10 border-sky-400/20' },
  verified: { label: 'Verified — delivered', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  rejected: { label: 'Payment not found', icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20' },
}

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem('nebula-orders') || '[]')
  } catch {
    return []
  }
}

export default function Verify() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(undefined) // undefined = not searched, null = not found

  function search(e) {
    e.preventDefault()
    const id = query.trim().toUpperCase()
    if (!id) return
    const order = loadOrders().find((o) => o.id === id || o.email?.toUpperCase() === id)
    setResult(order || null)
  }

  return (
    <div className="container-page py-16">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto border-nebula-primary/40 bg-nebula-primary/10 text-nebula-secondary">
            <ShieldCheck className="h-3.5 w-3.5" /> Manual verification
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Track & <span className="gradient-text">verify your order</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Enter your order ID (or email) to check the verification status. Crypto and UPI payments are
            confirmed manually by our team, usually within 5–15 minutes.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <form onSubmit={search} className="mx-auto mt-8 flex max-w-xl gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. NBL-X8K2Q7 or your email"
              className="input pl-10"
            />
          </div>
          <button type="submit" className="btn-primary shrink-0">Check status</button>
        </form>
      </Reveal>

      {/* Result */}
      <div className="mx-auto mt-8 max-w-xl">
        {result === null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <XCircle className="mx-auto h-8 w-8 text-slate-500" />
            <p className="mt-3 font-semibold text-white">No order found</p>
            <p className="mt-1 text-sm text-slate-400">
              Double-check your order ID. If you just paid, give it a moment and try again.
            </p>
          </motion.div>
        )}

        {result && <OrderResult order={result} />}
      </div>

      {/* How it works */}
      <Reveal delay={0.15}>
        <div className="mx-auto mt-16 grid max-w-4xl gap-5 sm:grid-cols-3">
          {[
            { icon: Search, title: '1. Place your order', desc: 'Pay with crypto or UPI and submit your transaction reference at checkout.' },
            { icon: Clock, title: '2. We verify', desc: 'Our team confirms the payment on-chain or via UPI — typically 5–15 minutes.' },
            { icon: CheckCircle2, title: '3. Instant delivery', desc: 'Once verified, your product is delivered to your email automatically.' },
          ].map((s, i) => (
            <div key={i} className="card-surface p-6 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-nebula-primary to-nebula-cyan text-white shadow-glow">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-semibold text-white">Need help with an order?</h3>
            <p className="text-sm text-slate-400">Our support team is online 24/7.</p>
          </div>
          <div className="flex gap-2">
            <a href="#" className="btn-ghost"><MessageCircle className="h-4 w-4" /> Discord</a>
            <a href="#" className="btn-ghost"><Mail className="h-4 w-4" /> Email</a>
          </div>
        </div>
      </Reveal>

      <p className="mx-auto mt-8 max-w-xl text-center text-xs text-slate-600">
        Don't have an order yet? <Link to="/products" className="text-nebula-secondary hover:underline">Browse the store <ArrowRight className="inline h-3 w-3" /></Link>
      </p>
    </div>
  )
}

function OrderResult({ order }) {
  const s = STATUS[order.status] || STATUS.pending
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-surface overflow-hidden">
      <div className={`flex items-center gap-3 border-b border-white/10 p-5 ${s.bg}`}>
        <s.icon className={`h-6 w-6 ${s.color}`} />
        <div>
          <p className={`font-semibold ${s.color}`}>{s.label}</p>
          <p className="text-xs text-slate-400">Order {order.id}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="Email" value={order.email || '—'} />
          <Field label="Payment method" value={order.method} />
          <Field label="Total" value={`${formatUSD(order.total)} · ₹${order.totalINR?.toLocaleString('en-IN')}`} />
          <Field label="Placed" value={new Date(order.createdAt).toLocaleString()} />
        </div>
        <div>
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
        {order.delivery?.content && <DeliveryBox delivery={order.delivery} />}

        {order.status === 'verified' && !order.delivery?.content && (
          <p className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-200/90">
            Verified & delivered. Check the email on this order (including spam) for your product details.
          </p>
        )}
        {order.status === 'pending' && (
          <p className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-200/90">
            Your payment is in the verification queue. This page updates once our team confirms it.
          </p>
        )}
        {order.status === 'confirming' && (
          <p className="rounded-lg border border-sky-400/20 bg-sky-400/5 p-3 text-xs text-sky-200/90">
            Waiting for on-chain confirmations. Your order delivers automatically once confirmed.
          </p>
        )}
      </div>
    </motion.div>
  )
}

function DeliveryBox({ delivery }) {
  const [copied, setCopied] = useState(false)
  const isLink = delivery.type === 'download'

  function copy() {
    navigator.clipboard?.writeText(delivery.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] p-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
          <Key className="h-4 w-4" /> Your delivery — {DELIVERY_LABEL[delivery.type] || 'Details'}
        </span>
        {!isLink && (
          <button onClick={copy} className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10">
            {copied ? <><Check className="h-3.5 w-3.5 text-emerald-400" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
          </button>
        )}
      </div>

      {isLink ? (
        <a
          href={delivery.content}
          target="_blank"
          rel="noreferrer"
          className="btn-primary mt-3 w-full"
        >
          <Download className="h-4 w-4" /> Download your file <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-white/10 bg-nebula-bg/60 p-3 font-mono text-sm text-emerald-100">
{delivery.content}
        </pre>
      )}
      {delivery.deliveredAt && (
        <p className="mt-2 text-[11px] text-slate-500">Delivered {new Date(delivery.deliveredAt).toLocaleString()}</p>
      )}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 font-medium text-slate-200">{value}</p>
    </div>
  )
}
