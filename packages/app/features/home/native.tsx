// Native wrapper: fetch the featured products on the client and render the shared home screen.
import { Status, useAsync } from '../shared/async'
import { fetchProducts, type Product } from '../products/api'
import { HomeScreen } from './screen'

export function HomeNative() {
  const { data, error } = useAsync<Product[]>(() => fetchProducts({ limit: 8 }), [])
  return data ? <HomeScreen products={data} /> : <Status error={error} />
}
