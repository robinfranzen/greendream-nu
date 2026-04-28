import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ntwfotaplbaegbxyfikb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50d2ZvdGFwbGJhZWdieHlmaWtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM0ODk5MiwiZXhwIjoyMDkyOTI0OTkyfQ.GHGC6QzQOp02WxamIQ4gMCyVaYYeoYnUEAInSgLiWNk'
)

const categories = [
  { name: 'Fuchsia', slug: 'fuchsia', description: 'Vackra hängande fuchsior i alla färger' },
  { name: 'Pelargonium', slug: 'pelargonium', description: 'Klassiska och ovanliga pelargoner' },
  { name: 'Änglatrumpeter', slug: 'anglatrumpeter', description: 'Doftande brugmansia' },
  { name: 'Citrus', slug: 'citrus', description: 'Citrusträd för balkong och orangeri' },
  { name: 'Exotiska', slug: 'exotiska', description: 'Exotiska blommor och fruktträd' },
  { name: 'Medelhavs­växter', slug: 'medelhavsvaxter', description: 'Växter för sydligt klimat' },
  { name: 'Örter', slug: 'orter', description: 'Örter och specialsorter' },
]

const products = [
  {
    name: 'Fuchsia Checkerboard', slug: 'fuchsia-checkerboard',
    description: 'En klassisk och älskad sort med vita och röda blommor. Passar utmärkt i hängkorgar.',
    price: 69, original_price: 89, stock: 12, category_slug: 'fuchsia',
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'],
    is_featured: true, is_new: false,
  },
  {
    name: 'Fuchsia Tennessee Waltz', slug: 'fuchsia-tennessee-waltz',
    description: 'Dubbla blommor i lila och rosa. En storslagen sort som blommar rikligt.',
    price: 49, original_price: null, stock: 8, category_slug: 'fuchsia',
    images: ['https://images.unsplash.com/photo-1490750967868-88df5691cc3b?w=600'],
    is_featured: true, is_new: true,
  },
  {
    name: 'Fuchsia Lambada', slug: 'fuchsia-lambada',
    description: 'Robust och lättodlad. Blommar hela sommaren med livfulla blommor.',
    price: 59, original_price: null, stock: 15, category_slug: 'fuchsia',
    images: ['https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600'],
    is_featured: false, is_new: true,
  },
  {
    name: 'Pelargonium Regal', slug: 'pelargonium-regal',
    description: 'Storblommig och elegant. Perfekt för fönsterkarmen eller terrassen.',
    price: 79, original_price: null, stock: 20, category_slug: 'pelargonium',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    is_featured: true, is_new: false,
  },
  {
    name: 'Brugmansia Gul', slug: 'brugmansia-gul',
    description: 'Stor doftande änglatrumpet i gult. Slår ut hela sommaren med magiska blommor.',
    price: 149, original_price: 189, stock: 5, category_slug: 'anglatrumpeter',
    images: ['https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600'],
    is_featured: true, is_new: false,
  },
  {
    name: 'Citronträd', slug: 'citrontrad',
    description: 'Välväxt citronträd i 20cm kruka. Fruktsätter redan första sommaren.',
    price: 299, original_price: null, stock: 3, category_slug: 'citrus',
    images: ['https://images.unsplash.com/photo-1587840171670-8b850147754e?w=600'],
    is_featured: true, is_new: false,
  },
  {
    name: 'Hibiskus Röd', slug: 'hibiskus-rod',
    description: 'Storblommig exotisk hibiskus med knallröda blommor. Älskar sol och värme.',
    price: 129, original_price: null, stock: 7, category_slug: 'exotiska',
    images: ['https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600'],
    is_featured: false, is_new: true,
  },
  {
    name: 'Rosmarin', slug: 'rosmarin',
    description: 'Stor välväxt rosmarinbuske i 15cm kruka. Härdig och doftande.',
    price: 49, original_price: null, stock: 25, category_slug: 'orter',
    images: ['https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=600'],
    is_featured: false, is_new: false,
  },
]

const blogPosts = [
  {
    title: 'Sticklingshjälp & Skötsel', slug: 'sticklingshjälp-skotsel',
    excerpt: 'Tips och tricks för att lyckas med sticklingar av fuchsia och pelargon.',
    content: 'Att ta sticklingar är ett fantastiskt sätt att föröka dina favoritväxter. Välj friska skott utan blommor, ca 8–10 cm långa. Ta bort de nedersta bladen och doppa i rotningspulver. Plantera i fuktig jord och ställ ljust men utan direkt sol. Efter 3–4 veckor har de rotat sig.',
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
    published: true, created_at: '2026-03-01',
  },
  {
    title: 'Förberedelser inför våren', slug: 'forberedelser-infor-varen',
    excerpt: 'Hur du väcker dina änglatrumpeter ur vintervilan och förbereder dem för sommaren.',
    content: 'När dagarna börjar bli längre och temperaturen stiger är det dags att väcka änglatrumpeterna. Ta fram dem från vintervilan i mars–april. Beskär kraftigt — det stimulerar ny tillväxt. Börja vattna mer och ge flytande gödsel varannan vecka.',
    image_url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600',
    published: true, created_at: '2026-03-15',
  },
  {
    title: 'Odla citrus i Sverige', slug: 'odla-citrus-i-sverige',
    excerpt: 'Allt du behöver veta för att lyckas med citrusträd på balkong eller i orangeri.',
    content: 'Citrusträd är mer härdiga än vad många tror. De trivs i full sol och väldrränerad jord. Vattna regelbundet men låt jorden torka ut något mellan vattningarna. Övervintras frostfritt, gärna svalt kring 8–12 grader. Ge specialgödsel för citrus under växtsäsongen.',
    image_url: 'https://images.unsplash.com/photo-1587840171670-8b850147754e?w=600',
    published: true, created_at: '2026-04-01',
  },
]

async function seed() {
  console.log('Seeding categories...')
  const { data: cats, error: catErr } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })
    .select()
  if (catErr) { console.error('Categories error:', catErr); process.exit(1) }
  console.log(`  ${cats.length} categories inserted`)

  const catMap = Object.fromEntries(cats.map(c => [c.slug, c.id]))

  console.log('Seeding products...')
  const productRows = products.map(({ category_slug, ...p }) => ({
    ...p,
    category_id: catMap[category_slug],
  }))
  const { data: prods, error: prodErr } = await supabase
    .from('products')
    .upsert(productRows, { onConflict: 'slug' })
    .select()
  if (prodErr) { console.error('Products error:', prodErr); process.exit(1) }
  console.log(`  ${prods.length} products inserted`)

  console.log('Seeding blog posts...')
  const { data: posts, error: postErr } = await supabase
    .from('blog_posts')
    .upsert(blogPosts, { onConflict: 'slug' })
    .select()
  if (postErr) { console.error('Blog posts error:', postErr); process.exit(1) }
  console.log(`  ${posts.length} blog posts inserted`)

  console.log('Done!')
}

seed()
