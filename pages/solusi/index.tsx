import Link from 'next/link'
import Image from 'next/image'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { getSolutions, type WPSolution } from '../../lib/wordpress'
import type { GetStaticProps } from 'next'

// ─── Fallback Data ────────────────────────────────────────────────────────────

const FALLBACK_SOLUTIONS: WPSolution[] = [
  {
    id: 1, slug: 'smk3',
    title: { rendered: 'SMK3' },
    excerpt: { rendered: 'Sistem Manajemen Keselamatan dan Kesehatan Kerja sesuai PP 50/2012.' },
    content: { rendered: '' },
    featured_media: 0, date: '', modified: '', link: '',
    acf: { tagline: 'Sertifikasi SMK3 PP 50/2012', icon: '🛡️' },
  },
  {
    id: 2, slug: 'iso-14001',
    title: { rendered: 'ISO 14001' },
    excerpt: { rendered: 'Standar manajemen lingkungan internasional untuk mengelola dampak lingkungan.' },
    content: { rendered: '' },
    featured_media: 0, date: '', modified: '', link: '',
    acf: { tagline: 'Manajemen Lingkungan Internasional', icon: '🌿' },
  },
  {
    id: 3, slug: 'iso-45001',
    title: { rendered: 'ISO 45001' },
    excerpt: { rendered: 'Standar internasional sistem manajemen keselamatan dan kesehatan kerja.' },
    content: { rendered: '' },
    featured_media: 0, date: '', modified: '', link: '',
    acf: { tagline: 'Keselamatan Kerja Standar Global', icon: '⚕️' },
  },
  {
    id: 4, slug: 'pengelolaan-limbah-b3',
    title: { rendered: 'Pengelolaan Limbah B3' },
    excerpt: { rendered: 'Solusi pengelolaan limbah bahan berbahaya dan beracun sesuai PP 22/2021.' },
    content: { rendered: '' },
    featured_media: 0, date: '', modified: '', link: '',
    acf: { tagline: 'Pengelolaan Limbah Bahan Berbahaya', icon: '♻️' },
  },
  {
    id: 5, slug: 'esg',
    title: { rendered: 'ESG' },
    excerpt: { rendered: 'Kerangka Environmental, Social, and Governance untuk praktik bisnis berkelanjutan.' },
    content: { rendered: '' },
    featured_media: 0, date: '', modified: '', link: '',
    acf: { tagline: 'Environmental, Social & Governance', icon: '📊' },
  },
]

// ─── Icon gradient colors ─────────────────────────────────────────────────────

const ICON_COLORS = [
  'from-[#123458] to-[#1a4d7a]',
  'from-[#2F6B3B] to-[#3d8a4d]',
  'from-[#123458] to-[#2F6B3B]',
  'from-[#1a4d7a] to-[#123458]',
  'from-[#3d8a4d] to-[#2F6B3B]',
]

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = { solutions: WPSolution[]; total: number }

