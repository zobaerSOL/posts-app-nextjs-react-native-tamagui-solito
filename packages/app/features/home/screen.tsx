'use client'

import { Button, H1, H3, Image, Paragraph, ScrollView, XStack, YStack } from '@my/ui'
import { ChevronRight, FileText, ShoppingBag } from '@tamagui/lucide-icons'
import { Platform } from 'react-native'
import { Link } from 'solito/link'
import { useRouter } from 'solito/navigation'
import type { Product } from '../products/api'
import { ProductGrid } from '../products/product-grid'

export function HomeScreen({ products }: { products: Product[] }) {
  const { push } = useRouter()
  const heroImage = products[0]?.thumbnail

  return (
    <ScrollView>
      <YStack
        padding="$4"
        gap="$6"
        maxWidth={1100}
        width="100%"
        alignSelf="center"
      >
        {/* Hero */}
        <XStack
          backgroundColor="$blue3"
          borderRadius="$6"
          overflow="hidden"
          alignItems="center"
          padding="$5"
          $sm={{ padding: '$8' }}
          gap="$4"
        >
          <YStack
            flex={1}
            gap="$4"
          >
            <Paragraph
              color="$blue10"
              fontWeight="800"
              size="$2"
              textTransform="uppercase"
            >
              New season sale
            </Paragraph>
            <H1
              size="$9"
              $sm={{ size: '$11' }}
            >
              Everything you need, delivered.
            </H1>
            <Paragraph
              size="$5"
              opacity={0.75}
              maxWidth={480}
            >
              Browse our catalog of beauty, fragrances, furniture and groceries. Up to 20% off this
              week.
            </Paragraph>
            <XStack
              gap="$3"
              flexWrap="wrap"
            >
              <Button
                theme="blue"
                size="$5"
                onPress={() => push('/products')}
              >
                Shop now
              </Button>
              <Button
                size="$5"
                onPress={() => push('/posts')}
              >
                Read the blog
              </Button>
            </XStack>
          </YStack>
          {heroImage ? (
            <YStack
              display="none"
              $sm={{ display: 'flex' }}
              width={220}
              height={220}
            >
              <Image
                src={heroImage}
                width="100%"
                height="100%"
                objectFit="contain"
              />
            </YStack>
          ) : null}
        </XStack>

        {/* Native has no sidebar menu, so offer the same destinations here */}
        {Platform.OS !== 'web' && (
          <YStack gap="$2">
            <QuickLink
              href="/products"
              title="Products"
              Icon={ShoppingBag}
            />
            <QuickLink
              href="/posts"
              title="Posts"
              Icon={FileText}
            />
          </YStack>
        )}

        {/* Featured products */}
        <YStack gap="$3">
          <XStack
            justifyContent="space-between"
            alignItems="center"
          >
            <H3>Featured products</H3>
            <Link href="/products">
              <Paragraph
                color="$blue10"
                fontWeight="700"
              >
                View all
              </Paragraph>
            </Link>
          </XStack>
          <ProductGrid products={products} />
        </YStack>
      </YStack>
    </ScrollView>
  )
}

function QuickLink({
  href,
  title,
  Icon,
}: { href: string; title: string; Icon: typeof ShoppingBag }) {
  return (
    <Link href={href}>
      <XStack
        gap="$3"
        padding="$3"
        alignItems="center"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius="$4"
        pressStyle={{ backgroundColor: '$backgroundPress' }}
      >
        <Icon size={22} />
        <Paragraph
          flex={1}
          fontWeight="700"
        >
          {title}
        </Paragraph>
        <ChevronRight
          size={18}
          opacity={0.5}
        />
      </XStack>
    </Link>
  )
}
