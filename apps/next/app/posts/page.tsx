// Server Component: fetch runs only on the Next.js server, so API_BASE_URL never reaches the browser.
import { fetchPosts } from 'app/features/posts/api'
import { PostListScreen } from 'app/features/posts/list-screen'

export const dynamic = 'force-dynamic'

export default async function PostsPage() {
  const posts = await fetchPosts()
  return <PostListScreen posts={posts} />
}
