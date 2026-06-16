import Head from 'next/head'
import Header from '../components/Header'
import Button from '../components/Button'
import SectionCard from '../components/SectionCard'
import ComplianceDashboard from '../components/ComplianceDashboard'
import WhatsAppWidget from '../components/WhatsAppWidget'
import TrustLogos from '../components/TrustLogos'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import SEO from '../components/SEO'
import ScrollReveal from '../components/ScrollReveal'

const risksData = [
  {
    title: 'Temuan audit berulang',
    tip: 'Tindakan korektif pasca-audit seringkali hanya kosmetik. Kami membantu membuat SOP verifikasi temuan dan melacak progres audit secara sistematis.'
  },
  {
    title: 'Ketidaksesuaian regulasi',
    tip: 'Regulasi K3 dan lingkungan berubah cepat. Kami menyediakan layanan pemetaan regulasi (Legal Register) bulanan khusus untuk jenis operasi pabrik Anda.'
  },
  {
    title: 'Dokumen tidak lengkap',
    tip: 'Dokumen AMDAL, UKL-UPL, atau ijin pembuangan limbah yang tidak teratur adalah temuan kritis. Kami merapikan seluruh dokumen dalam repositori cloud audit-ready.'
  },
  {
    title: 'Tingginya angka insiden',
    tip: 'Insiden bukan nasib buruk, tapi indikasi kontrol risiko yang lemah. Kami menerapkan program Behavior-Based Safety (BBS) untuk memperbaiki budaya kerja.'
  },
  {
    title: 'Persiapan sertifikasi yang lambat',
    tip: 'Persiapan SMK3 atau ISO 45001/14001 sering terhambat dokumentasi. Kami menyediakan roadmap 12-minggu terstruktur untuk kepastian kelulusan.'
  },
  {
    title: 'Risiko sanksi regulator',
    tip: 'Ketidakpatuhan dapat berujung sanksi administratif hingga penutupan. Kami melakukan audit awal untuk mendeteksi gap kepatuhan sebelum regulator bertindak.'
  }
]

