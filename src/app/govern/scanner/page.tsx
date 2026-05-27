'use client'

import { useState } from 'react'
import { ScanLine } from 'lucide-react'
import { APPLICATIONS } from './_data/scanner.data'
import ScannerQueue from './_components/ScannerQueue'
import AssessmentCard from './_components/AssessmentCard'
import ScannerModals from './_components/ScannerModals'
import ApprovalSuccess from './_components/ApprovalSuccess'
import { PageShell } from '@/features/govern/components/PageShell'

export default function SubmissionScanner() {
  const [selectedId,      setSelectedId]      = useState<string>(APPLICATIONS[2].id)
  const [approveModal,    setApproveModal]    = useState(false)
  const [rejectModal,     setRejectModal]     = useState(false)
  const [conditionsModal, setConditionsModal] = useState(false)
  const [approved,        setApproved]        = useState(false)
  const [approvedAt,      setApprovedAt]      = useState<Date | null>(null)

  const app = APPLICATIONS.find(a => a.id === selectedId) ?? APPLICATIONS[0]
  const failCount    = app.verifications.filter(v => v.result === 'FAIL').length
  const warningCount = app.verifications.filter(v => v.result === 'WARNING').length

  const closeModals = () => {
    setApproveModal(false)
    setRejectModal(false)
    setConditionsModal(false)
  }

  if (approved && approvedAt) {
    return (
      <ApprovalSuccess
        approvedAt={approvedAt}
        onReset={() => { setApproved(false); setApprovedAt(null); setSelectedId(APPLICATIONS[2].id) }}
      />
    )
  }

  return (
    <PageShell
      title="Submission Scanner"
      subtitle="Pre-assessment queue · 5-database verification"
      icon={
        <div className="hidden sm:flex items-center gap-2 text-muted-foreground text-xs">
          <ScanLine className="w-4 h-4" />
          {APPLICATIONS.length} pending
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">Pending Queue</div>
          <ScannerQueue apps={APPLICATIONS} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="lg:col-span-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">Pre-Assessment Report</div>
          <AssessmentCard
            app={app}
            failCount={failCount}
            warningCount={warningCount}
            onApprove={() => setApproveModal(true)}
            onReject={() => setRejectModal(true)}
            onConditions={() => setConditionsModal(true)}
          />
        </div>
      </div>

      <ScannerModals
        app={app}
        approveModal={approveModal}
        rejectModal={rejectModal}
        conditionsModal={conditionsModal}
        onConfirmApprove={() => { closeModals(); setApproved(true); setApprovedAt(new Date()) }}
        onConfirmReject={closeModals}
        onConfirmConditions={closeModals}
        onClose={closeModals}
      />
    </PageShell>
  )
}
