const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Perbaiki warning "multiple lockfiles" — pastikan Next.js tahu root project ini
  outputFileTracingRoot: path.join(__dirname),

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'training-jogja.com',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // Redirect 301 — jaga SEO artikel yang sudah terindeks Google
  // Semua akses ke /resource-center/:slug diarahkan ke /:slug (flat URL asli)
  async redirects() {
    return [
      {
        source: '/resource-center/:slug',
        destination: '/:slug',
        permanent: true, // 301 — Google transfer PageRank ke URL baru
      },
    ]
  },

  // Header keamanan & cache
  async headers() {
    return [
      {
        source: '/api/revalidate',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
      {
        source: '/api/posts',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=21600, stale-while-revalidate=3600',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
