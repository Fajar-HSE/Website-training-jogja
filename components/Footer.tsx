/**
 * components/Footer.tsx
 */

import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  layanan: [
    { label: 'Pelatihan K3',  href: '/pelatihan' },
    { label: 'Solusi Bisnis', href: '/solusi' },
    { label: 'Semua Layanan', href: '/layanan' },
    { label: 'Studi Kasus',   href: '/studi-kasus' },
  ],
  info: [
    { label: 'Resource Center', href: '/resource-center' },
    { label: 'Tentang Kami',    href: '/tentang-kami' },
    { label: 'Kontak',          href: '/kontak' },
    { label: 'Konsultasi',      href: '/konsultasi' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0B1F3A] text-slate-400 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center mb-5">
              <Image
                src="/images/logo.png"
                alt="Training Jogja"
                width={120}
                height={40}
                className="object-contain h-10 w-auto brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Mitra konsultasi K3 dan lingkungan terpercaya untuk perusahaan industri di Indonesia. Bersertifikat Kemnaker RI &amp; ISO.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://wa.me/6285328883511"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors text-sm"
                aria-label="WhatsApp"
              >
                💬
              </a>
              <a
                href="mailto:info@training-jogja.com"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors text-sm"
                aria-label="Email"
              >
                ✉️
              </a>
            </div>
          </div>

          {/* Layanan links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
              Layanan
            </p>
            <ul className="space-y-2.5">
              {footerLinks.layanan.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
              Informasi
            </p>
            <ul className="space-y-2.5">
              {footerLinks.info.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Training Jogja. Semua hak dilindungi.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Lisensi Kemnaker RI
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              ISO Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
