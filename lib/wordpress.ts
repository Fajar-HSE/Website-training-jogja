/**
 * lib/wordpress.ts
 * Data-access layer — WordPress REST API + ISR.
 *
 * Semua fungsi memanggil WP REST API v2 (/wp-json/wp/v2/).
 * Pagination menggunakan parameter `page` & `per_page`.
 * Header X-WP-Total / X-WP-TotalPages di-forward via WPApiResponse.
 *
 * Strategi revalidate:
 *   posts / regulations  → ISR 6 jam  (21600 detik)
 *   case studies         → ISR 12 jam (43200 detik)
 *   trainings / solutions / glossary / faq → false (SSG + on-demand webhook)
 *
 * Env:
 *   NEXT_PUBLIC_WP_API_URL=https://training-jogja.com/wp-json/wp/v2
 */

import { wpFetch, wpFetchBySlug, wpFetchAllSlugs } from './wpApi'
import type {
  WPPost,
  WPTraining,
  WPSolution,
  WPRegulation,
  WPGlossary,
  WPFAQ,
  WPCaseStudy,
  WPFeaturedMedia,
  WPEmbedded,
  YoastSEO,
  NormalizedPost,
  PaginationMeta,
} from './types'

// ─── Re-export types ──────────────────────────────────────────────────────────

export type {
  NormalizedPost,
  WPPost,
  WPTraining,
  WPSolution,
  WPRegulation,
  WPGlossary,
  WPFAQ,
  WPCaseStudy,
  PaginationMeta,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function estimateReadTime(html: string): string {
  const wordCount = html
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
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

function getEmbeddedMedia(embedded?: WPEmbedded): WPFeaturedMedia | null {
  return embedded?.['wp:featuredmedia']?.[0] ?? null
}

function getEmbeddedAuthor(embedded?: WPEmbedded) {
  return embedded?.author?.[0] ?? null
}

function getEmbeddedTerms(embedded?: WPEmbedded, index = 0) {
  return embedded?.['wp:term']?.[index] ?? []
}

function buildSEO(yoast?: YoastSEO) {
  if (!yoast) return null
  
  // Ambil canonical URL dari Yoast
  let canonical = yoast.canonical ?? ''
  
  // Jika canonical URL mengarah ke domain Vercel, arahkan ke domain utama (www.training-jogja.com)
  if (canonical.includes('website-training-jogja.vercel.app')) {
    canonical = canonical.replace(/https?:\/\/website-training-jogja\.vercel\.app/g, 'https://www.training-jogja.com')
  }

  return {
    title: yoast.title ?? '',
    metaDesc: yoast.description ?? '',
    ogTitle: yoast.og_title ?? '',
    ogDescription: yoast.og_description ?? '',
    ogImage: yoast.og_image?.[0]?.url ?? null,
    canonical: canonical,
  }
}

function normalizePost(post: WPPost): NormalizedPost {
  const media = getEmbeddedMedia(post._embedded)
  const author = getEmbeddedAuthor(post._embedded)
  // wp:term[0] = categories, wp:term[1] = tags
  const categories = getEmbeddedTerms(post._embedded, 0)
  const primaryCat = categories[0]

  const content = post.content.rendered
  const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 200)

  return {
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    excerpt,
    content,
    date: formatDate(post.date),
    dateISO: post.date,
    modified: post.modified,
    categoryLabel: primaryCat?.name ?? 'Artikel',
    categorySlug: primaryCat?.slug ?? 'artikel',
    featuredImage: media?.source_url ?? null,
    featuredImageAlt: media?.alt_text ?? '',
    authorName: author?.name ?? 'Tim Training Jogja',
    authorAvatar: author?.avatar_urls?.['96'] ?? null,
    readTime: estimateReadTime(content),
    seo: buildSEO(post.yoast_head_json),
  }
}

// ─── Posts / Artikel ──────────────────────────────────────────────────────────

export type PostsParams = {
  page?: number
  perPage?: number
  category?: string    // category slug
  search?: string
}

export type PostsResult = {
  posts: NormalizedPost[]
  pagination: PaginationMeta
}

/**
 * Ambil daftar artikel dengan pagination.
 * ISR 6 jam.
 */
export async function getPosts(params?: PostsParams): Promise<PostsResult> {
  const perPage = params?.perPage ?? 12
  const page = params?.page ?? 1

  try {
    // Resolve category slug → id bila perlu
    let categoryId: number | undefined
    if (params?.category && params.category !== 'semua') {
      try {
        const { data: cats } = await wpFetch<Array<{ id: number; slug: string }>>(
          '/categories',
          { slug: params.category, _fields: 'id,slug' },
          21600
        )
        categoryId = cats[0]?.id
      } catch {
        // ignore — lanjut tanpa filter kategori
      }
    }

    const { data, total, totalPages } = await wpFetch<WPPost[]>(
      '/posts',
      {
        page,
        per_page: perPage,
        _embed: true,
        status: 'publish',
        orderby: 'date',
        order: 'desc',
        ...(categoryId ? { categories: categoryId } : {}),
        ...(params?.search ? { search: params.search } : {}),
      },
      21600 // ISR 6 jam
    )

    return {
      posts: data.map((p) => {
        const np = normalizePost(p)
        delete np.content
        return np
      }),
      pagination: { total, totalPages, currentPage: page, perPage },
    }
  } catch (err) {
    console.error('[wordpress.ts] getPosts failed:', err)
    return {
      posts: getFallbackPosts().map((p) => {
        const np = { ...p }
        delete np.content
        return np
      }),
      pagination: { total: 3, totalPages: 1, currentPage: 1, perPage },
    }
  }
}

/** Ambil satu artikel by slug. ISR 6 jam. */
export async function getPostBySlug(slug: string): Promise<NormalizedPost | null> {
  try {
    const post = await wpFetchBySlug<WPPost>('/posts', slug, 21600)
    if (!post) return null
    return normalizePost(post)
  } catch (err) {
    console.error('[wordpress.ts] getPostBySlug failed:', err)
    return getFallbackPosts().find((p) => p.slug === slug) ?? null
  }
}

/** Semua slug untuk getStaticPaths. */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    return await wpFetchAllSlugs('/posts', 21600)
  } catch {
    return getFallbackPosts().map((p) => p.slug)
  }
}

