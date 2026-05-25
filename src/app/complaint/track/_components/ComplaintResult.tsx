import { CheckCircle2, Circle } from 'lucide-react'
import { ALL_STEPS, NEXT_STEPS, getActiveStep, getStepIndex, fmtDate, buildTimeline, type Complaint, type Language, type Tx } from '../_data/track-complaint.data'

interface Props {
  result: Complaint
  lang: Language
  tx: Tx
}

export default function ComplaintResult({ result, lang, tx }: Props) {
  const activeStep = getActiveStep(result)
  const activeIdx = getStepIndex(activeStep)
  const timeline = buildTimeline(result, lang)

  const details = [
    { label: tx.filed,  val: fmtDate(result.filed_date) },
    { label: tx.amount, val: `₹${result.amount_at_risk_lakh} Lakh` },
    result.hearing_date    ? { label: tx.hearing,  val: fmtDate(result.hearing_date) }    : null,
    result.resolution_date ? { label: tx.resolved, val: fmtDate(result.resolution_date) } : null,
    { label: tx.officer, val: result.assigned_officer },
  ].filter(Boolean)

  return (
    <div className="space-y-5">
      {/* Status banner */}
      <div className={`border rounded-sm p-4 flex items-center justify-between ${result.status === 'RESOLVED' ? 'bg-green/5 border-green/30' : 'bg-amber/5 border-amber/30'}`}>
        <div>
          <div className="font-mono text-xs text-gold mb-0.5">{result.id}</div>
          <div className="text-off-white text-sm font-medium">{result.project_name}</div>
          <div className="text-gray text-xs">{result.category}</div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium shrink-0 ${result.status === 'RESOLVED' ? 'text-green' : 'text-amber'}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${result.status === 'RESOLVED' ? 'bg-green' : 'bg-amber'}`} />
          {result.status === 'RESOLVED' ? (lang === 'en' ? 'Resolved' : 'ಇತ್ಯರ್ಥ') : (lang === 'en' ? 'Pending' : 'ಬಾಕಿ')}
        </span>
      </div>

      {/* Progress steps */}
      <div className="bg-surface border border-border rounded-sm p-5">
        <div className="text-[10px] uppercase tracking-widest text-gray mb-5">{tx.progress}</div>
        <div className="relative">
          <div className="absolute top-3 left-3 right-3 h-0.5 bg-border" />
          <div className="absolute top-3 left-3 h-0.5 bg-gold transition-all duration-700" style={{ width: activeIdx > 0 ? `${(activeIdx / (ALL_STEPS.length - 1)) * 100}%` : '0%' }} />
          <div className="relative flex justify-between">
            {ALL_STEPS.map((s, i) => {
              const done = i < activeIdx
              const active = i === activeIdx
              return (
                <div key={s.key} className="flex flex-col items-center gap-1.5" style={{ width: '16.67%' }}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 bg-background ${done ? 'border-gold bg-gold' : active ? 'border-gold' : 'border-border'}`}>
                    {done ? <CheckCircle2 className="w-3.5 h-3.5 text-background" /> : active ? <div className="w-2 h-2 rounded-full bg-gold" /> : <Circle className="w-2.5 h-2.5 text-border" />}
                  </div>
                  <span className={`text-[9px] text-center leading-tight ${active ? 'text-gold font-medium' : done ? 'text-gray-light' : 'text-gray'}`}>{s[lang]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Next step */}
      <div className="border-l-2 border-gold pl-4 bg-surface rounded-sm p-4">
        <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">{tx.nextStep}</div>
        <p className="text-off-white text-sm leading-relaxed">{NEXT_STEPS[activeStep][lang]}</p>
      </div>

      {/* Details */}
      <div className="bg-surface border border-border rounded-sm p-4">
        <div className="grid grid-cols-2 gap-4">
          {details.map((item, i) => (
            <div key={i}>
              <div className="text-[10px] uppercase tracking-widest text-gray mb-0.5">{item!.label}</div>
              <div className="text-off-white text-xs font-medium">{item!.val}</div>
            </div>
          ))}
        </div>
        {result.resolution_summary && (
          <div className="border-t border-border pt-4 mt-4">
            <div className="text-[10px] uppercase tracking-widest text-gray mb-1">{tx.resolution}</div>
            <p className="text-green text-xs leading-relaxed">{result.resolution_summary}</p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-surface border border-border rounded-sm p-4">
        <div className="text-[10px] uppercase tracking-widest text-gray mb-4">{tx.timeline}</div>
        <div className="space-y-3">
          {timeline.map((ev, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-2 h-2 rounded-full mt-1 ${i === 0 ? 'bg-gold' : 'bg-gray'}`} />
                {i < timeline.length - 1 && <div className="w-px bg-border mt-1" style={{ height: 24 }} />}
              </div>
              <div>
                <div className="text-off-white text-xs font-medium leading-tight">{ev.label}</div>
                <div className="text-gray text-[10px]">{ev.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
