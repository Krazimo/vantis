'use client'

import { useState } from 'react'
import type { Language, Tx } from '../_data/file-complaint.data'

interface Props {
  lang: Language
  tx: Tx
  onNext: (name: string, phone: string, email: string) => void
}

export default function Step1Form({ lang, tx, onNext }: Props) {
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = tx.nameErr
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) e.phone = tx.phoneErr
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = tx.emailErr
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const fields = [
    { key: 'name',  label: tx.name,  val: name,  set: setName,  type: 'text',  ph: lang === 'en' ? 'Rajesh Kumar' : 'ರಾಜೇಶ್ ಕುಮಾರ್' },
    { key: 'phone', label: tx.phone, val: phone, set: setPhone, type: 'tel',   ph: '98xxxxxxxx' },
    { key: 'email', label: tx.email, val: email, set: setEmail, type: 'email', ph: 'you@example.com' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="font-syne text-xl text-off-white mb-4">{tx.step1}</h2>
      {fields.map(f => (
        <div key={f.key}>
          <label className="block text-xs text-gray-light mb-1.5">{f.label}</label>
          <input
            type={f.type}
            value={f.val}
            onChange={e => { f.set(e.target.value); setErrors(ev => ({ ...ev, [f.key]: '' })) }}
            placeholder={f.ph}
            className={`w-full bg-surface border rounded-sm px-4 py-3 text-off-white placeholder-gray text-sm focus:outline-none focus:border-gold transition-colors duration-150 ${errors[f.key] ? 'border-red/50' : 'border-border'}`}
          />
          {errors[f.key] && <p className="text-red text-xs mt-1">{errors[f.key]}</p>}
        </div>
      ))}
      <button
        onClick={() => { if (validate()) onNext(name, phone, email) }}
        className="w-full py-3 bg-gold text-background font-semibold text-sm rounded-sm hover:bg-gold-light transition-colors duration-150 mt-2"
      >
        {tx.next}
      </button>
    </div>
  )
}
