import type { NextApiRequest, NextApiResponse } from 'next'
import { readData, updateStatus } from '../../../utils/dataStore'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hseskillup2026'

type ApiResponse = {
  success: boolean
  message?: string
  data?: object
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  // Simple token auth via header
  const authHeader = req.headers['x-admin-password']
  if (authHeader !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  // GET: Read all leads
  if (req.method === 'GET') {
    const { type } = req.query
    let data: unknown[] = []

    if (type === 'contacts') {
      data = readData('contacts.json')
    } else if (type === 'bookings') {
      data = readData('bookings.json')
    } else if (type === 'assessments') {
      data = readData('assessments.json')
    } else {
      // Return all combined
      const contacts = readData('contacts.json') as Array<Record<string, unknown>>
      const bookings = readData('bookings.json') as Array<Record<string, unknown>>
      const assessments = readData('assessments.json') as Array<Record<string, unknown>>
      return res.status(200).json({
        success: true,
        data: {
          contacts: contacts.sort((a, b) => String(b.createdAt) > String(a.createdAt) ? 1 : -1),
          bookings: bookings.sort((a, b) => String(b.createdAt) > String(a.createdAt) ? 1 : -1),
          assessments: assessments.sort((a, b) => String(b.createdAt) > String(a.createdAt) ? 1 : -1),
        }
      })
    }

    return res.status(200).json({ success: true, data })
  }

  // PATCH: Update status of a lead
  if (req.method === 'PATCH') {
    const { id, status, type } = req.body as { id: string; status: string; type: string }

    if (!id || !status || !type) {
      return res.status(400).json({ success: false, message: 'id, status, dan type wajib diisi.' })
    }

    const fileMap: Record<string, string> = {
      contacts: 'contacts.json',
      bookings: 'bookings.json',
      assessments: 'assessments.json',
    }

    const filename = fileMap[type]
    if (!filename) {
      return res.status(400).json({ success: false, message: 'Type tidak valid.' })
    }

    const updated = updateStatus(filename, id, status)
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' })
    }

    return res.status(200).json({ success: true, message: 'Status berhasil diperbarui.' })
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' })
}
