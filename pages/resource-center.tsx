import Head from 'next/head'
import Header from '../components/Header'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { getPosts, getCategories } from '../lib/wordpress'
import type { NormalizedPost } from '../lib/wordpress'
import type { GetStaticProps } from 'next'

const STATIC_CATEGORIES = [
  { id: 0, name: 'Semua Artikel', slug: 'semua', count: 0 },
]

const faqsData = [
  {
    question: 'Apa perbedaan mendasar antara SMK3 PP 50/2012 dan ISO 45001?',
    answer: 'SMK3 adalah standar keselamatan kerja yang diwajibkan oleh hukum nasional di Indonesia (mandatori untuk perusahaan dengan 100+ karyawan atau berisiko tinggi). Sedangkan ISO 45001 adalah standar manajemen keselamatan kerja internasional yang bersifat sukarela, namun seringkali menjadi syarat kemitraan bisnis global.'
  },
  {
    question: 'Berapa lama waktu yang dibutuhkan untuk pengajuan persetujuan lingkungan AMDAL?',
    answer: 'Secara normatif, proses penilaian dokumen AMDAL hingga terbit persetujuan kelayakan lingkungan memakan waktu sekitar 120-180 hari kerja, tergantung pada kompleksitas dampak industri, kelengkapan draf awal, dan kecepatan perbaikan oleh pemrakarsa proyek.'
  },
  {
    question: 'Siapa saja pekerja yang wajib memiliki lisensi K3 resmi Kemenaker?',
    answer: 'Seluruh operator alat berat (crane, forklift, loader), petugas K3 kimia, petugas peran kebakaran, scaffolder, ahli K3 umum, dan dokter perusahaan wajib memiliki lisensi/sertifikasi kompetensi resmi Kemenaker RI yang diperbarui secara berkala.'
  },
  {
    question: 'Bagaimana cara mendaftar sesi evaluasi kepatuhan awal?',
    answer: 'Anda dapat menggunakan fitur Compliance Assessment di halaman Konsultasi kami. Masukkan profil perusahaan dan jawaban kesiapan Anda, maka sistem akan mengalkulasi skor awal dan membuka formulir pemesanan jadwal tatap muka/online 15-menit gratis.'
  }
]

const CATEGORY_COLORS: Record<string, string> = {
  k3:         'bg-teal-50 text-teal-700 border border-teal-100',
  lingkungan: 'bg-green-50 text-green-700 border border-green-100',
  regulasi:   'bg-yellow-50 text-[#AB7F12] border border-[#AB7F12]/20',
}

function getCategoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? 'bg-slate-100 text-slate-600 border border-slate-200'
}

type Props = {
  posts: NormalizedPost[]
  categories: { id: string; name: string; slug: string; count: number }[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [posts, categories] = await Promise.all([getPosts({ perPage: 12 }), getCategories()])

  return {
    props: { posts, categories },
    revalidate: 21600,
  }
}

export default function ResourceCenter({ posts, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState('semua')
  const [searchQuery, setSearchQuery] = useState('')

  const allCategories = [...STATIC_CATEGORIES, ...categories]

  const filteredPosts = posts.filter((p) => {
    const matchCat = activeCategory === 'semua' || p.categorySlug === activeCategory
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <>
      <Head>
        <title>Resource & Intelligence Center | HSE SkillUp</title>
        <meta name="description" content="Kumpulan panduan regulasi, artikel kepatuhan K3, update AMDAL/ISO, dan jawaban pertanyaan umum seputar keselamatan industri." />
      </Head>

      <Header />

      <main className="bg-slate-50 text-slate-700 min-h-screen">

        {/* HERO HEADER */}
        <section className="relative bg-[#123458] text-white py-24 overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#123458] via-[#0e2a4a] to-[#0a1e35]" />
          {/* Accent glow atas — hijau */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-[#2F6B3B]/25 blur-3xl pointer-events-none" />
          {/* Accent glow kanan — amber */}
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[#F59E0B]/10 blur-2xl pointer-events-none" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 mx-auto max-w-4xl px-8 text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#F59E0B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              Regulatory Intelligence Hub
            </span>

            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Pusat Edukasi Regulasi &amp; Kepatuhan
            </h1>

            <p className="mt-5 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Tetap selangkah lebih maju dengan analisis hukum K3, panduan sertifikasi ISO, dan pemahaman teknis lingkungan dari tim advisor kami.
            </p>


          </div>
        </section>

        {/* ARTICLE GRID */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-12">

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat.slug
                      ? 'bg-[#0F766E] text-white shadow-sm'
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel/insight..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm focus:border-[#0F766E] focus:outline-none shadow-sm"
              />
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${post.slug}`}
                  className="group card flex flex-col justify-between hover:border-teal-200"
                >
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-5 -mt-2">
                      <Image
                        src={post.featuredImage}
                        alt={post.featuredImageAlt || post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  )}

                  <div>
                    <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase ${getCategoryColor(post.categorySlug)}`}>
                      {post.categoryLabel}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-[#0B1F3A] leading-snug group-hover:text-[#0F766E] transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-500">{post.authorName}</span>
                      <span>·</span>
                      <span>{post.date}</span>
                    </div>
                    <span className="font-medium">{post.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
              <p className="text-slate-500 text-base">Tidak ditemukan artikel yang sesuai dengan pencarian Anda.</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('semua') }} className="mt-4 text-sm text-teal-600 font-semibold hover:underline">
                Reset filter
              </button>
            </div>
          )}
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 bg-[#F4F6F8] scroll-mt-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0F766E] font-bold">Frequently Asked Questions</p>
              <h2 className="mt-4 text-3xl font-extrabold text-[#0B1F3A]">Pertanyaan yang Sering Muncul</h2>
            </div>
            <div className="space-y-4">
              {faqsData.map((faq, idx) => (
                <details key={idx} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-base md:text-lg font-semibold text-[#0B1F3A] list-none focus:outline-none">
                    <span>{faq.question}</span>
                    <span className="text-teal-600 group-open:rotate-180 transition-transform duration-200 flex-shrink-0">⌄</span>
                  </summary>
                  <p className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 pt-4">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-[#0B1F3A] to-[#0D2646] rounded-[32px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#0F766E]/10 blur-3xl" />
            <h2 className="text-2xl md:text-3xl font-extrabold leading-snug">
              Ingin Mengetahui Tingkat Kesiapan Audit Perusahaan Anda?
            </h2>
            <p className="mt-4 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Gunakan alat kalkulator evaluasi gratis kami untuk mendeteksi gap kepatuhan awal pada dokumen AMDAL, SMK3, atau ISO Anda.
            </p>
            <div className="mt-8">
              <Link href="/konsultasi" className="btn-primary">
                Mulai Compliance Assessment ➔
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center text-xs gap-4 text-slate-500">
          <div>© {new Date().getFullYear()} HSE SkillUp. Semua hak dilindungi.</div>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-400">Beranda</Link>
            <Link href="/layanan" className="hover:text-slate-400">Layanan</Link>
            <Link href="/kontak" className="hover:text-slate-400">Kontak</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
