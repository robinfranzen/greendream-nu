import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getBlogPostBySlug } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <Link href="/blog" className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" strokeWidth={1.75} /> Tillbaka till bloggen
      </Link>

      {post.image_url && (
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
          <Image src={post.image_url} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <p className="text-xs text-stone-400 mb-3">{formatDate(post.created_at)}</p>
      <h1 className="text-3xl font-semibold text-stone-800 mb-6 leading-tight">{post.title}</h1>

      <div className="text-stone-600 leading-relaxed text-sm space-y-4">
        {post.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  )
}
