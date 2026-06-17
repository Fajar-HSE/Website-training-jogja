/**
 * pages/robots.txt.tsx
 * robots.txt dinamis
 * Akses: https://training-jogja.com/robots.txt
 */

import type { GetServerSideProps } from 'next'

const SITE_URL = 'https://training-jogja.com'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const content = `User-agent: *
Allow: /

# Blokir halaman admin dan API
Disallow: /admin/
Disallow: /api/
Disallow: /api/revalidate
Disallow: /api/test-graphql

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml
`

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'public, s-maxage=86400')
  res.write(content)
  res.end()

  return { props: {} }
}

export default function RobotsTxt() { return null }
