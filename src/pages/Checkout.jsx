import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ArrowRight,
  Bitcoin,
  IndianRupee,
  QrCode,
  Lock,
  PartyPopper,
} from 'lucide-react'
import Icon from '../components/Icon.jsx'
import { useCart } from '../context/CartContext.jsx'
import { cryptoMethods, inrMethod, formatUSD } from '../data/products.js'

const USD_TO_INR = 83.4

// Rough demo conversion rates (USD per coin) — illustrative only.
const RATES = { btc: 64000, eth: 3400, usdt: 1, ltc: 82, sol: 145 }

export default function Checkout() {
  const { items, updateQty, removeItem, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1 = cart/info, 2 = payment, 3 = confirmation
  const [email, setEmail] = useState('')
  const [discord, setDiscord] = useState('')
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [payType, setPayType] = useState('crypto') // 'crypto' | 'inr'
  const [coin, setCoin] = useState('btc')
  const [copied, setCopied] = useState('')
  const [txid, setTxid] = useState('')
  const [orderId, setOrderId] = useState('')

  const discount = appliedCoupon ? subtotal * appliedCoupon.pct : 0
  const fee = payType === 'crypto' ? 0 : subtotal * 0.0 // no fee in demo
  const total = Math.max(0, subtotal - discount + fee)
  const totalINR = useMemo(() => Math.round(total * USD_TO_INR), [total])

  const activeCoin = cryptoMethods.find((c) => c.id === coin)
  const coinAmount = activeCoin ? (total / RATES[coin]).toFixed(coin === 'usdt' ? 2 : 6) : '0'

  function applyCoupon() {
    const code = coupon.trim().toUpperCase()
    if (code === 'NEBULA10') setAppliedCoupon({ code, pct: 0.1 })
    else if (code === 'GALAXY20') setAppliedCoupon({ code, pct: 0.2 })
    else setAppliedCoupon({ code, pct: 0, invalid: true })
  }

  function copy(text, key) {
    navigator.clipboard?.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 1500)
  }

  function placeOrder(e) {
    e.preventDefault()
    const id = 'NBL-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    setOrderId(id)
    // Persist a pending order for the admin panel + verification page (demo only).
    try {
      const orders = JSON.parse(localStorage.getItem('nebula-orders') || '[]')
      orders.unshift({
        id,
        email,
        discord,
        items: items.map((i) => ({ name: i.name, durationLabel: i.durationLabel, qty: i.qty, price: i.price })),
        total,
        totalINR,
        method: payType === 'crypto' ? activeCoin.symbol : 'UPI / INR',
        txid,
        status: 'pending',
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem('nebula-orders', JSON.stringify(orders))
    } catch {
      /* ignore storage errors in demo */
    }
    clearCart()
    setStep(3)
  }

  // Empty cart state
  if (items.length === 0 && step !== 3) {
    return (
      <div className="container-page py-24 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <ShoppingBag className="h-8 w-8 text-slate-400" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-400">Add some premium goods to get started.</p>
        <Link to="/products" className="btn-primary mt-6">Browse store <ArrowRight className="h-4 w-4" /></Link>
      </div>
    )
  }

  // Confirmation
  if (step === 3) {
    return (
      <div className="container-page py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-nebula-card/70 to-nebula-surface/30 p-10 text-center"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-nebula-primary to-nebula-cyan shadow-glow">
            <PartyPopper className="h-8 w-8 text-white" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold">Order received!</h1>
          <p className="mt-2 text-slate-400">
            We've logged your payment and our team is verifying it now. You'll receive delivery on
            {' '}<span className="text-white">{email || 'your email'}</span>.
          </p>
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Order ID</p>
            <p className="font-display text-xl font-bold gradient-text">{orderId}</p>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-300">
            <Clock className="h-4 w-4" /> Manual verification: typically 5–15 minutes
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/verify" className="btn-primary flex-1">Track / verify order</Link>
            <Link to="/products" className="btn-ghost flex-1">Continue shopping</Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Secure <span className="gradient-text">Checkout</span>
      </h1>

      {/* Stepper */}
      <div className="mt-6 flex items-center gap-3 text-sm">
        <Step n={1} label="Details" active={step >= 1} current={step === 1} />
        <div className="h-px w-8 bg-white/10" />
        <Step n={2} label="Payment" active={step >= 2} current={step === 2} />
        <div className="h-px w-8 bg-white/10" />
        <Step n={3} label="Done" active={step >= 3} current={step === 3} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Cart items */}
          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-semibold text-white">Your items ({items.length})</h2>
            <div className="mt-4 divide-y divide-white/5">
              {items.map((it) => (
                <div key={it.key} className="flex items-center gap-4 py-4">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
                    style={{ background: `${it.color}22`, color: it.color }}
                  >
                    <Icon name={it.icon} className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{it.name}</p>
                    <p className="text-sm text-slate-400">{it.durationLabel}</p>
                  </div>
                  <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.02]">
                    <button onClick={() => updateQty(it.key, it.qty - 1)} className="grid h-8 w-8 place-items-center text-slate-300 hover:text-white">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold">{it.qty}</span>
                    <button onClick={() => updateQty(it.key, it.qty + 1)} className="grid h-8 w-8 place-items-center text-slate-300 hover:text-white">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="w-20 text-right font-semibold text-white">{formatUSD(it.price * it.qty)}</div>
                  <button onClick={() => removeItem(it.key)} className="text-slate-500 transition hover:text-rose-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery details */}
          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-semibold text-white">Delivery details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Email address *</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@email.com" className="input" />
              </div>
              <div>
                <label className="label">Discord username (optional)</label>
                <input value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="username#0000 or invite link" className="input" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              For Discord boosts, paste your server invite link above. Delivery is sent to your email.
            </p>
          </div>

          {/* Payment */}
          {step >= 2 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-surface p-6">
              <h2 className="font-display text-lg font-semibold text-white">Payment method</h2>

              {/* Pay type toggle */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPayType('crypto')}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    payType === 'crypto' ? 'border-nebula-primary bg-nebula-primary/10 text-white shadow-glow' : 'border-white/10 bg-white/[0.02] text-slate-300'
                  }`}
                >
                  <Bitcoin className="h-4 w-4" /> Crypto
                </button>
                <button
                  onClick={() => setPayType('inr')}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    payType === 'inr' ? 'border-nebula-primary bg-nebula-primary/10 text-white shadow-glow' : 'border-white/10 bg-white/[0.02] text-slate-300'
                  }`}
                >
                  <IndianRupee className="h-4 w-4" /> UPI / INR
                </button>
              </div>

              <AnimatePresence mode="wait">
                {payType === 'crypto' ? (
                  <motion.div key="crypto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5">
                    <div className="flex flex-wrap gap-2">
                      {cryptoMethods.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setCoin(c.id)}
                          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                            coin === c.id ? 'border-transparent text-white shadow-glow' : 'border-white/10 bg-white/[0.02] text-slate-300'
                          }`}
                          style={coin === c.id ? { background: `${c.color}` } : undefined}
                        >
                          <span className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold" style={{ background: coin === c.id ? 'rgba(255,255,255,0.2)' : `${c.color}33`, color: coin === c.id ? '#fff' : c.color }}>
                            {c.symbol[0]}
                          </span>
                          {c.symbol}
                        </button>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-5 sm:grid-cols-[160px_1fr]">
                      {/* Fake QR */}
                      <div className="mx-auto grid aspect-square w-40 place-items-center rounded-2xl border border-white/10 bg-white p-3">
                        <QrPlaceholder />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="label">Send exactly</span>
                          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                            <span className="font-mono text-lg font-bold text-white">{coinAmount} {activeCoin.symbol}</span>
                            <button onClick={() => copy(coinAmount, 'amt')} className="text-slate-400 hover:text-white">
                              {copied === 'amt' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">≈ {formatUSD(total)} · rate locked for 15:00 min</p>
                        </div>
                        <div>
                          <span className="label">{activeCoin.name} address</span>
                          <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                            <span className="truncate font-mono text-xs text-slate-300">{activeCoin.address}</span>
                            <button onClick={() => copy(activeCoin.address, 'addr')} className="shrink-0 text-slate-400 hover:text-white">
                              {copied === 'addr' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <span className="label">Transaction ID / Hash (after sending)</span>
                          <input value={txid} onChange={(e) => setTxid(e.target.value)} placeholder="Paste your TX hash for faster verification" className="input" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="inr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5">
                    <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
                      <div className="mx-auto grid aspect-square w-40 place-items-center rounded-2xl border border-white/10 bg-white p-3">
                        <QrPlaceholder />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="label">Pay amount</span>
                          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                            <span className="font-mono text-lg font-bold text-white">₹{totalINR.toLocaleString('en-IN')}</span>
                            <button onClick={() => copy(String(totalINR), 'inr')} className="text-slate-400 hover:text-white">
                              {copied === 'inr' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">≈ {formatUSD(total)} @ ₹{USD_TO_INR}/$</p>
                        </div>
                        <div>
                          <span className="label">UPI ID</span>
                          <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                            <span className="font-mono text-sm text-slate-300">{inrMethod.upiId}</span>
                            <button onClick={() => copy(inrMethod.upiId, 'upi')} className="text-slate-400 hover:text-white">
                              {copied === 'upi' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <span className="label">UPI Reference / UTR number</span>
                          <input value={txid} onChange={(e) => setTxid(e.target.value)} placeholder="12-digit UTR after payment" className="input" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-200/90">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  This is a <strong>demo checkout</strong> — no real payment is processed. After "paying", submit the
                  order and our team manually verifies it (5–15 min) before delivery.
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT — summary */}
        <div className="lg:sticky lg:top-20 lg:h-fit">
          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-semibold text-white">Order summary</h2>

            <div className="mt-4 space-y-2.5 text-sm">
              <Row label="Subtotal" value={formatUSD(subtotal)} />
              {appliedCoupon && !appliedCoupon.invalid && (
                <Row label={`Coupon (${appliedCoupon.code})`} value={`- ${formatUSD(discount)}`} accent />
              )}
              <Row label="Network / processing fee" value="Free" />
              <div className="my-3 h-px bg-white/10" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Total</span>
                <div className="text-right">
                  <div className="font-display text-xl font-bold gradient-text">{formatUSD(total)}</div>
                  <div className="text-xs text-slate-500">≈ ₹{totalINR.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-5">
              <div className="flex gap-2">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="input" />
                <button onClick={applyCoupon} className="btn-ghost shrink-0">Apply</button>
              </div>
              {appliedCoupon?.invalid && <p className="mt-2 text-xs text-rose-400">Invalid coupon code.</p>}
              {appliedCoupon && !appliedCoupon.invalid && (
                <p className="mt-2 text-xs text-emerald-400">Coupon applied — {Math.round(appliedCoupon.pct * 100)}% off!</p>
              )}
              <p className="mt-2 text-[11px] text-slate-600">Try <code className="text-slate-400">NEBULA10</code> or <code className="text-slate-400">GALAXY20</code></p>
            </div>

            {/* Action */}
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                disabled={!email}
                className="btn-primary mt-6 w-full"
              >
                Continue to payment <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <form onSubmit={placeOrder}>
                <button type="submit" className="btn-primary mt-6 w-full">
                  <Lock className="h-4 w-4" /> I've paid — submit order
                </button>
              </form>
            )}

            <div className="mt-4 space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-nebula-cyan" /> Buyer protection & warranty</p>
              <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-nebula-primary" /> Manual verification 5–15 min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step({ n, label, active, current }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition ${
          active ? 'bg-gradient-to-r from-nebula-primary to-nebula-cyan text-white' : 'bg-white/5 text-slate-500'
        } ${current ? 'ring-2 ring-nebula-primary/40' : ''}`}
      >
        {n}
      </span>
      <span className={`hidden font-medium sm:inline ${active ? 'text-white' : 'text-slate-500'}`}>{label}</span>
    </div>
  )
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={accent ? 'font-semibold text-emerald-400' : 'text-slate-200'}>{value}</span>
    </div>
  )
}

// Decorative QR-style placeholder (not a scannable code).
function QrPlaceholder() {
  return (
    <div className="grid h-full w-full grid-cols-8 grid-rows-8 gap-0.5">
      {Array.from({ length: 64 }).map((_, i) => {
        const corner = (i % 8 < 3 && i < 24) || (i % 8 > 4 && i < 24) || (i % 8 < 3 && i >= 40)
        const on = corner ? (i * 7) % 3 !== 0 : (i * 13) % 5 < 2
        return <div key={i} className={on ? 'bg-black' : 'bg-white'} />
      })}
    </div>
  )
}
