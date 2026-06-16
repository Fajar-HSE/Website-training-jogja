import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Layanan', href: '/layanan' },
  { label: 'Studi Kasus', href: '/studi-kasus' },
  { label: 'Resource Center', href: '/resource-center' },
  { label: 'Tentang Kami', href: '/tentang-kami' },
  { label: 'Kontak', href: '/kontak' }
]

export default function Header() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === '/'
    }
    return router.pathname.startsWith(href)
  }

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0B1F3A]/95 border-teal-500/15 shadow-xl shadow-slate-950/15 backdrop-blur-md' 
        : 'bg-primary-900/90 border-white/5 shadow-lg shadow-slate-950/10 backdrop-blur-xl'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden bg-white/10 rounded-lg flex items-center justify-center p-0.5">
            <Image
              src="/images/logo.png"
              alt="HSE SkillUp Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            HSE <span className="text-teal-400">SkillUp</span>
          </span>
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <nav aria-label="Primary navigation" className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
                  isActive(item.href)
                    ? 'text-accent-500 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
                title={`Navigate to ${item.label}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Header CTA */}
          <Link
            href="/konsultasi"
            className="inline-flex items-center justify-center rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-accent-500/10 transition-all hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/20 active:scale-95"
          >
            Konsultasi
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-200 transition hover:border-white/20 hover:text-white md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Toggle navigation menu</span>
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden ${menuOpen ? 'block animate-fadeInDown' : 'hidden'} border-t border-white/5 bg-primary-900 px-6 py-4`}
      >
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-2.5 text-base font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-white/10 text-accent-500 font-semibold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/5">
            <Link
              href="/konsultasi"
              className="flex w-full items-center justify-center rounded-xl bg-accent-500 py-3 text-center text-base font-bold text-white shadow-md shadow-accent-500/10"
              onClick={() => setMenuOpen(false)}
            >
              Jadwalkan Konsultasi
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
