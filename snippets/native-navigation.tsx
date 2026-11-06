// 1) packages/app/navigation/native/index.tsx  -> add two screens to the existing Stack
import { PostDetailNative, PostListNative } from '../../features/posts/native'

<Stack.Screen name="posts" component={PostListNative} options={{ title: 'Posts' }} />
<Stack.Screen name="post-detail" component={PostDetailNative} options={{ title: 'Post' }} />

// 2) packages/app/provider/navigation/index.native.tsx  -> add to linking.config.screens
//    (these paths must match the Next.js routes so Solito Links work on both)
posts: 'posts',
'post-detail': 'posts/:id',
