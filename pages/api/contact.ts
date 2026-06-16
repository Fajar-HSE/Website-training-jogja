import type { NextApiRequest, NextApiResponse } from 'next'
import { appendData } from '../../utils/dataStore'

type ContactPayload = {
  name: string
  company: string
  email: string
  phone?: string
  service?: string
  message: string
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

  const { name, company, email, phone, service, message } = req.body as ContactPayload

  // Validation
  if (!name || !company || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Field wajib (nama, perusahaan, email, pesan) tidak boleh kosong.'
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Format email tidak valid.' })
  }

  try {
    const entry = appendData('contacts.json', {
      name: name.trim(),
      company: company.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      service: service || 'Tidak ditentukan',
      message: message.trim(),
    })

    return res.status(200).json({
      success: true,
      message: 'Pesan Anda berhasil dikirim. Tim kami akan merespons dalam 1x24 jam kerja.',
      data: { id: entry.id }
    })
  } catch (err) {
    console.error('[API/contact] Error:', err)
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server. Silakan coba lagi.' })
  }
}
