/**
 * lib/wordpress.ts
 * Data-access layer untuk Training Jogja.
 *
 * Semua fetch menggunakan GraphQL (WPGraphQL) menggantikan REST API.
 * Revalidation strategy:
 *   - Artikel / Regulasi  → ISR 6 jam  (21600 detik)
 *   - Studi Kasus         → ISR 12 jam (43200 detik)
 *   - Beranda             → ISR 1 jam  (3600 detik)
 *   - Solusi / Industri / Glossary / FAQ → SSG + On-Demand (false = tidak auto-expire)
 *   - Search / Form       → CSR (tidak dihandle di sini)
 *
 * On-Demand Revalidation di-trigger via /api/revalidate
 * saat konten dipublish/diupdate dari WordPress (webhook).
 *
 * Env:
 *   NEXT_PUBLIC_WP_GRAPHQL_URL=https://training-jogja.com/graphql
 */

import { fetchGraphQL } from './graphql'
import {
  GET_POSTS,
  GET_POST_BY_SLUG,
  GET_ALL_POST_SLUGS,
  GET_RELATED_POSTS,
  GET_CATEGORIES,
  type GQLPostCard,
  type GQLPostDetail,
  type GQLCategory,
} from './queries/posts'
import {
  GET_TRAININGS,
  GET_TRAINING_BY_SLUG,
  GET_ALL_TRAINING_SLUGS,
  type GQLTrainingCard,
  type GQLTrainingDetail,
} from './queries/trainings'
import {
  GET_SOLUTIONS,
  GET_SOLUTION_BY_SLUG,
  GET_ALL_SOLUTION_SLUGS,
  type GQLSolutionCard,
  type GQLSolutionDetail,
} from './queries/solutions'
import {
  GET_REGULATIONS,
  GET_REGULATION_BY_SLUG,
  GET_ALL_REGULATION_SLUGS,
  type GQLRegulationCard,
  type GQLRegulationDetail,
} from './queries/regulations'
import {
  GET_ALL_GLOSSARY,
  GET_GLOSSARY_BY_SLUG,
  GET_ALL_GLOSSARY_SLUGS,
  type GQLGlossaryItem,
} from './queries/glossary'
import {
  GET_ALL_FAQS,
  type GQLFAQ,
} from './queries/faq'
import {
  GET_CASE_STUDIES,
  GET_CASE_STUDY_BY_SLUG,
  GET_ALL_CASE_STUDY_SLUGS,
  type GQLCaseStudyCard,
  type GQLCaseStudyDetail,
} from './queries/caseStudies'

// ─── Re-export types ──────────────────────────────────────────────────────────

export type {
  GQLPostCard as WPPost,
  GQLPostDetail as WPPostDetail,
  GQLCategory as WPCategory,
  GQLTrainingCard,
  GQLTrainingDetail,
  GQLSolutionCard,
  GQLSolutionDetail,
  GQLRegulationCard,
  GQLRegulationDetail,
  GQLGlossaryItem,
  GQLFAQ,
  GQLCaseStudyCard,
  GQLCaseStudyDetail,
}

// ─── Normalized Post (backward compatibility) ─────────────────────────────────

