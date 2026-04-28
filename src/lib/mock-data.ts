import { Category, Product, BlogPost } from './types'

export const mockCategories: Category[] = [
  { id: '1', name: 'Fuchsia', slug: 'fuchsia', description: 'Vackra hängande fuchsior i alla färger', image_url: null, parent_id: null },
  { id: '2', name: 'Pelargonium', slug: 'pelargonium', description: 'Klassiska och ovanliga pelargoner', image_url: null, parent_id: null },
  { id: '3', name: 'Änglatrumpeter', slug: 'anglatrumpeter', description: 'Doftande brugmansia', image_url: null, parent_id: null },
  { id: '4', name: 'Citrus', slug: 'citrus', description: 'Citrusträd för balkong och orangeri', image_url: null, parent_id: null },
  { id: '5', name: 'Exotiska', slug: 'exotiska', description: 'Exotiska blommor och fruktträd', image_url: null, parent_id: null },
  { id: '6', name: 'Medelhavs­växter', slug: 'medelhavsvaxter', description: 'Växter för sydligt klimat', image_url: null, parent_id: null },
  { id: '7', name: 'Örter', slug: 'orter', description: 'Örter och specialsorter', image_url: null, parent_id: null },
]

export const mockProducts: Product[] = [
  {
    id: '1', name: 'Fuchsia Checkerboard', slug: 'fuchsia-checkerboard',
    description: 'En klassisk och älskad sort med vita och röda blommor. Passar utmärkt i hängkorgar.',
    price: 69, original_price: 89, stock: 12, category_id: '1',
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'],
    is_featured: true, is_new: false, created_at: '2026-01-01',
  },
  {
    id: '2', name: 'Fuchsia Tennessee Waltz', slug: 'fuchsia-tennessee-waltz',
    description: 'Dubbla blommor i lila och rosa. En storslagen sort som blommar rikligt.',
    price: 49, original_price: null, stock: 8, category_id: '1',
    images: ['https://images.unsplash.com/photo-1490750967868-88df5691cc3b?w=600'],
    is_featured: true, is_new: true, created_at: '2026-01-15',
  },
  {
    id: '3', name: 'Fuchsia Lambada', slug: 'fuchsia-lambada',
    description: 'Robust och lättodlad. Blommar hela sommaren med livfulla blommor.',
    price: 59, original_price: null, stock: 15, category_id: '1',
    images: ['https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600'],
    is_featured: false, is_new: true, created_at: '2026-02-01',
  },
  {
    id: '4', name: 'Pelargonium Regal', slug: 'pelargonium-regal',
    description: 'Storblommig och elegant. Perfekt för fönsterkarmen eller terrassen.',
    price: 79, original_price: null, stock: 20, category_id: '2',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    is_featured: true, is_new: false, created_at: '2026-01-10',
  },
  {
    id: '5', name: 'Brugmansia Gul', slug: 'brugmansia-gul',
    description: 'Stor doftande änglatrumpet i gult. Slår ut hela sommaren med magiska blommor.',
    price: 149, original_price: 189, stock: 5, category_id: '3',
    images: ['https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600'],
    is_featured: true, is_new: false, created_at: '2026-01-05',
  },
  {
    id: '6', name: 'Citronträd', slug: 'citrontrad',
    description: 'Välväxt citronträd i 20cm kruka. Fruktsätter redan första sommaren.',
    price: 299, original_price: null, stock: 3, category_id: '4',
    images: ['https://images.unsplash.com/photo-1587840171670-8b850147754e?w=600'],
    is_featured: true, is_new: false, created_at: '2026-01-20',
  },
  {
    id: '7', name: 'Hibiskus Röd', slug: 'hibiskus-rod',
    description: 'Storblommig exotisk hibiskus med knallröda blommor. Älskar sol och värme.',
    price: 129, original_price: null, stock: 7, category_id: '5',
    images: ['https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600'],
    is_featured: false, is_new: true, created_at: '2026-02-10',
  },
  {
    id: '8', name: 'Rosmarin', slug: 'rosmarin',
    description: 'Stor välväxt rosmarinbuske i 15cm kruka. Härdig och doftande.',
    price: 49, original_price: null, stock: 25, category_id: '7',
    images: ['https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=600'],
    is_featured: false, is_new: false, created_at: '2026-01-01',
  },
]

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1', title: 'Sticklingshjälp & Skötsel', slug: 'sticklingshjälp-skotsel',
    excerpt: 'Tips och tricks för att lyckas med sticklingar av fuchsia och pelargon.',
    content: 'Att ta sticklingar är ett fantastiskt sätt att föröka dina favoritväxter...',
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
    published: true, created_at: '2026-03-01',
  },
  {
    id: '2', title: 'Förberedelser inför våren', slug: 'forberedelser-infor-varen',
    excerpt: 'Hur du väcker dina änglatrumpeter ur vintervilan och förbereder dem för sommaren.',
    content: 'När dagarna börjar bli längre och temperaturen stiger är det dags...',
    image_url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600',
    published: true, created_at: '2026-03-15',
  },
  {
    id: '3', title: 'Odla citrus i Sverige', slug: 'odla-citrus-i-sverige',
    excerpt: 'Allt du behöver veta för att lyckas med citrusträd på balkong eller i orangeri.',
    content: 'Citrusträd är mer härdiga än vad många tror...',
    image_url: 'https://images.unsplash.com/photo-1587840171670-8b850147754e?w=600',
    published: true, created_at: '2026-04-01',
  },
]
