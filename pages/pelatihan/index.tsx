import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { getTrainings, type GQLTrainingCard } from '../../lib/wordpress'
import type { GetStaticProps } from 'next'

// ─── Fallback Data ────────────────────────────────────────────────────────────

const FALLBACK_TRAININGS: GQLTrainingCard[] = [
  { id: '1', slug: 'ahli-k3-umum', title: 'Ahli K3 Umum', excerpt: 'Pelatihan Ahli K3 Umum resmi Kemnaker RI untuk mempersiapkan tenaga ahli keselamatan kerja.', featuredImage: null, trainingFields: { durasi: '12 Hari', sertifikasi: 'Kemnaker RI', level: 'Intermediate', harga: 'Rp 6.500.000' }, certifications: { nodes: [{ name: 'Kemnaker RI', slug: 'kemnaker' }] }, sectors: { nodes: [{ name: 'Umum', slug: 'umum' }] } },
  { id: '2', slug: 'operator-forklift', title: 'Operator Forklift', excerpt: 'Pelatihan dan sertifikasi operator forklift resmi Kemnaker RI untuk keselamatan operasional.', featuredImage: null, trainingFields: { durasi: '3 Hari', sertifikasi: 'Kemnaker RI', level: 'Beginner', harga: 'Rp 2.500.000' }, certifications: { nodes: [{ name: 'Kemnaker RI', slug: 'kemnaker' }] }, sectors: { nodes: [{ name: 'Manufaktur', slug: 'manufaktur' }] } },
  { id: '3', slug: 'petugas-k3-kimia', title: 'Petugas K3 Kimia', excerpt: 'Pelatihan K3 kimia untuk petugas yang bekerja dengan bahan kimia berbahaya.', featuredImage: null, trainingFields: { durasi: '5 Hari', sertifikasi: 'Kemnaker RI', level: 'Intermediate', harga: 'Rp 3.800.000' }, certifications: { nodes: [{ name: 'Kemnaker RI', slug: 'kemnaker' }] }, sectors: { nodes: [{ name: 'Kimia', slug: 'kimia' }] } },
  { id: '4', slug: 'iso-14001-awareness', title: 'ISO 14001 Awareness', excerpt: 'Pelatihan pengenalan standar ISO 14001 untuk manajemen lingkungan yang efektif.', featuredImage: null, trainingFields: { durasi: '2 Hari', sertifikasi: 'ISO', level: 'Beginner', harga: 'Rp 1.800.000' }, certifications: { nodes: [{ name: 'ISO', slug: 'iso' }] }, sectors: { nodes: [{ name: 'Lingkungan', slug: 'lingkungan' }] } },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type SectorTab = { name: string; slug: string }
type Props = { trainings: GQLTrainingCard[]; sectors: SectorTab[] }

// ─── Data Fetching ────────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await getTrainings()
  const trainings = data.length > 0 ? data : FALLBACK_TRAININGS

  const sectorMap = new Map<string, string>()
  trainings.forEach((t) => {
    t.sectors?.nodes?.forEach((s) => { if (!sectorMap.has(s.slug)) sectorMap.set(s.slug, s.name) })
  })
  const sectors: SectorTab[] = Array.from(sectorMap.entries()).map(([slug, name]) => ({ slug, name }))

  return { props: { trainings, sectors }, revalidate: false }
}

