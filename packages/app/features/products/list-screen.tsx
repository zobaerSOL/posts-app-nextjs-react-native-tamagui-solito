'use client'

import { H2, Paragraph, ScrollView, YStack } from '@my/ui'
import type { Product } from './api'
import { ProductGrid } from './product-grid'

export function ProductListScreen({
  products,
  category,
}: { products: Product[]; category?: string }) {
  return (
    <ScrollView>
      <YStack
        padding="$4"
        gap="$3"
        maxWidth={1100}
        width="100%"
        alignSelf="center"
      >
        <H2 textTransform="capitalize">
          {category ? category.replace(/-/g, ' ') : 'All products'}
        </H2>
        {products.length === 0 ? <Paragraph>No products found.</Paragraph> : null}
        <ProductGrid products={products} />
      </YStack>
    </ScrollView>
  )
}
