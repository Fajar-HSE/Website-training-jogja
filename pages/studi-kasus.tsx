/**
 * pages/studi-kasus.tsx
 * Daftar studi kasus — ISR 12 jam dari WordPress REST API.
 *
 * CPT endpoint: /wp-json/wp/v2/case-study
 * ACF fields: klien, industri, hasil_utama, tantangan, solusi, durasi
 *
 * Fallback static tersedia jika API belum siap / koneksi gagal.
 */

import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { getCaseStudies, type WPCaseStudy } from '../lib/wordpress'
import type { GetStaticProps } from 'next'
import type { PaginationMeta } from '../lib/types'
import { useState } from 'react'

// ─── Fallback Data ────────────────────────────────────────────────────────────

const FALLBACK_CASES: WPCaseStudy[] = [
  {
    id: 1,
    slug: 'manufacturing-zero-accident',
    title: { rendered: 'Manufacturing: Zero Accident 12 Bulan' },
    excerpt: {
      rendered:
        'Penurunan temuan audit sebesar 75% dalam 6 bulan dan mencapai Zero Accident selama 12 bulan berturut-turut.',
    },
    content: { rendered: '' },
    featured_media: 0,
    date: '',
    modified: '',
    link: '',
    acf: {
      klien: 'PT. Manufaktur Indonesia',
      industri: 'Manufacturing',
      tantangan:
        '40+ temuan audit internal berulang dan angka kecelakaan kerja (LTI) yang tinggi pada lini produksi.',
      solusi:
        'Implementasi program LOTO terstruktur, pelatihan operator mesin bersertifikat, dan integrasi tracking audit digital.',
      hasil_utama: 'Temuan audit -75% dalam 6 bulan & Zero Accident 12 bulan.',
      durasi: '6 Bulan',
    },
  },
  {
    id: 2,
    slug: 'mining-smk3-emas',
    title: { rendered: 'Mining: SMK3 Kategori Emas' },
    excerpt: {
      rendered: 'Meraih Sertifikasi SMK3 kategori Emas dari Kementerian dan kelayakan kepatuhan penuh dari Minerba.',
    },
    content: { rendered: '' },
    featured_media: 0,
    date: '',
    modified: '',
    link: '',
    acf: {
      klien: 'PT. Pertambangan Maju',
      industri: 'Mining',
      tantangan:
        'Perubahan regulasi SMKP Minerba yang ketat menyebabkan risiko ketidakpatuhan tinggi pada dokumen operasional.',
      solusi:
        'Gap analysis menyeluruh, penyusunan ulang dokumen K3 pertambangan, dan pendampingan simulasi audit SMKP.',
      hasil_utama: 'SMK3 Emas & kepatuhan Minerba 100%.',
      durasi: '8 Bulan',
    },
  },
  {
    id: 3,
    slug: 'oil-gas-csms',
    title: { rendered: 'Oil & Gas: CSMS Vendor Compliance' },
    excerpt: {
      rendered: 'Keandalan standar vendor meningkat 90%, zero insiden pada proyek perluasan fasilitas kilang minyak.',
    },
    content: { rendered: '' },
    featured_media: 0,
    date: '',
    modified: '',
    link: '',
    acf: {
      klien: 'PT. Energi Baru',
      industri: 'Oil & Gas',
      tantangan:
        'Sistem manajemen kontraktor yang lemah menyebabkan ketidakseragaman standar keselamatan antar vendor.',
      solusi:
        'Pengembangan sistem CSMS (Contractor Safety Management System) baru dan audit vendor pra-kualifikasi.',
      hasil_utama: 'Keandalan vendor +90% & zero insiden.',
      durasi: '4 Bulan',
    },
  },
  {
    id: 4,
    slug: 'construction-zero-injury',
    title: { rendered: 'Construction: Zero Cidera Berat' },
    excerpt: {
      rendered: 'Angka unsafe behavior turun 85%, proyek selesai tepat waktu tanpa kecelakaan cidera berat.',
    },
    content: { rendered: '' },
    featured_media: 0,
    date: '',
    modified: '',
    link: '',
    acf: {
      klien: 'PT. Infrastruktur Jaya',
      industri: 'Construction',
      tantangan:
        'Kurangnya kesadaran penggunaan APD dan tingginya pelanggaran bekerja di ketinggian di area proyek.',
      solusi:
        'Pelatihan scaffolding berlisensi, pemasangan jaring pengaman tambahan, dan sistem reward/penalti harian.',
      hasil_utama: 'Unsafe behavior -85% & on-time delivery 100%.',
      durasi: '3 Bulan',
    },
  },
  {
    id: 5,
    slug: 'energy-klhk-approval',
    title: { rendered: 'Energy: KLHK Emission Approval 100%' },
    excerpt: {
      rendered: 'Kelayakan hasil emisi pembangkit disetujui KLHK secara berkala tanpa temuan administratif.',
    },
    content: { rendered: '' },
    featured_media: 0,
    date: '',
    modified: '',
    link: '',
    acf: {
      klien: 'PT. Power Nusantara',
      industri: 'Energy & Power',
      tantangan:
        'Kesulitan mengelola dan melaporkan pembuangan fly ash dan bottom ash pembangkit sesuai batas aman KLHK.',
      solusi:
        'Penyusunan ulang SOP penampungan abu, monitoring berkala emisi cerobong, dan digitalisasi pelaporan.',
      hasil_utama: 'Temuan KLHK zero & approval rate 100%.',
      durasi: '5 Bulan',
    },
  },
]

