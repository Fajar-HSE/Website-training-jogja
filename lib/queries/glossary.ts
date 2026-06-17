/**
 * lib/queries/glossary.ts
 * GraphQL queries untuk CPT: Glossary (Istilah K3)
 * Evergreen → SSG + On-Demand Revalidation
 */

export type GQLGlossaryItem = {
  id: string
  slug: string
  title: string
  content: string
  glossaryFields: {
    singkatan: string | null
    regulasiTerkait: string | null
  } | null
}

export const GET_ALL_GLOSSARY = /* GraphQL */ `
  query GetAllGlossary {
    glossaries(first: 200, where: { status: PUBLISH, orderby: { field: TITLE, order: ASC } }) {
      nodes {
        id
        slug
        title
        content
        glossaryFields {
          singkatan
          regulasiTerkait
        }
      }
    }
  }
`

export const GET_GLOSSARY_BY_SLUG = /* GraphQL */ `
  query GetGlossaryBySlug($slug: ID!) {
    glossary(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      glossaryFields {
        singkatan
        regulasiTerkait
      }
    }
  }
`

export const GET_ALL_GLOSSARY_SLUGS = /* GraphQL */ `
  query GetAllGlossarySlugs {
    glossaries(first: 200, where: { status: PUBLISH }) {
      nodes { slug }
    }
  }
`
