import { Product } from '@/lib/types'
import ProductCard from './ProductCard'

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400">
        <div className="text-5xl mb-4">🌱</div>
        <p className="text-lg font-medium">Inga växter hittades</p>
        <p className="text-sm mt-1">Prova ett annat filter eller sökord.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
