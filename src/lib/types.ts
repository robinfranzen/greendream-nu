export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  original_price: number | null
  stock: number
  category_id: string
  category?: Category
  images: string[]
  is_featured: boolean
  is_new: boolean
  created_at: string
}

export type Order = {
  id: string
  customer_id: string | null
  customer_email: string
  customer_name: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  shipping_address: ShippingAddress
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string | null
  quantity: number
  price: number
}

export type ShippingAddress = {
  name: string
  address: string
  city: string
  postal_code: string
  country: string
}

export type Customer = {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  is_admin: boolean
  created_at: string
}

export type Subscriber = {
  id: string
  email: string
  created_at: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image_url: string | null
  published: boolean
  created_at: string
}

export type CartItem = {
  product: Product
  quantity: number
}
