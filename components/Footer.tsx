import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="HSE SkillUp"
            width={100}
            height={34}
            className="object-contain h-8 w-auto brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
          />
        </Link>

        {/* Copyright */}
        <div className="text-center text-slate-500">
          © {new Date().getFullYear()} HSE SkillUp. Semua hak dilindungi.
        </div>

        {/* Nav Links */}
        <div className="flex gap-6">
          <Link href="/" className="hover:text-slate-300 transition-colors">Beranda</Link>
          <Link href="/layanan" className="hover:text-slate-300 transition-colors">Layanan</Link>
          <Link href="/resource-center" className="hover:text-slate-300 transition-colors">Resource</Link>
          <Link href="/kontak" className="hover:text-slate-300 transition-colors">Kontak</Link>
        </div>
      </div>
    </footer>
  )
}
