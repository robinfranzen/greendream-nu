'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('Lösenordet måste vara minst 6 tecken.'); return }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Insert into customers table
    if (data.user) {
      await supabase.from('customers').upsert({
        id: data.user.id,
        email,
        full_name: name,
        is_admin: false,
      })
    }

    router.push('/konto')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9f6] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold text-stone-800 hover:text-green-700 transition-colors">
            GreenDream
          </Link>
          <h1 className="text-2xl font-semibold text-stone-800 mt-6 mb-1">Skapa konto</h1>
          <p className="text-sm text-stone-400">Handla snabbare och följa dina ordrar</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-stone-100 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Namn</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
              placeholder="Anna Svensson"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">E-post</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
              placeholder="du@exempel.se"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Lösenord</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
              placeholder="Minst 6 tecken"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-60"
          >
            {loading ? 'Skapar konto...' : 'Skapa konto'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-400 mt-5">
          Har du redan ett konto?{' '}
          <Link href="/login" className="text-green-700 hover:text-green-800 font-medium">
            Logga in
          </Link>
        </p>
      </div>
    </div>
  )
}
