'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { OFFICERS, type Officer } from '../_data/govern-layout.data'

interface Props {
  onLogin: (o: Officer) => void
}

export default function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const officer = OFFICERS[email.toLowerCase()]
    if (officer && officer.password === password) {
      onLogin({ email: email.toLowerCase(), name: officer.name, role: officer.role })
    } else {
      setError('Invalid credentials. Check your email and password.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-2xl text-primary">Vantis Govern</span>
          </div>
          <div className="text-muted-foreground text-sm">K-RERA Officer Portal</div>
          <div className="text-muted-foreground text-xs mt-0.5">Karnataka Real Estate Regulatory Authority</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Officer Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="officer@krera.gov.in" required
              className="w-full bg-card border border-border rounded-sm px-4 py-3 text-foreground placeholder-gray text-sm focus:outline-none focus:border-primary transition-colors duration-150" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="••••••••" required
              className="w-full bg-card border border-border rounded-sm px-4 py-3 text-foreground placeholder-gray text-sm focus:outline-none focus:border-primary transition-colors duration-150" />
          </div>
          {error && <div className="text-status-risk text-xs px-3 py-2 bg-status-risk/10 border border-status-risk/20 rounded-sm">{error}</div>}
          <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-background font-semibold text-sm py-3 rounded-sm transition-colors duration-150">
            Sign In to Govern
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-150">← Back to Public Portal</Link>
        </div>

        <div className="mt-8 bg-card border border-border rounded-sm p-4">
          <div className="text-muted-foreground text-xs mb-2">Demo credentials — password: demo</div>
          <div className="font-mono text-xs space-y-1">
            <div className="text-primary">chairman@krera.gov.in</div>
            <div className="text-blue">technical@krera.gov.in</div>
            <div className="text-status-risk">legal@krera.gov.in</div>
            <div className="text-muted-foreground">secretary@krera.gov.in</div>
          </div>
        </div>
      </div>
    </div>
  )
}
