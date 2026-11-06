import { fetchProducts } from 'app/features/products/api'
import { HomeScreen } from 'app/features/home/screen'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const products = await fetchProducts({ limit: 8 })
  return <HomeScreen products={products} />
}
