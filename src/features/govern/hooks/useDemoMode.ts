'use client'
import { useState, useEffect } from 'react'

export function useDemoMode() {
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem('vantis_demo_mode') === 'true') setDemoMode(true)
    } catch (error) { console.warn('vantis_demo_mode localStorage read unavailable:', error) }

    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setDemoMode(prev => {
          const next = !prev
          try { localStorage.setItem('vantis_demo_mode', String(next)) } catch (err) { console.warn('vantis_demo_mode localStorage write unavailable:', err) }
          return next
        })
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  function toggleDemoMode() {
    setDemoMode(prev => {
      const next = !prev
      try { localStorage.setItem('vantis_demo_mode', String(next)) } catch (error) { console.warn('vantis_demo_mode localStorage write unavailable:', error) }
      return next
    })
  }

  return { demoMode, toggleDemoMode }
}
