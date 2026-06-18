import React, { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'

export default function Konsultasi() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    industry: 'manufacturing',
    certifications: [] as string[],
    auditHistory: 'never',
    insidents: 'no',
    painPoint: ''
  })
  
  const [assessmentResult, setAssessmentResult] = useState<{
    score: number;
    rating: string;
    description: string;
    criticalGaps: string[];
  } | null>(null)

  const [bookingData, setBookingData] = useState({
    preferredDate: '',
    preferredTime: '09:00',
    phone: '',
    platform: 'zoom'
  })
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)
  const [bookingError, setBookingError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBookingData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (cert: string) => {
    setFormData((prev) => {
      const exists = prev.certifications.includes(cert)
      const newCerts = exists 
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert]
      return { ...prev, certifications: newCerts }
    })
  }

  const calculateAssessment = async () => {
    let score = 100
    const criticalGaps: string[] = []

    // Calculate score based on answers
    if (formData.certifications.length === 0) {
      score -= 20
      criticalGaps.push('Belum memiliki sertifikasi sistem manajemen dasar (SMK3/ISO)')
    }
    if (formData.auditHistory === 'never') {
      score -= 25
      criticalGaps.push('Belum pernah melakukan audit kepatuhan K3/Lingkungan internal/eksternal')
    } else if (formData.auditHistory === 'fail') {
      score -= 20
      criticalGaps.push('Terdapat temuan audit berulang yang belum teratasi')
    }
    if (formData.insidents === 'yes') {
      score -= 25
      criticalGaps.push('Terdapat insiden kecelakaan kerja (LTI) dalam 12 bulan terakhir')
    }
    if (formData.painPoint === 'compliance_gap') {
      score -= 10
      criticalGaps.push('Kesulitan memetakan regulasi baru yang relevan dengan operasional')
    }

    let rating = 'Sangat Kritis (High Risk)'
    let description = 'Perusahaan Anda memiliki kerentanan tinggi terhadap sanksi regulator, kegagalan sertifikasi, atau kecelakaan kerja. Tindakan korektif harus segera diprioritaskan.'
    
    if (score >= 80) {
      rating = 'Kepatuhan Baik (Low Risk)'
      description = 'Sistem manajemen Anda berjalan cukup baik. Fokus saat ini adalah continuous improvement dan audit kesiapan berkala untuk mempertahankan performa.'
    } else if (score >= 55) {
      rating = 'Perlu Peningkatan (Medium Risk)'
      description = 'Terdapat celah kepatuhan signifikan yang berisiko menjadi temuan audit eksternal. Diperlukan peninjauan dokumen dan perbaikan SOP di beberapa lini.'
    }

    setAssessmentResult({
      score,
      rating,
      description,
      criticalGaps
    })
    setStep(3)

    try {
      await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          role: formData.role,
          industry: formData.industry,
          certifications: formData.certifications,
          auditHistory: formData.auditHistory,
          incidents: formData.insidents,
          painPoint: formData.painPoint,
          score,
          rating,
          description,
          criticalGaps
        })
      })
    } catch (err) {
      console.error('Error saving assessment:', err)
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingBooking(true)
    setBookingError('')

    try {
      const res = await fetch('/api/konsultasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          role: formData.role,
          industry: formData.industry,
          assessmentScore: assessmentResult?.score,
          assessmentRating: assessmentResult?.rating,
          criticalGaps: assessmentResult?.criticalGaps,
          preferredDate: bookingData.preferredDate,
          preferredTime: bookingData.preferredTime,
          phone: bookingData.phone,
          platform: bookingData.platform
        })
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal mendaftarkan jadwal konsultasi.')
      }

      alert(json.message || 'Jadwal konsultasi berhasil didaftarkan! Lead Advisor kami akan menghubungi Anda dalam waktu 1x24 jam.')
      
      // Reset form
      setStep(1)
      setFormData({
        name: '',
        company: '',
        role: '',
        industry: 'manufacturing',
        certifications: [] as string[],
        auditHistory: 'never',
        insidents: 'no',
        painPoint: ''
      })
      setBookingData({
        preferredDate: '',
        preferredTime: '09:00',
        phone: '',
        platform: 'zoom'
      })
      setAssessmentResult(null)
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsSubmittingBooking(false)
    }
  }

  return (
    <>
      <Head>
        <title>Compliance Assessment & Konsultasi | HSE SkillUp</title>
        <meta name="description" content="Evaluasi tingkat kepatuhan regulasi K3 dan lingkungan perusahaan Anda dan jadwalkan sesi konsultasi strategis bersama Lead Advisor kami." />
      </Head>

      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center mb-12">
          <span className="inline-flex rounded-full bg-accent-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#AB7F12]">
            B2B Interactive Assessment
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-[#0B1F3A]">
            Evaluasi Compliance K3 & Lingkungan Anda
          </h1>
          <p className="mt-4 text-slate-600 max-w-xl mx-auto">
            Dapatkan skor kepatuhan awal dan rekomendasi langkah mitigasi dari Lead Advisor kami dalam 3 langkah mudah.
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 md:p-12 shadow-xl shadow-slate-200/50">
          
          {/* Progres bar */}
          <div className="flex items-center justify-between mb-10 max-w-md mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step === s 
                    ? 'bg-[#0F766E] text-white ring-4 ring-teal-600/20'
                    : step > s 
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className={`h-1 flex-1 mx-4 rounded-full ${
                    step > s ? 'bg-green-600' : 'bg-slate-100'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          {/* STEP 1: PROFIL PERUSAHAAN */}
          {step === 1 && (
            <div className="animate-fadeInDown">
              <h2 className="text-2xl font-bold text-[#0B1F3A] mb-6 border-b border-slate-100 pb-3">Langkah 1: Profil Perusahaan</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-700">Nama Lengkap Anda</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-[#0F766E] focus:bg-white focus:outline-none"
                    placeholder="Contoh: Budi Santoso"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700">Nama Perusahaan</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-[#0F766E] focus:bg-white focus:outline-none"
                    placeholder="Contoh: PT. Sumber Makmur"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700">Jabatan Pekerjaan</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-[#0F766E] focus:bg-white focus:outline-none"
                    placeholder="Contoh: HSE Manager / Direktur Operasional"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700">Sektor Industri</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-[#0F766E] focus:bg-white focus:outline-none"
                  >
                    <option value="manufacturing">Manufacturing</option>
                    <option value="mining">Mining</option>
                    <option value="oilgas">Oil & Gas</option>
                    <option value="construction">Construction</option>
                    <option value="energy">Energy & Power</option>
                    <option value="hospitality">Hospitality / Hotel</option>
                    <option value="other">Lain-lain</option>
                  </select>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (formData.name && formData.company && formData.role) {
                      setStep(2)
                    } else {
                      alert('Harap isi semua kolom identitas terlebih dahulu.')
                    }
                  }}
                  className="btn-primary"
                >
                  Lanjutkan ke Assessment ➔
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ASSESSMENT DETAIL */}
          {step === 2 && (
            <div className="animate-fadeInDown">
              <h2 className="text-2xl font-bold text-[#0B1F3A] mb-6 border-b border-slate-100 pb-3">Langkah 2: Detail Evaluasi Kepatuhan</h2>
              
              <div className="space-y-6">
                {/* Certifications owned */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Sertifikasi yang Dimiliki / Diinginkan saat ini (Pilih semua yang berlaku):</label>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {[
                      { key: 'smk3', label: 'SMK3 PP 50/2012' },
                      { key: 'iso45001', label: 'ISO 45001 (K3)' },
                      { key: 'iso14001', label: 'ISO 14001 (Lingkungan)' },
                      { key: 'amdal', label: 'Dokumen AMDAL / UKL-UPL' },
                      { key: 'limbahb3', label: 'Izin Pengelolaan Limbah B3' }
                    ].map((cert) => (
                      <label key={cert.key} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.certifications.includes(cert.key)}
                          onChange={() => handleCheckboxChange(cert.key)}
                          className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-sm font-semibold text-slate-700">{cert.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Audit History */}
                <div>
                  <label className="block text-sm font-bold text-slate-700">Riwayat Audit Sistem K3 / Lingkungan:</label>
                  <select
                    name="auditHistory"
                    value={formData.auditHistory}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-[#0F766E] focus:bg-white focus:outline-none"
                  >
                    <option value="never">Belum pernah diaudit kepatuhan</option>
                    <option value="success">Pernah diaudit & Lulus tanpa temuan berarti</option>
                    <option value="fail">Pernah diaudit & Memiliki temuan audit berulang</option>
                  </select>
                </div>

                {/* Incident History */}
                <div>
                  <label className="block text-sm font-bold text-slate-700">Apakah terdapat insiden kecelakaan kerja (Lost Time Injury) dalam 12 bulan terakhir?</label>
                  <div className="mt-3 flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="insidents"
                        value="yes"
                        checked={formData.insidents === 'yes'}
                        onChange={handleInputChange}
                        className="h-5 w-5 border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm font-semibold text-slate-700">Ya, pernah ada</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="insidents"
                        value="no"
                        checked={formData.insidents === 'no'}
                        onChange={handleInputChange}
                        className="h-5 w-5 border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm font-semibold text-slate-700">Tidak ada (Zero Accident)</span>
                    </label>
                  </div>
                </div>

                {/* Key Pain Point */}
                <div>
                  <label className="block text-sm font-bold text-slate-700">Apa tantangan kepatuhan utama Anda saat ini?</label>
                  <select
                    name="painPoint"
                    value={formData.painPoint}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-[#0F766E] focus:bg-white focus:outline-none"
                  >
                    <option value="">Pilih tantangan utama...</option>
                    <option value="compliance_gap">Kesulitan melacak & memahami regulasi nasional yang berlaku</option>
                    <option value="docs">Dokumentasi SOP K3 / AMDAL berserakan & tidak terkelola</option>
                    <option value="training">Kurangnya kompetensi lisensi pekerja (Operator, Scaffolder, dll.)</option>
                    <option value="cert">Proses administrasi persiapan SMK3/ISO lambat & tidak pasti</option>
                  </select>
                </div>
              </div>

              <div className="mt-10 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-bold text-slate-500 hover:text-slate-700"
                >
                  Kembali ke Langkah 1
                </button>
                <button
                  type="button"
                  onClick={calculateAssessment}
                  className="btn-primary"
                >
                  Kalkulasi Skor Kepatuhan ➔
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: HASIL & BOOKING */}
          {step === 3 && assessmentResult && (
            <div className="animate-fadeInDown">
              <h2 className="text-2xl font-bold text-[#0B1F3A] mb-6 border-b border-slate-100 pb-3">Langkah 3: Skor Kepatuhan & Progres</h2>
              
              {/* Score card grid */}
              <div className="grid gap-6 md:grid-cols-[30%_70%] items-center p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
                <div className="text-center">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#0F766E] to-[#D4A017] text-white text-3xl font-extrabold shadow-md">
                    {assessmentResult.score}%
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">Skor Kepatuhan</p>
                </div>
                <div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    assessmentResult.score >= 80 
                      ? 'bg-green-100 text-green-700' 
                      : assessmentResult.score >= 55 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {assessmentResult.rating}
                  </span>
                  <p className="mt-3 text-slate-700 text-sm md:text-base leading-relaxed">
                    {assessmentResult.description}
                  </p>
                </div>
              </div>

              {/* Critical Gaps list */}
              {assessmentResult.criticalGaps.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3">RISIKO UTAMA YANG TERDETEKSI:</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {assessmentResult.criticalGaps.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                        <span className="text-red-500 font-bold">⚠️</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Consultation Scheduler Booking form */}
              <div className="border-t border-slate-100 pt-8 mt-8">
                <h3 className="text-xl font-bold text-[#0B1F3A] mb-4">
                  Jadwalkan Konsultasi Strategis 15-Menit
                </h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  Kami mengundang Anda untuk mendiskusikan skor penilaian di atas secara mendalam dan menyusun draf roadmap kepatuhan khusus bersama Lead Advisor kami. Gratis & Tanpa Komitmen.
                </p>

                {bookingError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold mb-5">
                    ⚠️ {bookingError}
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Pilihan</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={bookingData.preferredDate}
                      onChange={handleBookingInputChange}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu Pilihan</label>
                    <select
                      name="preferredTime"
                      value={bookingData.preferredTime}
                      onChange={handleBookingInputChange}
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#0F766E] focus:outline-none"
                    >
                      <option value="09:00">09:00 - 10:00 WIB</option>
                      <option value="11:00">11:00 - 12:00 WIB</option>
                      <option value="14:00">14:00 - 15:00 WIB</option>
                      <option value="16:00">16:00 - 17:00 WIB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nomor WhatsApp / HP</label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleBookingInputChange}
                      required
                      placeholder="Contoh: 08123456789"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Platform Konsultasi</label>
                    <select
                      name="platform"
                      value={bookingData.platform}
                      onChange={handleBookingInputChange}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#0F766E] focus:outline-none"
                    >
                      <option value="zoom">Google Meet / Zoom Call</option>
                      <option value="whatsapp">Panggilan Suara / Chat WhatsApp</option>
                      <option value="onsite">Kunjungan Kantor (Yogyakarta)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 mt-6 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-sm font-bold text-slate-500 hover:text-slate-700"
                    >
                      Kembali ke Langkah 2
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingBooking}
                      className="btn-primary disabled:opacity-50"
                    >
                      {isSubmittingBooking ? 'Memproses...' : 'Konfirmasi Jadwal Konsultasi ➔'}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}
