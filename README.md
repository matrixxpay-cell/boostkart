# Nebula Market

A modern, futuristic storefront for digital goods — premium subscriptions (Spotify, YouTube, Netflix),
Discord server boosts, Nitro, AI tools, gaming top-ups and more. Built with **React**, **Vite**,
**Tailwind CSS**, **Framer Motion** scroll animations and **Lucide** icons.

> Demo project. Not affiliated with any of the brands referenced. No real payments are processed.

## Features

- **Futuristic UI** — glassmorphism, neon gradients, animated grid, glow effects and scroll-reveal animations.
- **Storefront** — home page, searchable/filterable catalog, and rich product detail pages with plan selection.
- **Cart** — persistent (localStorage), quantity controls, coupons (`NEBULA10`, `GALAXY20`).
- **Checkout (dummy)** — multi-step flow with **crypto** payments (BTC, ETH, USDT, LTC, SOL) and **INR / UPI**,
  live coin amount conversion, copy-to-clipboard addresses, QR placeholder and TX/UTR submission.
- **Manual verification** — order-tracking page where customers check status (pending / verified / rejected).
- **Admin panel** — professional console with dashboard (stats, revenue chart, queue), orders management
  (verify/reject), product catalog, customers and settings.

## Getting started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the production build
```

## Routes

| Path            | Page                                   |
| --------------- | -------------------------------------- |
| `/`             | Home / landing                         |
| `/products`     | Catalog (supports `?cat=` and `?q=`)   |
| `/product/:id`  | Product details + buy box              |
| `/checkout`     | Cart + crypto/INR checkout (demo)      |
| `/verify`       | Manual order verification / tracking   |
| `/admin`        | Admin console                          |

## Tech

- React 18 + React Router 6
- Vite 5
- Tailwind CSS 3
- Framer Motion
- Lucide React icons

Orders placed at checkout are stored in `localStorage` (`nebula-orders`) so they appear in the
verification page and the admin panel — purely for demonstration.
