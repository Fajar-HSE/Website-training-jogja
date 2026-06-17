/**
 * pages/sitemap.xml.tsx
 * Sitemap XML dinamis — di-generate saat build dan di-revalidate via ISR.
 * Mencakup: halaman statis + artikel + solusi + pelatihan
 *
 * Akses: https://training-jogja.com/sitemap.xml
 */

import type { GetServerSideProps } from 'next'
import {
  getAllPostSlugs,
  getAllSolutionSlugs,
  getAllTrainingSlugs,
} from '../lib/wordpress'

const SITE_URL = 'https://training-jogja.com'

// Halaman statis dengan priority dan changefreq
const STATIC_PAGES = [
  { path: '/',               priority: '1.0', changefreq: 'weekly'  },
  { path: '/solusi',         priority: '0.9', changefreq: 'weekly'  },
  { path: '/pelatihan',      priority: '0.9', changefreq: 'weekly'  },
  { path: '/resource-center',priority: '0.8', changefreq: 'daily'   },
  { path: '/studi-kasus',    priority: '0.7', changefreq: 'weekly'  },
  { path: '/tentang-kami',   priority: '0.6', changefreq: 'monthly' },
  { path: '/layanan',        priority: '0.7', changefreq: 'monthly' },
  { path: '/konsultasi',     priority: '0.8', changefreq: 'monthly' },
  { path: '/kontak',         priority: '0.5', changefreq: 'monthly' },
]

function buildSitemap(urls: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`
}

function urlEntry(loc: string, priority: string, changefreq: string, lastmod?: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const today = new Date().toISOString().split('T')[0]

  // Fetch semua slug secara paralel
  const [postSlugs, solutionSlugs, trainingSlugs] = await Promise.all([
    getAllPostSlugs(),
    getAllSolutionSlugs(),
    getAllTrainingSlugs(),
  ])

  const entries: string[] = []

  // Halaman statis
  STATIC_PAGES.forEach(({ path, priority, changefreq }) => {
    entries.push(urlEntry(`${SITE_URL}${path}`, priority, changefreq, today))
  })

  // Artikel — flat URL /[slug], priority tinggi karena SEO utama
  postSlugs.forEach((slug) => {
    entries.push(urlEntry(`${SITE_URL}/${slug}`, '0.8', 'weekly'))
  })

  // Solusi
  solutionSlugs.forEach((slug) => {
    entries.push(urlEntry(`${SITE_URL}/solusi/${slug}`, '0.8', 'monthly'))
  })

  // Pelatihan
  trainingSlugs.forEach((slug) => {
    entries.push(urlEntry(`${SITE_URL}/pelatihan/${slug}`, '0.8', 'monthly'))
  })

  const sitemap = buildSitemap(entries.join('\n'))

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

// Komponen kosong — output ditangani getServerSideProps
export default function SitemapXML() { return null }
