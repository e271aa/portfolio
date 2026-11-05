import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Without a site address (local work, CI), the canonical link would point at "/", which the
// build then tries to read as a file and fails. A canonical link needs the full address anyway,
// so it is left out until VITE_SITE_URL is set (production sets it).
const canonicalNeedsSite = (site) => ({
  name: 'canonical-needs-site',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => (site ? html : html.replace(/\s*<link rel="canonical"[^>]*>/, '')),
  },
})

export default defineConfig(({ mode }) => ({
  plugins: [
    canonicalNeedsSite(loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL),
    tailwindcss(),
    react(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    unstubEnvs: true,
    exclude: ['**/node_modules/**', 'e2e/**'],
  },
}))
