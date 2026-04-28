'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Product } from '@/lib/types'
import { addToCart } from '@/lib/cart'

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
    window.dispatchEvent(new Event('cart-updated'))
  }

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-stone-100 aspect-square mb-3">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-[#e8f0e5]" />
        )}

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.is_new && (
            <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs font-medium rounded">Ny</span>
          )}
          {discount && (
            <span className="px-2 py-0.5 bg-stone-800 text-white text-xs font-medium rounded">−{discount}%</span>
          )}
          {product.stock === 0 && (
            <span className="px-2 py-0.5 bg-stone-200 text-stone-600 text-xs font-medium rounded">Slutsåld</span>
          )}
        </div>

        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 bg-white/95 text-stone-800 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-stone-100"
          >
            <ShoppingCart className="w-3.5 h-3.5" strokeWidth={1.75} />
            Lägg i varukorg
          </button>
        )}
      </div>

      <p className="text-xs text-stone-400 mb-0.5">{product.category?.name}</p>
      <h3 className="text-sm font-medium text-stone-700 group-hover:text-green-800 transition-colors leading-snug">{product.name}</h3>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-sm font-semibold text-stone-800">{product.price} kr</span>
        {product.original_price && (
          <span className="text-xs text-stone-400 line-through">{product.original_price} kr</span>
        )}
      </div>
    </Link>
  )
}
