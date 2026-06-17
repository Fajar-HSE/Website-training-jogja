import Head from 'next/head'
import Header from '../../components/Header'
import Image from 'next/image'
import Link from 'next/link'
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '../../lib/wordpress'
import type { NormalizedPost } from '../../lib/wordpress'
import type { GetStaticPaths, GetStaticProps } from 'next'

import SEO from '../../components/SEO'

type Props = {
  post: NormalizedPost
  relatedPosts: NormalizedPost[]
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllPostSlugs()
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: 'blocking', // SSR on-demand for new posts
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string
  const post = await getPostBySlug(slug)

  if (!post) return { notFound: true }

  const relatedPosts = await getRelatedPosts(post.categorySlug, post.id)

  return {
    props: { post, relatedPosts },
    revalidate: 21600, // ISR 6 jam
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  k3:         'bg-teal-50 text-teal-700 border border-teal-100',
  lingkungan: 'bg-green-50 text-green-700 border border-green-100',
  regulasi:   'bg-yellow-50 text-[#AB7F12] border border-[#AB7F12]/20',
}
function getCategoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? 'bg-slate-100 text-slate-600 border border-slate-200'
}

export default function ArticleDetail({ post, relatedPosts }: Props) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const waShare = `https://wa.me/?text=${encodeURIComponent(post.title + ' — ' + shareUrl)}`

  return (
    <>
      <SEO
        title={post.seo?.title || `${post.title} | Training Jogja`}
        description={post.seo?.metaDesc || post.excerpt}
        ogImage={post.seo?.opengraphImage?.sourceUrl || post.featuredImage || '/images/hero.png'}
        ogType="article"
        canonical={post.seo?.canonical}
        articleData={{
          publishedTime: post.dateISO,
          authorName: post.authorName,
          category: post.categoryLabel,
        }}
      />

      <Header />

      <main className="bg-slate-50 min-h-screen">

        {/* ── HERO IMAGE / HEADER ───────────────────────────────────────── */}
        <div className="relative bg-[#0B1F3A] text-white overflow-hidden">
          {post.featuredImage ? (
            <div className="relative h-[420px] md:h-[520px] w-full">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/60 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0D2646] to-slate-950 opacity-95" />
          )}

          {/* Text over hero */}
          <div className="relative z-10 mx-auto max-w-4xl px-6 pb-16 pt-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <span>/</span>
              <Link href="/resource-center" className="hover:text-white transition-colors">Resource Center</Link>
              <span>/</span>
              <span className="text-slate-300 truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Category badge */}
            <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase mb-5 ${getCategoryColor(post.categorySlug)}`}>
              {post.categoryLabel}
            </span>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-300">
              {/* Author */}
              <div className="flex items-center gap-2">
                {post.authorAvatar ? (
                  <Image src={post.authorAvatar} alt={post.authorName} width={28} height={28} className="rounded-full" />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-teal-500 to-[#0B1F3A] flex items-center justify-center text-white text-xs font-bold">
                    {post.authorName.charAt(0)}
                  </div>
                )}
                <span className="font-semibold text-white">{post.authorName}</span>
              </div>
              <span className="text-slate-500">·</span>
              <span>{post.date}</span>
              <span className="text-slate-500">·</span>
              <span>⏱ {post.readTime}</span>
            </div>
          </div>
        </div>

        {/* ── ARTICLE BODY + SIDEBAR ────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_340px]">

            {/* Article content */}
            <article>
              {/* Excerpt lead */}
              <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed border-l-4 border-teal-500 pl-5 mb-10">
                {post.excerpt}
              </p>

              {/* WordPress HTML content */}
              <div
                className="prose-wp"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share bar */}
              <div className="mt-14 pt-8 border-t border-slate-200 flex flex-wrap items-center gap-4">
                <span className="text-sm font-bold text-slate-600">Bagikan artikel:</span>
                <a
                  href={waShare}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-white hover:bg-[#1ebe5d] transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595A9.869 9.869 0 012.14 12.03C2.14 6.545 6.545 2.14 12.03 2.14c5.484 0 9.89 4.406 9.89 9.89 0 5.483-4.406 9.85-9.891 9.85z"/></svg>
                  WhatsApp
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '')}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  🔗 Copy Link
                </button>
              </div>
            </article>

            {/* ── SIDEBAR ─────────────────────────────────────────────── */}
            <aside className="space-y-6">

              {/* Sticky CTA */}
              <div className="sticky top-24 space-y-6">
                <div className="rounded-[28px] bg-gradient-to-br from-[#0B1F3A] to-[#0D2646] p-7 text-white shadow-xl">
                  <p className="text-xs uppercase tracking-widest text-teal-400 font-bold">Butuh Bantuan?</p>
                  <h3 className="mt-3 text-xl font-extrabold leading-snug">
                    Konsultasikan Kepatuhan K3 Perusahaan Anda
                  </h3>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    Tim advisor kami siap membantu pemetaan risiko dan persiapan audit secara personal.
                  </p>
                  <Link href="/konsultasi" className="mt-6 btn-primary w-full text-center block">
                    Jadwalkan Konsultasi ➔
                  </Link>
                  <a
                    href="https://wa.me/6285328883511?text=Halo%20HSE%20SkillUp,%20saya%20membaca%20artikel%20dan%20ingin%20konsultasi."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all"
                  >
                    <span>💬</span> Chat WhatsApp
                  </a>
                </div>

                {/* Related articles */}
                {relatedPosts.length > 0 && (
                  <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Artikel Terkait</p>
                    <div className="space-y-5">
                      {relatedPosts.map((rel) => (
                        <Link
                          key={rel.id}
                          href={`/${rel.slug}`}
                          className="group flex gap-3 items-start"
                        >
                          {rel.featuredImage && (
                            <div className="relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden">
                              <Image src={rel.featuredImage} alt={rel.title} fill className="object-cover" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-[#0B1F3A] leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
                              {rel.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">{rel.readTime}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link href="/resource-center" className="mt-6 block text-center text-xs font-bold text-teal-600 hover:underline">
                      Lihat Semua Artikel ➔
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center text-xs gap-4 text-slate-500">
          <div>© {new Date().getFullYear()} HSE SkillUp. Semua hak dilindungi.</div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-400">Beranda</Link>
            <Link href="/resource-center" className="hover:text-slate-400">Resource Center</Link>
            <Link href="/kontak" className="hover:text-slate-400">Kontak</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
