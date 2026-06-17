/**
 * lib/graphql.ts
 * GraphQL client untuk WordPress (WPGraphQL)
 *
 * Env yang dibutuhkan:
 *   NEXT_PUBLIC_WP_GRAPHQL_URL=https://training-jogja.com/graphql
 *   REVALIDATE_SECRET=<token-rahasia>
 */

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || ''

// ─── Core Fetcher ─────────────────────────────────────────────────────────────

export async function fetchGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate?: number | false
): Promise<T> {
  if (!WP_GRAPHQL_URL) {
    throw new Error('[graphql.ts] NEXT_PUBLIC_WP_GRAPHQL_URL belum dikonfigurasi.')
  }

  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    // revalidate: false  → tidak di-cache (CSR/SSR)
    // revalidate: 0      → selalu fresh
    // revalidate: N      → ISR setiap N detik
    // undefined          → ikuti default Next.js
    next: revalidate !== undefined ? { revalidate } : {},
  })

  if (!res.ok) {
    throw new Error(`[graphql.ts] HTTP error: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()

  if (json.errors?.length) {
    console.error('[graphql.ts] GraphQL errors:', json.errors)
    throw new Error(`[graphql.ts] GraphQL error: ${json.errors[0]?.message}`)
  }

  return json.data as T
}
