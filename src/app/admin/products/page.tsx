'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import { Plus, Edit2, Trash2, Search, Package, Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Product, Category } from '@/lib/types'
import { revalidateProducts } from './actions'

type ProductRow = Product & { category?: Category }

const emptyForm = {
  name: '', slug: '', description: '', price: '', original_price: '',
  stock: '', category_id: '', images: [] as string[], is_featured: false, is_new: false,
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ProductRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = useMemo(() => createClient(), [])

  async function load() {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    setProducts(prods ?? [])
    setCategories(cats ?? [])
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(p: ProductRow) {
    setEditing(p)
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description ?? '',
      price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : '',
      stock: String(p.stock),
      category_id: p.category_id,
      images: Array.isArray(p.images) ? [...p.images] : [],
      is_featured: p.is_featured,
      is_new: p.is_new,
    })
    setShowForm(true)
  }

  async function uploadImage(file: File) {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage.from('products').upload(path, file, { upsert: false })
    if (error) { console.error(error); setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path)
    setForm(f => ({ ...f, images: [...f.images, publicUrl] }))
    setUploading(false)
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    for (const file of files) await uploadImage(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    for (const file of files) await uploadImage(file)
  }

  function removeImage(url: string) {
    setForm(f => ({ ...f, images: f.images.filter(i => i !== url) }))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-åäö]/g, ''),
      description: form.description || null,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      stock: Number(form.stock),
      category_id: form.category_id || null,
      images: form.images,
      is_featured: form.is_featured,
      is_new: form.is_new,
    }

    if (editing) {
      await supabase.from('products').update(payload).eq('id', editing.id)
      // Delete removed images from Storage
      const removed = editing.images.filter(url => !form.images.includes(url))
      for (const url of removed) {
        const path = url.split('/storage/v1/object/public/products/')[1]
        if (path) {
            console.log('Deleting storage path:', path)
          const { error } = await supabase.storage.from('products').remove([decodeURIComponent(path)])
          if (error) console.error('Storage delete error:', error, 'path:', path)
        }
      }
    } else {
      await supabase.from('products').insert(payload)
    }

    await revalidateProducts()
    setSaving(false)
    setShowForm(false)
    await load()
  }

  async function remove(id: string) {
    if (!confirm('Ta bort produkten?')) return
    await supabase.from('products').delete().eq('id', id)
    load()
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Produkter</h1>
          <p className="text-stone-500 text-sm mt-0.5">{products.length} produkter totalt</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
          <Plus className="w-4 h-4" /> Ny produkt
        </button>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Sök produkter..."
          className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400 bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Produkt</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Kategori</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Pris</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">Lager</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map(product => (
              <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      {product.images[0] ? (
                        <Image src={product.images[0]} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-stone-300" /></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-stone-800">{product.name}</div>
                      <div className="text-xs text-stone-400">{product.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-stone-600">{(product as any).category?.name ?? '—'}</td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-stone-800">{product.price} kr</div>
                  {product.original_price && <div className="text-xs text-stone-400 line-through">{product.original_price} kr</div>}
                </td>
                <td className="px-5 py-4">
                  <span className={`font-semibold ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-orange-500' : 'text-green-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(product)} className="p-1.5 text-stone-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(product.id)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-5">{editing ? 'Redigera produkt' : 'Ny produkt'}</h2>
            <form onSubmit={save} className="space-y-4">

              {/* Image uploader */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Bilder</label>

                {/* Existing images */}
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.images.map((url, i) => (
                      <div key={url} className="relative group w-20 h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                        <Image src={url} alt={`Bild ${i + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-green-400 bg-green-50' : 'border-stone-200 hover:border-green-300 hover:bg-stone-50'}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-stone-400">
                      <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Laddar upp...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-stone-400">
                      <Upload className="w-5 h-5" />
                      <span className="text-xs">Klicka eller dra och släpp bilder hit</span>
                      <span className="text-xs text-stone-300">JPG, PNG, WebP · max 5 MB</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Produktnamn *</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400" placeholder="Ex: Fuchsia Checkerboard" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Beskrivning</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Pris (kr) *</label>
                  <input required type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Ordinarie pris</label>
                  <input type="number" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400" placeholder="Lämna tomt" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Lager *</label>
                  <input required type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Kategori</label>
                  <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400">
                    <option value="">Ingen</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-5">
                <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
                  Utvald
                </label>
                <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                  <input type="checkbox" checked={form.is_new} onChange={e => setForm(f => ({ ...f, is_new: e.target.checked }))} />
                  Ny
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving || uploading}
                  className="flex-1 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-60">
                  {saving ? 'Sparar...' : editing ? 'Spara ändringar' : 'Skapa produkt'}
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
