/**
 * lib/types.ts
 * Semua TypeScript types untuk WordPress REST API responses.
 *
 * Struktur mengikuti output WP REST API v2 dengan _embed,
 * serta ACF (Advanced Custom Fields) di field `acf`.
 *
 * CPT yang digunakan:
 *   - posts        → Artikel / Resource Center
 *   - training     → Program Pelatihan
 *   - solution     → Solusi K3 & Lingkungan
 *   - regulation   → Regulasi & Peraturan
 *   - glossary     → Glosarium Istilah K3
 *   - faq          → FAQ (Pertanyaan Umum)
 *   - case-study   → Studi Kasus
 */

// ─── Shared Sub-Types ──────────────────────────────────────────────────────────

export type WPRendered = { rendered: string }

export type WPFeaturedMedia = {
  source_url: string
  alt_text: string
  media_details?: {
    width: number
    height: number
    sizes?: Record<string, { source_url: string; width: number; height: number }>
  }
}

export type WPAuthor = {
  id: number
  name: string
  description: string
  avatar_urls: Record<string, string>
  link: string
}

export type WPCategory = {
  id: number
  name: string
  slug: string
  count: number
  description: string
  link: string
}

export type WPTag = {
  id: number
  name: string
  slug: string
  count: number
}

export type WPTaxonomyTerm = {
  id: number
  name: string
  slug: string
}

/** _embedded helper: ambil featured media dari _embedded */
export type WPEmbedded = {
  'wp:featuredmedia'?: WPFeaturedMedia[]
  author?: WPAuthor[]
  'wp:term'?: WPTaxonomyTerm[][]
}

// ─── Yoast SEO (via WP REST API + plugin Yoast) ───────────────────────────────

export type YoastSEO = {
  title?: string
  description?: string
  og_title?: string
  og_description?: string
  og_image?: Array<{ url: string; width: number; height: number }>
  canonical?: string
  robots?: Record<string, string>
}

// ─── Posts (Artikel / Resource Center) ───────────────────────────────────────

export type WPPost = {
  id: number
  slug: string
  date: string          // ISO 8601
  modified: string
  title: WPRendered
  excerpt: WPRendered
  content: WPRendered
  featured_media: number
  author: number
  categories: number[]
  tags: number[]
  link: string
  acf?: Record<string, unknown>
  yoast_head_json?: YoastSEO
  _embedded?: WPEmbedded
}

/** Post yang sudah dinormalisasi untuk dipakai di komponen */
export type NormalizedPost = {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string          // "10 Juni 2026" — display
  dateISO: string       // "2026-06-10T00:00:00" — schema / SEO
  modified: string
  categoryLabel: string
  categorySlug: string
  featuredImage: string | null
  featuredImageAlt: string
  authorName: string
  authorAvatar: string | null
  readTime: string
  seo: {
    title: string
    metaDesc: string
    ogTitle: string
    ogDescription: string
    ogImage: string | null
    canonical: string
  } | null
}

// ─── Trainings ────────────────────────────────────────────────────────────────

export type WPTrainingACF = {
  durasi?: string | null
  sertifikasi?: string | null
  level?: string | null
  harga?: string | null
  jadwal?: string | null
  materi?: string | null
  syarat?: string | null
  manfaat?: string | null
  target_peserta?: string | null
}

export type WPTraining = {
  id: number
  slug: string
  title: WPRendered
  excerpt: WPRendered
  content: WPRendered
  featured_media: number
  date: string
  modified: string
  link: string
  acf?: WPTrainingACF
  yoast_head_json?: YoastSEO
  _embedded?: WPEmbedded
  /** Taxonomy: sector */
  sector?: WPTaxonomyTerm[]
  /** Taxonomy: certification */
  certification?: WPTaxonomyTerm[]
}

// ─── Solutions ────────────────────────────────────────────────────────────────

export type WPSolutionACF = {
  tagline?: string | null
  icon?: string | null
  manfaat?: string | null
  proses?: string | null
  regulasi_terkait?: string | null
  industri?: string | null
}

export type WPSolution = {
  id: number
  slug: string
  title: WPRendered
  excerpt: WPRendered
  content: WPRendered
  featured_media: number
  date: string
  modified: string
  link: string
  acf?: WPSolutionACF
  yoast_head_json?: YoastSEO
  _embedded?: WPEmbedded
}

// ─── Regulations ──────────────────────────────────────────────────────────────

export type WPRegulationACF = {
  nomor_regulasi?: string | null
  instansi_penerbit?: string | null
  tanggal_berlaku?: string | null
  status?: string | null
}

export type WPRegulation = {
  id: number
  slug: string
  title: WPRendered
  excerpt: WPRendered
  content: WPRendered
  featured_media: number
  date: string
  modified: string
  link: string
  acf?: WPRegulationACF
  yoast_head_json?: YoastSEO
  _embedded?: WPEmbedded
  /** Taxonomy: regulation_type */
  regulation_type?: WPTaxonomyTerm[]
}

// ─── Glossary ─────────────────────────────────────────────────────────────────

export type WPGlossaryACF = {
  singkatan?: string | null
  regulasi_terkait?: string | null
}

export type WPGlossary = {
  id: number
  slug: string
  title: WPRendered
  content: WPRendered
  date: string
  modified: string
  link: string
  acf?: WPGlossaryACF
  _embedded?: WPEmbedded
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export type WPFaqACF = {
  kategori?: string | null
}

export type WPFAQ = {
  id: number
  slug: string
  title: WPRendered
  content: WPRendered
  date: string
  modified: string
  link: string
  acf?: WPFaqACF
  _embedded?: WPEmbedded
}

// ─── Case Studies ─────────────────────────────────────────────────────────────

export type WPCaseStudyACF = {
  klien?: string | null
  industri?: string | null
  hasil_utama?: string | null
  tantangan?: string | null
  solusi?: string | null
  durasi?: string | null
}

export type WPCaseStudy = {
  id: number
  slug: string
  title: WPRendered
  excerpt: WPRendered
  content: WPRendered
  featured_media: number
  date: string
  modified: string
  link: string
  acf?: WPCaseStudyACF
  yoast_head_json?: YoastSEO
  _embedded?: WPEmbedded
}

// ─── Pagination Meta ─────────────────────────────────────────────────────────

export type PaginationMeta = {
  total: number
  totalPages: number
  currentPage: number
  perPage: number
}
