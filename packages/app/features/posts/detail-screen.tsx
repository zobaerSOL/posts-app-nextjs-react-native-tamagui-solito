'use client'

import { Button, H2, Paragraph, ScrollView, YStack } from '@my/ui'
import { useRouter } from 'solito/navigation'
import type { Post } from './api'

export function PostDetailScreen({ post }: { post: Post }) {
  const { back } = useRouter()
  return (
    <ScrollView>
      <YStack
        padding="$4"
        gap="$3"
        maxWidth={720}
        width="100%"
        alignSelf="center"
      >
        <Button
          alignSelf="flex-start"
          onPress={() => back()}
        >
          Back
        </Button>
        <H2>{post.title}</H2>
        <Paragraph opacity={0.6}>
          Post #{post.id} by user {post.userId}
        </Paragraph>
        <Paragraph size="$5">{post.body}</Paragraph>
      </YStack>
    </ScrollView>
  )
}
