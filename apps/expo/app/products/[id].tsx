import { ProductDetailNative } from 'app/features/products/native'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Product' }} />
      <ProductDetailNative />
    </>
  )
}
