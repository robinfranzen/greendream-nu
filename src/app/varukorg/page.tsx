'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { getCart, removeFromCart, updateQuantity, cartTotal } from '@/lib/cart'
import { CartItem } from '@/lib/types'

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(getCart())
  }, [])

  const refresh = (newItems: CartItem[]) => {
    setItems([...newItems])
    window.dispatchEvent(new Event('cart-updated'))
  }

  const total = cartTotal(items)
  const shipping = total > 500 ? 0 : 79

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-5">🌿</div>
        <h1 className="text-2xl font-bold text-stone-800 mb-3">Din varukorg är tom</h1>
        <p className="text-stone-500 mb-8">Utforska vårt sortiment och lägg till dina favoritväxter.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl font-medium hover:bg-green-600 transition-colors">
          <ShoppingBag className="w-4 h-4" /> Gå till butiken
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-stone-800 mb-8">Varukorg</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.product.id} className="flex gap-4 bg-white p-4 rounded-2xl border border-stone-100">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                {item.product.images[0] ? (
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-stone-800 truncate">{item.product.name}</h3>
                <p className="text-sm text-stone-400 mb-3">{item.product.price} kr/st</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                    <button onClick={() => refresh(updateQuantity(item.product.id, item.quantity - 1))} className="px-3 py-1.5 text-stone-600 hover:bg-stone-50 text-sm">−</button>
                    <span className="px-3 py-1.5 text-sm font-medium border-x border-stone-200">{item.quantity}</span>
                    <button onClick={() => refresh(updateQuantity(item.product.id, item.quantity + 1))} className="px-3 py-1.5 text-stone-600 hover:bg-stone-50 text-sm">+</button>
                  </div>
                  <button onClick={() => refresh(removeFromCart(item.product.id))} className="text-stone-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-stone-800">{item.product.price * item.quantity} kr</span>
              </div>
            </div>
          ))}

          <Link href="/shop" className="flex items-center gap-2 text-sm text-green-700 hover:text-green-600 mt-2">
            <ArrowLeft className="w-4 h-4" /> Fortsätt handla
          </Link>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white border border-stone-100 rounded-2xl p-6 sticky top-24">
            <h2 className="font-bold text-stone-800 mb-5">Orderöversikt</h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-stone-600">
                <span>Delsumma</span>
                <span>{total} kr</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Frakt</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium">Gratis</span> : `${shipping} kr`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-stone-400">Fri frakt vid köp över 500 kr</p>
              )}
              <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-stone-800 text-base">
                <span>Totalt</span>
                <span>{total + shipping} kr</span>
              </div>
            </div>
            <Link href="/kassa"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors">
              Till kassan <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-stone-400 text-center mt-3">Betalning via Swish</p>
          </div>
        </div>
      </div>
    </div>
  )
}
