import Head from 'next/head'
import Header from '../components/Header'
import Link from 'next/link'

const servicesData = [
  {
    icon: '🔍',
    title: 'Compliance Advisory',
    description: 'Audit berkala, regulatory mapping, penyusunan legal register, dan kepatuhan perizinan K3 & Lingkungan yang berjalan seiring operasional.',
    features: ['Gap Analysis Regulasi', 'Legal Register Bulanan', 'Regulatory Mapping'],
    highlight: false
  },
  {
    icon: '📋',
    title: 'Audit & Assurance',
    description: 'Simulasi audit internal independen, verifikasi temuan, dan penyusunan CAPA untuk menjamin kesiapan audit eksternal Anda.',
    features: ['Audit Internal Independen', 'Simulasi Pra-Sertifikasi', 'CAPA Management'],
    highlight: true
  },
  {
    icon: '🏆',
    title: 'Management Systems',
    description: 'Pendampingan sertifikasi SMK3 PP 50/2012, ISO 45001 (K3), dan ISO 14001 (Lingkungan) dengan roadmap 12-minggu yang terstruktur.',
    features: ['Sertifikasi SMK3 PP 50/2012', 'ISO 45001 & ISO 14001', 'Roadmap 12-Minggu'],
    highlight: false
  },
  {
    icon: '🌿',
    title: 'Environmental Compliance',
    description: 'Penyusunan AMDAL, UKL-UPL, pemantauan kualitas lingkungan (RKL-RPL), dan pelaporan periodik pengelolaan limbah B3.',
    features: ['Dokumen AMDAL & UKL-UPL', 'Monitoring RKL-RPL', 'Pelaporan Limbah B3'],
    highlight: false
  },
  {
    icon: '🎓',
    title: 'Capability Development',
    description: 'Pelatihan lisensi Kemenaker, pembinaan P2K3, coaching manajerial K3, dan program induksi keselamatan terstruktur.',
    features: ['Training Lisensi Kemenaker', 'Pembinaan P2K3', 'Coaching Manajerial K3'],
    highlight: false
  },
  {
    icon: '📈',
    title: 'Continuous Improvement',
    description: 'Monitoring KPI keselamatan, evaluasi pasca-insiden, dan program Behavior-Based Safety (BBS) untuk membudayakan keselamatan kerja.',
    features: ['KPI Safety Monitoring', 'Post-Incident Evaluation', 'Program BBS'],
    highlight: false
  }
]

const processSteps = [
  { step: 1, title: 'Konsultasi Awal', desc: 'Diskusi 15-menit gratis dengan Lead Advisor untuk memahami profil risiko dan kebutuhan spesifik Anda.' },
  { step: 2, title: 'Proposal Tertulis', desc: 'Kami mengirimkan proposal solusi yang disesuaikan dengan operasional dan regulasi industri Anda.' },
  { step: 3, title: 'Eksekusi Program', desc: 'Tim kami mendampingi implementasi secara onsite maupun virtual sesuai jadwal yang disepakati.' },
  { step: 4, title: 'Laporan & Monitoring', desc: 'Pelaporan kemajuan berkala dan monitoring KPI untuk memastikan efektivitas dan hasil yang terukur.' }
]

