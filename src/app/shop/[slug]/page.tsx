import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getProductBySlug, getProducts } from '@/lib/db'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/shop/AddToCartButton'
import ProductGrid from '@/components/shop/ProductGrid'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getProducts({ categorySlug: (product as any).category?.slug, limit: 5 })
  const relatedFiltered = related.filter(p => p.id !== product.id).slice(0, 4)

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
        <Link href="/shop" className="hover:text-stone-700 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} /> Butik
        </Link>
        {(product as any).category && (
          <>
            <span>/</span>
            <Link href={`/shop?category=${(product as any).category.slug}`} className="hover:text-stone-700 transition-colors">
              {(product as any).category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-stone-600">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#e8f0e5]">
          {product.images[0] && (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority />
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {product.is_new && <span className="px-2 py-0.5 bg-green-200 text-green-800 text-xs font-medium rounded">Ny</span>}
            {discount && <span className="px-2 py-0.5 bg-stone-800 text-white text-xs font-medium rounded">−{discount}%</span>}
          </div>
        </div>

        <div>
          {(product as any).category && (
            <Link href={`/shop?category=${(product as any).category.slug}`} className="text-xs text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-wider font-medium">
              {(product as any).category.name}
            </Link>
          )}
          <h1 className="text-2xl font-semibold text-stone-800 mt-2 mb-1">{product.name}</h1>

          <div className="flex items-baseline gap-2.5 mb-5 mt-3">
            <span className="text-2xl font-semibold text-stone-800">{product.price} kr</span>
            {product.original_price && (
              <span className="text-base text-stone-400 line-through">{product.original_price} kr</span>
            )}
          </div>

          <p className="text-sm text-stone-500 leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-2 mb-6">
            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-stone-300'}`} />
            <span className="text-xs text-stone-500">
              {product.stock > 0 ? `${product.stock} i lager` : 'Slutsåld'}
            </span>
          </div>

          <AddToCartButton product={product} />

          <div className="border-t border-stone-100 pt-5 space-y-2 mt-6">
            <p className="text-xs text-stone-400">Leverans inom 2–5 arbetsdagar</p>
            <p className="text-xs text-stone-400">Betalning via Swish</p>
          </div>
        </div>
      </div>

      {relatedFiltered.length > 0 && (
        <div className="border-t border-stone-100 pt-12">
          <h2 className="text-lg font-semibold text-stone-800 mb-6">Fler i {(product as any).category?.name}</h2>
          <ProductGrid products={relatedFiltered} />
        </div>
      )}
    </div>
  )
}
