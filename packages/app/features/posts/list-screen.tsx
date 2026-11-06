'use client'

// Shared UI: same component renders on web (Next.js) and native (Expo).
import { H2, Paragraph, ScrollView, YStack } from '@my/ui'
import { Link } from 'solito/link'
import type { Post } from './api'

export function PostListScreen({ posts }: { posts: Post[] }) {
  return (
    <ScrollView>
      <YStack
        padding="$4"
        gap="$3"
        maxWidth={720}
        width="100%"
        alignSelf="center"
      >
        <H2>Posts</H2>
        {posts.map((post) => (
          // Solito Link: Next.js <Link> on web, React Navigation on native
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
          >
            <YStack
              padding="$3"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$4"
              hoverStyle={{ backgroundColor: '$backgroundHover' }}
              pressStyle={{ backgroundColor: '$backgroundPress' }}
            >
              <Paragraph fontWeight="700">{post.title}</Paragraph>
              <Paragraph
                numberOfLines={2}
                opacity={0.7}
              >
                {post.body}
              </Paragraph>
            </YStack>
          </Link>
        ))}
      </YStack>
    </ScrollView>
  )
}
