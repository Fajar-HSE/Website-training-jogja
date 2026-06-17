/**
 * lib/queries/trainings.ts
 * GraphQL queries untuk CPT: Training (Program Pelatihan)
 * Halaman ini bersifat evergreen → SSG + On-Demand Revalidation
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type GQLTrainingCard = {
  id: string
  slug: string
  title: string
  excerpt: string
  featuredImage: {
    node: { sourceUrl: string; altText: string }
  } | null
  trainingFields: {
    durasi: string | null
    sertifikasi: string | null
    level: string | null
    harga: string | null
  } | null
  certifications: { nodes: Array<{ name: string; slug: string }> }
  sectors: { nodes: Array<{ name: string; slug: string }> }
}

export type GQLTrainingDetail = GQLTrainingCard & {
  content: string
  trainingFields: {
    durasi: string | null
    sertifikasi: string | null
    level: string | null
    harga: string | null
    jadwal: string | null
    materi: string | null
    syarat: string | null
    manfaat: string | null
    targetPeserta: string | null
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

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_TRAININGS = /* GraphQL */ `
  query GetTrainings($first: Int = 20, $sector: String, $certification: String) {
    trainings(
      first: $first
      where: {
        taxQuery: {
          taxArray: [
            { taxonomy: SECTOR, terms: [$sector], operator: IN, field: SLUG }
            { taxonomy: CERTIFICATION, terms: [$certification], operator: IN, field: SLUG }
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
        featuredImage {
          node { sourceUrl altText }
        }
        trainingFields {
          durasi
          sertifikasi
          level
          harga
        }
        certifications { nodes { name slug } }
        sectors { nodes { name slug } }
      }
    }
  }
`

export const GET_TRAINING_BY_SLUG = /* GraphQL */ `
  query GetTrainingBySlug($slug: ID!) {
    training(id: $slug, idType: SLUG) {
      id
      slug
      title
      excerpt
      content
      featuredImage {
        node { sourceUrl altText }
      }
      trainingFields {
        durasi
        sertifikasi
        level
        harga
        jadwal
        materi
        syarat
        manfaat
        targetPeserta
      }
      certifications { nodes { name slug } }
      sectors { nodes { name slug } }
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

export const GET_ALL_TRAINING_SLUGS = /* GraphQL */ `
  query GetAllTrainingSlugs {
    trainings(first: 100, where: { status: PUBLISH }) {
      nodes {
        slug
        modified
      }
    }
  }
`
