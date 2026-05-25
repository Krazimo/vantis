'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { PROJECTS, NATURES, type Language, type Tx, type Project } from '../_data/file-complaint.data'

interface Props {
  lang: Language
  tx: Tx
  onNext: (project: Project, nature: string) => void
  onBack: () => void
}

export default function Step2Form({ lang, tx, onNext, onBack }: Props) {
  const [projectSearch, setProjectSearch] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [nature, setNature] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filteredProjects = useMemo(() =>
    projectSearch.length >= 2
      ? PROJECTS.filter(p => p.name.toLowerCase().includes(projectSearch.toLowerCase()))
      : [],
    [projectSearch]
  )

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!selectedProject) e.project = tx.projectErr
    if (!nature) e.nature = tx.natureErr
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="space-y-5">
      <h2 className="font-syne text-xl text-off-white mb-4">{tx.step2}</h2>

      <div>
        <label className="block text-xs text-gray-light mb-1.5">{lang === 'en' ? 'Project' : 'ಯೋಜನೆ'}</label>
        {selectedProject ? (
          <div className="bg-surface border border-gold/30 rounded-sm px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-off-white text-sm font-medium">{selectedProject.name}</div>
              <div className="text-gray text-xs">{selectedProject.developer_name} · {selectedProject.location}</div>
            </div>
            <button onClick={() => { setSelectedProject(null); setProjectSearch('') }} className="text-gray hover:text-gold transition-colors duration-150 text-xs">
              {lang === 'en' ? 'Change' : 'ಬದಲಾಯಿಸಿ'}
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
            <input type="text" value={projectSearch} onChange={e => setProjectSearch(e.target.value)}
              placeholder={tx.searchProject}
              className={`w-full bg-surface border rounded-sm pl-9 pr-4 py-3 text-off-white placeholder-gray text-sm focus:outline-none focus:border-gold transition-colors duration-150 ${errors.project ? 'border-red/50' : 'border-border'}`}
            />
            {filteredProjects.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-sm z-10 overflow-hidden">
                {filteredProjects.map(p => (
                  <button key={p.id} onClick={() => { setSelectedProject(p); setProjectSearch(''); setErrors(e => ({ ...e, project: '' })) }}
                    className="w-full text-left px-4 py-2.5 hover:bg-surface2 border-b border-border last:border-0 transition-colors duration-150">
                    <div className="text-off-white text-sm">{p.name}</div>
                    <div className="text-gray text-xs">{p.developer_name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {errors.project && <p className="text-red text-xs mt-1">{errors.project}</p>}
      </div>

      <div>
        <label className="block text-xs text-gray-light mb-2">{tx.nature}</label>
        <div className="grid grid-cols-2 gap-2">
          {NATURES.map(n => (
            <button key={n.key} onClick={() => { setNature(n.key); setErrors(e => ({ ...e, nature: '' })) }}
              className={`px-3 py-3.5 rounded-sm border text-sm text-center transition-colors duration-150 ${nature === n.key ? 'bg-gold/15 border-gold text-gold font-medium' : 'bg-surface border-border text-gray-light hover:border-gold/50 hover:text-gold'}`}>
              {n[lang]}
            </button>
          ))}
        </div>
        {errors.nature && <p className="text-red text-xs mt-1">{errors.nature}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 py-3 border border-border text-gray text-sm rounded-sm hover:text-off-white transition-colors duration-150">{tx.back}</button>
        <button onClick={() => { if (validate() && selectedProject) onNext(selectedProject, nature) }}
          className="flex-1 py-3 bg-gold text-background font-semibold text-sm rounded-sm hover:bg-gold-light transition-colors duration-150">{tx.next}</button>
      </div>
    </div>
  )
}
