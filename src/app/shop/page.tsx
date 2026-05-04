'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import ProductGrid from '@/components/shop/ProductGrid'
import { Product, Category } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('featured')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*, category:categories(*)').order('is_featured', { ascending: false }),
      ])
      setCategories(cats ?? [])
      setProducts(prods ?? [])
      setLoading(false)
    }

    load()
  }, [])

  const filtered = useMemo(() => {
    let list = [...products]

    if (selectedCategory) {
      list = list.filter((p: any) => p.category?.slug === selectedCategory)
    }

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
    }

    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sortBy === 'new') list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return list
  }, [products, search, selectedCategory, sortBy])

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800 mb-1">Alla växter</h1>
        <p className="text-sm text-stone-400">{filtered.length} produkter</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" strokeWidth={1.75} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Sök växter..."
            className="w-full pl-9 pr-8 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white text-stone-600"
        >
          <option value="featured">Utvalda först</option>
          <option value="new">Senaste</option>
          <option value="price-asc">Pris: lägst</option>
          <option value="price-desc">Pris: högst</option>
        </select>
      </div>

      {/* Mobile category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:hidden mb-6 -mx-1 px-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!selectedCategory ? 'bg-green-700 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}
        >
          Alla
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug === selectedCategory ? null : cat.slug)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${cat.slug === selectedCategory ? 'bg-green-700 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        <aside className="w-44 shrink-0 hidden sm:block">
          <div className="sticky top-20">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Kategori</p>
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-green-100 text-green-800 font-medium' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'}`}
              >
                Alla ({products.length})
              </button>
              {categories.map(cat => {
                const count = products.filter((p: any) => p.category?.slug === cat.slug).length
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug === selectedCategory ? null : cat.slug)}
                    className={`text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between ${cat.slug === selectedCategory ? 'bg-green-100 text-green-800 font-medium' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-stone-300">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square rounded-xl bg-stone-100 mb-3" />
                  <div className="h-3 bg-stone-100 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-stone-100 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-stone-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>
    </div>
  )
}
