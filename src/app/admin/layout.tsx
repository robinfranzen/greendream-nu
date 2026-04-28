import Link from 'next/link'
import { Leaf, LayoutDashboard, Package, ShoppingBag, Users, Mail, FileText, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produkter', icon: Package },
  { href: '/admin/orders', label: 'Ordrar', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Kunder', icon: Users },
  { href: '/admin/newsletter', label: 'Nyhetsbrev', icon: Mail },
  { href: '/admin/blog', label: 'Blogg', icon: FileText },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-60 bg-stone-900 text-stone-300 flex flex-col shrink-0 fixed inset-y-0 left-0 z-40">
        <div className="px-5 py-5 border-b border-stone-800">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">GreenDream</div>
              <div className="text-xs text-stone-500">Admin panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-stone-800 hover:text-white transition-colors">
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-stone-800">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-stone-800 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            Visa sajten
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 ml-60">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
