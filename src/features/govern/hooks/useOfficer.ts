'use client'
import { useState, useEffect } from 'react'

export interface Officer { email: string; name: string; role: string }

export function useOfficer() {
  const [mounted, setMounted] = useState(false)
  const [officer, setOfficer] = useState<Officer | null>(null)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('vantis_officer')
      if (stored) setOfficer(JSON.parse(stored) as Officer)
    } catch (error) { console.warn('vantis_officer localStorage read unavailable:', error) }
  }, [])

  function saveOfficer(o: Officer) {
    try { localStorage.setItem('vantis_officer', JSON.stringify(o)) } catch (error) { console.warn('vantis_officer localStorage write unavailable:', error) }
    setOfficer(o)
  }

  function clearOfficer() {
    try { localStorage.removeItem('vantis_officer') } catch (error) { console.warn('vantis_officer localStorage clear unavailable:', error) }
    setOfficer(null)
  }

  return { mounted, officer, saveOfficer, clearOfficer }
}
