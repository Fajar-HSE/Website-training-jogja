import type { NextApiRequest, NextApiResponse } from 'next'
import { appendData } from '../../utils/dataStore'

type AssessmentPayload = {
  name: string
  company: string
  role: string
  industry: string
  certifications: string[]
  auditHistory: string
  incidents: string
  painPoint: string
  score: number
  rating: string
  description: string
  criticalGaps: string[]
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

  const payload = req.body as AssessmentPayload

  if (!payload.name || !payload.company || typeof payload.score !== 'number') {
    return res.status(400).json({ success: false, message: 'Data assessment tidak lengkap.' })
  }

  try {
    const entry = appendData('assessments.json', {
      // Profil
      name: payload.name.trim(),
      company: payload.company.trim(),
      role: payload.role?.trim() || '',
      industry: payload.industry || '',
      // Input assessment
      certifications: payload.certifications || [],
      auditHistory: payload.auditHistory || '',
      incidents: payload.incidents || '',
      painPoint: payload.painPoint || '',
      // Output assessment
      score: payload.score,
      rating: payload.rating || '',
      description: payload.description || '',
      criticalGaps: payload.criticalGaps || [],
    })

    return res.status(200).json({
      success: true,
      message: 'Hasil assessment berhasil disimpan.',
      data: { id: entry.id }
    })
  } catch (err) {
    console.error('[API/assessment] Error:', err)
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' })
  }
}
