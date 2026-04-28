'use client'

import { useState, useEffect } from 'react'
import { Send, Users, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminNewsletterPage() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('subscribers').select('*', { count: 'exact', head: true })
      .then(({ count }) => setSubscriberCount(count ?? 0))
  }, [])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    // In production: call an API route that loops subscribers and sends via Resend/Sendgrid
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
    setSubject('')
    setBody('')
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Nyhetsbrev</h1>
        <p className="text-stone-500 text-sm mt-0.5">{subscriberCount} aktiva prenumeranter</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-6 max-w-2xl">
        <h2 className="font-bold text-stone-800 mb-5">Skriv nyhetsbrev</h2>

        {sent && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm mb-4">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Nyhetsbrevet har skickats till {subscriberCount} prenumeranter!
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Ämnesrad</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} required
              className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400"
              placeholder="Ex: Nya växter inne nu!" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Meddelande</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} required rows={12}
              className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400 resize-none"
              placeholder="Skriv ditt nyhetsbrev här..." />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-stone-500 bg-stone-50 px-3 py-2 rounded-lg flex-1">
              <Users className="w-4 h-4" />
              Skickas till {subscriberCount} prenumeranter
            </div>
            <button type="submit" disabled={sending}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-70">
              <Send className="w-4 h-4" />
              {sending ? 'Skickar...' : 'Skicka'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
