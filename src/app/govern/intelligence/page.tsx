import { Sparkles } from 'lucide-react'
import { PageShell } from '@/features/govern/components/PageShell'

export default function GovernIntelligence() {
  return (
    <PageShell title="Vantis Intelligence" subtitle="K-RERA AI Assistant">
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <Sparkles className="text-primary mx-auto mb-4 h-8 w-8" />
          <p className="text-foreground text-lg">Coming soon</p>
          <p className="text-muted-foreground mt-1 text-sm">
            The full-page Vantis Intelligence assistant is on its way.
          </p>
        </div>
      </div>
    </PageShell>
  )
}
