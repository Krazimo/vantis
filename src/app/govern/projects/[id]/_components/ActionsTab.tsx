'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Project } from '../_data/project-detail.types'

interface Props { project: Project }

export default function ActionsTab({ project }: Props) {
  const [watchlisted, setWatchlisted] = useState(false)
  const [watchConfirm, setWatchConfirm] = useState(false)
  const [inspectionModal, setInspectionModal] = useState(false)
  const [rrcModal, setRrcModal] = useState(false)

  return (
    <div className="space-y-3">
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-4">Regulatory Actions</div>

      <Link
        href="/govern/notices"
        className="flex items-center justify-between w-full bg-muted border border-border hover:border-primary rounded-sm p-4 transition-colors duration-150 group"
      >
        <div>
          <div className="text-foreground text-sm font-medium group-hover:text-primary transition-colors duration-150">Generate Show Cause Notice</div>
          <div className="text-muted-foreground text-xs mt-0.5">AI-drafted notice with project-specific details</div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-150 shrink-0" />
      </Link>

      <button
        onClick={() => setInspectionModal(true)}
        className="flex items-center justify-between w-full bg-muted border border-border hover:border-status-caution rounded-sm p-4 transition-colors duration-150 group text-left"
      >
        <div>
          <div className="text-foreground text-sm font-medium group-hover:text-status-caution transition-colors duration-150">Flag for Physical Inspection</div>
          <div className="text-muted-foreground text-xs mt-0.5">Assign inspection team · Notify field officer</div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-status-caution transition-colors duration-150 shrink-0" />
      </button>

      <button
        onClick={() => setRrcModal(true)}
        className="flex items-center justify-between w-full bg-muted border border-border hover:border-status-risk rounded-sm p-4 transition-colors duration-150 group text-left"
      >
        <div>
          <div className="text-foreground text-sm font-medium group-hover:text-status-risk transition-colors duration-150">Initiate Recovery Proceedings (RRC)</div>
          <div className="text-muted-foreground text-xs mt-0.5">Begin formal recovery action under RERA</div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-status-risk transition-colors duration-150 shrink-0" />
      </button>

      <button
        onClick={() => {
          setWatchlisted(w => !w)
          setWatchConfirm(true)
          setTimeout(() => setWatchConfirm(false), 2500)
        }}
        className={`flex items-center justify-between w-full border rounded-sm p-4 transition-colors duration-150 group text-left ${watchlisted ? 'bg-primary/10 border-primary' : 'bg-muted border-border hover:border-primary'}`}
      >
        <div>
          <div className={`text-sm font-medium transition-colors duration-150 ${watchlisted ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
            {watchlisted ? '★ On Watchlist' : 'Add to Watchlist'}
          </div>
          <div className="text-muted-foreground text-xs mt-0.5">
            {watchlisted ? 'You are monitoring this project' : 'Get alerts when risk indicators change'}
          </div>
        </div>
        {watchConfirm && (
          <span className="text-status-compliant text-xs font-medium shrink-0">{watchlisted ? 'Added ✓' : 'Removed'}</span>
        )}
      </button>

      {inspectionModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setInspectionModal(false)}>
          <div className="bg-card border border-border rounded-sm p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="font-syne text-foreground text-base mb-2">Flag for Inspection?</div>
            <div className="text-muted-foreground text-sm mb-4 leading-relaxed">
              An inspection request will be logged for <strong className="text-foreground">{project.name}</strong> and the assigned field officer will be notified.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setInspectionModal(false)} className="flex-1 bg-status-caution/15 border border-status-caution/40 text-status-caution text-sm py-2 rounded-sm hover:bg-status-caution/25 transition-colors duration-150">Confirm</button>
              <button onClick={() => setInspectionModal(false)} className="flex-1 bg-muted border border-border text-muted-foreground text-sm py-2 rounded-sm hover:text-foreground transition-colors duration-150">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {rrcModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setRrcModal(false)}>
          <div className="bg-card border border-border rounded-sm p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="font-syne text-foreground text-base mb-2">Initiate RRC?</div>
            <div className="text-muted-foreground text-sm mb-4 leading-relaxed">
              This will begin formal Recovery Proceedings against <strong className="text-foreground">{project.developer_name}</strong> under RERA. This action is recorded and cannot be undone.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRrcModal(false)} className="flex-1 bg-status-risk/15 border border-status-risk/40 text-status-risk text-sm py-2 rounded-sm hover:bg-status-risk/25 transition-colors duration-150">Initiate RRC</button>
              <button onClick={() => setRrcModal(false)} className="flex-1 bg-muted border border-border text-muted-foreground text-sm py-2 rounded-sm hover:text-foreground transition-colors duration-150">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
