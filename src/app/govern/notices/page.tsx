'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
import { PROJECTS, type ViolationValue } from './_data/notices.data'
import { generateNoticeText } from './_data/notices.utils'
import NoticeForm from './_components/NoticeForm'
import NoticePreview from './_components/NoticePreview'

export default function NoticeGenerator() {
  const [violationType, setViolationType] = useState<ViolationValue | ''>('')
  const [projectId,     setProjectId]     = useState('')
  const [lang,          setLang]          = useState<'en' | 'kn'>('en')
  const [loading,       setLoading]       = useState(false)
  const [noticeText,    setNoticeText]    = useState<string | null>(null)
  const [copied,        setCopied]        = useState(false)

  const selectedProject = PROJECTS.find(p => p.id === projectId) ?? null

  function handleGenerate() {
    if (!violationType || !projectId || !selectedProject) return
    setLoading(true)
    setNoticeText(null)
    setTimeout(() => {
      setLoading(false)
      setNoticeText(generateNoticeText(selectedProject, violationType, lang))
    }, 1500)
  }

  function handleCopy() {
    if (!noticeText) return
    navigator.clipboard.writeText(noticeText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne text-2xl sm:text-3xl text-off-white">AI Notice Generator</h1>
          <p className="text-gray text-xs mt-1">Draft regulatory notices · Powered by Vantis Intelligence</p>
        </div>
        <FileText className="w-6 h-6 text-gray hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2">
          <NoticeForm
            violationType={violationType}
            projectId={projectId}
            lang={lang}
            loading={loading}
            onViolationChange={v => { setViolationType(v); setNoticeText(null) }}
            onProjectChange={id => { setProjectId(id); setNoticeText(null) }}
            onLangChange={l => { setLang(l); setNoticeText(null) }}
            onGenerate={handleGenerate}
          />
        </div>
        <div className="lg:col-span-3">
          <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-2">Notice Preview</div>
          <NoticePreview
            noticeText={noticeText}
            loading={loading}
            copied={copied}
            onCopy={handleCopy}
            onPrint={() => window.print()}
          />
        </div>
      </div>
    </div>
  )
}
