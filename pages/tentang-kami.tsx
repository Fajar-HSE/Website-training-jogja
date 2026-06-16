import Head from 'next/head'
import Header from '../components/Header'
import Button from '../components/Button'
import Link from 'next/link'

const teamMembers = [
  {
    initial: 'RH',
    name: 'Dr. Rudi Hermanto',
    role: 'Director & Lead Consultant',
    bio: 'Berpengalaman lebih dari 20 tahun dalam konsultasi keselamatan industri. Memegang gelar doktor dalam bidang keselamatan kerja dari universitas ternama dan aktif sebagai penasihat kebijakan K3 nasional.',
    certs: ['ISO 45001 Lead Auditor', 'Ahli K3 Umum Lulusan UI', 'UK MSc HSE'],
    exp: '20+ Tahun Pengalaman'
  },
  {
    initial: 'SL',
    name: 'Siti Putri Laksmi, M.Ling',
    role: 'Lead Environment Specialist',
    bio: 'Spesialis kepatuhan lingkungan dengan keahlian mendalam pada penyusunan dokumen AMDAL, UKL-UPL, dan audit kepatuhan pembuangan limbah B3 untuk industri berat.',
    certs: ['ISO 14001 Lead Auditor', 'Sertifikasi AMDAL Penyusun', 'M.Lingkungan'],
    exp: '15+ Tahun Pengalaman'
  },
  {
    initial: 'AW',
    name: 'Adi Waskito',
    role: 'Training & Implementation Lead',
    bio: 'Telah mengajar lebih dari 500 kelas pelatihan K3 bersertifikasi. Pakar dalam metodologi transfer pengetahuan dan pembudayaan keselamatan kerja bagi pekerja lapangan.',
    certs: ['Ahli K3 Konstruksi Madya', 'Trainer Lisensi Kemenaker', 'SOP Specialist'],
    exp: '12+ Tahun Pengalaman'
  }
]

export default function TentangKami() {
  return (
    <>
      <Head>
        <title>Tentang Kami | HSE SkillUp — Competence for Sustainable Productivity</title>
        <meta name="description" content="Ketahui lebih lanjut tentang komitmen, akreditasi, dan tim advisor senior kami dalam membantu perusahaan mengelola risiko K3 & Lingkungan." />
      </Head>

      <Header />

      <main className="bg-slate-50 text-slate-700">
        
        {/* HERO SECTION */}
        <section className="relative bg-[#0B1F3A] text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0D2646] to-slate-950 opacity-95"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.15),_transparent_50%)] pointer-events-none"></div>
          
          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <span className="inline-flex rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-400">
              Corporate Profile
            </span>
            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              Strategic Risk & Compliance Advisory Partner
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300 max-w-3xl mx-auto">
              Didirikan dengan misi menjembatani regulasi K3 nasional dan praktik operasional industri yang efisien. Kami memposisikan diri bukan sekadar vendor pelatihan, melainkan partner penasihat risiko terpercaya Anda.
            </p>
          </div>
        </section>

        {/* MISSION & VALUE PROPOSITION */}
        <section className="py-24 max-w-7xl mx-auto px-6 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#0F766E] font-bold">Visi & Nilai Kami</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#0B1F3A]">Kepatuhan Hukum yang Melindungi Operasional Bisnis</h2>
            <p className="mt-6 text-slate-600 text-base leading-relaxed">
              Kami percaya bahwa kepatuhan K3 dan lingkungan tidak boleh sekadar menjadi beban administratif di atas kertas. Kepatuhan yang dirancang dengan baik adalah investasi strategis untuk mengurangi kerugian operasional, mencegah kecelakaan kerja, menghindari denda regulator, dan mempertahankan reputasi premium perusahaan Anda.
            </p>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              Dengan tim advisor berpengalaman yang memiliki sertifikasi Lead Auditor resmi, kami menjamin implementasi sistem manajemen yang selaras dengan efisiensi bisnis sehari-hari.
            </p>
          </div>

          <div className="grid gap-6">
            {[
              {
                title: 'Kredibilitas Tertinggi',
                desc: 'Seluruh tim advisor kami memiliki lisensi resmi, pengalaman lapangan minimal 10 tahun, dan merupakan auditor bersertifikat internasional.'
              },
              {
                title: 'Pendekatan Konsultatif',
                desc: 'Kami mendengarkan kebutuhan spesifik perusahaan Anda, menganalisis proses bisnis, dan merancang solusi mitigasi risiko yang disesuaikan secara khusus.'
              },
              {
                title: 'Jaminan Kesiapan Audit',
                desc: 'Setiap program pendampingan dirancang secara ketat hingga proses simulasi akhir untuk memastikan kelulusan audit sertifikasi dari lembaga resmi.'
              }
            ].map((val, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm transition hover:shadow-md">
                <h3 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-600 text-sm">✓</span>
                  {val.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed pl-11">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DETAILED ADVISOR PROFILES */}
        <section className="py-24 bg-[#F4F6F8]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0F766E] font-bold">Tim Advisory</p>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#0B1F3A]">Konsultan Senior Berlisensi Resmi</h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                Kami bangga didukung oleh para praktisi ahli K3 dan lingkungan yang memadukan latar belakang akademis kuat dan jam terbang lapangan yang komprehensif.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="bg-white rounded-[32px] border border-slate-200/80 p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition duration-300">
                  <div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0F766E] to-[#D4A017] flex items-center justify-center text-white text-xl font-bold mb-6">
                      {member.initial}
                    </div>
                    <h3 className="text-xl font-bold text-[#0B1F3A]">{member.name}</h3>
                    <p className="text-xs font-semibold text-[#0F766E] uppercase tracking-wider mt-1">{member.role}</p>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed border-b border-slate-100 pb-4">
                      {member.bio}
                    </p>
                    
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">SERTIFIKASI UTAMA:</p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {member.certs.map((c, cIdx) => (
                          <li key={cIdx} className="flex items-center gap-2">
                            <span className="text-teal-600 font-bold">✓</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#D4A017] uppercase tracking-wider">
                    <span>Lisensi Nasional</span>
                    <span>{member.exp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA & ACCREDITATIONS */}
        <section className="py-24 bg-white text-center max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1F3A]">
            Mitra Strategis Terakreditasi Resmi
          </h2>
          <p className="mt-4 text-slate-600 text-sm leading-relaxed max-w-2xl mx-auto">
            Seluruh layanan konsultasi kami didukung oleh afiliasi dengan lembaga sertifikasi dan pelatihan terdaftar di Kementerian Ketenagakerjaan (Kemenaker) RI dan KLHK.
          </p>

          <div className="mt-12 flex justify-center gap-6 items-center flex-wrap opacity-75">
            <span className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50">Lisensi Kemenaker RI</span>
            <span className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50">KLHK Approved</span>
            <span className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50">BNSP Certified</span>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/konsultasi" className="btn-primary">
              Mulai Konsultasi Strategis
            </Link>
            <Link href="/kontak" className="btn-secondary">
              Hubungi Kantor Kami
            </Link>
          </div>
        </section>

      </main>

      {/* REUSED COMPACT FOOTER FOR SUBPAGES */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center text-xs gap-4 text-slate-500">
          <div>
            © {new Date().getFullYear()} HSE SkillUp. Semua hak dilindungi.
          </div>
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
