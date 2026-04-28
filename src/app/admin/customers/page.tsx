'use client'

import { useState } from 'react'
import { Search, Mail, Ban } from 'lucide-react'

const mockCustomers = [
  { id: '1', name: 'Anna Lindqvist', email: 'anna@example.com', orders: 5, total: 1240, joined: '2025-06-01', active: true },
  { id: '2', name: 'Erik Svensson', email: 'erik@example.com', orders: 3, total: 890, joined: '2025-08-15', active: true },
  { id: '3', name: 'Maria Karlsson', email: 'maria@example.com', orders: 1, total: 99, joined: '2026-01-20', active: true },
  { id: '4', name: 'Lars Bergström', email: 'lars@example.com', orders: 8, total: 3200, joined: '2024-12-01', active: true },
  { id: '5', name: 'Sofia Nilsson', email: 'sofia@example.com', orders: 2, total: 450, joined: '2026-03-10', active: false },
]

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('')

  const filtered = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Kunder</h1>
          <p className="text-stone-500 text-sm mt-0.5">{mockCustomers.length} kunder totalt</p>
        </div>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Sök kund..." className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400 bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Kund</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Ordrar</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Totalt spenderat</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Registrerad</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
                      {c.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-stone-800">{c.name}</div>
                      <div className="text-xs text-stone-400">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-stone-600">{c.orders} ordrar</td>
                <td className="px-5 py-4 font-semibold text-stone-800">{c.total} kr</td>
                <td className="px-5 py-4 text-stone-500">{c.joined}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                    {c.active ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Skicka e-post">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Blockera">
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
