'use client'

import { TrendingDown, AlertTriangle } from 'lucide-react'
import PredictiveTable from './_components/PredictiveTable'

export default function PredictiveDefault() {
  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl sm:text-3xl text-foreground">Predictive Default Analytics</h1>
        <TrendingDown className="w-6 h-6 text-muted-foreground hidden sm:block" />
      </div>
      <p className="text-muted-foreground text-xs mb-6">
        Projects ranked by probability of default in next 4 quarters · Powered by QPR patterns, escrow velocity, litigation accumulation, and sales velocity
      </p>

      <div className="border border-primary/40 bg-primary/5 rounded-sm px-5 py-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">Vantis Early Detection · Case Study</div>
            <div className="text-foreground text-sm leading-relaxed">
              Ozone Urbana would have been flagged at{' '}
              <span className="text-status-caution font-bold">34% default probability</span> in{' '}
              <span className="text-primary font-semibold">Q1 2021</span> —{' '}
              <span className="font-bold text-status-risk">8 quarters before</span> the FIR was filed in Q3 2023.
              1,847 homebuyers and ₹927 Cr could have been protected.
            </div>
          </div>
        </div>
      </div>

      <PredictiveTable />
    </div>
  )
}
