/**
 * pages/resource-center.tsx
 * Listing artikel dengan pagination server-side + ISR 6 jam.
 *
 * - Setiap halaman di-generate via getStaticProps + revalidate: 21600
 * - URL: /resource-center?page=2 → ditangani oleh router query
 * - Halaman 1 di-pre-render saat build; halaman berikutnya SSR on-demand (fallback: true)
 * - Navigasi pagination menggunakan next/router (shallow routing)
 */

import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getPosts, getCategories } from '../lib/wordpress'
import type { NormalizedPost } from '../lib/wordpress'
import type { GetStaticProps } from 'next'
import type { PaginationMeta } from '../lib/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const PER_PAGE = 12

const STATIC_CATEGORY = { id: 0, name: 'Semua Artikel', slug: 'semua', count: 0 }

const faqsData = [
  {
    question: 'Apa perbedaan mendasar antara SMK3 PP 50/2012 dan ISO 45001?',
    answer:
      'SMK3 adalah standar keselamatan kerja yang diwajibkan oleh hukum nasional di Indonesia (mandatori untuk perusahaan dengan 100+ karyawan atau berisiko tinggi). Sedangkan ISO 45001 adalah standar manajemen keselamatan kerja internasional yang bersifat sukarela, namun seringkali menjadi syarat kemitraan bisnis global.',
  },
  {
    question: 'Berapa lama waktu yang dibutuhkan untuk pengajuan persetujuan lingkungan AMDAL?',
    answer:
      'Secara normatif, proses penilaian dokumen AMDAL hingga terbit persetujuan kelayakan lingkungan memakan waktu sekitar 120–180 hari kerja, tergantung pada kompleksitas dampak industri, kelengkapan draf awal, dan kecepatan perbaikan oleh pemrakarsa proyek.',
  },
  {
    question: 'Siapa saja pekerja yang wajib memiliki lisensi K3 resmi Kemenaker?',
    answer:
      'Seluruh operator alat berat (crane, forklift, loader), petugas K3 kimia, petugas peran kebakaran, scaffolder, ahli K3 umum, dan dokter perusahaan wajib memiliki lisensi/sertifikasi kompetensi resmi Kemenaker RI yang diperbarui secara berkala.',
  },
  {
    question: 'Bagaimana cara mendaftar sesi evaluasi kepatuhan awal?',
    answer:
      'Anda dapat menggunakan fitur Compliance Assessment di halaman Konsultasi kami. Masukkan profil perusahaan dan jawaban kesiapan Anda, maka sistem akan mengkalkulasi skor awal dan membuka formulir pemesanan jadwal tatap muka/online 15-menit gratis.',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  k3: 'bg-teal-50 text-teal-700 border border-teal-100',
  lingkungan: 'bg-green-50 text-green-700 border border-green-100',
  regulasi: 'bg-yellow-50 text-[#AB7F12] border border-[#AB7F12]/20',
}

function getCategoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? 'bg-slate-100 text-slate-600 border border-slate-200'
}

// ─── Types ────────────────────────────────────────────────────────────────────

type WPCategory = { id: number; name: string; slug: string; count: number }

type Props = {
  posts: NormalizedPost[]
  categories: WPCategory[]
  pagination: PaginationMeta
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [{ posts, pagination }, categories] = await Promise.all([
    getPosts({ page: 1, perPage: PER_PAGE }),
    getCategories(),
  ])

  return {
    props: { posts, categories, pagination },
    revalidate: 21600, // ISR 6 jam
  }
}

// ─── Pagination Component ─────────────────────────────────────────────────────

type PaginatorProps = {
  pagination: PaginationMeta
  activeCategory: string
  onPageChange: (page: number) => void
  loading: boolean
}