export default function Layanan() {
  return (
    <>
      <Head>
        <title>Layanan Strategis | HSE SkillUp — Compliance Advisory & Training</title>
        <meta name="description" content="Layanan K3 dan lingkungan HSE SkillUp: compliance advisory, audit & assurance, management systems, environmental compliance, dan capability development." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      <main className="bg-slate-50 text-slate-700 overflow-x-hidden">

        {/* HERO SECTION */}
        <section className="relative bg-[#0B1F3A] text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0D2646] to-slate-950 opacity-95"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,118,110,0.2),_transparent_50%)] pointer-events-none"></div>

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <span className="inline-flex rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-400">
              Strategic Services
            </span>
            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Solusi Komprehensif untuk Kepatuhan K3 & Lingkungan
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-slate-300 max-w-3xl mx-auto">
              Dari audit regulasi hingga sertifikasi ISO, setiap layanan kami dirancang untuk melindungi operasional, menjaga reputasi, dan mendorong produktivitas bisnis jangka panjang Anda.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/konsultasi" className="btn-primary">
                Jadwalkan Konsultasi Gratis
              </Link>
              <Link href="#detail" className="btn-secondary-dark text-slate-200">
                Eksplorasi Layanan ↓
              </Link>
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: '6', label: 'Lini Layanan Strategis', sub: 'Solusi end-to-end terintegrasi' },
                { value: '300+', label: 'Proyek Selesai', sub: 'Lintas sektor industri' },
                { value: '95%', label: 'Audit Readiness Rate', sub: 'Tingkat kesiapan klien' },
                { value: '12 Mgg', label: 'Rata-rata Roadmap', sub: 'Dari gap analysis ke sertifikasi' }
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

        {/* SERVICES GRID */}
        <section id="detail" className="py-24 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.35em] text-[#0F766E] font-bold">Portofolio Layanan</p>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-[#0B1F3A]">Layanan yang Kami Tawarkan</h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">Setiap layanan dirancang khusus sesuai tantangan nyata yang dihadapi industri — bukan solusi generik.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {servicesData.map((service, idx) => (
                <div
                  key={idx}
                  className={`rounded-[32px] border p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    service.highlight
                      ? 'bg-[#0B1F3A] border-[#0B1F3A] text-white shadow-xl shadow-[#0B1F3A]/20'
                      : 'bg-white border-slate-200/80 shadow-[0_24px_50px_-25px_rgba(15,23,42,0.08)] hover:border-slate-300/80'
                  }`}
                >
                  <div>
                    <span className={`text-3xl block mb-5`}>{service.icon}</span>
                    {service.highlight && (
                      <span className="inline-block mb-3 px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[#0F766E]/20 text-teal-400 rounded-full border border-teal-500/20">
                        Most Popular
                      </span>
                    )}
                    <h3 className={`text-xl font-bold ${service.highlight ? 'text-white' : 'text-[#0B1F3A]'}`}>
                      {service.title}
                    </h3>
                    <p className={`mt-4 text-sm leading-relaxed ${service.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                      {service.description}
                    </p>
                    <ul className="mt-6 space-y-2">
                      {service.features.map((f, fIdx) => (
                        <li key={fIdx} className={`flex items-center gap-2 text-sm font-medium ${service.highlight ? 'text-teal-400' : 'text-[#0F766E]'}`}>
                          <span className="text-xs">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <Link
                      href="/konsultasi"
                      className={`text-sm font-bold hover:underline flex items-center gap-1 transition-colors ${
                        service.highlight ? 'text-teal-400 hover:text-teal-300' : 'text-[#0B1F3A] hover:text-[#0F766E]'
                      }`}
                    >
                      Diskusikan Kebutuhan Anda ➔
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW WE WORK */}
        <section className="py-24 bg-[#F4F6F8]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.35em] text-[#0F766E] font-bold">Cara Kerja Kami</p>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-[#0B1F3A]">Proses Onboarding Klien</h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">Kami memastikan setiap klien mendapatkan perhatian penuh sejak pertemuan pertama.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((ps, idx) => (
                <div key={idx} className="relative bg-white rounded-[28px] border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F766E]/10 border border-[#0F766E]/20 flex items-center justify-center text-lg font-extrabold text-[#0F766E] mb-6">
                    {ps.step}
                  </div>
                  <h3 className="text-base font-bold text-[#0B1F3A]">{ps.title}</h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{ps.desc}</p>
                  {idx < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 -right-4 text-slate-300 text-2xl z-10">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INDUSTRY COVERAGE */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#0F766E] font-bold">Cakupan Industri</p>
                <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#0B1F3A]">Berpengalaman di 5+ Sektor Industri Utama</h2>
                <p className="mt-6 text-slate-600 text-base leading-relaxed">
                  Regulasi K3 dan lingkungan bersifat unik di setiap sektor. Tim kami memiliki track record nyata — bukan hanya pengetahuan teoritis — dalam mendampingi klien di industri dengan risiko dan kepatuhan tertinggi.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {['Manufacturing 🏭', 'Mining ⛏️', 'Oil & Gas 🛢️', 'Construction 🏗️', 'Energy & Power ⚡'].map((ind, idx) => (
                    <span key={idx} className="px-4 py-2 bg-slate-100 rounded-full text-sm font-semibold text-slate-700 border border-slate-200">
                      {ind}
                    </span>
                  ))}
                </div>
                <div className="mt-10">
                  <Link href="/konsultasi" className="btn-primary">
                    Konsultasi Gratis Sekarang
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Legal Register Update', value: 'Bulanan', icon: '📄' },
                  { label: 'Jaminan Kesiapan Audit', value: '95%', icon: '✅' },
                  { label: 'Tim Advisor Senior', value: '3 Pakar', icon: '👥' },
                  { label: 'Rata-rata Durasi Program', value: '12 Mgg', icon: '📅' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-6 flex flex-col">
                    <span className="text-2xl mb-3">{stat.icon}</span>
                    <span className="text-2xl font-extrabold text-[#0B1F3A]">{stat.value}</span>
                    <span className="mt-1 text-xs text-slate-500 font-semibold">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative bg-[#0B1F3A] py-24 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.2),_transparent_60%)] pointer-events-none"></div>
          <div className="relative z-10 mx-auto max-w-4xl text-center px-6">
            <p className="text-xs uppercase tracking-[0.35em] text-teal-400 font-bold">Mulai Sekarang</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Tidak Yakin Layanan Mana yang Tepat?
            </h2>
            <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Jadwalkan sesi konsultasi awal 15-menit gratis dengan Lead Advisor kami. Kami akan membantu memetakan gap kepatuhan dan merekomendasikan solusi yang sesuai.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/konsultasi" className="btn-primary">
                Jadwalkan Konsultasi Gratis
              </Link>
              <Link href="/kontak" className="btn-secondary-dark text-slate-200">
                Hubungi Tim Kami
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
            <Link href="/tentang-kami" className="hover:text-slate-400">Tentang Kami</Link>
            <Link href="/kontak" className="hover:text-slate-400">Kontak</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
