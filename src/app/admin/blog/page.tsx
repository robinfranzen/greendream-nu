'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { BlogPost } from '@/lib/types'
import { formatDate } from '@/lib/utils'

const emptyForm = { title: '', slug: '', excerpt: '', content: '', image_url: '', published: true }

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  async function load() {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setPosts(data ?? [])
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(p: BlogPost) {
    setEditing(p)
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt ?? '', content: p.content, image_url: p.image_url ?? '', published: p.published })
    setShowForm(true)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-åäö]/g, ''),
      excerpt: form.excerpt || null,
      image_url: form.image_url || null,
    }
    if (editing) {
      await supabase.from('blog_posts').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('blog_posts').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Ta bort inlägget?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    load()
  }

  async function togglePublished(p: BlogPost) {
    await supabase.from('blog_posts').update({ published: !p.published }).eq('id', p.id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Blogg</h1>
          <p className="text-stone-500 text-sm mt-0.5">{posts.length} inlägg</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
          <Plus className="w-4 h-4" /> Nytt inlägg
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Titel</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Datum</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {posts.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-stone-400 text-sm">Inga inlägg ännu.</td></tr>
            )}
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="font-medium text-stone-800">{post.title}</div>
                  {post.excerpt && <div className="text-xs text-stone-400 mt-0.5 truncate max-w-sm">{post.excerpt}</div>}
                </td>
                <td className="px-5 py-4 text-stone-500">{formatDate(post.created_at)}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                    {post.published ? 'Publicerat' : 'Utkast'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(post)} className="p-1.5 text-stone-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => togglePublished(post)} className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => remove(post.id)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-5">{editing ? 'Redigera inlägg' : 'Nytt inlägg'}</h2>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Titel *</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Sammanfattning</label>
                <input value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Innehåll *</label>
                <textarea required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={10} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Bild-URL</label>
                <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400" placeholder="https://..." />
              </div>
              <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                Publicera direkt
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-60">
                  {saving ? 'Sparar...' : editing ? 'Spara' : 'Skapa inlägg'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
