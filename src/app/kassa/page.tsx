'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { getCart, cartTotal, clearCart } from '@/lib/cart'
import { CartItem as CartItemType } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

type Step = 'address' | 'payment' | 'confirmed'

const emptyAddress = {
  name: '', email: '', phone: '', address: '', city: '', postal_code: '',
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItemType[]>([])
  const [addr, setAddr] = useState(emptyAddress)
  const [step, setStep] = useState<Step>('address')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setItems(getCart())
    // Pre-fill email if logged in
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setAddr(a => ({ ...a, email: data.user!.email! }))
    })
  }, [])

  const total = cartTotal(items)
  const shipping = total >= 500 ? 0 : 79
  const grandTotal = total + shipping

  async function placeOrder() {
    setPlacing(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const orderItems = items.map(i => ({
      product_id: i.product.id,
      product_name: i.product.name,
      product_image: i.product.images[0] ?? null,
      quantity: i.quantity,
      price: i.product.price,
    }))

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        customer_id: user?.id ?? null,
        customer_email: addr.email,
        customer_name: addr.name,
        status: 'pending',
        total: grandTotal,
        shipping_address: {
          name: addr.name,
          address: addr.address,
          city: addr.city,
          postal_code: addr.postal_code,
          country: 'Sverige',
        },
      })
      .select()
      .single()

    if (orderErr || !order) {
      setError(`Fel: ${orderErr?.message ?? 'okänt fel'} (kod: ${orderErr?.code})`)
      setPlacing(false)
      return
    }

    await supabase.from('order_items').insert(
      orderItems.map(i => ({ ...i, order_id: order.id }))
    )

    clearCart()
    window.dispatchEvent(new Event('cart-updated'))
    setOrderId(order.id)
    setStep('confirmed')
    setPlacing(false)
  }

  if (step === 'confirmed') {
    return (
      <div className="max-w-lg mx-auto px-5 py-20 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold text-stone-800 mb-2">Tack för din beställning!</h1>
        <p className="text-stone-500 text-sm mb-6">
          Vi har tagit emot din order och skickar en bekräftelse till <strong>{addr.email}</strong>.
        </p>

        <div className="bg-[#e8f0e5] rounded-2xl p-6 text-left mb-6">
          <p className="text-sm font-semibold text-stone-700 mb-3">Betalning via Swish</p>
          <div className="space-y-2 text-sm text-stone-600">
            <div className="flex justify-between">
              <span>Swish-nummer</span>
              <span className="font-semibold">070-924 66 49</span>
            </div>
            <div className="flex justify-between">
              <span>Belopp</span>
              <span className="font-semibold">{grandTotal} kr</span>
            </div>
            <div className="flex justify-between">
              <span>Meddelande</span>
              <span className="font-mono text-xs bg-white px-2 py-0.5 rounded">{orderId?.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-4">
            Ange ordernumret som meddelande när du betalar. Vi skickar din order så snart betalningen är mottagen.
          </p>
        </div>

        <Link href="/shop" className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
          Fortsätt handla
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-5 py-20 text-center">
        <p className="text-stone-500 mb-4">Din varukorg är tom.</p>
        <Link href="/shop" className="text-sm text-green-700 font-medium hover:underline">Gå till butiken</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <Link href="/varukorg" className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" strokeWidth={1.75} /> Tillbaka till varukorg
      </Link>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
        {/* Form */}
        <div className="lg:col-span-3">
          {step === 'address' && (
            <div>
              <h1 className="text-2xl font-semibold text-stone-800 mb-6">Leveransuppgifter</h1>
              <form onSubmit={e => { e.preventDefault(); setStep('payment') }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Namn *</label>
                  <input required value={addr.name} onChange={e => setAddr(a => ({ ...a, name: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400" placeholder="Anna Svensson" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">E-post *</label>
                  <input required type="email" value={addr.email} onChange={e => setAddr(a => ({ ...a, email: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400" placeholder="du@exempel.se" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Telefon</label>
                  <input type="tel" value={addr.phone} onChange={e => setAddr(a => ({ ...a, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400" placeholder="070-000 00 00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Adress *</label>
                  <input required value={addr.address} onChange={e => setAddr(a => ({ ...a, address: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400" placeholder="Storgatan 1" />
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Postnummer *</label>
                    <input required value={addr.postal_code} onChange={e => setAddr(a => ({ ...a, postal_code: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400" placeholder="123 45" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Stad *</label>
                    <input required value={addr.city} onChange={e => setAddr(a => ({ ...a, city: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400" placeholder="Stockholm" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors mt-2">
                  Fortsätt till betalning
                </button>
              </form>
            </div>
          )}

          {step === 'payment' && (
            <div>
              <h1 className="text-2xl font-semibold text-stone-800 mb-2">Betalning</h1>
              <p className="text-sm text-stone-400 mb-6">
                Leverans till: <span className="text-stone-600">{addr.address}, {addr.postal_code} {addr.city}</span>
                {' · '}
                <button onClick={() => setStep('address')} className="text-green-700 hover:underline">Ändra</button>
              </p>

              <div className="bg-[#e8f0e5] rounded-2xl p-6 mb-6">
                <p className="font-semibold text-stone-800 mb-4">Swish</p>
                <div className="space-y-2 text-sm text-stone-600 mb-4">
                  <div className="flex justify-between">
                    <span>Mottagare</span>
                    <span className="font-semibold">GreenDream — Malin Franzén</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nummer</span>
                    <span className="font-semibold">070-924 66 49</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Belopp</span>
                    <span className="font-semibold">{grandTotal} kr</span>
                  </div>
                </div>
                <p className="text-xs text-stone-500 bg-white/60 rounded-lg px-3 py-2">
                  Du betalar via Swish efter att ordern lagts. Vi skickar dina växter när betalningen är mottagen.
                </p>
              </div>

              {error && (
                <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={placeOrder}
                disabled={placing}
                className="w-full py-3 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-60"
              >
                {placing ? 'Lägger beställning...' : `Lägg beställning — ${grandTotal} kr`}
              </button>
              <p className="text-xs text-stone-400 text-center mt-3">
                Genom att lägga beställningen godkänner du våra villkor.
              </p>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-stone-100 rounded-2xl p-5 lg:sticky lg:top-24">
            <h2 className="font-semibold text-stone-800 mb-4">Din order</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    {item.product.images[0] && (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    )}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-stone-600 text-white text-[9px] rounded-full flex items-center justify-center font-semibold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-700 truncate">{item.product.name}</p>
                  </div>
                  <p className="text-sm font-semibold text-stone-800 shrink-0">{item.product.price * item.quantity} kr</p>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone-500">
                <span>Delsumma</span>
                <span>{total} kr</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Frakt</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium">Gratis</span> : `${shipping} kr`}</span>
              </div>
              {shipping > 0 && <p className="text-xs text-stone-400">Fri frakt över 500 kr</p>}
              <div className="flex justify-between font-semibold text-stone-800 text-base pt-1 border-t border-stone-100 mt-2">
                <span>Totalt</span>
                <span>{grandTotal} kr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
