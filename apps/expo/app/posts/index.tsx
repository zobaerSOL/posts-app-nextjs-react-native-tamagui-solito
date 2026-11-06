import { PostListNative } from 'app/features/posts/native'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Posts' }} />
      <PostListNative />
    </>
  )
}
