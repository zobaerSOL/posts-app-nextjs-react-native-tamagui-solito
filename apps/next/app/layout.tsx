import type { Metadata } from 'next'
import { fetchCategories } from 'app/features/products/api'
import { SiteShell } from 'app/features/shell/site-shell'
import { NextTamaguiProvider } from 'app/provider/NextTamaguiProvider'

export const metadata: Metadata = {
  title: 'Tamagui • App Router',
  description: 'Tamagui, Solito, Expo & Next.js',
  icons: '/favicon.ico',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The menu must not take the whole site down if the categories API is unavailable.
  const categories = await fetchCategories().catch(() => [])
  return (
    // You can use `suppressHydrationWarning` to avoid the warning about mismatched content during hydration in dev mode
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <NextTamaguiProvider>
          <SiteShell categories={categories}>{children}</SiteShell>
        </NextTamaguiProvider>
      </body>
    </html>
  )
}
