// Shared API layer. Public API: https://dummyjson.com/docs/products
// Runs on the Next.js server (Server Components) and on native (client fetch).
export type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand?: string
  thumbnail: string
  images: string[]
}

type ProductsResponse = { products: Product[]; total: number; skip: number; limit: number }

// Server-only env var on web (no NEXT_PUBLIC_ prefix). Falls back to the public API.
const BASE_URL = process.env.PRODUCTS_API_BASE_URL ?? 'https://dummyjson.com'

export type Category = { slug: string; name: string }

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/products/categories`)
  if (!res.ok) throw new Error(`Failed to load categories (${res.status})`)
  return res.json()
}

export async function fetchProducts(
  opts: { limit?: number; category?: string } = {}
): Promise<Product[]> {
  const { limit = 10, category } = opts
  const path = category ? `/products/category/${encodeURIComponent(category)}` : '/products'
  const res = await fetch(`${BASE_URL}${path}?limit=${limit}`)
  if (!res.ok) throw new Error(`Failed to load products (${res.status})`)
  const data: ProductsResponse = await res.json()
  return data.products
}

export async function fetchProduct(id: string | number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`)
  if (!res.ok) throw new Error(`Failed to load product ${id} (${res.status})`)
  return res.json()
}
