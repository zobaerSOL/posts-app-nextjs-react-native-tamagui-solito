// Server Component: fetch runs only on the Next.js server.
import { fetchProducts } from 'app/features/products/api'
import { ProductListScreen } from 'app/features/products/list-screen'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  searchParams,
}: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const products = await fetchProducts({ category })
  return (
    <ProductListScreen
      products={products}
      category={category}
    />
  )
}
