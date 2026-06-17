/**
 * lib/queries/regulations.ts
 * GraphQL queries untuk CPT: Regulation (Regulasi K3)
 * Semi-dinamis → ISR 6 jam
 */

export type GQLRegulationCard = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  regulationFields: {
    nomorRegulasi: string | null
    instansiPenerbit: string | null
    tanggalBerlaku: string | null
    status: string | null
  } | null
  regulationTypes: { nodes: Array<{ name: string; slug: string }> }
}

export type GQLRegulationDetail = GQLRegulationCard & {
  content: string
  seo: {
    title: string
    metaDesc: string
    opengraphTitle: string
    opengraphDescription: string
    opengraphImage: { sourceUrl: string } | null
    canonical: string
  } | null
}

export const GET_REGULATIONS = /* GraphQL */ `
  query GetRegulations($first: Int = 20, $regulationType: String) {
    regulations(
      first: $first
      where: {
        taxQuery: {
          taxArray: [
            { taxonomy: REGULATION_TYPE, terms: [$regulationType], operator: IN, field: SLUG }
          ]
        }
        status: PUBLISH
      }
    ) {
      nodes {
        id
        slug
        title
        excerpt
        date
        regulationFields {
          nomorRegulasi
          instansiPenerbit
          tanggalBerlaku
          status
        }
        regulationTypes { nodes { name slug } }
      }
    }
  }
`

export const GET_REGULATION_BY_SLUG = /* GraphQL */ `
  query GetRegulationBySlug($slug: ID!) {
    regulation(id: $slug, idType: SLUG) {
      id
      slug
      title
      excerpt
      content
      date
      regulationFields {
        nomorRegulasi
        instansiPenerbit
        tanggalBerlaku
        status
      }
      regulationTypes { nodes { name slug } }
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

export const GET_ALL_REGULATION_SLUGS = /* GraphQL */ `
  query GetAllRegulationSlugs {
    regulations(first: 100, where: { status: PUBLISH }) {
      nodes { slug modified }
    }
  }
`
