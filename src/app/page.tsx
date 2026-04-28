import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import ProductGrid from '@/components/shop/ProductGrid'
import { getProducts, getCategories, getBlogPosts } from '@/lib/db'
import { formatDate } from '@/lib/utils'

export default async function Home() {
  const [featured, categories, blogPosts] = await Promise.all([
    getProducts({ featured: true, limit: 4 }),
    getCategories(),
    getBlogPosts(),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#e8f0e5] min-h-[70vh] flex items-center">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm text-green-700 font-medium mb-4 tracking-wide uppercase">För trädgårdsälskare</p>
            <h1 className="text-4xl sm:text-5xl font-semibold text-stone-800 leading-tight mb-5">
              Växter med<br />omsorg odlade
            </h1>
            <p className="text-stone-500 leading-relaxed mb-8 max-w-md">
              Vi väljer ut varje sort för hand. Från sällsynta fuchsior till doftande änglatrumpeter — direkt från vår trädgård i Rödeby.
            </p>
            <div className="flex gap-3">
              <Link href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                Till butiken
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/om-oss"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors border border-stone-200">
                Om oss
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900"
              alt="Trädgård"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-stone-800">Kategorier</h2>
          <Link href="/shop" className="text-sm text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors">
            Alla växter <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map(cat => (
            <Link key={cat.id} href={`/shop?category=${cat.slug}`}
              className="flex flex-col items-center py-4 px-3 bg-white border border-stone-100 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all text-center group">
              <span className="text-sm font-medium text-stone-600 group-hover:text-green-800 transition-colors leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-white border-y border-stone-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-stone-800">Utvalda favoriter</h2>
            <Link href="/shop" className="text-sm text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors">
              Visa fler <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* About strip */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="bg-[#e8f0e5] rounded-2xl p-8 sm:p-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm text-green-700 font-medium mb-3 uppercase tracking-wide">Om oss</p>
            <h2 className="text-2xl font-semibold text-stone-800 mb-4 leading-snug">
              Passion för växter sedan 2010
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6 text-sm">
              GreenDream startades av Malin Franzén i Rödeby. Varje sort väljs noggrant ut och odlas med omsorg — vi säljer bara det vi är stolta över.
            </p>
            <Link href="/om-oss" className="inline-flex items-center gap-1.5 text-sm font-medium text-green-800 hover:text-green-900 transition-colors">
              Läs mer <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=700"
              alt="Malin i trädgården"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Blog */}
      {blogPosts.length > 0 && (
        <section className="bg-white border-t border-stone-100">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-stone-800">Senaste nytt</h2>
              <Link href="/blog" className="text-sm text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors">
                Alla inlägg <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {blogPosts.slice(0, 3).map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  {post.image_url && (
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-stone-100">
                      <Image src={post.image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <p className="text-xs text-stone-400 mb-1">{formatDate(post.created_at)}</p>
                  <h3 className="text-sm font-semibold text-stone-700 group-hover:text-green-800 transition-colors mb-1">{post.title}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
