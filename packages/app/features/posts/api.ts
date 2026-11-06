// Shared API layer. Public API: https://jsonplaceholder.typicode.com
// Runs on the Next.js server (getServerSideProps) and on native (client fetch).
export type Post = { id: number; userId: number; title: string; body: string }

// Server-only env var on web (no NEXT_PUBLIC_ prefix). Falls back to the public API.
const BASE_URL = process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com'

export async function fetchPosts(limit = 20): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts?_limit=${limit}`)
  if (!res.ok) throw new Error(`Failed to load posts (${res.status})`)
  return res.json()
}

export async function fetchPost(id: string | number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`)
  if (!res.ok) throw new Error(`Failed to load post ${id} (${res.status})`)
  return res.json()
}
