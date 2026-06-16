import Head from 'next/head'
import Header from '../components/Header'
import Link from 'next/link'

const casesData = [
  {
    industry: 'Manufacturing',
    icon: '🏭',
    client: 'PT. Manufaktur Indonesia',
    sector: 'Industri Berat',
    challenge: '40+ temuan audit internal berulang dan angka kecelakaan kerja (LTI) yang tinggi pada lini produksi.',
    solution: 'Implementasi program LOTO terstruktur, pelatihan operator mesin bersertifikat, dan integrasi tracking audit digital cloud-based.',
    result: 'Penurunan temuan audit sebesar 75% dalam 6 bulan dan mencapai Zero Accident selama 12 bulan berturut-turut.',
    metrics: [
      { label: 'Temuan Audit', value: '-75%' },
      { label: 'Zero Accident', value: '12 Bln' }
    ]
  },
  {
    industry: 'Mining',
    icon: '⛏️',
    client: 'PT. Pertambangan Maju',
    sector: 'Pertambangan Mineral',
    challenge: 'Perubahan regulasi SMKP Minerba yang ketat menyebabkan risiko ketidakpatuhan tinggi pada dokumen operasional.',
    solution: 'Gap analysis menyeluruh, penyusunan ulang dokumen K3 pertambangan, dan pendampingan simulasi audit SMKP.',
    result: 'Meraih Sertifikasi SMK3 kategori Emas dari Kementerian dan kelayakan kepatuhan penuh dari Minerba.',
    metrics: [
      { label: 'SMK3 Kategori', value: '🥇 Emas' },
      { label: 'Kepatuhan Minerba', value: '100%' }
    ]
  },
  {
    industry: 'Oil & Gas',
    icon: '🛢️',
    client: 'PT. Energi Baru',
    sector: 'Minyak & Gas',
    challenge: 'Sistem manajemen kontraktor yang lemah menyebabkan ketidakseragaman standar keselamatan antar vendor.',
    solution: 'Pengembangan sistem CSMS (Contractor Safety Management System) baru dan audit vendor pra-kualifikasi.',
    result: 'Keandalan standar vendor meningkat 90%, zero insiden pada proyek perluasan fasilitas kilang minyak.',
    metrics: [
      { label: 'Keandalan Vendor', value: '+90%' },
      { label: 'Insiden Proyek', value: 'Zero' }
    ]
  },
  {
    industry: 'Construction',
    icon: '🏗️',
    client: 'PT. Infrastruktur Jaya',
    sector: 'Konstruksi & Sipil',
    challenge: 'Kurangnya kesadaran penggunaan APD dan tingginya pelanggaran bekerja di ketinggian di area proyek.',
    solution: 'Pelatihan pekerja scaffolding berlisensi, pemasangan jaring pengaman tambahan, dan sistem reward/penalti harian.',
    result: 'Angka unsafe behavior turun 85%, proyek selesai tepat waktu tanpa kecelakaan cidera berat.',
    metrics: [
      { label: 'Unsafe Behavior', value: '-85%' },
      { label: 'On-time Delivery', value: '100%' }
    ]
  },
  {
    industry: 'Energy & Power',
    icon: '⚡',
    client: 'PT. Power Nusantara',
    sector: 'Energi & Pembangkit',
    challenge: 'Kesulitan mengelola dan melaporkan pembuangan fly ash dan bottom ash pembangkit sesuai batas aman KLHK.',
    solution: 'Penyusunan ulang SOP penampungan abu pembangkit, monitoring berkala emisi cerobong, dan digitalisasi pelaporan.',
    result: 'Kelayakan hasil emisi pembangkit disetujui KLHK secara berkala tanpa temuan administratif.',
    metrics: [
      { label: 'Temuan KLHK', value: 'Zero' },
      { label: 'Approval Rate', value: '100%' }
    ]
  }
]

