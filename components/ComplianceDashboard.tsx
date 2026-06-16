import React, { useState } from 'react'

type IndustryType = 'manufacturing' | 'mining' | 'oilgas'

const dashboardData: Record<IndustryType, {
  score: number
  readiness: number
  envStatus: string
  envStatusBadge: string
  openFindings: number
  controlsAtRisk: number
  daysSinceAudit: number
}> = {
  manufacturing: {
    score: 92,
    readiness: 95,
    envStatus: 'Compliant',
    envStatusBadge: '✓ Stable',
    openFindings: 2,
    controlsAtRisk: 4,
    daysSinceAudit: 12
  },
  mining: {
    score: 85,
    readiness: 88,
    envStatus: 'Fair',
    envStatusBadge: '⚠ Action Req.',
    openFindings: 5,
    controlsAtRisk: 7,
    daysSinceAudit: 45
  },
  oilgas: {
    score: 97,
    readiness: 99,
    envStatus: 'Excellent',
    envStatusBadge: '★ Compliant',
    openFindings: 1,
    controlsAtRisk: 2,
    daysSinceAudit: 8
  }
}

export default function ComplianceDashboard() {
  const [activeInd, setActiveInd] = useState<IndustryType>('manufacturing')
  const current = dashboardData[activeInd]

  return (
    <div className="p-6 lg:p-8">
      {/* Dynamic Tab Selector inside Mockup */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        {(['manufacturing', 'mining', 'oilgas'] as IndustryType[]).map((ind) => (
          <button
            key={ind}
            onClick={() => setActiveInd(ind)}
            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
              activeInd === ind
                ? 'bg-accent-500 border-accent-500 text-white shadow-sm'
                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {ind === 'oilgas' ? 'Oil & Gas' : ind}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-300">COMPLIANCE SCORE</h3>
          <div className="mt-3 flex items-end gap-4">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-primary-900 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer" title="Overall compliance rating based on latest audit">
              <span className="text-2xl font-bold">{current.score}</span>
              <span className="absolute bottom-2 text-xs text-white/80">%</span>
            </div>
            <div>
              <p className="text-sm text-slate-300">Overall compliance index</p>
              <p className="mt-2 text-xs text-slate-400">Last audit: Mar 2026</p>
            </div>
          </div>
        </div>
        <div className="hidden flex-col items-start gap-2 lg:flex lg:items-end">
          <div className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-200 transition hover:bg-accent-500/20 hover:text-accent-300 cursor-default" title="Audit Readiness Level">Audit Ready {current.readiness}%</div>
          <div className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-200 transition hover:bg-green-600/20 hover:text-green-300 cursor-default" title="SMK3 Compliance Status">SMK3: Compliant</div>
          <div className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-200 transition hover:bg-blue-600/20 hover:text-blue-300 cursor-default" title="ISO 45001 Readiness">ISO 45001: Ready</div>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3 transition hover:bg-slate-800/60 hover:shadow-md" title="Audit Readiness Progress">
          <div>
            <p className="text-xs text-slate-300">Audit Readiness</p>
            <p className="text-sm font-semibold text-white">{current.readiness}%</p>
          </div>
          <div className="w-40 bg-slate-800/40 h-2 rounded-full overflow-hidden">
            <div className="h-2 rounded-full bg-gradient-to-r from-accent-500 to-accent-400 transition-all duration-500" style={{width: `${current.readiness}%`}} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3 transition hover:bg-slate-800/60 hover:shadow-md" title="Environmental Compliance Status">
          <div>
            <p className="text-xs text-slate-300">Environmental Status</p>
            <p className="text-sm font-semibold text-white">{current.envStatus}</p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-white transition hover:shadow-md ${
            activeInd === 'mining' ? 'bg-yellow-600/80 hover:bg-yellow-600' : 'bg-green-600/80 hover:bg-green-600'
          }`}>{current.envStatusBadge}</div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-900/60 p-3 text-center transition hover:bg-slate-800/60 hover:shadow-md cursor-pointer" title="Outstanding audit findings">
            <div className="text-lg font-bold text-white transition-all duration-300">{current.openFindings}</div>
            <div className="text-xs text-slate-300">Open Findings</div>
          </div>
          <div className="rounded-xl bg-slate-900/60 p-3 text-center transition hover:bg-slate-800/60 hover:shadow-md cursor-pointer" title="Controls requiring attention">
            <div className="text-lg font-bold text-white transition-all duration-300">{current.controlsAtRisk}</div>
            <div className="text-xs text-slate-300">Controls At Risk</div>
          </div>
          <div className="rounded-xl bg-slate-900/60 p-3 text-center transition hover:bg-slate-800/60 hover:shadow-md cursor-pointer" title="Days since last compliance audit">
            <div className="text-lg font-bold text-white transition-all duration-300">{current.daysSinceAudit}</div>
            <div className="text-xs text-slate-300">Days Since Audit</div>
          </div>
        </div>
      </div>
    </div>
  )
}