export type NormalizedPost = {
  id: string
  databaseId: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string        // format display: "10 Juni 2026"
  dateISO: string     // format ISO: "2026-06-10T00:00:00" — untuk schema & SEO
  modified: string
  categoryLabel: string
  categorySlug: string
  featuredImage: string | null
  featuredImageAlt: string
  authorName: string
  authorAvatar: string | null
  readTime: string
  seo?: {
    title: string
    metaDesc: string
    opengraphTitle: string
    opengraphDescription: string
    opengraphImage: { sourceUrl: string } | null
    canonical: string
  } | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function estimateReadTime(html: string): string {
  const wordCount = html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(wordCount / 200))
  return `${minutes} min baca`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function normalizePost(post: GQLPostCard | GQLPostDetail): NormalizedPost {
  const primaryCat = post.categories.nodes[0]
  const isDetail = 'content' in post

  return {
    id: post.id,
    databaseId: post.databaseId,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt?.replace(/<[^>]+>/g, '').substring(0, 200) ?? '',
    content: isDetail ? (post as GQLPostDetail).content : '',
    date: formatDate(post.date),
    dateISO: post.date, // simpan ISO asli dari WordPress untuk schema
    modified: post.modified,
    categoryLabel: primaryCat?.name ?? 'Artikel',
    categorySlug: primaryCat?.slug ?? 'artikel',
    featuredImage: post.featuredImage?.node.sourceUrl ?? null,
    featuredImageAlt: post.featuredImage?.node.altText ?? '',
    authorName: post.author.node.name ?? 'Tim Training Jogja',
    authorAvatar: post.author.node.avatar?.url ?? null,
    readTime: isDetail ? estimateReadTime((post as GQLPostDetail).content) : '5 min baca',
    seo: isDetail ? (post as GQLPostDetail).seo ?? null : null,
  }
}

// ─── Articles / Posts ─────────────────────────────────────────────────────────

export async function getPosts(params?: {
  category?: string
  search?: string
  perPage?: number
  after?: string
}): Promise<NormalizedPost[]> {
  try {
    const data = await fetchGraphQL<{ posts: { nodes: GQLPostCard[] } }>(
      GET_POSTS,
      {
        first: params?.perPage ?? 12,
        after: params?.after ?? null,
        categoryName: params?.category && params.category !== 'semua' ? params.category : null,
        search: params?.search ?? null,
      },
      21600 // ISR 6 jam
    )
    return data.posts.nodes.map(normalizePost)
  } catch (err) {
    console.error('[wordpress.ts] getPosts failed, menggunakan fallback:', err)
    return getFallbackPosts()
  }
}

export async function getPostBySlug(slug: string): Promise<NormalizedPost | null> {
  try {
    const data = await fetchGraphQL<{ post: GQLPostDetail | null }>(
      GET_POST_BY_SLUG,
      { slug },
      21600 // ISR 6 jam
    )
    if (!data.post) return null
    return normalizePost(data.post)
  } catch (err) {
    console.error('[wordpress.ts] getPostBySlug failed:', err)
    return getFallbackPosts().find((p) => p.slug === slug) ?? null
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<{ posts: { nodes: Array<{ slug: string }> } }>(
      GET_ALL_POST_SLUGS,
      { first: 100 },
      21600
    )
    return data.posts.nodes.map((n) => n.slug)
  } catch (err) {
    console.error('[wordpress.ts] getAllPostSlugs failed:', err)
    return getFallbackPosts().map((p) => p.slug)
  }
}

export async function getCategories(): Promise<{ id: string; name: string; slug: string; count: number }[]> {
  try {
    const data = await fetchGraphQL<{ categories: { nodes: GQLCategory[] } }>(
      GET_CATEGORIES,
      {},
      21600
    )
    return data.categories.nodes
  } catch (err) {
    console.error('[wordpress.ts] getCategories failed:', err)
    return getFallbackCategories()
  }
}

export async function getRelatedPosts(
  categorySlug: string,
  excludeId: string
): Promise<NormalizedPost[]> {
  try {
    const data = await fetchGraphQL<{ posts: { nodes: GQLPostCard[] } }>(
      GET_RELATED_POSTS,
      { categoryName: categorySlug, notIn: [excludeId], first: 3 },
      21600
    )
    return data.posts.nodes.map(normalizePost)
  } catch {
    return []
  }
}

// ─── Trainings ────────────────────────────────────────────────────────────────

/** SSG + On-Demand: revalidate = false (tidak auto-expire, di-trigger webhook) */
export async function getTrainings(params?: {
  sector?: string
  certification?: string
}): Promise<GQLTrainingCard[]> {
  try {
    const data = await fetchGraphQL<{ trainings: { nodes: GQLTrainingCard[] } }>(
      GET_TRAININGS,
      { first: 20, sector: params?.sector ?? null, certification: params?.certification ?? null },
      false // SSG — On-Demand Revalidation only
    )
    return data.trainings.nodes
  } catch (err) {
    console.error('[wordpress.ts] getTrainings failed:', err)
    return []
  }
}

export async function getTrainingBySlug(slug: string): Promise<GQLTrainingDetail | null> {
  try {
    const data = await fetchGraphQL<{ training: GQLTrainingDetail | null }>(
      GET_TRAINING_BY_SLUG,
      { slug },
      false
    )
    return data.training
  } catch (err) {
    console.error('[wordpress.ts] getTrainingBySlug failed:', err)
    return null
  }
}

export async function getAllTrainingSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<{ trainings: { nodes: Array<{ slug: string }> } }>(
      GET_ALL_TRAINING_SLUGS,
      {},
      false
    )
    return data.trainings.nodes.map((n) => n.slug)
  } catch {
    return []
  }
}