export default function StudiKasus() {
  return (
    <>
      <Head>
        <title>Studi Kasus Sukses | HSE SkillUp — Compliance & K3 Advisory</title>
        <meta name="description" content="Hasil nyata dari pendampingan HSE SkillUp: manufacturing, mining, oil & gas, construction, hingga energy. Studi kasus compliance & K3 terbukti berhasil." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      <main className="bg-slate-50 text-slate-700 overflow-x-hidden">

        {/* HERO */}
        <section className="relative bg-[#0B1F3A] text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0D2646] to-slate-950 opacity-95"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,118,110,0.2),_transparent_50%)] pointer-events-none"></div>

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <span className="inline-flex rounded-full bg-[#D4A017]/10 border border-[#D4A017]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D4A017]">
              Bukti Kinerja Nyata
            </span>
            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Studi Kasus Klien Lintas Industri
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-slate-300 max-w-3xl mx-auto">
              Setiap klien memiliki tantangan unik. Berikut adalah hasil nyata yang kami capai bersama — bukan janji, melainkan rekam jejak yang dapat diverifikasi.
            </p>
          </div>
        </section>

        {/* METRICS OVERVIEW */}
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: '50+', label: 'Klien Industri', sub: 'Skala nasional & multinasional' },
                { value: '95%', label: 'Audit Readiness', sub: 'Rata-rata tingkat kelulusan klien' },
                { value: '300+', label: 'Proyek Selesai', sub: 'Lintas 5 sektor industri utama' },
                { value: '10+ Thn', label: 'Track Record', sub: 'Pengalaman konsultasi lapangan' }
              ].map((m, idx) => (
                <div key={idx} className="text-center p-6 border-r border-slate-100 last:border-0">
                  <div className="text-4xl font-extrabold text-[#0B1F3A]">{m.value}</div>
                  <p className="mt-2 text-sm font-bold text-slate-700">{m.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CASE STUDIES GRID */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.35em] text-[#0F766E] font-bold">Portfolio Hasil Kerja</p>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-[#0B1F3A]">Hasil Nyata, Terukur & Transparan</h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">Setiap studi kasus dilengkapi dengan tantangan, tindakan mitigasi, dan hasil bisnis yang dapat divalidasi.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {casesData.map((cs, idx) => (
                <article
                  key={idx}
                  className="bg-white rounded-[32px] border border-slate-200/80 p-8 md:p-10 shadow-[0_24px_50px_-25px_rgba(15,23,42,0.08)] hover:shadow-[0_32px_64px_-20px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border-l-4 border-l-[#0F766E]"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{cs.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-[#0B1F3A]">{cs.client}</h3>
                          <p className="text-xs text-[#0F766E] font-semibold uppercase tracking-wider">{cs.sector}</p>
                        </div>
                      </div>
                      <span className="shrink-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[#0F766E]/5 text-[#0F766E] border border-[#0F766E]/20 rounded-full">
                        {cs.industry}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">TANTANGAN:</p>
                        <p>{cs.challenge}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">TINDAKAN MITIGASI:</p>
                        <p>{cs.solution}</p>
                      </div>
                      <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-4">
                        <p className="text-[11px] font-bold text-[#0F766E] uppercase tracking-wider mb-1.5">HASIL BISNIS:</p>
                        <p className="font-semibold text-[#0F766E]">{cs.result}</p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics & CTA */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex gap-6">
                      {cs.metrics.map((met, mIdx) => (
                        <div key={mIdx}>
                          <p className="text-xl font-extrabold text-[#0B1F3A]">{met.value}</p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{met.label}</p>
                        </div>
                      ))}
                    </div>
                    <Link href="/konsultasi" className="text-sm font-bold text-[#0B1F3A] hover:text-[#0F766E] transition-colors">
                      Solusi Serupa ➔
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative bg-[#0B1F3A] py-24 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.2),_transparent_60%)] pointer-events-none"></div>
          <div className="relative z-10 mx-auto max-w-4xl text-center px-6">
            <p className="text-xs uppercase tracking-[0.35em] text-teal-400 font-bold">Buat Kisah Sukses Anda Sendiri</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Siap Menjadi Klien Berikutnya?
            </h2>
            <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Diskusikan tantangan regulasi K3 spesifik perusahaan Anda dengan Lead Advisor kami. Gratis & tanpa komitmen.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/konsultasi" className="btn-primary">
                Jadwalkan Konsultasi Strategis
              </Link>
              <Link href="/layanan" className="btn-secondary-dark text-slate-200">
                Lihat Semua Layanan
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
