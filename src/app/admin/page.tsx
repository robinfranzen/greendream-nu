import { Package, ShoppingBag, Users, Mail, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: productCount },
    { count: orderCount },
    { count: customerCount },
    { count: subscriberCount },
    { data: lowStockProducts },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('id, name, stock').lte('stock', 5).order('stock'),
  ])

  const stats = [
    { label: 'Produkter', value: productCount ?? 0, icon: Package, color: 'bg-blue-100 text-blue-700' },
    { label: 'Ordrar', value: orderCount ?? 0, icon: ShoppingBag, color: 'bg-green-100 text-green-700' },
    { label: 'Kunder', value: customerCount ?? 0, icon: Users, color: 'bg-purple-100 text-purple-700' },
    { label: 'Prenumeranter', value: subscriberCount ?? 0, icon: Mail, color: 'bg-orange-100 text-orange-700' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-1">Dashboard</h1>
      <p className="text-stone-500 mb-8">Välkommen tillbaka, Malin</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-stone-100 p-5">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-stone-800 mb-0.5">{stat.value}</div>
            <div className="text-sm text-stone-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-6 max-w-sm">
        <h2 className="font-bold text-stone-800 mb-5 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          Lågt lager
        </h2>
        <div className="space-y-3">
          {(lowStockProducts ?? []).map(p => (
            <div key={p.id} className="flex items-center justify-between">
              <span className="text-sm text-stone-700 truncate flex-1">{p.name}</span>
              <span className={`text-xs font-bold ml-2 ${p.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                {p.stock === 0 ? 'Slut' : `${p.stock} kvar`}
              </span>
            </div>
          ))}
          {(lowStockProducts ?? []).length === 0 && (
            <p className="text-sm text-stone-400">Allt i lager!</p>
          )}
        </div>
      </div>
    </div>
  )
}
