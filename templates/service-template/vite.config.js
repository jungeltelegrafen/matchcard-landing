import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Set API_PORT in .env.local to match whichever port matchcard-landing runs on
  const apiPort = process.env.API_PORT || env.API_PORT || '3000'

  return {
    // Production build uses /repo-name/ prefix for GitHub Pages; dev uses /
    base: mode === 'production' ? '/your-repo-name/' : '/',
    plugins: [react()],
    server: {
      proxy: {
        // Forwards /api calls to the local matchcard-landing Next.js server
        '/api': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', () => {}) // silence ECONNREFUSED when API server is off
          },
        },
      },
    },
  }
})
