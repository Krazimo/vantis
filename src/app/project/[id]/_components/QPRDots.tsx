import { type Submission, type QPREntry, qprKey, dotClasses, dotLabel } from '../_data/project-profile.data'

interface Props {
  submission: Submission | undefined
  quarters: string[]
}

export default function QPRDots({ submission, quarters }: Props) {
  return (
    <div className="bg-surface border border-border rounded-sm p-5">
      <div className="flex items-end justify-between gap-1 sm:gap-2 mb-4 relative">
        <div className="absolute top-4 left-4 right-4 h-px bg-border" />
        {quarters.map(q => {
          const key = qprKey(q)
          const entry = submission ? (submission[key] as QPREntry | undefined) : undefined
          const status = entry?.status ?? 'NA'
          return (
            <div key={q} className="flex flex-col items-center gap-2 flex-1 relative z-10">
              <div title={`${q}: ${dotLabel(status)}`}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 ${dotClasses(status)} transition-transform duration-150 hover:scale-110 cursor-default`}
              />
              <span className="font-mono text-gray text-[9px] sm:text-xs text-center leading-tight whitespace-nowrap">
                {q.replace(' ', '\n')}
              </span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-4 pt-3 border-t border-border flex-wrap">
        {[
          { color: 'bg-green',    label: 'Filed on time' },
          { color: 'bg-amber',    label: 'Filed late' },
          { color: 'bg-red',      label: 'Missed' },
          { color: 'bg-gray/30',  label: 'Pre-registration' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-gray text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
