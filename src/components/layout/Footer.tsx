import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200 mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="text-sm font-semibold text-stone-800 mb-3">GreenDream</div>
            <p className="text-sm text-stone-500 leading-relaxed mb-4">
              Handplockade växter för trädgårdsälskare. Direkt från vår trädgård i Rödeby.
            </p>
            <p className="text-xs text-stone-400">Mån–Fre 09:00–18:00</p>
          </div>

          <div>
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Butik</div>
            <ul className="space-y-2 text-sm text-stone-500">
              {[
                ['Alla växter', '/shop'],
                ['Fuchsia', '/shop?category=fuchsia'],
                ['Pelargonium', '/shop?category=pelargonium'],
                ['Änglatrumpeter', '/shop?category=anglatrumpeter'],
                ['Citrus', '/shop?category=citrus'],
              ].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-stone-800 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Information</div>
            <ul className="space-y-2 text-sm text-stone-500">
              {[
                ['Om oss', '/om-oss'],
                ['Blogg', '/blog'],
                ['Leverans', '/leverans'],
                ['Villkor', '/villkor'],
                ['Kontakt', '/om-oss'],
              ].map(([label, href]) => (
                <li key={label}><Link href={href} className="hover:text-stone-800 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Kontakt</div>
            <ul className="space-y-2 text-sm text-stone-500">
              <li>Lilla Skogsvägen 1, Rödeby</li>
              <li><a href="tel:0709246649" className="hover:text-stone-800 transition-colors">070-924 66 49</a></li>
              <li><a href="mailto:malin.franzen@icloud.com" className="hover:text-stone-800 transition-colors">malin.franzen@icloud.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-400">© {new Date().getFullYear()} GreenDream. Alla rättigheter förbehållna.</p>
          <form className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="Prenumerera på nyhetsbrev"
              className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-700 placeholder-stone-400 focus:outline-none focus:border-green-400 flex-1 sm:w-56"
            />
            <button type="submit" className="px-4 py-2 bg-green-300 hover:bg-green-400 text-green-900 text-xs font-medium rounded-lg transition-colors whitespace-nowrap">
              Prenumerera
            </button>
          </form>
        </div>
      </div>
    </footer>
  )
}
