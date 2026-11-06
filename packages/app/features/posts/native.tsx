// Native wrappers: Next.js fetches on the server, but native has no server,
// so these fetch on the client and render the same shared screens.
import { useParams } from 'solito/navigation'
import { Status, useAsync } from '../shared/async'
import { fetchPost, fetchPosts, type Post } from './api'
import { PostDetailScreen } from './detail-screen'
import { PostListScreen } from './list-screen'

export function PostListNative() {
  const { data, error } = useAsync<Post[]>(() => fetchPosts(), [])
  return data ? <PostListScreen posts={data} /> : <Status error={error} />
}

export function PostDetailNative() {
  const { id } = useParams<{ id: string }>()
  const { data, error } = useAsync<Post>(() => fetchPost(id as string), [id])
  return data ? <PostDetailScreen post={data} /> : <Status error={error} />
}