// ─── Solutions ────────────────────────────────────────────────────────────────

export async function getSolutions(): Promise<GQLSolutionCard[]> {
  try {
    const data = await fetchGraphQL<{ solutions: { nodes: GQLSolutionCard[] } }>(
      GET_SOLUTIONS,
      {},
      false // SSG — On-Demand only
    )
    return data.solutions.nodes
  } catch (err) {
    console.error('[wordpress.ts] getSolutions failed:', err)
    return []
  }
}

export async function getSolutionBySlug(slug: string): Promise<GQLSolutionDetail | null> {
  try {
    const data = await fetchGraphQL<{ solution: GQLSolutionDetail | null }>(
      GET_SOLUTION_BY_SLUG,
      { slug },
      false
    )
    return data.solution
  } catch (err) {
    console.error('[wordpress.ts] getSolutionBySlug failed:', err)
    return null
  }
}

export async function getAllSolutionSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<{ solutions: { nodes: Array<{ slug: string }> } }>(
      GET_ALL_SOLUTION_SLUGS,
      {},
      false
    )
    return data.solutions.nodes.map((n) => n.slug)
  } catch {
    return []
  }
}

// ─── Regulations ──────────────────────────────────────────────────────────────

export async function getRegulations(params?: {
  regulationType?: string
  perPage?: number
}): Promise<GQLRegulationCard[]> {
  try {
    const data = await fetchGraphQL<{ regulations: { nodes: GQLRegulationCard[] } }>(
      GET_REGULATIONS,
      { first: params?.perPage ?? 20, regulationType: params?.regulationType ?? null },
      21600 // ISR 6 jam
    )
    return data.regulations.nodes
  } catch (err) {
    console.error('[wordpress.ts] getRegulations failed:', err)
    return []
  }
}

export async function getRegulationBySlug(slug: string): Promise<GQLRegulationDetail | null> {
  try {
    const data = await fetchGraphQL<{ regulation: GQLRegulationDetail | null }>(
      GET_REGULATION_BY_SLUG,
      { slug },
      21600
    )
    return data.regulation
  } catch (err) {
    console.error('[wordpress.ts] getRegulationBySlug failed:', err)
    return null
  }
}

export async function getAllRegulationSlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<{ regulations: { nodes: Array<{ slug: string }> } }>(
      GET_ALL_REGULATION_SLUGS,
      {},
      21600
    )
    return data.regulations.nodes.map((n) => n.slug)
  } catch {
    return []
  }
}

// ─── Glossary ─────────────────────────────────────────────────────────────────

export async function getAllGlossary(): Promise<GQLGlossaryItem[]> {
  try {
    const data = await fetchGraphQL<{ glossaries: { nodes: GQLGlossaryItem[] } }>(
      GET_ALL_GLOSSARY,
      {},
      false // Evergreen — On-Demand only
    )
    return data.glossaries.nodes
  } catch (err) {
    console.error('[wordpress.ts] getAllGlossary failed:', err)
    return []
  }
}

export async function getGlossaryBySlug(slug: string): Promise<GQLGlossaryItem | null> {
  try {
    const data = await fetchGraphQL<{ glossary: GQLGlossaryItem | null }>(
      GET_GLOSSARY_BY_SLUG,
      { slug },
      false
    )
    return data.glossary
  } catch {
    return null
  }
}

export async function getAllGlossarySlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<{ glossaries: { nodes: Array<{ slug: string }> } }>(
      GET_ALL_GLOSSARY_SLUGS,
      {},
      false
    )
    return data.glossaries.nodes.map((n) => n.slug)
  } catch {
    return []
  }
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export async function getFAQs(kategori?: string): Promise<GQLFAQ[]> {
  try {
    const data = await fetchGraphQL<{ faqs: { nodes: GQLFAQ[] } }>(
      GET_ALL_FAQS,
      { first: 50, kategori: kategori ?? null },
      false // Evergreen — On-Demand only
    )
    return data.faqs.nodes
  } catch (err) {
    console.error('[wordpress.ts] getFAQs failed:', err)
    return []
  }
}

