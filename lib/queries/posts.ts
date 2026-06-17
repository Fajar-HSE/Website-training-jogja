/**
 * lib/queries/posts.ts
 * GraphQL queries untuk artikel (Post)
 */

import { POST_CARD_FRAGMENT } from './fragments'

// ─── Types ────────────────────────────────────────────────────────────────────

export type GQLPostCard = {
  id: string
  databaseId: number
  slug: string
  title: string
  excerpt: string
  date: string
  modified: string
  featuredImage: {
    node: {
      sourceUrl: string
      altText: string
      mediaDetails: { width: number; height: number } | null
    }
  } | null
  categories: { nodes: Array<{ name: string; slug: string }> }
  author: { node: { name: string; avatar: { url: string } | null } }
}

export type GQLPostDetail = GQLPostCard & {
  content: string
  tags: { nodes: Array<{ name: string; slug: string }> }
  author: {
    node: {
      name: string
      description: string
      avatar: { url: string } | null
    }
  }
  seo?: {
    title: string
    metaDesc: string
    opengraphTitle: string
    opengraphDescription: string
    opengraphImage: { sourceUrl: string } | null
    canonical: string
  } | null
}
export type GQLCategory = {
  id: string
  name: string
  slug: string
  count: number
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Listing artikel dengan filter kategori & pencarian */
export const GET_POSTS = /* GraphQL */ `
  ${POST_CARD_FRAGMENT}
  query GetPosts(
    $first: Int = 12
    $after: String
    $categoryName: String
    $search: String
  ) {
    posts(
      first: $first
      after: $after
      where: {
        categoryName: $categoryName
        search: $search
        status: PUBLISH
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...PostCard
      }
    }
  }
`

/** Detail satu artikel by slug — dengan field seo dari WPGraphQL for Yoast SEO */
export const GET_POST_BY_SLUG = /* GraphQL */ `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
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
  }
`

/** Semua slug untuk generateStaticParams */
export const GET_ALL_POST_SLUGS = /* GraphQL */ `
  query GetAllPostSlugs($first: Int = 100) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        slug
        modified
      }
    }
  }
`

/** Artikel terkait dari kategori yang sama */
export const GET_RELATED_POSTS = /* GraphQL */ `
  ${POST_CARD_FRAGMENT}
  query GetRelatedPosts($categoryName: String, $notIn: [ID], $first: Int = 3) {
    posts(
      first: $first
      where: {
        categoryName: $categoryName
        notIn: $notIn
        status: PUBLISH
      }
    ) {
      nodes {
        ...PostCard
      }
    }
  }
`

/** Semua kategori */
export const GET_CATEGORIES = /* GraphQL */ `
  query GetCategories {
    categories(where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`
