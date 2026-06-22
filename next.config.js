/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverComponentsExternalPackages: ['@anthropic-ai/sdk'] },
  async rewrites() {
    return [
      // Serve the Vite SPA at /behovsavklarer (no trailing slash)
      { source: '/behovsavklarer', destination: '/behovsavklarer/index.html' },
    ]
  },
}
module.exports = nextConfig
