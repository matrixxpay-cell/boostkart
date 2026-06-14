// Configurable payment settings for Nebula Market.
// Editable from the admin panel and consumed by the checkout. Persisted to
// localStorage so the storefront and admin stay in sync (demo only).
import { cryptoMethods, inrMethod } from './products.js'

const KEY = 'nebula-payment-settings'

const NETWORKS = { btc: 'Bitcoin', eth: 'ERC-20', usdt: 'TRC-20', ltc: 'Litecoin', sol: 'Solana' }

export const defaultPaymentSettings = {
  // When true, crypto orders are confirmed automatically after a simulated
  // number of on-chain confirmations — no manual review needed.
  autoConfirmCrypto: true,
  confirmationsRequired: 2,
  simulatedConfirmSeconds: 8,
  coins: cryptoMethods.reduce((acc, c) => {
    acc[c.id] = { enabled: true, address: c.address, network: NETWORKS[c.id] || '' }
    return acc
  }, {}),
  inr: { enabled: true, upiId: inrMethod.upiId, autoConfirm: false },
}

export function loadPaymentSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}')
    return {
      ...defaultPaymentSettings,
      ...raw,
      coins: mergeCoins(raw.coins),
      inr: { ...defaultPaymentSettings.inr, ...(raw.inr || {}) },
    }
  } catch {
    return defaultPaymentSettings
  }
}

function mergeCoins(saved = {}) {
  const out = {}
  for (const id of Object.keys(defaultPaymentSettings.coins)) {
    out[id] = { ...defaultPaymentSettings.coins[id], ...(saved[id] || {}) }
  }
  return out
}

export function savePaymentSettings(settings) {
  localStorage.setItem(KEY, JSON.stringify(settings))
}

// Update a single order's status in the shared order log.
export function updateOrderStatus(id, status) {
  try {
    const orders = JSON.parse(localStorage.getItem('nebula-orders') || '[]')
    const next = orders.map((o) => (o.id === id ? { ...o, status } : o))
    localStorage.setItem('nebula-orders', JSON.stringify(next))
  } catch {
    /* ignore storage errors in demo */
  }
}
