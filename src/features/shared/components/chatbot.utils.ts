import chatbotData from '@/data/chatbot-responses.json'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export const GOVERN_SUGGESTIONS = [
  'Show QPR defaulters this quarter',
  'Which projects are at risk of default',
  'Draft a show cause notice',
]

export const PUBLIC_SUGGESTIONS = [
  'Is Ozone Urbana safe to buy',
  'What are my rights if possession is delayed',
  'How do I file a complaint',
]

export function findResponse(query: string, isGovern: boolean): string {
  const q = query.toLowerCase()
  for (const r of chatbotData.responses) {
    for (const kw of r.keywords) {
      if (q.includes(kw.toLowerCase())) return r.response
    }
  }
  return isGovern ? chatbotData.fallback_govern : chatbotData.fallback_public
}
