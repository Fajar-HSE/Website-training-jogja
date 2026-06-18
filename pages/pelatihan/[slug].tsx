import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { getTrainingBySlug, getAllTrainingSlugs, type WPTraining } from '../../lib/wordpress'
import type { GetStaticPaths, GetStaticProps } from 'next'

type Props = { training: WPTraining }

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllTrainingSlugs()
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string
  const training = await getTrainingBySlug(slug)
  if (!training) return { notFound: true }
  return { props: { training }, revalidate: false }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

type TabKey = 'deskripsi' | 'materi' | 'persyaratan' | 'jadwal'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'deskripsi', label: 'Deskripsi' },
  { key: 'materi', label: 'Materi' },
  { key: 'persyaratan', label: 'Persyaratan' },
  { key: 'jadwal', label: 'Jadwal' },
]

function buildWAUrl(title: string) {
  return `https://wa.me/6285328883511?text=${encodeURIComponent(
    `Halo Training Jogja, saya ingin mendaftar program pelatihan ${title}.`
  )}`
}

function LevelBadge({ level }: { level: string | null | undefined }) {
  if (!level) return null
  const map: Record<string, string> = {
    beginner: 'bg-green-50 text-green-700 border-green-200',
    intermediate: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    advanced: 'bg-red-50 text-red-700 border-red-200',
  }
  const cls = map[level.toLowerCase()] ?? 'bg-slate-100 text-slate-600 border-slate-200'
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${cls}`}
    >
      {level}
    </span>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PelatihanDetail({ training }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('deskripsi')

  const acf = training.acf
  const media = training._embedded?.['wp:featuredmedia']?.[0] ?? null
  const seoData = training.yoast_head_json

  const title = training.title.rendered
  const excerpt = training.excerpt.rendered.replace(/<[^>]+>/g, '')
  const content = training.content.rendered

  const seoTitle = seoData?.title || `${title} | Training Jogja`
  const seoDesc = seoData?.description || excerpt.substring(0, 160) || `Program pelatihan ${title} dari Training Jogja.`
  const seoImage = seoData?.og_image?.[0]?.url || media?.source_url || '/images/hero.png'
  const canonical = seoData?.canonical

  const tabContent: Record<TabKey, string | null | undefined> = {
    deskripsi: content,
    materi: acf?.materi,
    persyaratan: acf?.syarat,
    jadwal: acf?.jadwal,
  }

  // Sector terms
  const sectorTerms =
    training.sector ??
    training._embedded?.['wp:term']
      ?.flat()
      ?.filter((t) => t) ?? []

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDesc}
        ogImage={seoImage}
        ogType="article"
        canonical={canonical}
        courseData={{
          name: title,
          description: seoDesc,
          price: acf?.harga ?? undefined,
          duration: acf?.durasi ?? undefined,
          level: acf?.level ?? undefined,
        }}
      />

      <Header />

      <main className="bg-[#F8FAFC] text-[#1E293B] min-h-screen">
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div className="relative bg-[#123458] text-white overflow-hidden">
          {media ? (
            <div className="relative h-[380px] md:h-[460px] w-full">
              <Image
                src={media.source_url}
                alt={media.alt_text || title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123458] via-[#123458]/60 to-transparent" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#123458] via-[#0f2d4d] to-[#0a1f36]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(47,107,59,0.35),_transparent_55%)] pointer-events-none" />
              <div className="relative h-[260px] flex items-center justify-center">
                <span className="text-8xl opacity-40 select-none">🎓</span>
              </div>
            </>
          )}

          <div className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-8">
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <span className="text-slate-600">/</span>
              <Link href="/pelatihan" className="hover:text-white transition-colors">Pelatihan</Link>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300 truncate max-w-[200px]">{title}</span>
            </nav>

            <div className="flex flex-wrap gap-2 mb-4">
              {acf?.sertifikasi && (
                <span className="rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-bold text-white">
                  {acf.sertifikasi}
                </span>
              )}
              {acf?.level && <LevelBadge level={acf.level} />}
              {sectorTerms.map((s) => (
                <span
                  key={s.slug}
                  className="rounded-full border border-[#2F6B3B]/40 bg-[#2F6B3B]/15 px-3 py-1 text-xs font-bold text-green-300"
                >
                  {s.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white max-w-3xl">
              {title}
            </h1>
            {excerpt && (
              <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-2xl">{excerpt}</p>
            )}
          </div>
        </div>

        {/* ── BODY + SIDEBAR ────────────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
            {/* Main Content */}
            <div>
              {/* Tabs */}
              <div className="flex gap-1 border-b border-slate-200 mb-10 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative shrink-0 px-5 py-3 text-sm font-semibold transition-colors ${
                      activeTab === tab.key
                        ? 'text-[#123458] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#123458]'
                        : 'text-slate-500 hover:text-[#123458]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="min-h-[200px]">
                {(() => {
                  const tabHtml = tabContent[activeTab]
                  if (!tabHtml) {
                    return (
                      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                        <p className="text-lg font-semibold">Informasi belum tersedia.</p>
                        <p className="mt-2 text-sm">Hubungi kami untuk informasi lengkap.</p>
                        <a
                          href={buildWAUrl(title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2F6B3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#25522e] transition-colors"
                        >
                          Tanya via WhatsApp
                        </a>
                      </div>
                    )
                  }
                  return (
                    <div className="prose-wp" dangerouslySetInnerHTML={{ __html: tabHtml }} />
                  )
                })()}
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              <div className="sticky top-24 space-y-6">
                {/* Info Card */}
                <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
                    Info Program
                  </p>
                  <div className="space-y-4">
                    {acf?.durasi && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-500 font-medium">
                          <span>⏱</span> Durasi
                        </span>
                        <span className="font-bold text-[#123458]">{acf.durasi}</span>
                      </div>
                    )}
                    {acf?.sertifikasi && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-500 font-medium">
                          <span>📜</span> Sertifikasi
                        </span>
                        <span className="font-bold text-[#123458]">{acf.sertifikasi}</span>
                      </div>
                    )}
                    {acf?.level && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-500 font-medium">
                          <span>📊</span> Level
                        </span>
                        <LevelBadge level={acf.level} />
                      </div>
                    )}
                    {acf?.harga && (
                      <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-4 mt-2">
                        <span className="flex items-center gap-2 text-slate-500 font-medium">
                          <span>💰</span> Harga
                        </span>
                        <span className="font-extrabold text-[#2F6B3B] text-base">{acf.harga}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Card */}
                <div className="rounded-[28px] bg-gradient-to-br from-[#123458] to-[#0f2d4d] p-7 text-white shadow-xl shadow-[#123458]/20">
                  <p className="text-xs uppercase tracking-widest text-green-300 font-bold">
                    Daftar Sekarang
                  </p>
                  <h3 className="mt-3 text-xl font-extrabold leading-snug">
                    Bergabung dalam Program Ini
                  </h3>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    Tempat terbatas. Hubungi kami untuk konfirmasi ketersediaan jadwal dan proses
                    pendaftaran.
                  </p>
                  <a
                    href={buildWAUrl(title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-3 text-sm font-bold text-white hover:bg-[#e08e0a] transition-all active:scale-95"
                  >
                    💬 Daftar via WhatsApp
                  </a>
                  <Link
                    href="/konsultasi"
                    className="mt-3 flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all"
                  >
                    Jadwalkan Konsultasi
                  </Link>
                </div>

                {/* Back to listing */}
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                    Program Lainnya
                  </p>
                  <Link
                    href="/pelatihan"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#123458] hover:text-[#2F6B3B] transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Lihat Semua Program
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
