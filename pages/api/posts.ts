/**
 * pages/api/posts.ts
 * Internal API route untuk client-side pagination artikel.
 *
 * GET /api/posts?page=1&perPage=12&category=k3&search=audit
 *
 * Dipakai oleh resource-center.tsx saat user klik paginator / filter kategori.
 * Fetch ke WordPress REST API tetap pakai cache Next.js (ISR 6 jam).
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { getPosts } from '../../lib/wordpress'
import type { NormalizedPost } from '../../lib/wordpress'
import type { PaginationMeta } from '../../lib/types'

type ResponseData = {
  posts: NormalizedPost[]
  pagination: PaginationMeta
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { message: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const page     = Math.max(1, Number(req.query.page)    || 1)
  const perPage  = Math.min(50, Number(req.query.perPage) || 12)
  const category = typeof req.query.category === 'string' ? req.query.category : undefined
  const search   = typeof req.query.search   === 'string' ? req.query.search   : undefined

  const { posts, pagination } = await getPosts({ page, perPage, category, search })

  // Cache response di CDN edge selama 6 jam (sama dengan ISR)
  res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=3600')

  return res.status(200).json({ posts, pagination })
}