/** Artikel terkait (dari kategori yang sama). */
export async function getRelatedPosts(
  categorySlug: string,
  excludeId: number,
  limit = 3
): Promise<NormalizedPost[]> {
  try {
    // Resolve slug → id
    const { data: cats } = await wpFetch<Array<{ id: number; slug: string }>>(
      '/categories',
      { slug: categorySlug, _fields: 'id,slug' },
      21600
    )
    const categoryId = cats[0]?.id
    if (!categoryId) return []

    const { data } = await wpFetch<WPPost[]>(
      '/posts',
      {
        per_page: limit + 1,
        _embed: true,
        status: 'publish',
        categories: categoryId,
        exclude: excludeId,
        orderby: 'date',
        order: 'desc',
      },
      21600
    )
    return data.slice(0, limit).map((p) => {
      const np = normalizePost(p)
      delete np.content
      return np
    })
  } catch {
    return []
  }
}

/** Semua kategori artikel. */
export async function getCategories(): Promise<
  { id: number; name: string; slug: string; count: number }[]
> {
  try {
    const { data } = await wpFetch<
      Array<{ id: number; name: string; slug: string; count: number }>
    >(
      '/categories',
      { per_page: 50, hide_empty: true, _fields: 'id,name,slug,count' },
      21600
    )
    return data
  } catch {
    return getFallbackCategories()
  }
}

// ─── Trainings ────────────────────────────────────────────────────────────────

export type TrainingsParams = {
  page?: number
  perPage?: number
  sector?: string       // taxonomy term slug
  certification?: string
}

export type TrainingsResult = {
  trainings: WPTraining[]
  pagination: PaginationMeta
}

/** Ambil daftar pelatihan. SSG + on-demand. */
export async function getTrainings(params?: TrainingsParams): Promise<TrainingsResult> {
  const perPage = params?.perPage ?? 20
  const page = params?.page ?? 1

  try {
    const { data, total, totalPages } = await wpFetch<WPTraining[]>(
      '/training', // endpoint CPT: /wp-json/wp/v2/training
      {
        page,
        per_page: perPage,
        _embed: true,
        status: 'publish',
        orderby: 'title',
        order: 'asc',
        ...(params?.sector ? { sector: params.sector } : {}),
        ...(params?.certification ? { certification: params.certification } : {}),
      },
      false // SSG — on-demand only
    )

    return {
      trainings: data,
      pagination: { total, totalPages, currentPage: page, perPage },
    }
  } catch (err) {
    console.error('[wordpress.ts] getTrainings failed:', err)
    return {
      trainings: [],
      pagination: { total: 0, totalPages: 1, currentPage: 1, perPage },
    }
  }
}

/** Satu pelatihan by slug. SSG + on-demand. */
export async function getTrainingBySlug(slug: string): Promise<WPTraining | null> {
  try {
    return await wpFetchBySlug<WPTraining>('/training', slug, false)
  } catch (err) {
    console.error('[wordpress.ts] getTrainingBySlug failed:', err)
    return null
  }
}

/** Semua slug pelatihan. */
export async function getAllTrainingSlugs(): Promise<string[]> {
  try {
    return await wpFetchAllSlugs('/training', false)
  } catch {
    return []
  }
}

// ─── Solutions ────────────────────────────────────────────────────────────────

