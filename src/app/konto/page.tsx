import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/ui/LogoutButton'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/konto')

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  const statusLabels: Record<string, string> = {
    pending: 'Väntar', paid: 'Betald', shipped: 'Skickad', delivered: 'Levererad', cancelled: 'Avbruten',
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">Mitt konto</h1>
        <LogoutButton />
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        <div className="bg-white border border-stone-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Kontoinformation</p>
          <p className="font-medium text-stone-800">{customer?.full_name ?? user.email}</p>
          <p className="text-sm text-stone-500 mt-0.5">{user.email}</p>
          {customer?.is_admin && (
            <a href="/admin" className="inline-block mt-3 text-xs text-green-700 font-medium hover:underline">
              Gå till admin →
            </a>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Mina ordrar</h2>
        {(!orders || orders.length === 0) ? (
          <div className="bg-white border border-stone-100 rounded-xl p-8 text-center">
            <p className="text-stone-400 text-sm">Du har inte gjort några beställningar ännu.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-stone-100 rounded-xl overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between border-b border-stone-50">
                  <div className="flex items-center gap-4">
                    <p className="font-mono text-xs text-stone-400">{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-stone-400">{new Date(order.created_at).toLocaleDateString('sv-SE')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-stone-800">{order.total} kr</span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-stone-100 text-stone-600">
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </div>
                </div>
                {order.order_items && order.order_items.length > 0 && (
                  <div className="px-5 py-3 space-y-3">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                          {item.product_image ? (
                            <Image src={item.product_image} alt={item.product_name} width={40} height={40} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-stone-100" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-700 truncate">{item.product_name}</p>
                          <p className="text-xs text-stone-400">{item.quantity} st</p>
                        </div>
                        <p className="text-sm font-semibold text-stone-800 shrink-0">{item.price * item.quantity} kr</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
