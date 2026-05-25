import type { NoticeProject, ViolationValue } from '../_data/notices.data'
import { PROJECTS, VIOLATION_TYPES } from '../_data/notices.data'

interface Props {
  violationType: ViolationValue | ''
  projectId: string
  lang: 'en' | 'kn'
  loading: boolean
  onViolationChange: (v: ViolationValue | '') => void
  onProjectChange: (id: string) => void
  onLangChange: (l: 'en' | 'kn') => void
  onGenerate: () => void
}

export default function NoticeForm({ violationType, projectId, lang, loading, onViolationChange, onProjectChange, onLangChange, onGenerate }: Props) {
  const selectedProject: NoticeProject | null = PROJECTS.find(p => p.id === projectId) ?? null
  const selectedSection = VIOLATION_TYPES.find(v => v.value === violationType)?.section ?? ''
  const canGenerate = violationType && projectId

  return (
    <div className="space-y-4">
      <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-2">Notice Configuration</div>

      <div>
        <label className="block text-xs text-gray mb-1.5">Violation Type</label>
        <select
          value={violationType}
          onChange={e => onViolationChange(e.target.value as ViolationValue | '')}
          className="w-full bg-surface border border-border rounded-sm px-3 py-2.5 text-sm text-off-white focus:outline-none focus:border-gold transition-colors duration-150 appearance-none cursor-pointer"
        >
          <option value="">Select violation type…</option>
          {VIOLATION_TYPES.map(v => (
            <option key={v.value} value={v.value}>{v.label}</option>
          ))}
        </select>
      </div>

      {violationType && (
        <div>
          <label className="block text-xs text-gray mb-1.5">Applicable RERA Section</label>
          <div className="w-full bg-surface2 border border-border rounded-sm px-3 py-2.5 text-sm font-mono text-gold">
            {selectedSection} — Real Estate (Regulation and Development) Act, 2016
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs text-gray mb-1.5">Project</label>
        <select
          value={projectId}
          onChange={e => onProjectChange(e.target.value)}
          className="w-full bg-surface border border-border rounded-sm px-3 py-2.5 text-sm text-off-white focus:outline-none focus:border-gold transition-colors duration-150 appearance-none cursor-pointer"
        >
          <option value="">Select project…</option>
          {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {selectedProject && (
        <div className="bg-surface2 border border-border rounded-sm p-3 space-y-2">
          <div className="text-[10px] text-gray uppercase tracking-widest font-semibold">Auto-populated Developer Details</div>
          <div className="grid grid-cols-1 gap-1.5 text-xs">
            <div className="flex items-start gap-2"><span className="text-gray shrink-0 w-20">Developer:</span><span className="text-off-white">{selectedProject.developer_name}</span></div>
            <div className="flex items-start gap-2"><span className="text-gray shrink-0 w-20">Location:</span><span className="text-off-white">{selectedProject.location}</span></div>
            <div className="flex items-start gap-2"><span className="text-gray shrink-0 w-20">RERA No.:</span><span className="font-mono text-gold text-[10px] break-all">{selectedProject.rera}</span></div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs text-gray mb-1.5">Notice Language</label>
        <div className="flex gap-2">
          {(['en', 'kn'] as const).map(l => (
            <button key={l} onClick={() => onLangChange(l)} className={`flex-1 py-2 text-sm font-medium rounded-sm border transition-colors duration-150 ${lang === l ? 'bg-gold/15 border-gold text-gold' : 'bg-surface border-border text-gray hover:border-gold/50 hover:text-gold-light'}`}>
              {l === 'en' ? 'English' : 'ಕನ್ನಡ'}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={!canGenerate || loading}
        className={`w-full py-3 text-sm font-bold rounded-sm transition-colors duration-150 ${canGenerate && !loading ? 'bg-gold text-background hover:bg-gold-light' : 'bg-surface2 border border-border text-gray cursor-not-allowed'}`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-1.5">
            Generating
            <span className="typing-dot" />
            <span className="typing-dot" style={{ animationDelay: '200ms' }} />
            <span className="typing-dot" style={{ animationDelay: '400ms' }} />
          </span>
        ) : 'Generate Notice'}
      </button>
    </div>
  )
}
