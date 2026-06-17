/**
 * components/SEO.tsx
 * Komponen SEO global — meta tags + structured data (JSON-LD)
 *
 * Structured data yang di-inject:
 * - Organization (semua halaman)
 * - BreadcrumbList (semua halaman kecuali home)
 * - Article (halaman artikel)
 * - Course (halaman pelatihan)
 * - FAQPage (jika faqItems disediakan)
 */

import Head from 'next/head'
import { useRouter } from 'next/router'

// ─── Types ────────────────────────────────────────────────────────────────────

type ArticleData = {
  publishedTime?: string
  modifiedTime?: string
  authorName?: string
  category?: string
}

type CourseData = {
  name: string
  description: string
  provider?: string
  price?: string
  duration?: string
  level?: string
}

type FAQItem = {
  question: string
  answer: string
}

type SEOProps = {
  title: string
  description: string
  ogImage?: string
  ogType?: 'website' | 'article'
  canonical?: string
  articleData?: ArticleData
  courseData?: CourseData
  faqItems?: FAQItem[]
  schemaType?: 'Organization' | 'Article' | 'WebPage'
  noindex?: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SITE_URL = 'https://training-jogja.com'
const SITE_NAME = 'Training Jogja'
const ORG_PHONE = '+62-274-000-0000'
const ORG_ADDRESS = {
  street: 'Jl. Patangpuluhan No.26A Wirobrajan',
  city: 'Yogyakarta',
  postal: '55251',
  country: 'ID',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SEO({
  title,
  description,
  ogImage = '/images/hero.png',
  ogType = 'website',
  canonical,
  articleData,
  courseData,
  faqItems,
  schemaType = 'WebPage',
  noindex = false,
}: SEOProps) {
  const router = useRouter()
  const canonicalUrl = canonical || `${SITE_URL}${router.asPath.split('?')[0]}`
  const ogImageFull = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`

  // ── 1. Organization schema ─────────────────────────────────────────────────
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/logo.png`,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: ORG_PHONE,
      contactType: 'customer support',
      areaServed: 'ID',
      availableLanguage: 'Indonesian',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORG_ADDRESS.street,
      addressLocality: ORG_ADDRESS.city,
      postalCode: ORG_ADDRESS.postal,
      addressCountry: ORG_ADDRESS.country,
    },
    sameAs: [
      'https://www.instagram.com/trainingjogja',
      'https://www.linkedin.com/company/trainingjogja',
    ],
  }

  // ── 2. BreadcrumbList schema ───────────────────────────────────────────────
  const pathSegments = router.asPath.split('?')[0].split('/').filter(Boolean)
  const breadcrumbSchema = pathSegments.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Beranda',
            item: SITE_URL,
          },
          ...pathSegments.map((segment, idx) => ({
            '@type': 'ListItem',
            position: idx + 2,
            name: segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            item: `${SITE_URL}/${pathSegments.slice(0, idx + 1).join('/')}`,
          })),
        ],
      }
    : null

  // ── 3. Article schema ──────────────────────────────────────────────────────
  const articleSchema =
    ogType === 'article' && articleData
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          '@id': `${canonicalUrl}#article`,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl,
          },
          headline: title,
          description,
          image: ogImageFull,
          datePublished: articleData.publishedTime,
          dateModified: articleData.modifiedTime || articleData.publishedTime,
          author: {
            '@type': 'Person',
            name: articleData.authorName || SITE_NAME,
          },
          publisher: {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: SITE_NAME,
            logo: {
              '@type': 'ImageObject',
              url: `${SITE_URL}/images/logo.png`,
            },
          },
          articleSection: articleData.category || 'K3 & Lingkungan',
          inLanguage: 'id-ID',
        }
      : null

  // ── 4. Course schema ───────────────────────────────────────────────────────
  const courseSchema = courseData
    ? {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: courseData.name,
        description: courseData.description,
        url: canonicalUrl,
        provider: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: courseData.provider || SITE_NAME,
        },
        ...(courseData.price && {
          offers: {
            '@type': 'Offer',
            price: courseData.price.replace(/[^0-9]/g, ''),
            priceCurrency: 'IDR',
            availability: 'https://schema.org/InStock',
          },
        }),
        ...(courseData.duration && {
          timeRequired: courseData.duration,
        }),
        ...(courseData.level && {
          educationalLevel: courseData.level,
        }),
        inLanguage: 'id-ID',
      }
    : null

  // ── 5. FAQPage schema ──────────────────────────────────────────────────────
  const faqSchema =
    faqItems && faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null

  return (
    <Head>
      {/* ── Basic Meta ───────────────────────────────────────────────── */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      }

      {/* ── Open Graph ───────────────────────────────────────────────── */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageFull} />
      <meta property="og:locale" content="id_ID" />

      {/* ── Twitter Card ─────────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageFull} />

      {/* ── Article meta ─────────────────────────────────────────────── */}
      {ogType === 'article' && articleData?.publishedTime && (
        <meta property="article:published_time" content={articleData.publishedTime} />
      )}
      {ogType === 'article' && articleData?.modifiedTime && (
        <meta property="article:modified_time" content={articleData.modifiedTime} />
      )}

      {/* ── Structured Data (JSON-LD) ─────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {courseSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </Head>
  )
}