/** Ambil semua solusi. SSG + on-demand. */
export async function getSolutions(page = 1, perPage = 20): Promise<{
  solutions: WPSolution[]
  pagination: PaginationMeta
}> {
  try {
    const { data, total, totalPages } = await wpFetch<WPSolution[]>(
      '/solution', // endpoint CPT: /wp-json/wp/v2/solution
      { page, per_page: perPage, _embed: true, status: 'publish' },
      false
    )
    return {
      solutions: data,
      pagination: { total, totalPages, currentPage: page, perPage },
    }
  } catch (err) {
    console.error('[wordpress.ts] getSolutions failed:', err)
    return {
      solutions: [],
      pagination: { total: 0, totalPages: 1, currentPage: 1, perPage },
    }
  }
}

/** Satu solusi by slug. SSG + on-demand. */
export async function getSolutionBySlug(slug: string): Promise<WPSolution | null> {
  try {
    return await wpFetchBySlug<WPSolution>('/solution', slug, false)
  } catch (err) {
    console.error('[wordpress.ts] getSolutionBySlug failed:', err)
    return null
  }
}

/** Semua slug solusi. */
export async function getAllSolutionSlugs(): Promise<string[]> {
  try {
    return await wpFetchAllSlugs('/solution', false)
  } catch {
    return []
  }
}

// ─── Regulations ──────────────────────────────────────────────────────────────

export type RegulationsParams = {
  page?: number
  perPage?: number
  regulationType?: string   // taxonomy term slug
}

/** Ambil regulasi dengan pagination. ISR 6 jam. */
export async function getRegulations(params?: RegulationsParams): Promise<{
  regulations: WPRegulation[]
  pagination: PaginationMeta
}> {
  const perPage = params?.perPage ?? 20
  const page = params?.page ?? 1

  try {
    const { data, total, totalPages } = await wpFetch<WPRegulation[]>(
      '/regulation', // endpoint CPT: /wp-json/wp/v2/regulation
      {
        page,
        per_page: perPage,
        _embed: true,
        status: 'publish',
        orderby: 'date',
        order: 'desc',
        ...(params?.regulationType ? { regulation_type: params.regulationType } : {}),
      },
      21600
    )
    return {
      regulations: data,
      pagination: { total, totalPages, currentPage: page, perPage },
    }
  } catch (err) {
    console.error('[wordpress.ts] getRegulations failed:', err)
    return {
      regulations: [],
      pagination: { total: 0, totalPages: 1, currentPage: 1, perPage },
    }
  }
}

/** Satu regulasi by slug. ISR 6 jam. */
export async function getRegulationBySlug(slug: string): Promise<WPRegulation | null> {
  try {
    return await wpFetchBySlug<WPRegulation>('/regulation', slug, 21600)
  } catch (err) {
    console.error('[wordpress.ts] getRegulationBySlug failed:', err)
    return null
  }
}

/** Semua slug regulasi. */
export async function getAllRegulationSlugs(): Promise<string[]> {
  try {
    return await wpFetchAllSlugs('/regulation', 21600)
  } catch {
    return []
  }
}

// ─── Glossary ─────────────────────────────────────────────────────────────────

/** Ambil semua glossary (A–Z). SSG + on-demand. */
export async function getAllGlossary(): Promise<WPGlossary[]> {
  const all: WPGlossary[] = []
  let page = 1
  let totalPages = 1

  try {
    while (page <= totalPages) {
      const { data, totalPages: tp } = await wpFetch<WPGlossary[]>(
        '/glossary', // endpoint CPT
        {
          page,
          per_page: 100,
          status: 'publish',
          orderby: 'title',
          order: 'asc',
          _fields: 'id,slug,title,content,acf',
        },
        false
      )
      all.push(...data)
      totalPages = tp
      page++
    }
    return all
  } catch (err) {
    console.error('[wordpress.ts] getAllGlossary failed:', err)
    return []
  }
}

/** Satu glosarium by slug. */
export async function getGlossaryBySlug(slug: string): Promise<WPGlossary | null> {
  try {
    return await wpFetchBySlug<WPGlossary>('/glossary', slug, false)
  } catch {
    return null
  }
}

