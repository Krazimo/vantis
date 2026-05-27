'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { TrendingDown, ChevronRight } from 'lucide-react'

const RiskTimeline = dynamic(() => import('@/features/govern/components/RiskTimeline'), { ssr: false })

interface Props { projectId: string }

export default function TimelineTab({ projectId }: Props) {
  if (projectId !== 'ozone-urbana') {
    return (
      <div className="bg-surface2 border border-border rounded-sm p-8 text-center">
        <TrendingDown className="w-10 h-10 text-gray mx-auto mb-3" />
        <div className="text-off-white text-sm font-medium mb-2">Insufficient Data for Prediction</div>
        <div className="text-gray text-xs max-w-sm mx-auto leading-relaxed mb-5">
          Vantis Risk Timeline requires at least 3 consecutive distress signals. This project does not currently meet the threshold.
        </div>
        <div className="border border-border rounded-sm p-4 text-left max-w-md mx-auto">
          <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-2">Ozone Urbana — Case Study</div>
          <div className="text-gray text-xs leading-relaxed">
            Vantis detected collapse 8 quarters before FIR was filed. Risk score declined from 42 → 9 across
            8 quarters, default probability rose to 97%. 1,847 homebuyers and ₹927 Cr protected if action had been taken early.
          </div>
          <Link href="/govern/projects/ozone-urbana" className="inline-flex items-center gap-1 text-gold text-xs mt-3 hover:text-gold-light transition-colors duration-150">
            View Ozone Urbana timeline <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    )
  }
  return <RiskTimeline />
}
