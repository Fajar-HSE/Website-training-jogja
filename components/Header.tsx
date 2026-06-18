/**
 * components/Header.tsx
 * Navigasi utama dengan dropdown "Layanan" untuk Pelatihan, Solusi, dan Layanan.
 */

import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const navItems = [
  { label: 'Beranda',         href: '/' },
  { label: 'Studi Kasus',     href: '/studi-kasus' },
  { label: 'Resource Center', href: '/resource-center' },
  { label: 'Tentang Kami',    href: '/tentang-kami' },
  { label: 'Kontak',          href: '/kontak' },
]

const layananDropdown = [
  { label: 'Pelatihan K3',    href: '/pelatihan',  icon: '🎓', desc: 'Program bersertifikat Kemnaker RI & ISO' },
  { label: 'Solusi Bisnis',   href: '/solusi',     icon: '🛡️', desc: 'SMK3, ISO 14001, ISO 45001, ESG' },
  { label: 'Semua Layanan',   href: '/layanan',    icon: '🎯', desc: 'Compliance advisory & audit' },
]

export default function Header() {
  const router = useRouter()
  const [menuOpen, setMenuOpen]       = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled]   = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Tutup dropdown saat navigasi
  useEffect(() => {
    setDropdownOpen(false)
    setMenuOpen(false)
  }, [router.pathname])

  const isActive = (href: string) => {
    if (href === '/') return router.pathname === '/'
    return router.pathname.startsWith(href)
  }

  const isLayananActive = ['/pelatihan', '/solusi', '/layanan'].some((p) =>
    router.pathname.startsWith(p)
  )

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1F3A]/95 border-[#2F6B3B]/20 shadow-xl shadow-slate-950/15 backdrop-blur-md'
          : 'bg-[#0B1F3A]/90 border-white/5 shadow-lg shadow-slate-950/10 backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Training Jogja"
            width={140}
            height={48}
            className="object-contain h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <nav aria-label="Primary navigation" className="flex items-center gap-5">

            {/* Dropdown: Layanan */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] ${
                  isLayananActive ? 'text-[#F59E0B] font-semibold' : 'text-slate-300 hover:text-white'
                }`}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                Layanan
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 rounded-2xl border border-white/10 bg-[#0D2646] shadow-2xl shadow-slate-950/40 overflow-hidden animate-fadeInDown">
                  {layananDropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-start gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors ${
                        isActive(item.href) ? 'bg-white/10' : ''
                      }`}
                    >
                      <span className="text-xl mt-0.5 flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className={`text-sm font-semibold leading-tight ${isActive(item.href) ? 'text-[#F59E0B]' : 'text-white'}`}>
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Regular nav items */}
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] ${
                  isActive(item.href)
                    ? 'text-[#F59E0B] font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/konsultasi"
            className="inline-flex items-center justify-center rounded-xl bg-[#F59E0B] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#e08e0a] hover:shadow-lg active:scale-95"
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
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden ${menuOpen ? 'block animate-fadeInDown' : 'hidden'} border-t border-white/5 bg-[#0B1F3A] px-6 py-4`}
      >
        <nav className="space-y-1">
          <Link
            href="/"
            className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              router.pathname === '/' ? 'bg-white/10 text-[#F59E0B] font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Beranda
          </Link>

          {/* Layanan group */}
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Layanan
            </p>
            {layananDropdown.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive(item.href) ? 'bg-white/10 text-[#F59E0B]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {navItems.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-white/10 text-[#F59E0B] font-semibold'
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
              className="flex w-full items-center justify-center rounded-xl bg-[#F59E0B] py-3 text-center text-sm font-bold text-white shadow-md"
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
