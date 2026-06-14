import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// On GitHub Pages a project site is served from /<repo>/, so the build needs
// that base path. Locally (dev / preview) we serve from root.
const repoBase = '/boostkart/'

// Emit a 404.html identical to index.html so client-side routes deep-link
// correctly on GitHub Pages (Pages serves 404.html for unknown paths).
function spaFallback() {
  return {
    name: 'spa-404-fallback',
    closeBundle() {
      const out = resolve(__dirname, 'dist')
      const index = resolve(out, 'index.html')
      if (existsSync(index)) copyFileSync(index, resolve(out, '404.html'))
    },
  }
}

export default defineConfig(({ command }) => ({
  base: command === 'build' ? repoBase : '/',
  plugins: [react(), spaFallback()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
}))
