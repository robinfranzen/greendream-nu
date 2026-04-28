'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, User } from 'lucide-react'
import { getCart, cartCount } from '@/lib/cart'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setCount(cartCount(getCart()))
    const handler = () => setCount(cartCount(getCart()))
    window.addEventListener('cart-updated', handler)
    return () => window.removeEventListener('cart-updated', handler)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const navLinks = [
    { href: '/shop', label: 'Butik' },
    { href: '/blog', label: 'Blogg' },
    { href: '/om-oss', label: 'Om oss' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-white ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-lg font-semibold text-stone-800 tracking-tight hover:text-green-700 transition-colors">
            GreenDream
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link href={loggedIn ? '/konto' : '/login'} className="p-2 text-stone-500 hover:text-stone-800 transition-colors hidden sm:block">
              <User className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </Link>
            <Link href="/varukorg" className="relative p-2 text-stone-500 hover:text-stone-800 transition-colors">
              <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.75} />
              {count > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 text-white text-[9px] rounded-full flex items-center justify-center font-semibold leading-none">
                  {count}
                </span>
              )}
            </Link>
            <button className="md:hidden p-2 text-stone-500 hover:text-stone-800" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-[18px] h-[18px]" strokeWidth={1.75} /> : <Menu className="w-[18px] h-[18px]" strokeWidth={1.75} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white">
          <nav className="flex flex-col px-5 py-3">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="py-3 text-sm text-stone-600 hover:text-stone-900 border-b border-stone-50 last:border-0"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href={loggedIn ? '/konto' : '/login'}
              className="py-3 text-sm text-stone-600 hover:text-stone-900"
              onClick={() => setMenuOpen(false)}>
              {loggedIn ? 'Mitt konto' : 'Logga in'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
