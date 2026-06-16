import type { NextApiRequest, NextApiResponse } from 'next'
import { appendData } from '../../utils/dataStore'

type BookingPayload = {
  // Profile from step 1
  name: string
  company: string
  role: string
  industry: string
  // Assessment result from step 2-3
  assessmentScore?: number
  assessmentRating?: string
  criticalGaps?: string[]
  // Booking details from step 3 form
  preferredDate: string
  preferredTime: string
  phone: string
  platform: string
}

type ApiResponse = {
  success: boolean
  message: string
  data?: object
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { name, company, role, industry, assessmentScore, assessmentRating, criticalGaps, preferredDate, preferredTime, phone, platform } = req.body as BookingPayload

  // Validation
  if (!name || !company || !preferredDate || !preferredTime || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Data booking tidak lengkap. Harap isi tanggal, waktu, dan nomor HP.'
    })
  }

  try {
    const entry = appendData('bookings.json', {
      // Profil klien
      name: name.trim(),
      company: company.trim(),
      role: role?.trim() || '',
      industry: industry || '',
      // Assessment snapshot
      assessmentScore: assessmentScore ?? null,
      assessmentRating: assessmentRating || '',
      criticalGaps: criticalGaps || [],
      // Booking detail
      preferredDate,
      preferredTime,
      phone: phone.trim(),
      platform: platform || 'Google Meet / Zoom',
    })

    return res.status(200).json({
      success: true,
      message: 'Jadwal konsultasi berhasil didaftarkan! Lead Advisor kami akan menghubungi Anda dalam 1x24 jam.',
      data: { id: entry.id }
    })
  } catch (err) {
    console.error('[API/konsultasi] Error:', err)
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server. Silakan coba lagi.' })
  }
}
