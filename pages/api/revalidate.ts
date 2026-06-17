/**
 * pages/api/revalidate.ts
 * On-Demand Revalidation endpoint.
 *
 * Dipanggil oleh WordPress via webhook setiap kali konten dipublish/diupdate.
 * Gunakan plugin "WP Webhooks" atau custom action hook di WordPress:
 *
 *   add_action('save_post', function($post_id) {
 *     $post = get_post($post_id);
 *     if ($post->post_status !== 'publish') return;
 *     wp_remote_post('https://training-jogja.com/api/revalidate', [
 *       'body' => json_encode([
 *         'secret'   => 'REVALIDATE_SECRET_ANDA',
 *         'type'     => $post->post_type,  // post, training, solution, dll
 *         'slug'     => $post->post_name,
 *       ]),
 *       'headers' => ['Content-Type' => 'application/json'],
 *     ]);
 *   });
 *
 * Env:
 *   REVALIDATE_SECRET=<token-rahasia-yang-sama-di-wordpress-dan-nextjs>
 */

import type { NextApiRequest, NextApiResponse } from 'next'

// Pemetaan post_type WordPress → path Next.js
const TYPE_TO_PATH: Record<string, (slug: string) => string[]> = {
  post:        (slug) => [`/artikel/${slug}`, '/resource-center'],
  training:    (slug) => [`/pelatihan/${slug}`, '/pelatihan'],
  solution:    (slug) => [`/solusi/${slug}`, '/solusi'],
  industry:    (slug) => [`/industri/${slug}`, '/industri'],
  regulation:  (slug) => [`/regulasi/${slug}`, '/regulasi'],
  glossary:    (slug) => [`/glossary/${slug}`, '/glossary'],
  faq:         (slug) => ['/faq'],
  'case-study': (slug) => [`/studi-kasus/${slug}`, '/studi-kasus'],
}

type RevalidateBody = {
  secret: string
  type: string
  slug?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const body = req.body as RevalidateBody

  // Validasi secret token
  if (body.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid revalidation secret' })
  }

  const { type, slug } = body

  if (!type) {
    return res.status(400).json({ message: 'Parameter type diperlukan' })
  }

  const pathResolver = TYPE_TO_PATH[type]
  if (!pathResolver) {
    return res.status(400).json({ message: `Tipe konten tidak dikenal: ${type}` })
  }

  const pathsToRevalidate = pathResolver(slug ?? '')

  try {
    await Promise.all(pathsToRevalidate.map((path) => res.revalidate(path)))

    console.log(`[revalidate] Berhasil merevalidasi: ${pathsToRevalidate.join(', ')}`)

    return res.status(200).json({
      revalidated: true,
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[revalidate] Gagal merevalidasi:', err)
    return res.status(500).json({ message: 'Gagal merevalidasi halaman', error: String(err) })
  }
}
