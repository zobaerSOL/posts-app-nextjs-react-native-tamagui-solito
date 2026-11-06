import { fetchPost } from 'app/features/posts/api'
import { PostDetailScreen } from 'app/features/posts/detail-screen'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const post = await fetchPost(id)
    return <PostDetailScreen post={post} />
  } catch {
    notFound()
  }
}
