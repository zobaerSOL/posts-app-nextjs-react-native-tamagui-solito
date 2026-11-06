import { ProductListNative } from 'app/features/products/native'
import { Stack, useLocalSearchParams } from 'expo-router'

export default function Screen() {
  const { category } = useLocalSearchParams<{ category?: string }>()
  return (
    <>
      <Stack.Screen options={{ title: 'Products' }} />
      <ProductListNative category={category} />
    </>
  )
}
