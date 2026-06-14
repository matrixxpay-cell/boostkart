import { Link } from 'react-router-dom'
import { Sparkles, Twitter, MessageCircle, Send, ShieldCheck, Zap, Headphones } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-nebula-surface/40">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-nebula-primary to-nebula-cyan shadow-glow">
                <Sparkles className="h-5 w-5 text-white" />
              </span>
              <span className="font-display text-lg font-bold">
                Nebula<span className="gradient-text">Market</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              The galaxy's most affordable hub for premium subscriptions, Discord boosts, Nitro and digital goods —
              delivered at light speed.
            </p>
            <div className="mt-5 flex gap-2">
              {[Twitter, MessageCircle, Send].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-nebula-primary/50 hover:text-white"
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Store"
            links={[
              ['Music', '/products?cat=music'],
              ['Streaming', '/products?cat=streaming'],
              ['Discord', '/products?cat=discord'],
              ['AI Tools', '/products?cat=ai'],
            ]}
          />
          <FooterCol
            title="Support"
            links={[
              ['Verify Order', '/verify'],
              ['Checkout', '/checkout'],
              ['Admin Panel', '/admin'],
              ['Store', '/products'],
            ]}
          />

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Why Nebula?</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-nebula-cyan" /> Instant automated delivery
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-nebula-primary" /> Warranty on every order
              </li>
              <li className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-nebula-pink" /> 24/7 human support
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Nebula Market. Demo project — not affiliated with any listed brand.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-slate-300">Terms</Link>
            <Link to="#" className="hover:text-slate-300">Privacy</Link>
            <Link to="#" className="hover:text-slate-300">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-white">{title}</h4>
      <ul className="space-y-3 text-sm text-slate-400">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="transition hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
