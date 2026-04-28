import Image from 'next/image'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/db'
import { formatDate } from '@/lib/utils'

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-stone-800 mb-1">Blogg</h1>
        <p className="text-sm text-stone-400">Tips, guider och nyheter från trädgården</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            {post.image_url && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-stone-100">
                <Image src={post.image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            <p className="text-xs text-stone-400 mb-1">{formatDate(post.created_at)}</p>
            <h2 className="text-sm font-semibold text-stone-700 group-hover:text-green-800 transition-colors mb-1">{post.title}</h2>
            <p className="text-xs text-stone-400 leading-relaxed">{post.excerpt}</p>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className="text-stone-400 text-sm col-span-3">Inga inlägg ännu.</p>
        )}
      </div>
    </div>
  )
}
