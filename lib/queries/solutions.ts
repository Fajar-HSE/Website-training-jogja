/**
 * lib/queries/solutions.ts
 * GraphQL queries untuk CPT: Solution (Halaman Solusi)
 * Evergreen content → SSG + On-Demand Revalidation
 */

export type GQLSolutionCard = {
  id: string
  slug: string
  title: string
  excerpt: string
  featuredImage: {
    node: { sourceUrl: string; altText: string }
  } | null
  solutionFields?: {
    tagline: string | null
    icon: string | null
  } | null
}

export type GQLSolutionDetail = GQLSolutionCard & {
  content: string
  solutionFields?: {
    tagline: string | null
    icon: string | null
    manfaat: string | null
    proses: string | null
    regulasiTerkait: string | null
    industri: string | null
  } | null
  seo?: {
    title: string
    metaDesc: string
    opengraphTitle: string
    opengraphDescription: string
    opengraphImage: { sourceUrl: string } | null
    canonical: string
  } | null
}

export const GET_SOLUTIONS = /* GraphQL */ `
  query GetSolutions {
    solutions(first: 20, where: { status: PUBLISH }) {
      nodes {
        id
        slug
        title
        excerpt
        featuredImage {
          node { sourceUrl altText }
        }
      }
    }
  }
`

export const GET_SOLUTION_BY_SLUG = /* GraphQL */ `
  query GetSolutionBySlug($slug: ID!) {
    solution(id: $slug, idType: SLUG) {
      id
      slug
      title
      excerpt
      content
      featuredImage {
        node { sourceUrl altText }
      }
      seo {
        title
        metaDesc
        opengraphTitle
        opengraphDescription
        opengraphImage { sourceUrl }
        canonical
      }
    }
  }
`

export const GET_ALL_SOLUTION_SLUGS = /* GraphQL */ `
  query GetAllSolutionSlugs {
    solutions(first: 50, where: { status: PUBLISH }) {
      nodes { slug }
    }
  }
`
