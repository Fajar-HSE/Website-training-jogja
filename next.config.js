/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'training-jogja.com',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com', // avatar WordPress
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

  // Header keamanan dasar
  async headers() {
    return [
      {
        source: '/api/revalidate',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },

  // Redirect 301: URL lama WordPress → flat URL baru
  // Menjaga ranking SEO artikel yang sudah terindeks
  async redirects() {
    return [
      {
        source: '/resource-center/:slug',
        destination: '/:slug',
        permanent: true, // 301
      },
    ]
  },
}

module.exports = nextConfig
