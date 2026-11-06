// Native wrappers: native has no server, so fetch on the client and render the shared screens.
import { useParams } from 'solito/navigation'
import { Status, useAsync } from '../shared/async'
import { fetchProduct, fetchProducts, type Product } from './api'
import { ProductDetailScreen } from './detail-screen'
import { ProductListScreen } from './list-screen'

export function ProductListNative({ category }: { category?: string }) {
  const { data, error } = useAsync<Product[]>(() => fetchProducts({ category }), [category])
  return data ? (
    <ProductListScreen
      products={data}
      category={category}
    />
  ) : (
    <Status error={error} />
  )
}

export function ProductDetailNative() {
  const { id } = useParams<{ id: string }>()
  const { data, error } = useAsync<Product>(() => fetchProduct(id as string), [id])
  return data ? <ProductDetailScreen product={data} /> : <Status error={error} />
}
