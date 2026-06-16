import Image from 'next/image'

const partners = [
  { src: '/images/partners/client-logo-1.svg', alt: 'PT. Manufaktur Nusantara', label: 'Manufaktur Nusantara' },
  { src: '/images/partners/client-logo-2.svg', alt: 'PT. Mineral Sejahtera', label: 'Mineral Sejahtera' },
  { src: '/images/partners/client-logo-3.svg', alt: 'PT. Konstruksi Indonesia', label: 'Konstruksi Indonesia' },
  { src: '/images/partners/partner-4.png',     alt: 'Nusantara Industri',     label: 'Nusantara Industri' },
  { src: '/images/partners/partner-5.png',     alt: 'Tambang Maju',           label: 'Tambang Maju' },
  { src: '/images/partners/partner-6.png',     alt: 'Energi Prima',           label: 'Energi Prima' },
]

// Duplicate twice for seamless loop
const allLogos = [...partners, ...partners, ...partners]

export default function TrustLogos() {
  return (
    <section className="relative bg-[#071729] py-16 overflow-hidden border-y border-white/5">
      {/* Radial ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(15,118,110,0.1),_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-10 js-animate">
          <p className="text-xs uppercase tracking-[0.35em] text-teal-400 font-bold">
            Trusted Partners
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-white">
            Dipercaya oleh 50+ Perusahaan Industri
          </h2>
          <p className="mt-2 text-slate-400 text-sm max-w-xl mx-auto">
            Dari manufaktur, pertambangan, hingga energi — kami telah membuktikan kompetensi K3 di berbagai sektor.
          </p>
        </div>

        {/* Marquee */}
        <div className="marquee-wrapper" aria-label="Daftar mitra perusahaan kami">
          <div className="marquee-track">
            {allLogos.map((partner, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center mx-10 flex-shrink-0 group cursor-default"
                title={partner.alt}
              >
                <div className="
                  flex items-center justify-center
                  h-16 w-40
                  rounded-xl border border-white/10 bg-white/5
                  px-4
                  transition-all duration-300
                  group-hover:bg-white/10 group-hover:border-teal-500/30 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-teal-900/30
                ">
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain filter grayscale brightness-200 opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100"
                  />
                </div>
                <span className="mt-2 text-[10px] text-slate-500 font-medium tracking-wide group-hover:text-teal-400 transition-colors duration-300">
                  {partner.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 js-animate">
          {[
            { icon: '🏅', text: 'ISO 45001 Certified Partner' },
            { icon: '⭐', text: 'SMK3 Gold Category' },
            { icon: '🔒', text: 'Zero Audit Penalty' },
            { icon: '📋', text: '10+ Years of Compliance' },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-slate-300 font-semibold"
            >
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
