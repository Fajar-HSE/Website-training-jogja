import React, { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Link from 'next/link'

export default function Kontak() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [formValues, setFormValues] = useState({
    name: '', company: '', email: '', phone: '', service: '', message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Gagal mengirim pesan.')
      setFormSubmitted(true)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Hubungi Kami | HSE SkillUp — Konsultasi K3 & Compliance</title>
        <meta name="description" content="Hubungi tim HSE SkillUp untuk konsultasi strategis K3 dan environmental compliance. Respon dalam 1x24 jam kerja." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      <main className="bg-slate-50 text-slate-700 overflow-x-hidden">

        {/* HERO SECTION */}
        <section className="relative bg-[#0B1F3A] text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0D2646] to-slate-950 opacity-95"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.2),_transparent_50%)] pointer-events-none"></div>

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <span className="inline-flex rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-400">
              Hubungi Tim Kami
            </span>
            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Mulai Percakapan Strategis Anda
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-slate-300 max-w-3xl mx-auto">
              Lead Advisor kami siap mendiskusikan tantangan kepatuhan dan risiko K3 spesifik perusahaan Anda. Respon dijamin dalam 1x24 jam kerja.
            </p>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[38%_62%] items-start">

            {/* Left: Contact Info Cards */}
            <div className="space-y-6">

              {/* Quick CTA to Konsultasi */}
              <div className="rounded-[28px] bg-gradient-to-br from-[#0B1F3A] to-[#0D2646] p-8 text-white relative overflow-hidden shadow-xl shadow-[#0B1F3A]/20">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#0F766E]/10 blur-3xl pointer-events-none"></div>
                <p className="text-xs uppercase tracking-[0.3em] text-teal-400 font-bold">Rekomendasi</p>
                <h2 className="mt-3 text-xl font-extrabold text-white">Evaluasi Compliance Gratis</h2>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Gunakan alat compliance assessment kami untuk mendapatkan skor kepatuhan awal dan jadwalkan sesi 15-menit dengan Lead Advisor.
                </p>
                <Link href="/konsultasi" className="mt-6 inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#0d6660] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all">
                  Mulai Compliance Assessment ➔
                </Link>
              </div>

              {/* Contact Details */}
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-[#0B1F3A]">Informasi Kontak</h3>

                {[
                  {
                    icon: '📍',
                    label: 'Alamat Kantor',
                    value: 'Jl. Patangpuluhan No.26A Wirobrajan, Yogyakarta',
                    sub: 'Kunjungan dengan janji temu'
                  },
                  {
                    icon: '✉️',
                    label: 'Email',
                    value: 'info@hseskillup.com',
                    sub: 'Respon 1x24 jam kerja'
                  },
                  {
                    icon: '📞',
                    label: 'Telepon / WhatsApp',
                    value: '+62 853-2888-3511',
                    sub: 'Senin – Jumat, 08:00–17:00 WIB'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-teal-50 text-lg shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-[#0B1F3A]">{item.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service highlights */}
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-8 shadow-sm">
                <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-4">Layanan Prioritas Kami</h3>
                <ul className="space-y-3">
                  {[
                    'Audit Readiness & Gap Analysis',
                    'Implementasi SMK3 / ISO 45001 / ISO 14001',
                    'AMDAL & Environmental Reporting',
                    'Pelatihan Lisensi Kemenaker',
                    'Pendampingan Sertifikasi'
                  ].map((s, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-teal-50 text-teal-600 text-[10px] font-bold shrink-0">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="bg-white rounded-[32px] border border-slate-200/80 p-8 md:p-12 shadow-xl shadow-slate-200/50">
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-4xl mb-6">✅</div>
                  <h3 className="text-2xl font-bold text-[#0B1F3A]">Pesan Terkirim!</h3>
                  <p className="mt-4 text-slate-600 text-base max-w-sm leading-relaxed">
                    Terima kasih. Tim kami akan menghubungi Anda dalam 1x24 jam kerja. Atau jadwalkan langsung via compliance assessment.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="btn-secondary"
                    >
                      Kirim Pesan Lain
                    </button>
                    <Link href="/konsultasi" className="btn-primary">
                      Lanjut ke Assessment
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#0F766E] font-bold">Kirim Pesan</p>
                    <h2 className="mt-2 text-2xl font-extrabold text-[#0B1F3A]">Ceritakan Tantangan Anda</h2>
                    <p className="mt-2 text-sm text-slate-500">Kami akan merespon dalam 1x24 jam kerja dengan rekomendasi awal yang relevan.</p>
                  </div>

                  {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold mb-5">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nama Lengkap *</label>
                        <input
                          id="contact-name"
                          name="name"
                          value={formValues.name}
                          onChange={handleChange}
                          type="text"
                          required
                          placeholder="Contoh: Budi Santoso"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-company" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nama Perusahaan *</label>
                        <input
                          id="contact-company"
                          name="company"
                          value={formValues.company}
                          onChange={handleChange}
                          type="text"
                          required
                          placeholder="Contoh: PT. Sumber Makmur"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Bisnis *</label>
                        <input
                          id="contact-email"
                          name="email"
                          value={formValues.email}
                          onChange={handleChange}
                          type="email"
                          required
                          placeholder="email@perusahaan.co.id"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">No. HP / WhatsApp</label>
                        <input
                          id="contact-phone"
                          name="phone"
                          value={formValues.phone}
                          onChange={handleChange}
                          type="tel"
                          placeholder="Contoh: 0812-3456-7890"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-service" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Layanan yang Diminati</label>
                      <select
                        id="contact-service"
                        name="service"
                        value={formValues.service}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition-colors"
                      >
                        <option value="">Pilih layanan...</option>
                        <option value="compliance">Compliance Advisory & Legal Register</option>
                        <option value="audit">Audit & Assurance</option>
                        <option value="systems">Management Systems (SMK3/ISO)</option>
                        <option value="environment">Environmental Compliance (AMDAL)</option>
                        <option value="training">Pelatihan & Capability Development</option>
                        <option value="other">Lainnya / Belum Tahu</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Deskripsikan Kebutuhan Anda *</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formValues.message}
                        onChange={handleChange}
                        rows={5}
                        required
                        placeholder="Ceritakan tantangan kepatuhan, target sertifikasi, atau pertanyaan spesifik yang Anda hadapi..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
                      <p className="text-xs text-slate-400 text-center sm:text-left">
                        🔒 Data Anda aman dan tidak akan dibagikan kepada pihak ketiga.
                      </p>
                      <button
                        type="submit"
                        id="contact-submit"
                        disabled={isLoading}
                        className="btn-primary w-full sm:w-auto disabled:opacity-50"
                      >
                        {isLoading ? 'Mengirim...' : 'Kirim Pesan ➔'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

        {/* TRUST SIGNAL */}
        <section className="py-16 bg-[#F4F6F8] border-t border-slate-100">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0F766E] font-bold">Kenapa Memilih HSE SkillUp?</p>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                { icon: '⚡', title: 'Respon Cepat', desc: 'Lead Advisor kami merespon setiap inquiry dalam maksimal 1x24 jam kerja.' },
                { icon: '🎯', title: 'Konsultasi Tanpa Komitmen', desc: 'Sesi evaluasi awal gratis tanpa biaya atau kewajiban untuk melanjutkan.' },
                { icon: '📜', title: 'Advisor Berlisensi Resmi', desc: 'Seluruh tim kami memegang lisensi nasional Kemenaker dan sertifikasi internasional.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm text-center">
                  <span className="text-3xl block mb-4">{item.icon}</span>
                  <h3 className="text-base font-bold text-[#0B1F3A]">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
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
            <Link href="/tentang-kami" className="hover:text-slate-400">Tentang Kami</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
