import Link from 'next/link'
import Image from 'next/image'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { getSolutionBySlug, getAllSolutionSlugs, type GQLSolutionDetail } from '../../lib/wordpress'
import type { GetStaticPaths, GetStaticProps } from 'next'

type Props = { solution: GQLSolutionDetail }

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllSolutionSlugs()
  return { paths: slugs.map((slug) => ({ params: { slug } })), fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string
  const solution = await getSolutionBySlug(slug)
  if (!solution) return { notFound: true }
  return { props: { solution }, revalidate: false }
}

function buildWAUrl(title: string) {
  return `https://wa.me/6285328883511?text=${encodeURIComponent(`Halo Training Jogja, saya ingin konsultasi mengenai solusi ${title}.`)}`
}

export default function SolusiDetail({ solution }: Props) {
  const seoTitle = solution.seo?.title || `${solution.title} | Training Jogja`
  const seoDesc = solution.seo?.metaDesc || solution.excerpt?.replace(/<[^>]+>/g, '').substring(0, 160) || `Pelajari solusi ${solution.title} dari Training Jogja.`
  const seoImage = solution.seo?.opengraphImage?.sourceUrl || solution.featuredImage?.node.sourceUrl || '/images/hero.png'
  const tagline = solution.solutionFields?.tagline ?? ''
  const icon = solution.solutionFields?.icon ?? '🔧'

  return (
    <>
      <SEO title={seoTitle} description={seoDesc} ogImage={seoImage} ogType="article" canonical={solution.seo?.canonical} />

      <Header />

      <main className="bg-[#F8FAFC] text-[#1E293B] min-h-screen">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div className="relative bg-[#123458] text-white overflow-hidden">
          {solution.featuredImage ? (
            <div className="relative h-[380px] md:h-[480px] w-full">
              <Image src={solution.featuredImage.node.sourceUrl} alt={solution.featuredImage.node.altText || solution.title} fill priority className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123458] via-[#123458]/60 to-transparent" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#123458] via-[#0f2d4d] to-[#0a1f36]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(47,107,59,0.35),_transparent_55%)] pointer-events-none" />
              <div className="relative h-[260px] flex items-center justify-center">
                <span className="text-8xl opacity-40 select-none">{icon}</span>
              </div>
            </>
          )}

          <div className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-8">
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <span className="text-slate-600">/</span>
              <Link href="/solusi" className="hover:text-white transition-colors">Solusi</Link>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300 truncate max-w-[200px]">{solution.title}</span>
            </nav>

            {tagline && (
              <span className="mb-4 inline-block rounded-full border border-[#2F6B3B]/40 bg-[#2F6B3B]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-300">
                {tagline}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white max-w-3xl">
              {solution.title}
            </h1>
            {solution.excerpt && (
              <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl"
                dangerouslySetInnerHTML={{ __html: solution.excerpt.replace(/<[^>]+>/g, '') }}
              />
            )}
          </div>
        </div>

        {/* ── BODY + SIDEBAR ────────────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_340px]">

            {/* Main content */}
            <article>
              <div className="prose-wp" dangerouslySetInnerHTML={{ __html: solution.content || '' }} />

              {solution.solutionFields?.manfaat && (
                <div className="mt-10 rounded-2xl bg-[#2F6B3B]/5 border border-[#2F6B3B]/20 p-7">
                  <h2 className="text-xl font-bold text-[#123458] mb-4">Manfaat Utama</h2>
                  <div className="prose-wp text-slate-700" dangerouslySetInnerHTML={{ __html: solution.solutionFields.manfaat }} />
                </div>
              )}
              {solution.solutionFields?.proses && (
                <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-7">
                  <h2 className="text-xl font-bold text-[#123458] mb-4">Proses Implementasi</h2>
                  <div className="prose-wp text-slate-700" dangerouslySetInnerHTML={{ __html: solution.solutionFields.proses }} />
                </div>
              )}
              {solution.solutionFields?.regulasiTerkait && (
                <div className="mt-8 rounded-2xl bg-[#123458]/5 border border-[#123458]/15 p-7">
                  <h2 className="text-xl font-bold text-[#123458] mb-4">Regulasi Terkait</h2>
                  <div className="prose-wp text-slate-700" dangerouslySetInnerHTML={{ __html: solution.solutionFields.regulasiTerkait }} />
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside>
              <div className="sticky top-24 space-y-6">
                <div className="rounded-[28px] bg-gradient-to-br from-[#123458] to-[#0f2d4d] p-7 text-white shadow-xl shadow-[#123458]/20">
                  <p className="text-xs uppercase tracking-widest text-green-300 font-bold">Butuh Bantuan?</p>
                  <h3 className="mt-3 text-xl font-extrabold leading-snug">Konsultasikan Kebutuhan {solution.title} Anda</h3>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">Tim advisor kami siap membantu merancang roadmap implementasi yang sesuai dengan kondisi perusahaan Anda.</p>
                  <Link href="/konsultasi" className="mt-6 block w-full rounded-xl bg-[#F59E0B] px-5 py-3 text-center text-sm font-bold text-white hover:bg-[#e08e0a] transition-all active:scale-95">
                    Jadwalkan Konsultasi ➔
                  </Link>
                  <a href={buildWAUrl(solution.title)} target="_blank" rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all"
                  >
                    💬 Chat WhatsApp
                  </a>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Solusi Lainnya</p>
                  <Link href="/solusi" className="inline-flex items-center gap-2 text-sm font-bold text-[#123458] hover:text-[#2F6B3B] transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Lihat Semua Solusi
                  </Link>
                </div>
              </div>
            </aside>

          </div>
        </div>

      </main>

      <Footer />
    </>
  )
}