// ─── Case Studies ─────────────────────────────────────────────────────────────

export async function getCaseStudies(perPage = 12): Promise<GQLCaseStudyCard[]> {
  try {
    const data = await fetchGraphQL<{ caseStudies: { nodes: GQLCaseStudyCard[] } }>(
      GET_CASE_STUDIES,
      { first: perPage },
      43200 // ISR 12 jam
    )
    return data.caseStudies.nodes
  } catch (err) {
    console.error('[wordpress.ts] getCaseStudies failed:', err)
    return []
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<GQLCaseStudyDetail | null> {
  try {
    const data = await fetchGraphQL<{ caseStudy: GQLCaseStudyDetail | null }>(
      GET_CASE_STUDY_BY_SLUG,
      { slug },
      43200
    )
    return data.caseStudy
  } catch (err) {
    console.error('[wordpress.ts] getCaseStudyBySlug failed:', err)
    return null
  }
}

export async function getAllCaseStudySlugs(): Promise<string[]> {
  try {
    const data = await fetchGraphQL<{ caseStudies: { nodes: Array<{ slug: string }> } }>(
      GET_ALL_CASE_STUDY_SLUGS,
      {},
      43200
    )
    return data.caseStudies.nodes.map((n) => n.slug)
  } catch {
    return []
  }
}

// ─── Fallback Static Data ─────────────────────────────────────────────────────

function getFallbackPosts(): NormalizedPost[] {
  return [
    {
      id: '1', databaseId: 1, slug: 'teknik-audit-internal-smk3',
      title: 'Teknik Audit Internal SMK3 yang Efektif',
      excerpt: 'Langkah praktis untuk mengidentifikasi celah keselamatan sebelum badan sertifikasi eksternal tiba di pabrik Anda.',
      content: '<p>Artikel sedang dipersiapkan. Hubungi tim kami untuk konsultasi langsung.</p>',
      date: '10 Juni 2026', dateISO: '2026-06-10T00:00:00', modified: '', categoryLabel: 'K3', categorySlug: 'k3',
      featuredImage: null, featuredImageAlt: '',
      authorName: 'Tim Training Jogja', authorAvatar: null, readTime: '5 min baca', seo: null,
    },
    {
      id: '2', databaseId: 2, slug: 'mengintegrasikan-iso-14001-rkl-rpl',
      title: 'Mengintegrasikan ISO 14001 dengan RKL-RPL',
      excerpt: 'Cara menyelaraskan standar manajemen lingkungan internasional dengan kewajiban pelaporan ke Dinas Lingkungan Hidup.',
      content: '<p>Artikel sedang dipersiapkan. Hubungi tim kami untuk konsultasi langsung.</p>',
      date: '5 Juni 2026', dateISO: '2026-06-05T00:00:00', modified: '', categoryLabel: 'Lingkungan', categorySlug: 'lingkungan',
      featuredImage: null, featuredImageAlt: '',
      authorName: 'Tim Training Jogja', authorAvatar: null, readTime: '6 min baca', seo: null,
    },
    {
      id: '3', databaseId: 3, slug: 'update-regulasi-kemenaker-2026',
      title: 'Update Regulasi: Area Fokus Inspeksi Kemenaker 2026',
      excerpt: 'Analisis regulasi keselamatan kerja baru yang berpotensi menjadi fokus utama pemeriksaan pengawas tahun ini.',
      content: '<p>Artikel sedang dipersiapkan. Hubungi tim kami untuk konsultasi langsung.</p>',
      date: '28 Mei 2026', dateISO: '2026-05-28T00:00:00', modified: '', categoryLabel: 'Regulasi', categorySlug: 'regulasi',
      featuredImage: null, featuredImageAlt: '',
      authorName: 'Tim Training Jogja', authorAvatar: null, readTime: '4 min baca', seo: null,
    },
  ]
}

function getFallbackCategories() {
  return [
    { id: '1', name: 'K3 Keselamatan', slug: 'k3', count: 2 },
    { id: '2', name: 'Lingkungan', slug: 'lingkungan', count: 2 },
    { id: '3', name: 'Regulasi & ISO', slug: 'regulasi', count: 2 },
  ]
}
