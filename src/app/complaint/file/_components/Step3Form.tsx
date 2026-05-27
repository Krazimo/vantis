'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import type { Language, Tx } from '../_data/file-complaint.data'

interface Props {
  lang: Language
  tx: Tx
  onNext: () => void
  onBack: () => void
}

export default function Step3Form({ lang, tx, onNext, onBack }: Props) {
  const [text, setText] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    if (text.trim().length < 50) {
      setErrors({ text: tx.minChars })
      return false
    }
    return true
  }

  return (
    <div className="space-y-5">
      <h2 className="font-syne text-xl text-foreground mb-4">{tx.step3}</h2>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-muted-foreground">{tx.complaintText}</label>
          <span className={`text-xs font-mono ${text.length < 50 ? 'text-muted-foreground' : text.length > 2000 ? 'text-status-risk' : 'text-status-compliant'}`}>
            {text.length} / 2000 {tx.charCount}
          </span>
        </div>
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); setErrors({}) }}
          rows={6}
          placeholder={lang === 'en'
            ? 'Describe your complaint in detail. Include dates, amounts, and any communications with the developer…'
            : 'ನಿಮ್ಮ ದೂರನ್ನು ವಿವರವಾಗಿ ವಿವರಿಸಿ. ದಿನಾಂಕಗಳು, ಮೊತ್ತಗಳು ಮತ್ತು ಡೆವಲಪರ್‌ನೊಂದಿಗಿನ ಯಾವುದೇ ಸಂಪರ್ಕಗಳನ್ನು ಸೇರಿಸಿ…'
          }
          className={`w-full bg-card border rounded-sm px-4 py-3 text-foreground placeholder-gray text-sm focus:outline-none focus:border-primary transition-colors duration-150 resize-none ${errors.text ? 'border-status-risk/50' : 'border-border'}`}
        />
        {errors.text && <p className="text-status-risk text-xs mt-1">{errors.text}</p>}
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-1.5">{tx.photoUpload}</label>
        <div className="border-2 border-dashed border-border rounded-sm p-6 text-center hover:border-primary/40 transition-colors duration-150 cursor-pointer">
          <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <div className="text-muted-foreground text-sm mb-1">{tx.photoDrag}</div>
          <div className="text-muted-foreground text-xs">{tx.photoSub}</div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 py-3 border border-border text-muted-foreground text-sm rounded-sm hover:text-foreground transition-colors duration-150">{tx.back}</button>
        <button onClick={() => { if (validate()) onNext() }}
          className="flex-1 py-3 bg-primary text-background font-semibold text-sm rounded-sm hover:bg-primary/80 transition-colors duration-150">{tx.submit}</button>
      </div>
    </div>
  )
}
