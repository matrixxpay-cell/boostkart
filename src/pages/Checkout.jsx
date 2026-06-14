import { useEffect, useMemo, useRef, useState } from 'react'
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
  Loader2,
  Zap,
  CheckCircle2,
  Mail,
} from 'lucide-react'
import Icon from '../components/Icon.jsx'
import { useCart } from '../context/CartContext.jsx'
import { cryptoMethods, formatUSD } from '../data/products.js'
import { loadPaymentSettings, updateOrderStatus } from '../data/settings.js'

const USD_TO_INR = 83.4

// Rough demo conversion rates (USD per coin) — illustrative only.
const RATES = { btc: 64000, eth: 3400, usdt: 1, ltc: 82, sol: 145 }

export default function Checkout() {
  const { items, updateQty, removeItem, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  // Payment configuration comes from the admin panel (with sane defaults).
  const settings = useMemo(loadPaymentSettings, [])
  const enabledCoins = useMemo(
    () =>
      cryptoMethods
        .filter((c) => settings.coins[c.id]?.enabled)
        .map((c) => ({ ...c, ...settings.coins[c.id] })),
    [settings],
  )

  const [step, setStep] = useState(1) // 1 = details, 2 = payment, 3 = confirmation
  const [email, setEmail] = useState('')
  const [discord, setDiscord] = useState('')
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [payType, setPayType] = useState('crypto')
  const [coin, setCoin] = useState(enabledCoins[0]?.id || 'btc')
  const [copied, setCopied] = useState('')
  const [txid, setTxid] = useState('')
  const [order, setOrder] = useState(null)
  const [confirmations, setConfirmations] = useState(0)

  const discount = appliedCoupon && !appliedCoupon.invalid ? subtotal * appliedCoupon.pct : 0
  const total = Math.max(0, subtotal - discount)
  const totalINR = useMemo(() => Math.round(total * USD_TO_INR), [total])

  const activeCoin = enabledCoins.find((c) => c.id === coin) || enabledCoins[0]
  const coinAmount = activeCoin ? (total / RATES[activeCoin.id]).toFixed(activeCoin.id === 'usdt' ? 2 : 6) : '0'

  // Drive simulated on-chain confirmations for auto-processed crypto orders.
  const tickRef = useRef(null)
  useEffect(() => {
    if (step !== 3 || !order || order.status !== 'confirming') return
    const required = Math.max(1, settings.confirmationsRequired)
    const interval = Math.max(700, (settings.simulatedConfirmSeconds * 1000) / required)
    let n = 0
    tickRef.current = setInterval(() => {
      n += 1
      setConfirmations(n)
      if (n >= required) {
        clearInterval(tickRef.current)
        updateOrderStatus(order.id, 'verified')
        setOrder((o) => (o ? { ...o, status: 'verified' } : o))
      }
    }, interval)
    return () => clearInterval(tickRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, order?.id])

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
    const auto = payType === 'crypto' && settings.autoConfirmCrypto
    const newOrder = {
      id,
      email,
      discord,
      items: items.map((i) => ({ name: i.name, durationLabel: i.durationLabel, qty: i.qty, price: i.price })),
      total,
      totalINR,
      method: payType === 'crypto' ? activeCoin.symbol : 'UPI / INR',
      txid,
      auto,
      status: auto ? 'confirming' : 'pending',
      createdAt: new Date().toISOString(),
    }
    try {
      const orders = JSON.parse(localStorage.getItem('nebula-orders') || '[]')
      orders.unshift(newOrder)
      localStorage.setItem('nebula-orders', JSON.stringify(orders))
    } catch {
      /* ignore storage errors in demo */
    }
    clearCart()
    setConfirmations(0)
    setOrder(newOrder)
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
  if (step === 3 && order) {
    return <Confirmation order={order} confirmations={confirmations} required={Math.max(1, settings.confirmationsRequired)} />
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
                  disabled={!settings.inr.enabled}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-40 ${
                    payType === 'inr' ? 'border-nebula-primary bg-nebula-primary/10 text-white shadow-glow' : 'border-white/10 bg-white/[0.02] text-slate-300'
                  }`}
                >
                  <IndianRupee className="h-4 w-4" /> UPI / INR
                </button>
              </div>

              <AnimatePresence mode="wait">
                {payType === 'crypto' ? (
                  <motion.div key="crypto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5">
                    {settings.autoConfirmCrypto && (
                      <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs text-emerald-200/90">
                        <Zap className="h-4 w-4 shrink-0" />
                        <span><strong>Automatic processing</strong> — crypto payments are confirmed on-chain and delivered instantly, no manual review.</span>
                      </div>
                    )}
                    {enabledCoins.length === 0 ? (
                      <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-200/90">No crypto methods are currently enabled. Please use UPI / INR.</p>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {enabledCoins.map((c) => (
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
                              <p className="mt-1 text-xs text-slate-500">≈ {formatUSD(total)} · {activeCoin.network} · rate locked 15:00 min</p>
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
                              <span className="label">Transaction ID / Hash (optional)</span>
                              <input value={txid} onChange={(e) => setTxid(e.target.value)} placeholder="Paste your TX hash to speed things up" className="input" />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
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
                            <span className="font-mono text-sm text-slate-300">{settings.inr.upiId}</span>
                            <button onClick={() => copy(settings.inr.upiId, 'upi')} className="text-slate-400 hover:text-white">
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
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs text-amber-200/90">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>UPI / INR payments are <strong>manually verified</strong> by our team (typically 5–15 minutes) before delivery.</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-5 text-center text-xs text-slate-600">Demo checkout — no real payment is processed.</p>
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
              <button onClick={() => setStep(2)} disabled={!email} className="btn-primary mt-6 w-full">
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
              {payType === 'crypto' && settings.autoConfirmCrypto ? (
                <p className="flex items-center gap-2"><Zap className="h-4 w-4 text-emerald-400" /> Crypto auto-confirmed & delivered instantly</p>
              ) : (
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-nebula-primary" /> Manual verification 5–15 min</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Confirmation({ order, confirmations, required }) {
  const confirming = order.status === 'confirming'
  const verified = order.status === 'verified'

  return (
    <div className="container-page py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-nebula-card/70 to-nebula-surface/30 p-10 text-center"
      >
        <span
          className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl shadow-glow ${
            verified ? 'bg-gradient-to-br from-emerald-500 to-nebula-cyan' : 'bg-gradient-to-br from-nebula-primary to-nebula-cyan'
          }`}
        >
          {confirming ? (
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          ) : verified ? (
            <CheckCircle2 className="h-8 w-8 text-white" />
          ) : (
            <PartyPopper className="h-8 w-8 text-white" />
          )}
        </span>

        {confirming && (
          <>
            <h1 className="mt-6 font-display text-2xl font-bold">Confirming your payment…</h1>
            <p className="mt-2 text-slate-400">
              Watching the {order.method} network for your transaction. This is automatic — no need to do anything.
            </p>
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>On-chain confirmations</span>
                <span className="font-mono text-white">{Math.min(confirmations, required)}/{required}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-nebula-primary to-nebula-cyan"
                  animate={{ width: `${(Math.min(confirmations, required) / required) * 100}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
            </div>
          </>
        )}

        {verified && (
          <>
            <h1 className="mt-6 font-display text-2xl font-bold">Payment confirmed!</h1>
            <p className="mt-2 text-slate-400">
              Your {order.method} payment was auto-verified on-chain and your order has been delivered to
              {' '}<span className="text-white">{order.email || 'your email'}</span>.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-sm text-emerald-300">
              <Mail className="h-4 w-4" /> Delivery email sent — check your inbox & spam
            </div>
          </>
        )}

        {order.status === 'pending' && (
          <>
            <h1 className="mt-6 font-display text-2xl font-bold">Order received!</h1>
            <p className="mt-2 text-slate-400">
              We've logged your payment and our team is verifying it now. Delivery goes to
              {' '}<span className="text-white">{order.email || 'your email'}</span>.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-amber-300">
              <Clock className="h-4 w-4" /> Manual verification: typically 5–15 minutes
            </div>
          </>
        )}

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Order ID</p>
          <p className="font-display text-xl font-bold gradient-text">{order.id}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/verify" className="btn-primary flex-1">Track / verify order</Link>
          <Link to="/products" className="btn-ghost flex-1">Continue shopping</Link>
        </div>
      </motion.div>
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
