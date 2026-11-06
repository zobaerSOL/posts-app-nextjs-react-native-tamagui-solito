import { HomeNative } from 'app/features/home/native'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <HomeNative />
    </>
  )
}
