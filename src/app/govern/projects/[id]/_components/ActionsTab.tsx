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
      <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-4">Regulatory Actions</div>

      <Link
        href="/govern/notices"
        className="flex items-center justify-between w-full bg-surface2 border border-border hover:border-gold rounded-sm p-4 transition-colors duration-150 group"
      >
        <div>
          <div className="text-off-white text-sm font-medium group-hover:text-gold transition-colors duration-150">Generate Show Cause Notice</div>
          <div className="text-gray text-xs mt-0.5">AI-drafted notice with project-specific details</div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray group-hover:text-gold transition-colors duration-150 shrink-0" />
      </Link>

      <button
        onClick={() => setInspectionModal(true)}
        className="flex items-center justify-between w-full bg-surface2 border border-border hover:border-amber rounded-sm p-4 transition-colors duration-150 group text-left"
      >
        <div>
          <div className="text-off-white text-sm font-medium group-hover:text-amber transition-colors duration-150">Flag for Physical Inspection</div>
          <div className="text-gray text-xs mt-0.5">Assign inspection team · Notify field officer</div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray group-hover:text-amber transition-colors duration-150 shrink-0" />
      </button>

      <button
        onClick={() => setRrcModal(true)}
        className="flex items-center justify-between w-full bg-surface2 border border-border hover:border-red rounded-sm p-4 transition-colors duration-150 group text-left"
      >
        <div>
          <div className="text-off-white text-sm font-medium group-hover:text-red transition-colors duration-150">Initiate Recovery Proceedings (RRC)</div>
          <div className="text-gray text-xs mt-0.5">Begin formal recovery action under RERA</div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray group-hover:text-red transition-colors duration-150 shrink-0" />
      </button>

      <button
        onClick={() => {
          setWatchlisted(w => !w)
          setWatchConfirm(true)
          setTimeout(() => setWatchConfirm(false), 2500)
        }}
        className={`flex items-center justify-between w-full border rounded-sm p-4 transition-colors duration-150 group text-left ${watchlisted ? 'bg-gold/10 border-gold' : 'bg-surface2 border-border hover:border-gold'}`}
      >
        <div>
          <div className={`text-sm font-medium transition-colors duration-150 ${watchlisted ? 'text-gold' : 'text-off-white group-hover:text-gold'}`}>
            {watchlisted ? '★ On Watchlist' : 'Add to Watchlist'}
          </div>
          <div className="text-gray text-xs mt-0.5">
            {watchlisted ? 'You are monitoring this project' : 'Get alerts when risk indicators change'}
          </div>
        </div>
        {watchConfirm && (
          <span className="text-green text-xs font-medium shrink-0">{watchlisted ? 'Added ✓' : 'Removed'}</span>
        )}
      </button>

      {inspectionModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setInspectionModal(false)}>
          <div className="bg-surface border border-border rounded-sm p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="font-syne text-off-white text-base mb-2">Flag for Inspection?</div>
            <div className="text-gray text-sm mb-4 leading-relaxed">
              An inspection request will be logged for <strong className="text-off-white">{project.name}</strong> and the assigned field officer will be notified.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setInspectionModal(false)} className="flex-1 bg-amber/15 border border-amber/40 text-amber text-sm py-2 rounded-sm hover:bg-amber/25 transition-colors duration-150">Confirm</button>
              <button onClick={() => setInspectionModal(false)} className="flex-1 bg-surface2 border border-border text-gray text-sm py-2 rounded-sm hover:text-off-white transition-colors duration-150">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {rrcModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setRrcModal(false)}>
          <div className="bg-surface border border-border rounded-sm p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="font-syne text-off-white text-base mb-2">Initiate RRC?</div>
            <div className="text-gray text-sm mb-4 leading-relaxed">
              This will begin formal Recovery Proceedings against <strong className="text-off-white">{project.developer_name}</strong> under RERA. This action is recorded and cannot be undone.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRrcModal(false)} className="flex-1 bg-red/15 border border-red/40 text-red text-sm py-2 rounded-sm hover:bg-red/25 transition-colors duration-150">Initiate RRC</button>
              <button onClick={() => setRrcModal(false)} className="flex-1 bg-surface2 border border-border text-gray text-sm py-2 rounded-sm hover:text-off-white transition-colors duration-150">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
