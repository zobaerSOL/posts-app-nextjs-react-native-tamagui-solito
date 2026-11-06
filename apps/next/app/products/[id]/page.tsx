import { fetchProduct } from 'app/features/products/api'
import { ProductDetailScreen } from 'app/features/products/detail-screen'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const product = await fetchProduct(id)
    return <ProductDetailScreen product={product} />
  } catch {
    notFound()
  }
}
