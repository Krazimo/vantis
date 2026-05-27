'use client'

import { FlaskConical } from 'lucide-react'

interface Props {
  demoMode: boolean
  onToggle: () => void
}

export default function DemoModeSection({ demoMode, onToggle }: Props) {
  return (
    <div className="bg-card border border-border rounded-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <FlaskConical className="w-4 h-4 text-primary" />
        <h2 className="font-syne text-sm font-semibold text-foreground uppercase tracking-widest">Demo Mode</h2>
      </div>
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="text-sm text-foreground mb-1">
            Enable Demo Mode
            {demoMode && (
              <span className="ml-2 text-[10px] bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-sm font-bold">DEMO</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            When enabled, a gold DEMO badge appears in all Govern pages and chatbot defaults to
            hardcoded responses. Recommended for presentations with DK Shivakumar.
          </p>
        </div>
        <button onClick={onToggle}
          className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${demoMode ? 'bg-primary' : 'bg-muted border border-border'}`}>
          <span className={`absolute top-0.5 w-4 h-4 bg-background rounded-full shadow transition-transform duration-200 ${demoMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </div>
  )
}