// ─── Level Badge ──────────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: string | null }) {
  if (!level) return null
  const map: Record<string, string> = {
    beginner: 'bg-green-50 text-green-700 border-green-200',
    intermediate: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    advanced: 'bg-red-50 text-red-700 border-red-200',
  }
  const cls = map[level.toLowerCase()] ?? 'bg-slate-100 text-slate-600 border-slate-200'
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}>{level}</span>
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PelatihanIndex({ trainings, sectors }: Props) {
  const [activeSector, setActiveSector] = useState<string>('semua')

  const filtered = activeSector === 'semua'
    ? trainings
    : trainings.filter((t) => t.sectors?.nodes?.some((s) => s.slug === activeSector))

  return (
    <>
      <SEO
        title="Program Pelatihan K3 & Lingkungan | Training Jogja"
        description="Program pelatihan bersertifikat Kemnaker RI dan ISO: Ahli K3 Umum, Operator Forklift, K3 Kimia, ISO 14001 dan banyak lagi. Instruktur berpengalaman di Yogyakarta."
        ogImage="/images/hero.png"
        ogType="website"
      />

      <Header />

      <main className="bg-[#F8FAFC] text-[#1E293B] min-h-screen">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative bg-[#123458] text-white overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#123458] via-[#0f2d4d] to-[#0a1f36]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(47,107,59,0.35),_transparent_55%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(47,107,59,0.2),_transparent_50%)] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <span className="inline-flex items-center rounded-full border border-[#2F6B3B]/40 bg-[#2F6B3B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-green-300">
              Program Pelatihan
            </span>
            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Pelatihan Bersertifikat<br />
              <span className="text-[#F59E0B]">K3 &amp; Lingkungan</span>
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-slate-300 max-w-2xl mx-auto">
              Program pelatihan resmi bersertifikat Kemnaker RI dan ISO. Tingkatkan kompetensi tim Anda dengan instruktur berpengalaman di bidang K3 dan lingkungan hidup.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/konsultasi" className="inline-flex items-center justify-center rounded-xl bg-[#F59E0B] px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#e08e0a] transition-all active:scale-95">
                Daftar Sekarang
              </Link>
              <a href="#pelatihan" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all">
                Lihat Program ↓
              </a>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ──────────────────────────────────────────────── */}
        <section className="bg-white border-b border-slate-100 py-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { value: `${trainings.length}+`, label: 'Program Tersedia', icon: '📋' },
                { value: '5.000+', label: 'Peserta Terlatih', icon: '👷' },
                { value: '98%', label: 'Tingkat Kelulusan', icon: '🏆' },
                { value: 'Bersertifikat', label: 'Kemnaker RI & ISO', icon: '📜' },
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

        {/* ── FILTER + GRID ─────────────────────────────────────────────── */}
        <section id="pelatihan" className="py-24 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-xs uppercase tracking-[0.35em] text-[#2F6B3B] font-bold">Semua Program</p>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#123458]">Pilih Program Pelatihan</h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">Filter program berdasarkan sektor industri Anda.</p>
            </div>

            {sectors.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-12">
                <button
                  onClick={() => setActiveSector('semua')}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${activeSector === 'semua' ? 'bg-[#123458] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#123458] hover:text-[#123458]'}`}
                >
                  Semua
                </button>
                {sectors.map((sector) => (
                  <button
                    key={sector.slug}
                    onClick={() => setActiveSector(sector.slug)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${activeSector === sector.slug ? 'bg-[#123458] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#123458] hover:text-[#123458]'}`}
                  >
                    {sector.name}
                  </button>
                ))}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-lg font-semibold">Tidak ada program untuk sektor ini.</p>
                <button onClick={() => setActiveSector('semua')} className="mt-4 text-sm text-[#2F6B3B] font-bold hover:underline">Tampilkan semua program</button>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((training) => {
                  const tf = training.trainingFields
                  return (
                    <Link
                      key={training.id}
                      href={`/pelatihan/${training.slug}`}
                      className="group flex flex-col rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_40px_-15px_rgba(18,52,88,0.08)] hover:shadow-[0_28px_56px_-15px_rgba(18,52,88,0.16)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative h-44 bg-gradient-to-br from-[#123458] to-[#2F6B3B] overflow-hidden flex items-center justify-center">
                        {training.featuredImage ? (
                          <Image src={training.featuredImage.node.sourceUrl} alt={training.featuredImage.node.altText || training.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                        ) : (
                          <span className="text-4xl opacity-50">🎓</span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        {tf?.sertifikasi && (
                          <span className="absolute top-4 right-4 rounded-full bg-[#F59E0B] px-2.5 py-1 text-[10px] font-bold uppercase text-white tracking-wide shadow">
                            {tf.sertifikasi}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col flex-1 p-6">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="text-lg font-bold text-[#123458] group-hover:text-[#2F6B3B] transition-colors leading-snug">
                            {training.title}
                          </h3>
                          {tf?.level && <LevelBadge level={tf.level} />}
                        </div>

                        {training.excerpt && (
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4"
                            dangerouslySetInnerHTML={{ __html: training.excerpt.replace(/<[^>]+>/g, '') }}
                          />
                        )}

                        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                          {tf?.durasi && <div className="flex items-center gap-1.5 text-xs text-slate-500"><span>⏱</span><span className="font-semibold">{tf.durasi}</span></div>}
                          {tf?.harga && <div className="flex items-center gap-1.5 text-xs text-[#2F6B3B] font-bold"><span>💰</span><span>{tf.harga}</span></div>}
                        </div>

                        <div className="mt-4">
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-[#123458] group-hover:text-[#2F6B3B] transition-colors">
                            Lihat Detail
                            <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="relative bg-[#123458] py-24 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(47,107,59,0.3),_transparent_60%)] pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-green-300 font-bold">Daftarkan Tim Anda</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-white leading-tight">Siap Meningkatkan Kompetensi K3?</h2>
            <p className="mt-6 text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">Hubungi kami untuk informasi jadwal, harga grup, atau pelatihan in-house di lokasi perusahaan Anda.</p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/konsultasi" className="inline-flex items-center justify-center rounded-xl bg-[#F59E0B] px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#e08e0a] transition-all active:scale-95">
                Konsultasi &amp; Daftar
              </Link>
              <a
                href="https://wa.me/6285328883511?text=Halo%20Training%20Jogja,%20saya%20ingin%20informasi%20program%20pelatihan."
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all"
              >
                💬 Chat WhatsApp
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
