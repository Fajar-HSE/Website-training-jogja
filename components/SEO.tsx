import Head from 'next/head'
import { useRouter } from 'next/router'

type SEOProps = {
  title: string
  description: string
  ogImage?: string
  ogType?: 'website' | 'article'
  articleData?: {
    publishedTime?: string
    modifiedTime?: string
    authorName?: string
    category?: string
  }
  schemaType?: 'Organization' | 'Article' | 'WebPage'
}

export default function SEO({
  title,
  description,
  ogImage = '/images/hero.png', // Default fallback share image
  ogType = 'website',
  articleData,
  schemaType = 'WebPage',
}: SEOProps) {
  const router = useRouter()
  const siteUrl = 'https://hseskillup.com' // Domain utama website
  const canonicalUrl = `${siteUrl}${router.asPath}`

  // 1. JSON-LD Base Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    'name': 'HSE SkillUp',
    'url': siteUrl,
    'logo': `${siteUrl}/favicon.ico`,
    'sameAs': [
      'https://www.linkedin.com/company/hseskillup',
      'https://instagram.com/hseskillup'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+62-853-2888-3511',
      'contactType': 'customer support',
      'areaServed': 'ID',
      'availableLanguage': 'Indonesian'
    },
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Jl. Patangpuluhan No.26A Wirobrajan',
      'addressLocality': 'Yogyakarta',
      'postalCode': '55251',
      'addressCountry': 'ID'
    }
  }

  // 2. JSON-LD Article Schema
  const articleSchema = ogType === 'article' && articleData ? {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${canonicalUrl}/#article`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    'headline': title,
    'description': description,
    'image': ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
    'datePublished': articleData.publishedTime,
    'dateModified': articleData.modifiedTime || articleData.publishedTime,
    'author': {
      '@type': 'Organization',
      'name': articleData.authorName || 'HSE SkillUp Advisor'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'HSE SkillUp',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/favicon.ico`
      }
    },
    'genre': articleData.category || 'K3 & Lingkungan'
  } : null

  // 3. JSON-LD Breadcrumb Schema
  const pathSegments = router.asPath.split('/').filter(Boolean)
  const breadcrumbList = pathSegments.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Beranda',
        'item': siteUrl
      },
      ...pathSegments.map((segment, idx) => {
        const url = `${siteUrl}/${pathSegments.slice(0, idx + 1).join('/')}`
        const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
        return {
          '@type': 'ListItem',
          'position': idx + 2,
          'name': name,
          'item': url
        }
      })
    ]
  } : null

  return (
    <Head>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="HSE SkillUp" />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />

      {/* Google & AI Crawlers */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Inject Structured Data */}
      {schemaType === 'Organization' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      )}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {breadcrumbList && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
        />
      )}
    </Head>
  )
}