// ─── Data Fetching ────────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { solutions, pagination } = await getSolutions(1, 50)
  const data = solutions.length > 0 ? solutions : FALLBACK_SOLUTIONS
  return {
    props: { solutions: data, total: pagination.total || data.length },
    revalidate: false, // SSG + on-demand webhook
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SolusiIndex({ solutions }: Props) {
  return (
    <>
      <SEO
        title="Solusi Bisnis K3 & Lingkungan | Training Jogja"
        description="Temukan solusi komprehensif untuk kepatuhan K3 dan lingkungan: SMK3, ISO 14001, ISO 45001, Pengelolaan Limbah B3, dan ESG. Didukung tim ahli berpengalaman."
        ogImage="/images/hero.png"
        ogType="website"
      />

      <Header />

      <main className="bg-[#F8FAFC] text-[#1E293B] min-h-screen">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative bg-[#123458] text-white overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#123458] via-[#0f2d4d] to-[#0a1f36]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(47,107,59,0.35),_transparent_55%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(47,107,59,0.2),_transparent_50%)] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <span className="inline-flex items-center rounded-full border border-[#2F6B3B]/40 bg-[#2F6B3B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-green-300">
              Solusi Bisnis
            </span>
            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Solusi K3 &amp; Lingkungan<br />
              <span className="text-[#F59E0B]">untuk Bisnis Anda</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-slate-300 max-w-2xl mx-auto">
              Dari sertifikasi SMK3 hingga implementasi ESG, kami menyediakan solusi komprehensif
              yang disesuaikan dengan kebutuhan dan regulasi industri Anda.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/konsultasi"
                className="inline-flex items-center justify-center rounded-xl bg-[#F59E0B] px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#e08e0a] transition-all active:scale-95"
              >
                Konsultasi Gratis
              </Link>
              <a
                href="#solusi"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all"
              >
                Lihat Semua Solusi ↓
              </a>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ──────────────────────────────────────────────── */}
        <section className="bg-white border-b border-slate-100 py-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { value: '10+', label: 'Solusi Tersedia', icon: '🎯' },
                { value: '300+', label: 'Klien Terbantu', icon: '🏭' },
                { value: '95%', label: 'Tingkat Keberhasilan', icon: '✅' },
                { value: '12 Mgg', label: 'Rata-rata Implementasi', icon: '⏱️' },
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-4">
                  <span className="text-2xl mb-2">{stat.icon}</span>
                  <span className="text-2xl font-extrabold text-[#123458]">{stat.value}</span>
                  <span className="mt-1 text-xs font-semibold text-slate-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOLUSI GRID ──────────────────────────────────────────────── */}
        <section id="solusi" className="py-24 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.35em] text-[#2F6B3B] font-bold">
                Portofolio Solusi
              </p>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#123458]">
                Solusi yang Kami Tawarkan
              </h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                Setiap solusi dirancang khusus untuk tantangan nyata yang dihadapi industri — bukan
                solusi generik.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {solutions.map((solution, idx) => {
                const acf = solution.acf
                const tagline = acf?.tagline ?? ''
                const icon = acf?.icon ?? '🔧'
                const gradientClass = ICON_COLORS[idx % ICON_COLORS.length]
                const media = solution._embedded?.['wp:featuredmedia']?.[0] ?? null
                const title = solution.title.rendered
                const excerpt = solution.excerpt.rendered.replace(/<[^>]+>/g, '')

                return (
                  <Link
                    key={solution.id}
                    href={`/solusi/${solution.slug}`}
                    className="group flex flex-col rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_40px_-15px_rgba(18,52,88,0.08)] hover:shadow-[0_28px_56px_-15px_rgba(18,52,88,0.16)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div
                      className={`relative h-40 bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden`}
                    >
                      {media ? (
                        <Image
                          src={media.source_url}
                          alt={media.alt_text || title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      ) : (
                        <span className="text-5xl">{icon}</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <div className="flex flex-col flex-1 p-7">
                      {tagline && (
                        <span className="mb-3 inline-block rounded-full bg-[#2F6B3B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#2F6B3B] border border-[#2F6B3B]/20">
                          {tagline}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-[#123458] group-hover:text-[#2F6B3B] transition-colors">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {excerpt}
                        </p>
                      )}
                      <div className="mt-auto pt-6">
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-[#123458] group-hover:text-[#2F6B3B] transition-colors">
                          Pelajari Selengkapnya
                          <svg
                            className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="relative bg-[#123458] py-24 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(47,107,59,0.3),_transparent_60%)] pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-green-300 font-bold">
              Konsultasi Sekarang
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Tidak Yakin Solusi Mana yang Tepat?
            </h2>
            <p className="mt-6 text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Tim advisor kami siap membantu memetakan kebutuhan spesifik perusahaan Anda dan
              merekomendasikan solusi yang paling sesuai.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/konsultasi"
                className="inline-flex items-center justify-center rounded-xl bg-[#F59E0B] px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#e08e0a] transition-all active:scale-95"
              >
                Jadwalkan Konsultasi Gratis
              </Link>
              <a
                href="https://wa.me/6285328883511?text=Halo%20Training%20Jogja,%20saya%20ingin%20konsultasi%20solusi%20K3%20untuk%20perusahaan%20saya."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all"
              >
                Chat WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
