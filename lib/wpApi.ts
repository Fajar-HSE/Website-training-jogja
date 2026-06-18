/**
 * lib/wpApi.ts
 * Core HTTP client untuk WordPress REST API.
 *
 * Base URL: NEXT_PUBLIC_WP_API_URL  (mis: https://training-jogja.com/wp-json/wp/v2)
 *
 * Strategi cache via Next.js fetch({ next: { revalidate } }):
 *   - revalidate: false  → SSG tetap / on-demand webhook
 *   - revalidate: 21600 → ISR 6 jam  (posts, regulations)
 *   - revalidate: 43200 → ISR 12 jam (case studies)
 *   - revalidate: 3600  → ISR 1 jam  (homepage)
 *
 * Pagination: gunakan params `page` & `per_page`.
 * WordPress mengembalikan header `X-WP-Total` & `X-WP-TotalPages`.
 */

const WP_API_URL =
  (process.env.NEXT_PUBLIC_WP_API_URL || 'https://training-jogja.com/wp-json/wp/v2').replace(
    /\/$/,
    ''
  )

// ─── Types ────────────────────────────────────────────────────────────────────

export type WPApiResponse<T> = {
  data: T
  total: number
  totalPages: number
}

export type FetchParams = Record<string, string | number | boolean | null | undefined>

// ─── Core Fetcher ─────────────────────────────────────────────────────────────

/**
 * Ambil data dari WP REST API.
 * @param endpoint  path relatif, mis: "/posts" atau "/training?slug=ahli-k3"
 * @param params    query params tambahan
 * @param revalidate ISR detik, atau false untuk SSG
 */
export async function wpFetch<T = unknown>(
  endpoint: string,
  params?: FetchParams,
  revalidate?: number | false
): Promise<WPApiResponse<T>> {
  if (!WP_API_URL) {
    throw new Error('[wpApi.ts] NEXT_PUBLIC_WP_API_URL belum dikonfigurasi.')
  }

  // Bangun URL dengan query string
  const url = new URL(`${WP_API_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        url.searchParams.set(key, String(val))
      }
    })
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: revalidate !== undefined ? { revalidate } : {},
  })

  if (!res.ok) {
    throw new Error(
      `[wpApi.ts] HTTP ${res.status} ${res.statusText} — ${url.toString()}`
    )
  }

  const data = (await res.json()) as T
  const total = Number(res.headers.get('X-WP-Total') ?? 0)
  const totalPages = Number(res.headers.get('X-WP-TotalPages') ?? 1)

  return { data, total, totalPages }
}

/**
 * Helper: ambil satu item by slug (GET /endpoint?slug=xxx&_embed)
 * Mengembalikan item pertama atau null bila tidak ditemukan.
 */
export async function wpFetchBySlug<T = unknown>(
  endpoint: string,
  slug: string,
  revalidate?: number | false
): Promise<T | null> {
  try {
    const { data } = await wpFetch<T[]>(
      endpoint,
      { slug, _embed: true, _fields: '' }, // _fields kosong = semua field
      revalidate
    )
    if (!Array.isArray(data) || data.length === 0) return null
    return data[0]
  } catch {
    return null
  }
}

/**
 * Helper: ambil semua slug dari sebuah CPT (untuk getStaticPaths).
 * Iterasi semua halaman secara otomatis.
 */
export async function wpFetchAllSlugs(
  endpoint: string,
  revalidate?: number | false
): Promise<string[]> {
  const slugs: string[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const { data, totalPages: tp } = await wpFetch<Array<{ slug: string }>>(
      endpoint,
      { page, per_page: 100, _fields: 'slug', status: 'publish' },
      revalidate
    )
    slugs.push(...data.map((item) => item.slug))
    totalPages = tp
    page++
  }

  return slugs
}
