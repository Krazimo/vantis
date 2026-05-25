'use client'

import { X, Send } from 'lucide-react'
import { type RefObject } from 'react'
import { type Message } from './chatbot.utils'

interface Props {
  panelTitle: string
  panelSub: string
  mode: 'demo' | 'live'
  onToggleMode: () => void
  onClose: () => void
  messages: Message[]
  isTyping: boolean
  input: string
  setInput: (v: string) => void
  onSend: (text?: string) => void
  suggestions: string[]
  inputRef: RefObject<HTMLInputElement | null>
  messagesEndRef: RefObject<HTMLDivElement | null>
}

export default function ChatPanel({
  panelTitle, panelSub, mode, onToggleMode, onClose,
  messages, isTyping, input, setInput, onSend,
  suggestions, inputRef, messagesEndRef,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0 bg-surface2">
        <div>
          <div className="font-syne text-sm text-gold">{panelTitle}</div>
          <div className="text-gray text-xs mt-0.5">{panelSub}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleMode} className={`text-[10px] px-2 py-1 rounded border transition-colors duration-150 font-mono tracking-wider ${
            mode === 'demo' ? 'border-border text-gray-light hover:border-gold-dim hover:text-gold' : 'border-blue/50 text-blue'
          }`}>{mode === 'demo' ? 'DEMO' : 'LIVE'}</button>
          <button onClick={onClose} className="text-gray hover:text-gold transition-colors duration-150 ml-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {mode === 'live' && (
        <div className="px-4 py-2 bg-blue/10 border-b border-blue/20 shrink-0">
          <div className="text-blue text-xs">Live AI mode — coming soon. Responses from demo dataset.</div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="text-gray text-xs text-center mb-4">Try asking:</div>
            {suggestions.map(s => (
              <button key={s} onClick={() => onSend(s)} disabled={isTyping}
                className="w-full text-left text-xs text-gray-light border border-border rounded-sm px-3 py-2.5 hover:border-gold hover:text-gold transition-colors duration-150 disabled:opacity-50">
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] text-xs rounded-sm px-3 py-2.5 leading-relaxed ${
              m.role === 'user' ? 'bg-surface2 text-off-white' : 'bg-background border border-border text-off-white'
            }`}>
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">{m.content}</pre>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-background border border-border rounded-sm px-4 py-3 flex items-center gap-1.5">
              <span className="typing-dot inline-block w-2 h-2 rounded-full bg-gold" style={{ animationDelay: '0ms' }} />
              <span className="typing-dot inline-block w-2 h-2 rounded-full bg-gold" style={{ animationDelay: '200ms' }} />
              <span className="typing-dot inline-block w-2 h-2 rounded-full bg-gold" style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2">
          <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSend()}
            placeholder="Ask anything about K-RERA..."
            className="flex-1 bg-background border border-border rounded-sm px-3 py-2 text-off-white placeholder-gray text-xs focus:outline-none focus:border-gold transition-colors duration-150"
          />
          <button onClick={() => onSend()} disabled={!input.trim() || isTyping}
            className="p-2 text-gold hover:text-gold-light disabled:text-gray disabled:cursor-not-allowed transition-colors duration-150">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}
