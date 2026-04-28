'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Product } from '@/lib/types'
import { addToCart } from '@/lib/cart'

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (product.stock === 0) return null

  const handleAdd = () => {
    addToCart(product, qty)
    window.dispatchEvent(new Event('cart-updated'))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex gap-2">
      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3.5 py-2.5 text-stone-500 hover:bg-stone-50 transition-colors text-sm">−</button>
        <span className="px-4 py-2.5 text-sm font-medium text-stone-800 border-x border-stone-200">{qty}</span>
        <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3.5 py-2.5 text-stone-500 hover:bg-stone-50 transition-colors text-sm">+</button>
      </div>
      <button
        onClick={handleAdd}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${added ? 'bg-green-300 text-green-900' : 'bg-green-700 text-white hover:bg-green-800'}`}
      >
        <ShoppingCart className="w-4 h-4" strokeWidth={1.75} />
        {added ? 'Tillagd!' : 'Lägg i varukorg'}
      </button>
    </div>
  )
}