function Paginator({ pagination, activeCategory, onPageChange, loading }: PaginatorProps) {
  const { currentPage, totalPages } = pagination
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      pages.push(i)
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-14"
      aria-label="Navigasi halaman artikel"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-[#0F766E] hover:text-[#0F766E] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Halaman sebelumnya"
      >
        ←
      </button>

      {pages.map((p, idx) =>
        p === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex h-10 w-10 items-center justify-center text-slate-400 text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            disabled={loading}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-semibold transition-all disabled:opacity-60 ${
              p === currentPage
                ? 'border-[#0F766E] bg-[#0F766E] text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-[#0F766E] hover:text-[#0F766E]'
            }`}
            aria-label={`Halaman ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {loading && p === currentPage ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              p
            )}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-[#0F766E] hover:text-[#0F766E] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Halaman berikutnya"
      >
        →
      </button>
    </nav>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResourceCenter({ posts: initialPosts, categories, pagination: initialPagination }: Props) {
  const router = useRouter()

  const [activeCategory, setActiveCategory] = useState('semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [posts, setPosts] = useState(initialPosts)
  const [pagination, setPagination] = useState(initialPagination)
  const [loading, setLoading] = useState(false)

  const allCategories: WPCategory[] = [STATIC_CATEGORY, ...categories]

  // ── Client-side fetch saat ganti halaman / kategori / search ──────────────
  async function fetchPage(page: number, category: string, search: string) {
    setLoading(true)
    try {
      // Panggil internal API route agar fetch terjadi di sisi server (pakai cache)
      const params = new URLSearchParams({
        page: String(page),
        perPage: String(PER_PAGE),
      })
      if (category !== 'semua') params.set('category', category)
      if (search.trim()) params.set('search', search.trim())

      const res = await fetch(`/api/posts?${params.toString()}`)
      if (!res.ok) throw new Error('Gagal memuat artikel')
      const data: { posts: NormalizedPost[]; pagination: PaginationMeta } = await res.json()
      setPosts(data.posts)
      setPagination(data.pagination)

      // Scroll ke atas grid
      document.getElementById('article-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleCategoryChange(slug: string) {
    setActiveCategory(slug)
    setSearchQuery('')
    fetchPage(1, slug, '')
  }

  function handleSearch(q: string) {
    setSearchQuery(q)
    // Debounce sederhana — hanya search setelah ketik berhenti
    fetchPage(1, activeCategory, q)
  }

  function handlePageChange(page: number) {
    fetchPage(page, activeCategory, searchQuery)
  }

  return (
    <>
      <Head>
        <title>Resource &amp; Intelligence Center | Training Jogja</title>
        <meta
          name="description"
          content="Kumpulan panduan regulasi, artikel kepatuhan K3, update AMDAL/ISO, dan jawaban pertanyaan umum seputar keselamatan industri."
        />
      </Head>

      <Header />

      <main className="bg-slate-50 text-slate-700 min-h-screen">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative bg-[#123458] text-white py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#123458] via-[#0e2a4a] to-[#0a1e35]" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-[#2F6B3B]/25 blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[#F59E0B]/10 blur-2xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 mx-auto max-w-4xl px-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#F59E0B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              Regulatory Intelligence Hub
            </span>
            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Pusat Edukasi Regulasi &amp; Kepatuhan
            </h1>
            <p className="mt-5 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Tetap selangkah lebih maju dengan analisis hukum K3, panduan sertifikasi ISO, dan
              pemahaman teknis lingkungan dari tim advisor kami.
            </p>
          </div>
        </section>

        {/* ── ARTIKEL GRID ─────────────────────────────────────────────── */}
        <section id="article-grid" className="py-20 max-w-7xl mx-auto px-6 scroll-mt-20">
          {/* Filter + Search */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-12">
            {/* Kategori tabs */}
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  disabled={loading}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all disabled:opacity-70 ${
                    activeCategory === cat.slug
                      ? 'bg-[#123458] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                  {cat.count > 0 && (
                    <span className="ml-1.5 opacity-60">({cat.count})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="w-full md:w-80 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cari artikel..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm focus:border-[#123458] focus:outline-none shadow-sm"
                aria-label="Cari artikel"
              />
            </div>
          </div>

          {/* Info total */}
          <p className="text-xs text-slate-400 mb-8">
            Menampilkan{' '}
            <span className="font-semibold text-slate-600">
              {(pagination.currentPage - 1) * PER_PAGE + 1}–
              {Math.min(pagination.currentPage * PER_PAGE, pagination.total)}
            </span>{' '}
            dari <span className="font-semibold text-slate-600">{pagination.total}</span> artikel
            {activeCategory !== 'semua' && (
              <span>
                {' '}
                dalam kategori <em>{allCategories.find((c) => c.slug === activeCategory)?.name}</em>
              </span>
            )}
          </p>

          {/* Grid */}
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PER_PAGE }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-[28px] border border-slate-200 bg-white overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-16 bg-slate-200 rounded-full" />
                    <div className="h-5 bg-slate-200 rounded-lg" />
                    <div className="h-4 w-3/4 bg-slate-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${post.slug}`}
                  className="group flex flex-col justify-between rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_40px_-15px_rgba(18,52,88,0.07)] hover:shadow-[0_28px_56px_-15px_rgba(18,52,88,0.14)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {post.featuredImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.featuredImageAlt || post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-6">
                    <span
                      className={`inline-block self-start rounded-full px-3 py-1 text-[10px] font-bold uppercase ${getCategoryColor(
                        post.categorySlug
                      )}`}
                    >
                      {post.categoryLabel}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-[#123458] leading-snug group-hover:text-[#2F6B3B] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        {post.authorAvatar ? (
                          <Image
                            src={post.authorAvatar}
                            alt={post.authorName}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#123458] text-[8px] font-bold text-white">
                            {post.authorName.charAt(0)}
                          </span>
                        )}
                        <span className="font-medium text-slate-500">{post.authorName}</span>
                        <span>·</span>
                        <span>{post.date}</span>
                      </div>
                      <span className="font-medium">{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
              <p className="text-slate-500 text-base">
                Tidak ditemukan artikel yang sesuai.
              </p>
              <button
                onClick={() => handleCategoryChange('semua')}
                className="mt-4 text-sm text-[#2F6B3B] font-bold hover:underline"
              >
                Reset filter
              </button>
            </div>
          )}

          {/* Paginator */}
          <Paginator
            pagination={pagination}
            activeCategory={activeCategory}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section id="faq" className="py-24 bg-[#F4F6F8] scroll-mt-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-[#2F6B3B] font-bold">
                Frequently Asked Questions
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-[#123458]">
                Pertanyaan yang Sering Muncul
              </h2>
            </div>
            <div className="space-y-4">
              {faqsData.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-base md:text-lg font-semibold text-[#123458] list-none focus:outline-none">
                    <span>{faq.question}</span>
                    <span className="text-[#2F6B3B] group-open:rotate-180 transition-transform duration-200 flex-shrink-0">
                      ⌄
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 pt-4">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="py-20 max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-[#123458] to-[#0f2d4d] rounded-[32px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#2F6B3B]/10 blur-3xl" />
            <h2 className="text-2xl md:text-3xl font-extrabold leading-snug">
              Ingin Mengetahui Tingkat Kesiapan Audit Perusahaan Anda?
            </h2>
            <p className="mt-4 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Gunakan alat kalkulator evaluasi gratis kami untuk mendeteksi gap kepatuhan awal
              pada dokumen AMDAL, SMK3, atau ISO Anda.
            </p>
            <div className="mt-8">
              <Link
                href="/konsultasi"
                className="inline-flex items-center justify-center rounded-xl bg-[#F59E0B] px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#e08e0a] transition-all active:scale-95"
              >
                Mulai Compliance Assessment ➔
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