/** Semua slug glosarium. */
export async function getAllGlossarySlugs(): Promise<string[]> {
  try {
    return await wpFetchAllSlugs('/glossary', false)
  } catch {
    return []
  }
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

/** Ambil FAQ, opsional filter by kategori (ACF field). SSG + on-demand. */
export async function getFAQs(kategori?: string): Promise<WPFAQ[]> {
  try {
    const { data } = await wpFetch<WPFAQ[]>(
      '/faq', // endpoint CPT
      {
        per_page: 100,
        status: 'publish',
        orderby: 'menu_order',
        order: 'asc',
        ...(kategori ? { search: kategori } : {}),
      },
      false
    )
    return data
  } catch (err) {
    console.error('[wordpress.ts] getFAQs failed:', err)
    return []
  }
}

// ─── Case Studies ─────────────────────────────────────────────────────────────

export type CaseStudiesParams = {
  page?: number
  perPage?: number
}

/** Ambil studi kasus dengan pagination. ISR 12 jam. */
export async function getCaseStudies(params?: CaseStudiesParams): Promise<{
  caseStudies: WPCaseStudy[]
  pagination: PaginationMeta
}> {
  const perPage = params?.perPage ?? 12
  const page = params?.page ?? 1

  try {
    const { data, total, totalPages } = await wpFetch<WPCaseStudy[]>(
      '/case-study', // endpoint CPT
      {
        page,
        per_page: perPage,
        _embed: true,
        status: 'publish',
        orderby: 'date',
        order: 'desc',
      },
      43200 // ISR 12 jam
    )
    return {
      caseStudies: data,
      pagination: { total, totalPages, currentPage: page, perPage },
    }
  } catch (err) {
    console.error('[wordpress.ts] getCaseStudies failed:', err)
    return {
      caseStudies: [],
      pagination: { total: 0, totalPages: 1, currentPage: 1, perPage },
    }
  }
}

/** Satu studi kasus by slug. ISR 12 jam. */
export async function getCaseStudyBySlug(slug: string): Promise<WPCaseStudy | null> {
  try {
    return await wpFetchBySlug<WPCaseStudy>('/case-study', slug, 43200)
  } catch (err) {
    console.error('[wordpress.ts] getCaseStudyBySlug failed:', err)
    return null
  }
}

/** Semua slug studi kasus. */
export async function getAllCaseStudySlugs(): Promise<string[]> {
  try {
    return await wpFetchAllSlugs('/case-study', 43200)
  } catch {
    return []
  }
}

// ─── Fallback Static Data ─────────────────────────────────────────────────────

function getFallbackPosts(): NormalizedPost[] {
  return [
    {
      id: 1,
      slug: 'teknik-audit-internal-smk3',
      title: 'Teknik Audit Internal SMK3 yang Efektif',
      excerpt:
        'Langkah praktis untuk mengidentifikasi celah keselamatan sebelum badan sertifikasi eksternal tiba di pabrik Anda.',
      content: '<p>Artikel sedang dipersiapkan. Hubungi tim kami untuk konsultasi langsung.</p>',
      date: '10 Juni 2026',
      dateISO: '2026-06-10T00:00:00',
      modified: '',
      categoryLabel: 'K3',
      categorySlug: 'k3',
      featuredImage: null,
      featuredImageAlt: '',
      authorName: 'Tim Training Jogja',
      authorAvatar: null,
      readTime: '5 min baca',
      seo: null,
    },
    {
      id: 2,
      slug: 'mengintegrasikan-iso-14001-rkl-rpl',
      title: 'Mengintegrasikan ISO 14001 dengan RKL-RPL',
      excerpt:
        'Cara menyelaraskan standar manajemen lingkungan internasional dengan kewajiban pelaporan ke Dinas Lingkungan Hidup.',
      content: '<p>Artikel sedang dipersiapkan. Hubungi tim kami untuk konsultasi langsung.</p>',
      date: '5 Juni 2026',
      dateISO: '2026-06-05T00:00:00',
      modified: '',
      categoryLabel: 'Lingkungan',
      categorySlug: 'lingkungan',
      featuredImage: null,
      featuredImageAlt: '',
      authorName: 'Tim Training Jogja',
      authorAvatar: null,
      readTime: '6 min baca',
      seo: null,
    },
    {
      id: 3,
      slug: 'update-regulasi-kemenaker-2026',
      title: 'Update Regulasi: Area Fokus Inspeksi Kemenaker 2026',
      excerpt:
        'Analisis regulasi keselamatan kerja baru yang berpotensi menjadi fokus utama pemeriksaan pengawas tahun ini.',
      content: '<p>Artikel sedang dipersiapkan. Hubungi tim kami untuk konsultasi langsung.</p>',
      date: '28 Mei 2026',
      dateISO: '2026-05-28T00:00:00',
      modified: '',
      categoryLabel: 'Regulasi',
      categorySlug: 'regulasi',
      featuredImage: null,
      featuredImageAlt: '',
      authorName: 'Tim Training Jogja',
      authorAvatar: null,
      readTime: '4 min baca',
      seo: null,
    },
  ]
}

function getFallbackCategories() {
  return [
    { id: 1, name: 'K3 Keselamatan', slug: 'k3', count: 2 },
    { id: 2, name: 'Lingkungan', slug: 'lingkungan', count: 2 },
    { id: 3, name: 'Regulasi & ISO', slug: 'regulasi', count: 2 },
  ]
}