const industriesData = [
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    icon: '🏭',
    desc: 'Fokus pada keselamatan lini produksi, pemeliharaan mesin (LOTO), dan kontrol pajanan bahan kimia berbahaya.',
    regulations: ['UU No. 1 Tahun 1970 tentang Keselamatan Kerja', 'PP No. 50 Tahun 2012 tentang SMK3'],
    caseStudy: {
      client: 'PT. Manufaktur Indonesia',
      challenge: 'Menghadapi 40+ temuan audit internal dan angka kecelakaan kerja (LTI) yang tinggi.',
      action: 'Implementasi program LOTO terstruktur, pelatihan operator mesin, dan integrasi tracking audit digital.',
      result: 'Penurunan temuan audit sebesar 75% dalam 6 bulan dan mencapai Zero Accident selama 12 bulan berturut-turut.'
    }
  },
  {
    id: 'mining',
    label: 'Mining',
    icon: '⛏️',
    desc: 'Kepatuhan standar keselamatan pertambangan (SMKP), manajemen risiko lereng, jalan angkut, dan operasional alat berat.',
    regulations: ['Permen ESDM No. 26 Tahun 2018', 'Kepmen ESDM No. 1827 K/30/MEM/2018'],
    caseStudy: {
      client: 'PT. Pertambangan Maju',
      challenge: 'Perubahan regulasi SMKP Minerba yang ketat menyebabkan risiko ketidakpatuhan tinggi pada dokumen operasional.',
      action: 'Gap analysis menyeluruh, penyusunan ulang dokumen K3 pertambangan, dan pendampingan simulasi audit SMKP.',
      result: 'Meraih Sertifikasi SMK3 kategori Emas dari Kementerian dan kelayakan kepatuhan penuh dari Minerba.'
    }
  },
  {
    id: 'oilgas',
    label: 'Oil & Gas',
    icon: '🛢️',
    desc: 'Manajemen risiko tinggi (Process Safety Management), audit kontraktor (CSMS), keselamatan instalasi lepas pantai dan kilang.',
    regulations: ['UU No. 22 Tahun 2001 tentang Minyak dan Gas Bumi', 'Kepmenaker No. 186 Tahun 1999 tentang Penanggulangan Kebakaran'],
    caseStudy: {
      client: 'PT. Energi Baru',
      challenge: 'Sistem manajemen kontraktor yang lemah menyebabkan ketidakseragaman standar keselamatan antar vendor.',
      action: 'Pengembangan sistem CSMS (Contractor Safety Management System) baru dan audit vendor pra-kualifikasi.',
      result: 'Keandalan standar vendor meningkat 90%, zero insiden pada proyek perluasan fasilitas kilang minyak.'
    }
  },
  {
    id: 'construction',
    label: 'Construction',
    icon: '🏗️',
    desc: 'Pengawasan K3 konstruksi pada pekerjaan ketinggian, galian, scaffolding, dan pemenuhan dokumen RK3K.',
    regulations: ['Permen PUPR No. 21/PRT/M/2019 tentang Sistem Manajemen Keselamatan Konstruksi (SMKK)'],
    caseStudy: {
      client: 'PT. Infrastruktur Jaya',
      challenge: 'Kurangnya kesadaran penggunaan APD dan tingginya pelanggaran bekerja di ketinggian di area proyek.',
      action: 'Pelatihan pekerja scaffolding berlisensi, pemasangan jaring pengaman tambahan, dan sistem penalti/hadiah harian.',
      result: 'Angka unsafe behavior turun 85%, proyek selesai tepat waktu tanpa kecelakaan cidera berat.'
    }
  },
  {
    id: 'energy',
    label: 'Energy & Power',
    icon: '⚡',
    desc: 'Keselamatan instalasi listrik tegangan tinggi, audit lingkungan pembangkit, serta pelaporan pengelolaan limbah gas/abu.',
    regulations: ['Permen LHK No. P.56 Tahun 2015 tentang Pengelolaan Limbah B3'],
    caseStudy: {
      client: 'PT. Power Nusantara',
      challenge: 'Kesulitan mengelola dan melaporkan pembuangan fly ash dan bottom ash pembangkit sesuai batas aman KLHK.',
      action: 'Penyusunan ulang SOP penampungan abu pembangkit, monitoring berkala emisi cerobong, dan digitalisasi pelaporan.',
      result: 'Kelayakan hasil emisi pembangkit disetujui KLHK secara berkala tanpa temuan administratif.'
    }
  }
]

const lifecycleSteps = [
  {
    step: 1,
    title: 'Assess',
    tagline: 'Evaluasi Kepatuhan Awal',
    desc: 'Kami melakukan investigasi lapangan menyeluruh dan meninjau seluruh dokumen izin K3 serta lingkungan Anda saat ini untuk mengidentifikasi status kepatuhan hukum.',
    deliverable: 'Laporan Compliance Gap Analysis & Peta Risiko'
  },
  {
    step: 2,
    title: 'Analyze',
    tagline: 'Identifikasi Akar Masalah',
    desc: 'Menganalisis mengapa temuan audit terulang dan mengukur potensi kerugian operasional akibat ketidakpatuhan tersebut.',
    deliverable: 'Rekomendasi Kontrol Risiko & Skala Prioritas Tindakan'
  },
  {
    step: 3,
    title: 'Plan',
    tagline: 'Desain Program & Roadmap',
    desc: 'Menyusun langkah strategis, jadwal pelatihan, pembaruan SOP, dan rencana persiapan sertifikasi yang disepakati bersama manajemen.',
    deliverable: 'Roadmap Implementasi & Rencana Tindakan Korektif (CAPA)'
  },
  {
    step: 4,
    title: 'Implement',
    tagline: 'Eksekusi & Pembudayaan',
    desc: 'Mendampingi tim internal Anda di lapangan dalam memperbarui sistem kerja, melaksanakan training kompetensi, dan membiasakan pelaporan insiden.',
    deliverable: 'Sistem Kerja Baru & Sertifikat Kompetensi Karyawan'
  },
  {
    step: 5,
    title: 'Audit',
    tagline: 'Verifikasi & Kesiapan',
    desc: 'Melakukan simulasi audit internal pra-inspeksi oleh badan sertifikasi atau kementerian untuk menguji efektivitas sistem yang baru.',
    deliverable: 'Laporan Simulasi Audit & Status Kesiapan Sertifikasi'
  },
  {
    step: 6,
    title: 'Improve',
    tagline: 'Perbaikan Berkelanjutan',
    desc: 'Mengevaluasi hasil audit eksternal, memperbarui legal register dengan regulasi terbaru, dan memastikan sistem terus membaik secara berkelanjutan.',
    deliverable: 'Sistem Manajemen K3 & Lingkungan Mandiri Terintegrasi'
  }
]

