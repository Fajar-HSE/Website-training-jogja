/**
 * pages/resource-center/[slug].tsx
 *
 * Halaman ini TIDAK PERNAH dirender karena next.config.js sudah mendaftarkan
 * redirect 301 permanen:
 *   /resource-center/:slug  →  /:slug
 *
 * File ini dipertahankan sebagai safety-net: jika redirect gagal (mis. dev mode
 * tanpa config terbaca), halaman ini akan redirect secara server-side ke flat URL.
 *
 * Canonical artikel tetap di: https://training-jogja.com/{slug}
 */

import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const slug = params?.slug as string

  res.setHeader('Location', `/${slug}`)
  res.statusCode = 301
  res.end()

  return { props: {} }
}

export default function RedirectPage() {
  return null
}
