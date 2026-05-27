'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { MessageSquare, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { findResponse, GOVERN_SUGGESTIONS, PUBLIC_SUGGESTIONS, type Message } from './chatbot.utils'
import ChatPanel from './ChatPanel'

export default function VantisIntelligence() {
  const pathname = usePathname()
  const isGovern = pathname.startsWith('/govern')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState<'demo' | 'live'>('demo')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  async function handleSend(text?: string) {
    const query = (text ?? input).trim()
    if (!query || isTyping) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: query }])
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsTyping(false)
    setMessages(prev => [...prev, { role: 'assistant', content: findResponse(query, isGovern) }])
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed bottom-[4.5rem] right-4 sm:bottom-[5rem] sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] bg-surface border border-border rounded-sm flex flex-col overflow-hidden"
            style={{ maxWidth: '380px' }}
          >
            <ChatPanel
              panelTitle={isGovern ? 'Vantis Intelligence' : 'Vantis Assistant'}
              panelSub={isGovern ? 'K-RERA Officer Assistant' : 'Karnataka Homebuyer Assistant'}
              mode={mode}
              onToggleMode={() => setMode(m => m === 'demo' ? 'live' : 'demo')}
              onClose={() => setOpen(false)}
              messages={messages}
              isTyping={isTyping}
              input={input}
              setInput={setInput}
              onSend={handleSend}
              suggestions={isGovern ? GOVERN_SUGGESTIONS : PUBLIC_SUGGESTIONS}
              inputRef={inputRef}
              messagesEndRef={messagesEndRef}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open Vantis Intelligence"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full bg-gold hover:bg-gold-light transition-colors duration-150 flex items-center justify-center"
      >
        {!open && messages.length === 0 && (
          <span className="absolute inset-0 rounded-full animate-ping bg-gold opacity-30 pointer-events-none" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5 text-background" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageSquare className="w-5 h-5 text-background" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </>
  )
}
