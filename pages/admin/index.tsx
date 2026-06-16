import Head from 'next/head'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'hseskillup2026'

type LeadStatus = 'baru' | 'ditindaklanjuti' | 'selesai'

type Contact = {
  id: string
  createdAt: string
  status: LeadStatus
  name: string
  company: string
  email: string
  phone: string
  service: string
  message: string
}

type Booking = {
  id: string
  createdAt: string
  status: LeadStatus
  name: string
  company: string
  role: string
  industry: string
  assessmentScore: number | null
  assessmentRating: string
  criticalGaps: string[]
  preferredDate: string
  preferredTime: string
  phone: string
  platform: string
}

type Assessment = {
  id: string
  createdAt: string
  status: LeadStatus
  name: string
  company: string
  industry: string
  score: number
  rating: string
  criticalGaps: string[]
}

type AllData = {
  contacts: Contact[]
  bookings: Booking[]
  assessments: Assessment[]
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  baru: 'bg-blue-100 text-blue-700 border-blue-200',
  ditindaklanjuti: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  selesai: 'bg-green-100 text-green-700 border-green-200',
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  baru: '🔵 Baru',
  ditindaklanjuti: '🟡 Ditindaklanjuti',
  selesai: '🟢 Selesai',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [data, setData] = useState<AllData | null>(null)
  const [activeTab, setActiveTab] = useState<'contacts' | 'bookings' | 'assessments'>('contacts')
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchData = useCallback(async (pwd: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { 'x-admin-password': pwd }
      })
      if (!res.ok) throw new Error('Unauthorized')
      const json = await res.json()
      setData(json.data as AllData)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setAuthError('')
      fetchData(password)
    } else {
      setAuthError('Password salah. Coba lagi.')
    }
  }

  const handleStatusChange = async (id: string, type: string, newStatus: LeadStatus) => {
    setUpdatingId(id)
    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password || ADMIN_PASSWORD
        },
        body: JSON.stringify({ id, status: newStatus, type })
      })
      await fetchData(password || ADMIN_PASSWORD)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleExport = () => {
    if (!data) return
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hseskillup-leads-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const counts = {
    contacts: data?.contacts?.length ?? 0,
    bookings: data?.bookings?.length ?? 0,
    assessments: data?.assessments?.length ?? 0,
  }
  const newContacts = data?.contacts?.filter(c => c.status === 'baru').length ?? 0
  const newBookings = data?.bookings?.filter(b => b.status === 'baru').length ?? 0

  // ── LOGIN SCREEN ──────────────────────────────────────────────
  if (!authenticated) {
    return (
      <>
        <Head><title>Admin Login | HSE SkillUp</title></Head>
        <div className="min-h-screen flex items-center justify-center bg-[#0B1F3A]">
          <div className="w-full max-w-sm bg-white rounded-[28px] p-10 shadow-2xl">
            <div className="text-center mb-8">
              <span className="text-3xl font-extrabold text-[#0B1F3A] flex items-center justify-center gap-2">
                <span className="text-[#D4A017]">◆</span> HSE SkillUp
              </span>
              <p className="mt-2 text-sm text-slate-500 font-medium">Admin Dashboard</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Password Admin
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#0F766E] focus:bg-white focus:outline-none"
                  placeholder="Masukkan password..."
                  autoFocus
                />
              </div>
              {authError && (
                <p className="text-xs text-red-500 font-semibold">{authError}</p>
              )}
              <button type="submit" className="w-full bg-[#0B1F3A] text-white font-bold py-3 rounded-xl hover:bg-[#0d2646] transition-colors text-sm">
                Masuk ke Dashboard
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">← Kembali ke Website</Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── DASHBOARD ─────────────────────────────────────────────────
  return (
    <>
      <Head><title>Admin Dashboard | HSE SkillUp</title></Head>
      <div className="min-h-screen bg-[#F4F6F8]">

        {/* Top Bar */}
        <header className="sticky top-0 z-50 bg-[#0B1F3A] text-white px-6 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold flex items-center gap-2">
              <span className="text-[#D4A017]">◆</span> HSE SkillUp
            </span>
            <span className="text-xs bg-teal-500/20 text-teal-400 border border-teal-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExport}
              className="text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-xl transition-colors"
            >
              ⬇ Export JSON
            </button>
            <button
              onClick={() => fetchData(password || ADMIN_PASSWORD)}
              className="text-xs font-bold bg-[#0F766E] hover:bg-[#0d6660] text-white px-4 py-2 rounded-xl transition-colors"
            >
              ↺ Refresh
            </button>
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">← Website</Link>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Stats Overview */}
          <div className="grid gap-6 sm:grid-cols-3 mb-10">
            {[
              { label: 'Pesan Kontak', value: counts.contacts, new: newContacts, color: 'bg-blue-50 border-blue-200 text-blue-700', icon: '✉️' },
              { label: 'Booking Konsultasi', value: counts.bookings, new: newBookings, color: 'bg-teal-50 border-teal-200 text-teal-700', icon: '📅' },
              { label: 'Assessment Selesai', value: counts.assessments, new: 0, color: 'bg-[#D4A017]/10 border-[#D4A017]/30 text-[#AB7F12]', icon: '📊' },
            ].map((stat, idx) => (
              <div key={idx} className={`rounded-2xl border ${stat.color} bg-white p-6 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{stat.icon}</span>
                  {stat.new > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200">
                      {stat.new} Baru
                    </span>
                  )}
                </div>
                <div className="mt-4 text-3xl font-extrabold text-[#0B1F3A]">{stat.value}</div>
                <div className="mt-1 text-sm font-semibold text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tab Selector */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {([
              { key: 'contacts', label: `✉️ Pesan Kontak (${counts.contacts})` },
              { key: 'bookings', label: `📅 Booking Konsultasi (${counts.bookings})` },
              { key: 'assessments', label: `📊 Assessment (${counts.assessments})` },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#0B1F3A] text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-20 text-slate-400">Memuat data...</div>
          ) : (
            <div className="space-y-4">

              {/* CONTACTS */}
              {activeTab === 'contacts' && (
                <>
                  {(data?.contacts ?? []).length === 0 ? (
                    <EmptyState label="Belum ada pesan kontak masuk." />
                  ) : (
                    data?.contacts.map((c) => (
                      <div key={c.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="font-bold text-[#0B1F3A] text-base">{c.name}</h3>
                              <span className="text-xs text-slate-500 font-semibold">{c.company}</span>
                              <StatusBadge status={c.status} />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{formatDate(c.createdAt)}</p>
                          </div>
                          <StatusSelect
                            currentStatus={c.status}
                            disabled={updatingId === c.id}
                            onChange={(s) => handleStatusChange(c.id, 'contacts', s)}
                          />
                        </div>
                        <div className="mt-4 grid gap-2 sm:grid-cols-3 text-xs text-slate-600">
                          <span><b>Email:</b> {c.email}</span>
                          <span><b>HP:</b> {c.phone || '-'}</span>
                          <span><b>Layanan:</b> {c.service}</span>
                        </div>
                        <div className="mt-3 text-sm text-slate-700 bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <b className="text-xs uppercase tracking-wider text-slate-400">Pesan:</b>
                          <p className="mt-1 leading-relaxed">{c.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* BOOKINGS */}
              {activeTab === 'bookings' && (
                <>
                  {(data?.bookings ?? []).length === 0 ? (
                    <EmptyState label="Belum ada booking konsultasi masuk." />
                  ) : (
                    data?.bookings.map((b) => (
                      <div key={b.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="font-bold text-[#0B1F3A] text-base">{b.name}</h3>
                              <span className="text-xs text-slate-500 font-semibold">{b.company} · {b.role}</span>
                              <StatusBadge status={b.status} />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{formatDate(b.createdAt)}</p>
                          </div>
                          <StatusSelect
                            currentStatus={b.status}
                            disabled={updatingId === b.id}
                            onChange={(s) => handleStatusChange(b.id, 'bookings', s)}
                          />
                        </div>
                        <div className="mt-4 grid gap-2 sm:grid-cols-3 text-xs text-slate-600">
                          <span><b>Industri:</b> {b.industry}</span>
                          <span><b>Tanggal:</b> {b.preferredDate}</span>
                          <span><b>Waktu:</b> {b.preferredTime}</span>
                          <span><b>Platform:</b> {b.platform}</span>
                          <span><b>HP:</b> {b.phone}</span>
                        </div>
                        {b.assessmentScore !== null && (
                          <div className="mt-4 flex items-center gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0F766E] to-[#D4A017] flex items-center justify-center text-white text-sm font-extrabold shrink-0">
                              {b.assessmentScore}%
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#0F766E] uppercase">{b.assessmentRating}</p>
                              {b.criticalGaps.length > 0 && (
                                <ul className="mt-1 space-y-0.5">
                                  {b.criticalGaps.map((g, i) => (
                                    <li key={i} className="text-xs text-red-600 flex items-start gap-1"><span>⚠️</span><span>{g}</span></li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}

              {/* ASSESSMENTS */}
              {activeTab === 'assessments' && (
                <>
                  {(data?.assessments ?? []).length === 0 ? (
                    <EmptyState label="Belum ada data assessment." />
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {data?.assessments.map((a) => (
                        <div key={a.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-bold text-[#0B1F3A]">{a.name}</h3>
                              <p className="text-xs text-slate-500">{a.company} · {a.industry}</p>
                              <p className="text-xs text-slate-400 mt-1">{formatDate(a.createdAt)}</p>
                            </div>
                            <div className="text-center">
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-extrabold text-white ${
                                a.score >= 80 ? 'bg-green-600' : a.score >= 55 ? 'bg-yellow-500' : 'bg-red-600'
                              }`}>
                                {a.score}%
                              </div>
                            </div>
                          </div>
                          <p className="mt-3 text-xs font-bold text-[#0F766E] uppercase tracking-wider">{a.rating}</p>
                          {a.criticalGaps.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {a.criticalGaps.map((g, i) => (
                                <li key={i} className="text-xs text-red-600 flex items-start gap-1"><span>⚠️</span><span>{g}</span></li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  )
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

function StatusSelect({ currentStatus, onChange, disabled }: {
  currentStatus: LeadStatus
  onChange: (s: LeadStatus) => void
  disabled?: boolean
}) {
  return (
    <select
      value={currentStatus}
      onChange={e => onChange(e.target.value as LeadStatus)}
      disabled={disabled}
      className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:border-[#0F766E] cursor-pointer disabled:opacity-50"
    >
      <option value="baru">🔵 Baru</option>
      <option value="ditindaklanjuti">🟡 Ditindaklanjuti</option>
      <option value="selesai">🟢 Selesai</option>
    </select>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-400">
      <p className="text-4xl mb-4">📭</p>
      <p className="text-base font-semibold">{label}</p>
    </div>
  )
}