export default function Home() {
  const [selectedRisk, setSelectedRisk] = useState<number | null>(0)
  const [activeIndustry, setActiveIndustry] = useState(industriesData[0].id)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const elements = document.querySelectorAll('.js-animate')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const currentIndustryData = industriesData.find((ind) => ind.id === activeIndustry) || industriesData[0]

  return (
    <>
      <SEO
        title="HSE SkillUp — Strategic Risk & Compliance Advisory Partner"
        description="Kami membantu perusahaan melindungi operasional, reputasi, dan pertumbuhan bisnis melalui audit readiness, training sertifikasi kompetensi, pendampingan AMDAL & kepatuhan K3 & Lingkungan."
        schemaType="Organization"
      />

      <Header />

      <main className="overflow-x-hidden bg-slate-50 text-slate-700 hero-bg-pattern">
        
        {/* HERO SECTION */}
        <section id="beranda" className="relative bg-[#0B1F3A] text-white py-20 lg:py-32 overflow-hidden">
          {/* Hero background image */}
          <Image
            src="/images/hero.png"
            alt="Hero background"
            fill
            priority
            className="absolute inset-0 object-cover -z-10"
          />
          {/* Decorative gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0D2646] to-slate-950 opacity-95"></div>
          <div className="absolute top-0 left-0 right-0 h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.25),_transparent_50%)] pointer-events-none"></div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-6 grid gap-16 lg:grid-cols-[45%_55%] items-center">
            <ScrollReveal direction="up">
              <div className="max-w-[620px]">
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                  <span className="h-2 w-2 rounded-full bg-[#0F766E] animate-pulse"></span>
                  Competence for sustainable productivity
                </span>
                <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Compliance yang Melindungi Operasional & Reputasi Bisnis Anda
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-slate-300">
                  Kami membantu perusahaan memenuhi regulasi K3 dan lingkungan melalui pendekatan konsultatif yang terukur, meminimalkan risiko audit, sanksi administratif, dan gangguan operasional.
                </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/konsultasi" className="btn-primary">
                  Jadwalkan Konsultasi Strategis
                </Link>
                <Link href="/studi-kasus" className="btn-secondary-dark text-slate-200">
                  Lihat Studi Kasus
                </Link>
              </div>
            </div>
            </ScrollReveal>

            {/* Dashboard Mockup Container */}
            <ScrollReveal direction="left" delay={0.2}>
              <div className="relative w-full">
                <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-[#0F766E]/20 blur-[100px] pointer-events-none"></div>
                <div className="glass-panel rounded-[32px] p-2 overflow-hidden border border-white/10 shadow-2xl relative">
                  <div className="absolute top-2 left-6 right-6 flex items-center justify-between border-b border-white/5 pb-3 pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    <span>LIVE RISK PROFILE PREVIEW</span>
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  </div>
                  <div className="mt-8">
                    <ComplianceDashboard />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* RISK ASSESSMENT SECTION */}
        <section id="risiko" className="py-24 bg-[#F4F6F8]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0F766E] font-bold">Risk Exposure Assessment</p>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-[#0B1F3A]">Apakah Perusahaan Anda Menghadapi Risiko Berikut?</h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">Ketidakpatuhan K3 dan lingkungan yang tidak terkelola dengan baik sering kali tidak terlihat hingga audit gagal atau sanksi jatuh. Klik risiko di bawah untuk melihat rekomendasi aksi mitigasi kami.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[45%_55%] items-start">
              {/* Risks Selector List */}
              <div className="grid gap-3 js-animate">
                {risksData.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedRisk(idx)}
                    className={`flex items-center justify-between text-left p-6 rounded-2xl border transition-all duration-200 ${
                      selectedRisk === idx
                        ? 'border-[#0F766E] bg-white shadow-md text-[#0B1F3A] ring-1 ring-[#0F766E]/20'
                        : 'border-slate-200 bg-white/50 text-slate-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold ${
                        selectedRisk === idx ? 'bg-[#0F766E] text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-base md:text-lg">{item.title}</span>
                    </div>
                    <span className={`text-xl transition-transform ${selectedRisk === idx ? 'rotate-90 text-[#0F766E]' : 'text-slate-400'}`}>➔</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Tip Panel */}
              <div className="rounded-3xl border border-[#0F766E]/20 bg-white p-8 md:p-12 shadow-lg shadow-[#0B1F3A]/5 relative overflow-hidden min-h-[360px] flex flex-col justify-between js-animate">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#0F766E]/5 blur-3xl pointer-events-none"></div>
                <div>
                  <div className="inline-flex rounded-full bg-[#D4A017]/10 px-4 py-1 text-xs font-bold uppercase text-[#AB7F12] tracking-wider">
                    REKOMENDASI MITIGASI
                  </div>
                  <h3 className="mt-6 text-xl md:text-2xl font-bold text-[#0B1F3A]">
                    {selectedRisk !== null ? risksData[selectedRisk].title : 'Pilih Risiko'}
                  </h3>
                  <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed">
                    {selectedRisk !== null ? risksData[selectedRisk].tip : 'Silakan klik salah satu opsi risiko di sebelah kiri untuk melihat rekomendasi tindakan dari Tim Advisory kami.'}
                  </p>
                </div>
                <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                  <span className="text-sm font-semibold text-slate-500">Butuh evaluasi menyeluruh?</span>
                  <Link href="/konsultasi" className="text-sm font-bold text-[#0F766E] hover:underline flex items-center gap-1">
                    Cek Tingkat Kesiapan Anda ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BUSINESS IMPACT METRICS */}
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: '95%', label: 'Audit Readiness Rate', sub: 'Tingkat kesiapan audit klien' },
                { value: '300+', label: 'Projects Delivered', sub: 'Pekerjaan K3 & Lingkungan selesai' },
                { value: '50+', label: 'Industrial Clients', sub: 'Perusahaan skala nasional & multinasional' },
                { value: '10+ Yrs', label: 'Years Experience', sub: 'Advisory risiko & kepatuhan' }
              ].map((metric, idx) => (
                <div key={idx} className="text-center p-6 border-r border-slate-100 last:border-0 md:p-8 js-animate">
                  <div className="text-4xl lg:text-5xl font-extrabold text-[#0B1F3A] tracking-tight">{metric.value}</div>
                  <p className="mt-3 text-base font-bold text-slate-800">{metric.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{metric.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INDUSTRIES WE SERVE & CASE STUDIES (COMBINED & DYNAMIC) */}
        <section id="industri" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.35em] text-[#0F766E] font-bold">Industries We Serve</p>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-[#0B1F3A]">Pengalaman Spesifik Sesuai Sektor Industri</h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">Regulasi K3 dan Lingkungan bersifat unik di setiap sektor. Pilih industri Anda di bawah untuk melihat kerangka regulasi dan studi kasus sukses kami.</p>
            </div>

            {/* Industry Tabs Selector */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12 js-animate">
              {industriesData.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustry(ind.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
                    activeIndustry === ind.id
                      ? 'bg-[#0B1F3A] text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{ind.icon}</span>
                  <span>{ind.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Output Box */}
            <div className="grid gap-12 lg:grid-cols-[40%_60%] items-stretch js-animate">
              {/* Industry Info */}
              <div className="flex flex-col justify-between p-8 md:p-10 rounded-3xl bg-[#F8FAFC] border border-slate-100">
                <div>
                  <h3 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-3">
                    <span>{currentIndustryData.icon}</span>
                    <span>Industri {currentIndustryData.label}</span>
                  </h3>
                  <p className="mt-4 text-slate-600 text-base leading-relaxed">
                    {currentIndustryData.desc}
                  </p>
                  
                  <div className="mt-8">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">REGULASI UTAMA:</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {currentIndustryData.regulations.map((reg, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>{reg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-200">
                  <Link href={`/layanan?industry=${currentIndustryData.id}`} className="btn-primary w-full text-center">
                    Eksplor Layanan Industri
                  </Link>
                </div>
              </div>

              {/* Related Case Study */}
              <div className="card border-l-4 border-l-[#D4A017] p-8 md:p-10 flex flex-col justify-between bg-white relative">
                <div className="absolute top-4 right-6 text-xs font-semibold text-[#D4A017] uppercase tracking-widest bg-[#D4A017]/5 px-3 py-1 rounded-full">
                  Studi Kasus Sukses
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-[#0B1F3A] uppercase tracking-wide">
                    {currentIndustryData.caseStudy.client}
                  </h4>
                  
                  <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
                    <div>
                      <p className="font-bold text-slate-800 uppercase text-xs tracking-wider">Tantangan:</p>
                      <p className="mt-1">{currentIndustryData.caseStudy.challenge}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 uppercase text-xs tracking-wider">Tindakan Mitigasi:</p>
                      <p className="mt-1">{currentIndustryData.caseStudy.action}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 uppercase text-xs tracking-wider">Hasil Bisnis:</p>
                      <p className="mt-1 font-semibold text-[#0F766E] bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                        {currentIndustryData.caseStudy.result}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Link href="/studi-kasus" className="text-sm font-bold text-[#0B1F3A] hover:underline">
                    Baca Studi Kasus Lain ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="layanan" className="py-24 bg-[#F4F6F8]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.35em] text-[#0F766E] font-bold">Strategic Services</p>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-[#0B1F3A]">Solusi Kepatuhan Komprehensif</h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">Dari mapping regulasi hingga audit lapangan, layanan kami menjamin bisnis Anda selalu siap menghadapi inspeksi resmi.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <SectionCard title="Compliance Advisory" description="Audit berkala, regulatory mapping, penyusunan legal register, dan kepatuhan perizinan K3 & Lingkungan." />
              <SectionCard title="Audit & Assurance" description="Simulasi audit, audit internal independen, verifikasi temuan audit, dan penyusunan CAPA audit eksternal." />
              <SectionCard title="Management Systems" description="Pendampingan sertifikasi SMK3 PP 50/2012, sertifikasi ISO 45001 (K3), dan ISO 14001 (Lingkungan)." />
              <SectionCard title="Environmental Compliance" description="Penyusunan AMDAL, dokumen UKL-UPL, pemantauan kualitas lingkungan (RKL-RPL), dan pelaporan limbah B3." />
              <SectionCard title="Capability Development" description="Pelatihan lisensi Kemenaker, pembinaan panitia K3 (P2K3), coaching manajerial, dan induksi keselamatan terstruktur." />
              <SectionCard title="Continuous Improvement" description="Monitoring KPI keselamatan, evaluasi pasca-insiden, dan program budaya keselamatan berbasis perilaku (BBS)." />
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/layanan" className="btn-secondary">
                Lihat Detail Layanan
              </Link>
            </div>
          </div>
        </section>

        {/* COMPLIANCE LIFECYCLE (METHODOLOGY STEPPER) */}
        <section id="metodologi" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.35em] text-[#0F766E] font-bold">Compliance Lifecycle</p>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-[#0B1F3A]">Metodologi Pendekatan Konsultatif Kami</h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">Kami tidak sekadar memberikan saran tertulis, melainkan mendampingi di setiap tahapan siklus kepatuhan.</p>
            </div>

            {/* Stepper Timeline Buttons */}
            <div className="relative max-w-5xl mx-auto mb-12">
              <div className="timeline-line hidden lg:block"></div>
              
              <div className="grid grid-cols-3 gap-4 lg:grid-cols-6 relative z-10 js-animate">
                {lifecycleSteps.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className="flex flex-col items-center group focus:outline-none"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-md transition-all duration-200 ${
                      activeStep === idx
                        ? 'bg-[#0F766E] text-white scale-110 ring-4 ring-[#0F766E]/20'
                        : 'bg-white text-slate-500 border border-slate-200 group-hover:border-slate-400 group-hover:text-slate-700'
                    }`}>
                      {item.step}
                    </div>
                    <span className={`mt-3 text-sm font-semibold transition-colors duration-200 ${
                      activeStep === idx ? 'text-[#0F766E] font-bold' : 'text-slate-500 group-hover:text-slate-700'
                    }`}>
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Step Detail Card */}
            <div className="max-w-4xl mx-auto rounded-[32px] border border-slate-100 bg-[#F8FAFC] p-8 md:p-12 shadow-sm grid gap-8 md:grid-cols-[60%_40%] items-center js-animate">
              <div>
                <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
                  TAHAP {lifecycleSteps[activeStep].step} — {lifecycleSteps[activeStep].title.toUpperCase()}
                </span>
                <h3 className="mt-4 text-2xl font-bold text-[#0B1F3A]">
                  {lifecycleSteps[activeStep].tagline}
                </h3>
                <p className="mt-4 text-slate-600 text-base leading-relaxed">
                  {lifecycleSteps[activeStep].desc}
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200/50 p-6 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4A017] block mb-2">DELIVERABLE:</span>
                <p className="text-sm font-bold text-[#0B1F3A] leading-relaxed">
                  {lifecycleSteps[activeStep].deliverable}
                </p>
                <div className="mt-4 w-6 h-6 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERT ADVISORY TEAM */}
        <section id="tim-ahli" className="py-24 bg-[#0B1F3A] text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="text-xs uppercase tracking-[0.35em] text-teal-400 font-bold">Expert Advisory Team</p>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white">Didukung Praktisi & Lead Auditor Senior</h2>
              <p className="mt-4 text-slate-300 text-base leading-relaxed">Konsultan kami memegang lisensi kementerian, memiliki pengalaman lapangan bertahun-tahun, serta pemahaman mendalam terhadap hukum nasional.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  initial: 'DH',
                  name: 'Dr. Rudi Hermanto',
                  role: 'Director & Lead Consultant',
                  certs: ['ISO 45001 Lead Auditor', 'Ahli K3 Umum Lulusan UI', 'UK MSc HSE'],
                  exp: '20+ Tahun Pengalaman'
                },
                {
                  initial: 'SL',
                  name: 'Siti Putri Laksmi',
                  role: 'Lead Environment Specialist',
                  certs: ['ISO 14001 Lead Auditor', 'Sertifikasi AMDAL Penyusun', 'M.Lingkungan'],
                  exp: '15+ Tahun Pengalaman'
                },
                {
                  initial: 'AW',
                  name: 'Adi Waskito',
                  role: 'Implementation & Training Lead',
                  certs: ['Ahli K3 Konstruksi Madya', 'Trainer Lisensi Kemenaker', 'SOP Specialist'],
                  exp: '12+ Tahun Pengalaman'
                }
              ].map((member, idx) => (
                <div key={idx} className="rounded-[32px] border border-white/10 bg-white/5 p-8 flex flex-col justify-between min-h-[400px] js-animate">
                  <div>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0F766E] to-[#D4A017] flex items-center justify-center text-white text-2xl font-bold mb-6">
                      {member.initial}
                    </div>
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-sm text-teal-400 font-medium mt-1">{member.role}</p>
                    
                    <div className="mt-6 border-t border-white/5 pt-4">
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Sertifikasi & Keahlian:</p>
                      <ul className="space-y-2 text-sm text-slate-300">
                        {member.certs.map((c, cIdx) => (
                          <li key={cIdx} className="flex items-center gap-2">
                            <span className="text-[#D4A017]">■</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-8 border-t border-white/5 pt-4 text-xs font-bold uppercase tracking-widest text-[#D4A017]">
                    {member.exp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLIENT TRUST LAYER & TESTIMONIALS */}
        <section id="trust" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.35em] text-[#0F766E] font-bold">Client Trust Layer</p>
              <h2 className="mt-4 text-3xl font-extrabold text-[#0B1F3A]">Dipercaya Lebih dari 50+ Klien Industri</h2>
              
              {/* Grayscale Client Logos */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-12 lg:gap-16">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="logo-grayscale cursor-pointer">
                    <Image
                      src={`/images/client-logo-${num}.svg`}
                      alt={`Logo Klien ${num}`}
                      width={140}
                      height={40}
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  quote: "Dahulu kami dipusingkan dengan temuan audit K3 berulang pada pipa uap. Tim Advisory Training Jogja membantu menyusun ulang prosedur verifikasi kelayakan alat secara otomatis, temuan berkurang 80%.",
                  author: "Ir. Bambang Setyo",
                  position: "HSE Manager, PT. Manufaktur Nusantara"
                },
                {
                  quote: "Pendampingan sertifikasi ISO 14001 berjalan lancar. Proses dokumentasi lingkungan dari AMDAL sampai laporan limbah B3 dirapikan dengan sempurna sehingga lolos audit tahap satu.",
                  author: "Siti Rahma, M.Sc",
                  position: "Environment Director, PT. Mineral Sejahtera"
                },
                {
                  quote: "Program training berlisensi Kemenaker yang mereka selenggarakan sangat berkualitas. Operator crane dan forklift kami lulus dengan bekal kebiasaan keselamatan kerja yang nyata.",
                  author: "Budi Santoso",
                  position: "Plant Manager, PT. Konstruksi Indonesia"
                }
              ].map((test, idx) => (
                <div key={idx} className="card flex flex-col justify-between js-animate">
                  <p className="text-slate-600 text-base leading-relaxed italic">
                    "{test.quote}"
                  </p>
                  <div className="mt-8 border-t border-slate-100 pt-4">
                    <p className="font-bold text-[#0B1F3A] text-sm">{test.author}</p>
                    <p className="text-xs text-[#0F766E] mt-1">{test.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST LOGOS MARQUEE */}
        <TrustLogos />

        {/* EXECUTIVE CTA SECTION */}
        <section id="konsultasi-cta" className="relative bg-[#0B1F3A] py-24 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0D2646] to-slate-950 opacity-95"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.15),_transparent_50%)] pointer-events-none"></div>
          
          <div className="relative z-10 mx-auto max-w-4xl text-center px-6">
            <p className="text-xs uppercase tracking-[0.35em] text-teal-400 font-bold">Solusi Risiko & Compliance</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Siap Mengurangi Risiko Compliance dan Meningkatkan Kesiapan Audit?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-slate-300 leading-relaxed">
              Jadwalkan konsultasi strategis awal 15-menit dengan Lead Advisor kami untuk memetakan risiko regulasi dan membuat rencana mitigasi terarah.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/konsultasi" className="btn-primary">
                Jadwalkan Konsultasi Strategis
              </Link>
              <Link href="/layanan" className="btn-secondary-dark text-slate-200">
                Telusuri Detail Layanan
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER SECTION */}
        <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-4">
            <div>
              <div className="mb-4">
                <Image
                  src="/images/logo.png"
                  alt="HSE SkillUp"
                  width={120}
                  height={40}
                  className="object-contain h-10 w-auto brightness-0 invert"
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Mitra penasihat risiko strategis dan kepatuhan regulasi K3 serta lingkungan untuk memastikan operasi bisnis terlindungi, aman, dan berkelanjutan.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Layanan Strategis</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/layanan" className="hover:text-white transition-colors">Compliance Advisory</Link></li>
                <li><Link href="/layanan" className="hover:text-white transition-colors">Audit & Assurance</Link></li>
                <li><Link href="/layanan" className="hover:text-white transition-colors">Sertifikasi SMK3 & ISO</Link></li>
                <li><Link href="/layanan" className="hover:text-white transition-colors">Environmental Compliance</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Sumber Informasi</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/resource-center" className="hover:text-white transition-colors">Regulatory Updates</Link></li>
                <li><Link href="/studi-kasus" className="hover:text-white transition-colors">Studi Kasus Bisnis</Link></li>
                <li><Link href="/resource-center#faq" className="hover:text-white transition-colors">Pertanyaan Umum (FAQ)</Link></li>
                <li><Link href="/tentang-kami" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hubungi Kami</h4>
              <p className="mt-4 text-sm">Jl. Industri No. 10, Sleman, Yogyakarta</p>
              <p className="mt-2 text-sm">info@hseskillup.co.id</p>
              <p className="mt-2 text-sm">+62 812-3456-7890</p>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs gap-4 text-slate-500">
            <div>
              © {new Date().getFullYear()} HSE SkillUp. Semua hak dilindungi.
            </div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-slate-400">Kebijakan Privasi</Link>
              <Link href="#" className="hover:text-slate-400">Syarat & Ketentuan</Link>
            </div>
          </div>
        </footer>

        <WhatsAppWidget />
      </main>
    </>
  )
}