// ─── Industry icon map ────────────────────────────────────────────────────────

const INDUSTRY_ICONS: Record<string, string> = {
  manufacturing:  '🏭',
  mining:         '⛏️',
  'oil & gas':    '🛢️',
  oil_gas:        '🛢️',
  construction:   '🏗️',
  energy:         '⚡',
  'energy & power': '⚡',
}

function getIndustryIcon(industri: string | null | undefined) {
  if (!industri) return '🏢'
  return INDUSTRY_ICONS[industri.toLowerCase()] ?? '🏢'
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  caseStudies: WPCaseStudy[]
  pagination: PaginationMeta
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { caseStudies, pagination } = await getCaseStudies({ page: 1, perPage: 20 })

  return {
    props: {
      caseStudies: caseStudies.length > 0 ? caseStudies : FALLBACK_CASES,
      pagination,
    },
    revalidate: 43200, // ISR 12 jam
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudiKasus({ caseStudies, pagination }: Props) {
  const [visibleCount, setVisibleCount] = useState(6)
  const visible = caseStudies.slice(0, visibleCount)

  return (
    <>
      <Head>
        <title>Studi Kasus Sukses | Training Jogja — Compliance &amp; K3 Advisory</title>
        <meta
          name="description"
          content="Hasil nyata dari pendampingan Training Jogja: manufacturing, mining, oil & gas, construction, hingga energy. Studi kasus compliance & K3 terbukti berhasil."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      <main className="bg-slate-50 text-slate-700 overflow-x-hidden">
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative bg-[#123458] text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#123458] via-[#0f2d4d] to-slate-950 opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(47,107,59,0.2),_transparent_50%)] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <span className="inline-flex rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
              Bukti Kinerja Nyata
            </span>
            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Studi Kasus Klien Lintas Industri
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-slate-300 max-w-3xl mx-auto">
              Setiap klien memiliki tantangan unik. Berikut adalah hasil nyata yang kami capai
              bersama — bukan janji, melainkan rekam jejak yang dapat diverifikasi.
            </p>
          </div>
        </section>

        {/* ── METRICS OVERVIEW ─────────────────────────────────────────── */}
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: `${pagination.total || caseStudies.length}+`, label: 'Klien Industri',  sub: 'Skala nasional & multinasional' },
                { value: '95%',    label: 'Audit Readiness',  sub: 'Rata-rata tingkat kelulusan klien' },
                { value: '300+',   label: 'Proyek Selesai',   sub: 'Lintas 5 sektor industri utama' },
                { value: '10+ Thn', label: 'Track Record',    sub: 'Pengalaman konsultasi lapangan' },
              ].map((m, idx) => (
                <div key={idx} className="text-center p-6 border-r border-slate-100 last:border-0">
                  <div className="text-4xl font-extrabold text-[#123458]">{m.value}</div>
                  <p className="mt-2 text-sm font-bold text-slate-700">{m.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CASE STUDIES GRID ────────────────────────────────────────── */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.35em] text-[#2F6B3B] font-bold">
                Portfolio Hasil Kerja
              </p>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-[#123458]">
                Hasil Nyata, Terukur &amp; Transparan
              </h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                Setiap studi kasus dilengkapi dengan tantangan, tindakan mitigasi, dan hasil bisnis
                yang dapat divalidasi.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {visible.map((cs) => {
                const acf    = cs.acf
                const media  = cs._embedded?.['wp:featuredmedia']?.[0] ?? null
                const title  = cs.title.rendered
                const excerpt = cs.excerpt?.rendered?.replace(/<[^>]+>/g, '') ?? ''
                const icon   = getIndustryIcon(acf?.industri)

                return (
                  <article
                    key={cs.id}
                    className="bg-white rounded-[32px] border border-slate-200/80 p-8 md:p-10 shadow-[0_24px_50px_-25px_rgba(18,52,88,0.08)] hover:shadow-[0_32px_64px_-20px_rgba(18,52,88,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border-l-4 border-l-[#2F6B3B]"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        {media ? (
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={media.source_url}
                              alt={media.alt_text || title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-3xl">{icon}</span>
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-[#123458]">
                            {acf?.klien ?? title}
                          </h3>
                          {acf?.industri && (
                            <p className="text-xs text-[#2F6B3B] font-semibold uppercase tracking-wider">
                              {acf.industri}
                            </p>
                          )}
                        </div>
                      </div>
                      {acf?.durasi && (
                        <span className="shrink-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[#2F6B3B]/5 text-[#2F6B3B] border border-[#2F6B3B]/20 rounded-full">
                          {acf.durasi}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
                      {acf?.tantangan && (
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            TANTANGAN:
                          </p>
                          <p>{acf.tantangan}</p>
                        </div>
                      )}
                      {acf?.solusi && (
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            TINDAKAN MITIGASI:
                          </p>
                          <p>{acf.solusi}</p>
                        </div>
                      )}
                      <div className="bg-[#2F6B3B]/5 border border-[#2F6B3B]/20 rounded-2xl p-4">
                        <p className="text-[11px] font-bold text-[#2F6B3B] uppercase tracking-wider mb-1.5">
                          HASIL BISNIS:
                        </p>
                        <p className="font-semibold text-[#2F6B3B]">
                          {acf?.hasil_utama ?? excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end">
                      <Link
                        href="/konsultasi"
                        className="text-sm font-bold text-[#123458] hover:text-[#2F6B3B] transition-colors"
                      >
                        Solusi Serupa ➔
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Load more */}
            {visibleCount < caseStudies.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisibleCount((n) => n + 6)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-[#123458] shadow-sm hover:border-[#2F6B3B] hover:text-[#2F6B3B] transition-all"
                >
                  Lihat Studi Kasus Lainnya ↓
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="relative bg-[#123458] py-24 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(47,107,59,0.2),_transparent_60%)] pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-4xl text-center px-6">
            <p className="text-xs uppercase tracking-[0.35em] text-green-300 font-bold">
              Buat Kisah Sukses Anda Sendiri
            </p>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Siap Menjadi Klien Berikutnya?
            </h2>
            <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Diskusikan tantangan regulasi K3 spesifik perusahaan Anda dengan Lead Advisor kami.
              Gratis &amp; tanpa komitmen.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/konsultasi"
                className="inline-flex items-center justify-center rounded-xl bg-[#F59E0B] px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#e08e0a] transition-all active:scale-95"
              >
                Jadwalkan Konsultasi Strategis
              </Link>
              <Link
                href="/layanan"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all"
              >
                Lihat Semua Layanan
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
