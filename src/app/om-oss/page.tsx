import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <div className="max-w-xl mb-12">
        <h1 className="text-3xl font-semibold text-stone-800 mb-3">Om GreenDream</h1>
        <p className="text-stone-500 leading-relaxed">
          En liten men passionerad odlare från Rödeby med kärlek till ovanliga och vackra växter.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#e8f0e5]">
          <Image src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800" alt="Trädgård" fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-stone-800 mb-4">Hej, jag är Malin</h2>
          <p className="text-sm text-stone-500 leading-relaxed mb-3">
            GreenDream startade 2010 som ett litet hobbyprojekt. Jag har alltid älskat växter — särskilt de ovanliga sorterna som är svåra att hitta i vanliga blomsteraffärer.
          </p>
          <p className="text-sm text-stone-500 leading-relaxed mb-3">
            Vad som började som en liten hörna i trädgården har vuxit till ett sortiment med över 200 sorter. Varje planta väljs ut och odlas med omsorg.
          </p>
          <p className="text-sm text-stone-500 leading-relaxed">
            Jag specialiserar mig på fuchsior, pelargoner och änglatrumpeter — men du hittar också citrusträd, exotiska växter och örter i mitt sortiment.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-16">
        {[
          { title: 'Kvalitet', text: 'Varje växt väljs noggrant ut. Vi säljer bara det vi är stolta över.' },
          { title: 'Passion', text: 'Växter är inte ett jobb — det är en livsstil. Det märks i varje kruka.' },
          { title: 'Omsorg', text: 'Vi packar varje beställning med omsorg så att växterna ankommer i toppskick.' },
        ].map(({ title, text }) => (
          <div key={title} className="bg-[#e8f0e5] rounded-xl p-6">
            <h3 className="font-semibold text-stone-700 mb-2">{title}</h3>
            <p className="text-sm text-stone-500 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-semibold text-stone-800 mb-5">Kontakt</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-stone-500">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0" strokeWidth={1.75} />
              Lilla Skogsvägen 1, Rödeby
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-stone-400 shrink-0" strokeWidth={1.75} />
              <a href="tel:0709246649" className="text-stone-500 hover:text-stone-800 transition-colors">070-924 66 49</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-stone-400 shrink-0" strokeWidth={1.75} />
              <a href="mailto:malin.franzen@icloud.com" className="text-stone-500 hover:text-stone-800 transition-colors">malin.franzen@icloud.com</a>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-4">Måndag–Fredag 09:00–18:00</p>
        </div>

        <div className="bg-stone-50 rounded-xl p-6 border border-stone-100">
          <h3 className="font-semibold text-stone-700 mb-4">Skicka ett meddelande</h3>
          <form className="space-y-3">
            <input className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white" placeholder="Ditt namn" />
            <input type="email" className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white" placeholder="Din e-post" />
            <textarea rows={4} className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-green-400 bg-white resize-none" placeholder="Ditt meddelande..." />
            <button type="submit" className="w-full py-2.5 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
              Skicka
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
