/**
 * lib/queries/fragments.ts
 * GraphQL fragments yang dipakai bersama antar query.
 * Setiap fragment hanya meminta field yang benar-benar dirender.
 */

// ─── Post Fragments ───────────────────────────────────────────────────────────

/** Untuk listing (kartu artikel) — tanpa content body */
export const POST_CARD_FRAGMENT = /* GraphQL */ `
  fragment PostCard on Post {
    id
    databaseId
    slug
    title
    excerpt
    date
    modified
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
    categories {
      nodes {
        name
        slug
      }
    }
    author {
      node {
        name
        avatar {
          url
        }
      }
    }
  }
`

/** Untuk halaman detail artikel — termasuk content body */
export const POST_DETAIL_FRAGMENT = /* GraphQL */ `
  fragment PostDetail on Post {
    id
    databaseId
    slug
    title
    excerpt
    content
    date
    modified
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
    categories {
      nodes {
        name
        slug
      }
    }
    tags {
      nodes {
        name
        slug
      }
    }
    author {
      node {
        name
        description
        avatar {
          url
        }
      }
    }
    seo {
      title
      metaDesc
      opengraphTitle
      opengraphDescription
      opengraphImage {
        sourceUrl
      }
      canonical
    }
  }
`

// ─── SEO Fragment (untuk semua page types) ───────────────────────────────────

export const SEO_FRAGMENT = /* GraphQL */ `
  fragment SeoFields on PostTypeSEO {
    title
    metaDesc
    opengraphTitle
    opengraphDescription
    opengraphImage {
      sourceUrl
    }
    canonical
  }
`
