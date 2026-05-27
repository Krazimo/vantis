import { CheckCircle2 } from 'lucide-react'

interface Props {
  steps: string[]
  currentStep: number
}

export default function StepIndicator({ steps, currentStep }: Props) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const n = i + 1
        const done = currentStep > n
        const active = currentStep === n
        return (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              done   ? 'bg-primary text-background' :
              active ? 'bg-primary/20 border-2 border-primary text-primary' :
                       'bg-muted border border-border text-muted-foreground'
            }`}>
              {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
            </div>
            <span className={`text-xs hidden sm:inline truncate ${active ? 'text-primary' : done ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
              {label}
            </span>
            {i < steps.length - 1 && <div className={`flex-1 h-px mx-1 ${done ? 'bg-primary/40' : 'bg-border'}`} />}
          </div>
        )
      })}
    </div>
  )
}
