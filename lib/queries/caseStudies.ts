/**
 * lib/queries/caseStudies.ts
 * GraphQL queries untuk CPT: Case Study (Studi Kasus)
 * ISR 12 jam
 */

export type GQLCaseStudyCard = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  featuredImage: {
    node: { sourceUrl: string; altText: string }
  } | null
  caseStudyFields: {
    klien: string | null
    industri: string | null
    hasilUtama: string | null
  } | null
}

export type GQLCaseStudyDetail = GQLCaseStudyCard & {
  content: string
  caseStudyFields: {
    klien: string | null
    industri: string | null
    hasilUtama: string | null
    tantangan: string | null
    solusi: string | null
    durasi: string | null
  } | null
  seo: {
    title: string
    metaDesc: string
    opengraphTitle: string
    opengraphDescription: string
    opengraphImage: { sourceUrl: string } | null
    canonical: string
  } | null
}

export const GET_CASE_STUDIES = /* GraphQL */ `
  query GetCaseStudies($first: Int = 12) {
    caseStudies(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        slug
        title
        excerpt
        date
        featuredImage {
          node { sourceUrl altText }
        }
        caseStudyFields {
          klien
          industri
          hasilUtama
        }
      }
    }
  }
`

export const GET_CASE_STUDY_BY_SLUG = /* GraphQL */ `
  query GetCaseStudyBySlug($slug: ID!) {
    caseStudy(id: $slug, idType: SLUG) {
      id
      slug
      title
      excerpt
      content
      date
      featuredImage {
        node { sourceUrl altText }
      }
      caseStudyFields {
        klien
        industri
        hasilUtama
        tantangan
        solusi
        durasi
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

export const GET_ALL_CASE_STUDY_SLUGS = /* GraphQL */ `
  query GetAllCaseStudySlugs {
    caseStudies(first: 50, where: { status: PUBLISH }) {
      nodes { slug modified }
    }
  }
`
