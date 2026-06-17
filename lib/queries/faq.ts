/**
 * lib/queries/faq.ts
 * GraphQL queries untuk CPT: FAQ
 * Evergreen → SSG + On-Demand Revalidation
 */

export type GQLFAQ = {
  id: string
  slug: string
  title: string
  content: string
  faqFields: {
    kategori: string | null
  } | null
}

export const GET_ALL_FAQS = /* GraphQL */ `
  query GetAllFAQs($first: Int = 50, $kategori: String) {
    faqs(
      first: $first
      where: {
        status: PUBLISH
        search: $kategori
      }
    ) {
      nodes {
        id
        slug
        title
        content
        faqFields {
          kategori
        }
      }
    }
  }
`
