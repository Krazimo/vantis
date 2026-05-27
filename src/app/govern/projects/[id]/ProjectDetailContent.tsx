'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, XCircle } from 'lucide-react'
import projectsData from '@/data/projects.json'
import developersData from '@/data/developers.json'
import qprData from '@/data/qpr.json'
import litigationData from '@/data/litigation.json'
import type { Project, Developer, LitigationItem, QPREntry } from './_data/project-detail.types'
import { statusColor, statusDot, riskColor, riskBarColor } from './_data/project-detail.utils'
import { TABS } from './_data/project-detail.data'
import OverviewTab from './_components/OverviewTab'
import QPRTab from './_components/QPRTab'
import FinancialTab from './_components/FinancialTab'
import LitigationTab from './_components/LitigationTab'
import TimelineTab from './_components/TimelineTab'
import ActionsTab from './_components/ActionsTab'
import DocumentsTab from './_components/DocumentsTab'

export default function ProjectDetailContent({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')

  const projectMaybe = (projectsData as Project[]).find(p => p.id === params.id)

  if (!projectMaybe) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <XCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <div className="text-xl text-foreground mb-2">Project Not Found</div>
          <Link href="/govern/projects" className="text-primary text-sm hover:text-primary/80 transition-colors duration-150">
            ← Back to Registry
          </Link>
        </div>
      </div>
    )
  }

  const project: Project = projectMaybe
  const developer = (developersData as unknown as Developer[]).find(d => d.id === project.developer_id)
  const qprSub = qprData.submissions.find(s => s.project_id === project.id)
  const litigation = (litigationData as LitigationItem[]).filter(l => l.project_id === project.id)

  const qprRows = qprSub
    ? qprData.quarters.map(q => {
        const key = q.toLowerCase().replace(' ', '_')
        const entry = (qprSub as Record<string, unknown>)[key] as QPREntry
        return { quarter: q, entry }
      })
    : []

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      <Link
        href="/govern/projects"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-150 mb-5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Registry
      </Link>

      <div className="bg-card border border-border rounded-sm p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl text-foreground font-bold leading-tight mb-1">{project.name}</h1>
            <div className="font-mono text-primary text-xs mb-1.5">{project.rera}</div>
            <div className="text-muted-foreground text-xs">{project.developer_name} · {project.location}</div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`inline-flex items-center gap-1.5 text-xs ${statusColor(project.status)}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(project.status)}`} />
              {project.status}
            </span>
            <div className="text-center">
              <div className={`text-3xl font-bold leading-none ${riskColor(project.risk_score)}`}>{project.risk_score}</div>
              <div className="text-muted-foreground text-[10px] mt-0.5">Risk score</div>
            </div>
          </div>
        </div>
        <div className="mt-4 h-1.5 bg-border rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${riskBarColor(project.risk_score)}`} style={{ width: `${project.risk_score}%` }} />
        </div>
      </div>

      <div className="flex overflow-x-auto gap-0 border-b border-border mb-6 scrollbar-none">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors duration-150 -mb-px ${
              activeTab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary/80'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            {label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'overview'   && <OverviewTab project={project} developer={developer} qprRows={qprRows} />}
        {activeTab === 'qpr'        && <QPRTab project={project} qprRows={qprRows} totalQuarters={qprData.quarters.length} />}
        {activeTab === 'financial'  && <FinancialTab project={project} />}
        {activeTab === 'litigation' && <LitigationTab litigation={litigation} />}
        {activeTab === 'timeline'   && <TimelineTab projectId={project.id} />}
        {activeTab === 'actions'    && <ActionsTab project={project} />}
        {activeTab === 'documents'  && <DocumentsTab projectId={project.id} />}
      </div>
    </div>
  )
}
