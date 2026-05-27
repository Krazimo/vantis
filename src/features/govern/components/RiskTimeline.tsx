'use client'

import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { TIMELINE, ozoneData, type TimelinePoint } from './risk-timeline.data'
import RiskDetailPanel from './RiskDetailPanel'

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: TimelinePoint }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-muted border border-border rounded-sm px-3 py-2 text-xs shadow-lg">
      <div className="text-primary font-semibold mb-1">{d.quarter}</div>
      <div className="text-foreground mb-0.5">
        Score: <span className={`font-mono font-bold ${d.score >= 40 ? 'text-status-caution' : 'text-status-risk'}`}>{d.score}</span>
      </div>
      <div className="text-muted-foreground">Default prob: <span className="text-status-risk font-mono font-bold">{d.default_probability}%</span></div>
    </div>
  )
}

function ScoreDot(props: {
  cx?: number; cy?: number; index?: number;
  payload?: TimelinePoint; selectedQ: string | null; onSelect: (q: string) => void
}) {
  const { cx, cy, payload, selectedQ, onSelect } = props
  if (cx == null || cy == null || !payload) return null
  const isSelected = selectedQ === payload.quarter
  const color = payload.score >= 40 ? '#F39C12' : '#E74C3C'
  return (
    <circle cx={cx} cy={cy} r={isSelected ? 7 : 5}
      fill={isSelected ? color : '#0E0E1A'} stroke={color}
      strokeWidth={isSelected ? 2.5 : 1.5}
      style={{ cursor: 'pointer', transition: 'r 0.15s, fill 0.15s' }}
      onClick={() => onSelect(payload.quarter)}
    />
  )
}

export default function RiskTimeline() {
  const [selectedQ, setSelectedQ] = useState<string | null>('Q1 2022')
  const selectedPoint = TIMELINE.find(d => d.quarter === selectedQ) ?? null

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-status-risk/10 border border-status-risk/20 rounded-sm p-3 text-center">
          <div className="font-syne text-status-risk text-2xl font-bold">{ozoneData.quarters_early_warning}</div>
          <div className="text-muted-foreground text-xs mt-1">Quarters early warning</div>
        </div>
        <div className="bg-status-risk/10 border border-status-risk/20 rounded-sm p-3 text-center">
          <div className="font-syne text-status-risk text-2xl font-bold">{ozoneData.homebuyers_affected.toLocaleString('en-IN')}</div>
          <div className="text-muted-foreground text-xs mt-1">Homebuyers at risk</div>
        </div>
        <div className="bg-status-risk/10 border border-status-risk/20 rounded-sm p-3 text-center">
          <div className="font-syne text-status-risk text-2xl font-bold">₹{ozoneData.capital_at_risk_crore} Cr</div>
          <div className="text-muted-foreground text-xs mt-1">Capital at risk</div>
        </div>
        <div className="bg-status-caution/10 border border-status-caution/20 rounded-sm p-3 text-center">
          <div className="font-syne text-status-caution text-2xl font-bold">{ozoneData.fir_filed}</div>
          <div className="text-muted-foreground text-xs mt-1">FIR filed</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-semibold">Vantis Risk Score · 8-Quarter Trajectory</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#F39C12" stopOpacity={1} />
                  <stop offset="20%"  stopColor="#E86A2B" stopOpacity={1} />
                  <stop offset="100%" stopColor="#E74C3C" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#F39C12" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#E74C3C" stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="probAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#E74C3C" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#E74C3C" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,42,62,0.8)" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fill: 'rgba(107,107,136,0.8)', fontSize: 10 }} axisLine={{ stroke: 'rgba(42,42,62,0.6)' }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'rgba(107,107,136,0.8)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={40} stroke="#F39C12" strokeDasharray="4 3" strokeOpacity={0.5} label={{ value: 'CAUTION', fill: '#F39C12', fontSize: 9, position: 'insideTopRight' }} />
              <ReferenceLine x="Q1 2022" stroke="#E74C3C" strokeDasharray="4 3" strokeOpacity={0.6} label={{ value: '80% default', fill: '#E74C3C', fontSize: 9, position: 'top' }} />
              <Area type="monotone" dataKey="default_probability" stroke="#E74C3C" strokeWidth={1} strokeOpacity={0.35} fill="url(#probAreaGrad)" dot={false} activeDot={false} isAnimationActive animationDuration={1500} name="Default %" />
              <Area type="monotone" dataKey="score" stroke="url(#scoreLineGrad)" strokeWidth={2.5} fill="url(#scoreAreaGrad)"
                dot={(props: object) => {
                  const p = props as { cx?: number; cy?: number; index?: number; payload?: TimelinePoint }
                  return <ScoreDot key={p.index} {...p} selectedQ={selectedQ} onSelect={q => setSelectedQ(prev => prev === q ? null : q)} />
                }}
                activeDot={false} isAnimationActive animationDuration={1500} name="Risk Score"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <div className="flex items-center gap-1.5"><div className="w-6 h-0.5 bg-gradient-to-r from-amber to-red" /><span className="text-muted-foreground text-[10px]">Risk Score</span></div>
            <div className="flex items-center gap-1.5"><div className="w-6 h-0.5 bg-status-risk opacity-40" /><span className="text-muted-foreground text-[10px]">Default Probability</span></div>
            <span className="text-muted-foreground text-[10px] ml-auto">← Click a point for details</span>
          </div>
        </div>
        <div className="lg:col-span-2">
          <RiskDetailPanel point={selectedPoint} />
        </div>
      </div>
    </div>
  )
}
