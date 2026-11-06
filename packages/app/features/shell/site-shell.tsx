'use client'

// Web site chrome: top header + tree menu sidebar (desktop) / collapsible menu (phones).
// Visibility is driven by CSS media style props ($md) rather than useMedia, so SSR and
// hydration agree. Native does not use this: it keeps Expo Router's stack navigation.
import { Button, H4, Paragraph, SwitchThemeButton, XStack, YStack } from '@my/ui'
import { ChevronDown, ChevronRight, Menu, X } from '@tamagui/lucide-icons'
import { type ReactNode, useEffect, useState } from 'react'
import { Link } from 'solito/link'
import { usePathname } from 'solito/navigation'
import type { Category } from '../products/api'

type TreeNode = { label: string; href?: string; children?: TreeNode[] }

const pathOf = (href?: string) => href?.split('?')[0]
// Only plain links (no query string) can be "active": category links share /products.
const isActive = (node: TreeNode, pathname: string) =>
  !!node.href && !node.href.includes('?') && node.href === pathname
const hasActive = (node: TreeNode, pathname: string): boolean =>
  isActive(node, pathname) || !!node.children?.some((c) => hasActive(c, pathname))

function buildTree(categories: Category[]): TreeNode[] {
  return [
    { label: 'Home', href: '/' },
    {
      label: 'Shop',
      children: [
        { label: 'All products', href: '/products' },
        {
          label: 'Categories',
          children: categories.map((c) => ({
            label: c.name,
            href: `/products?category=${encodeURIComponent(c.slug)}`,
          })),
        },
      ],
    },
    { label: 'Content', children: [{ label: 'Posts', href: '/posts' }] },
  ]
}

function TreeItem({
  node,
  depth,
  pathname,
  onNavigate,
}: { node: TreeNode; depth: number; pathname: string; onNavigate?: () => void }) {
  const [open, setOpen] = useState(() => hasActive(node, pathname))
  const rowProps = {
    paddingVertical: '$2',
    paddingRight: '$2',
    paddingLeft: 8 + depth * 14,
    borderRadius: '$3',
    alignItems: 'center',
    gap: '$2',
    hoverStyle: { backgroundColor: '$backgroundHover' },
    pressStyle: { backgroundColor: '$backgroundPress' },
  } as const

  if (node.children) {
    return (
      <YStack>
        <XStack
          {...rowProps}
          cursor="pointer"
          onPress={() => setOpen((o) => !o)}
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <Paragraph
            fontWeight="700"
            flex={1}
          >
            {node.label}
          </Paragraph>
        </XStack>
        {open &&
          node.children.map((child) => (
            <TreeItem
              key={child.label}
              node={child}
              depth={depth + 1}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
      </YStack>
    )
  }

  const active = isActive(node, pathname)
  return (
    <Link href={node.href as string}>
      <XStack
        {...rowProps}
        paddingLeft={8 + depth * 14 + 22}
        backgroundColor={active ? '$blue4' : undefined}
        onPress={onNavigate}
      >
        <Paragraph
          flex={1}
          textTransform={
            pathOf(node.href) === '/products' && node.href?.includes('?') ? 'capitalize' : undefined
          }
          color={active ? '$blue11' : undefined}
          fontWeight={active ? '700' : '400'}
        >
          {node.label}
        </Paragraph>
      </XStack>
    </Link>
  )
}

function TreeMenu({ categories, onNavigate }: { categories: Category[]; onNavigate?: () => void }) {
  const pathname = usePathname() ?? '/'
  return (
    <YStack gap="$1">
      {buildTree(categories).map((node) => (
        <TreeItem
          key={node.label}
          node={node}
          depth={0}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </YStack>
  )
}

export function SiteShell({
  categories,
  children,
}: { categories: Category[]; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <YStack
      minHeight="100vh"
      backgroundColor="$background"
    >
      {/* Header */}
      <XStack
        height={60}
        paddingHorizontal="$4"
        alignItems="center"
        gap="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <YStack $md={{ display: 'none' }}>
          <Button
            chromeless
            circular
            size="$3"
            aria-label="Toggle menu"
            icon={menuOpen ? X : Menu}
            onPress={() => setMenuOpen((o) => !o)}
          />
        </YStack>
        <Link href="/">
          <H4>ShopHub</H4>
        </Link>
        <XStack flex={1} />
        <SwitchThemeButton />
      </XStack>

      {/* Phone / tablet menu: collapsible panel under the header */}
      {menuOpen && (
        <YStack
          padding="$3"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          maxHeight={420}
          overflow="scroll"
          $md={{ display: 'none' }}
        >
          <TreeMenu
            categories={categories}
            onNavigate={() => setMenuOpen(false)}
          />
        </YStack>
      )}

      <XStack flex={1}>
        {/* Desktop sidebar */}
        <YStack
          display="none"
          width={260}
          padding="$3"
          borderRightWidth={1}
          borderRightColor="$borderColor"
          $md={{ display: 'flex' }}
        >
          <TreeMenu categories={categories} />
        </YStack>
        <YStack
          flex={1}
          minWidth={0}
        >
          {children}
        </YStack>
      </XStack>
    </YStack>
  )
}
