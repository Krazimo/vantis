import { type TimelinePoint } from './risk-timeline.data'

interface Props {
  point: TimelinePoint | null
}

export default function RiskDetailPanel({ point }: Props) {
  if (!point) {
    return (
      <div className="h-full min-h-[200px] flex items-center justify-center bg-surface2 border border-border rounded-sm p-4">
        <p className="text-gray text-sm text-center">Click any point on the chart to view quarter details.</p>
      </div>
    )
  }

  return (
    <div className="bg-surface2 border border-border rounded-sm p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="font-syne text-off-white text-base">{point.quarter}</span>
        <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded-sm border ${
          point.score >= 40 ? 'text-amber bg-amber/10 border-amber/30' : 'text-red bg-red/10 border-red/30'
        }`}>{point.score}</span>
      </div>

      <div className="flex gap-6 mb-4">
        <div>
          <div className="text-[10px] text-gray uppercase tracking-wide mb-0.5">Status</div>
          <div className={`text-xs font-semibold ${point.score >= 40 ? 'text-amber' : 'text-red'}`}>{point.status}</div>
        </div>
        <div>
          <div className="text-[10px] text-gray uppercase tracking-wide mb-0.5">Default Prob</div>
          <div className="text-xs font-mono font-bold text-red">{point.default_probability}%</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-1.5">Signals Detected</div>
        <div className="space-y-1.5">
          {point.signals.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-red shrink-0 text-xs mt-0.5">▸</span>
              <span className="text-gray-light text-xs leading-relaxed">{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-1.5">Vantis Action Taken</div>
        <div className="text-xs text-gold-light leading-relaxed border-l-2 border-gold pl-2.5">{point.action}</div>
      </div>
    </div>
  )
}
