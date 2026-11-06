const path = require('node:path')

// Build-time style extraction only runs under webpack (`next build --webpack`,
// `yarn web:extract`). Turbopack, the default for `next dev`, ignores the plugin's
// webpack hook and uses runtime styles. DISABLE_EXTRACTION=true|false overrides the default,
// which is: extract everywhere except `next dev`.
const disableExtraction = process.env.DISABLE_EXTRACTION
  ? process.env.DISABLE_EXTRACTION === 'true'
  : process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: [
    'solito',
    'react-native-web',
    '@tamagui/react-native-svg',
    '@tamagui/next-theme',
    '@tamagui/lucide-icons',
    'expo-linking',
    'expo-constants',
    'expo-modules-core',
  ],
  experimental: {
    scrollRestoration: true,
  },
  // Webpack equivalents of the Turbopack aliases below (used by `--webpack` builds).
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native-svg': '@tamagui/react-native-svg',
      'react-native-safe-area-context': path.resolve(
        __dirname,
        'shims/react-native-safe-area-context.js'
      ),
    }
    return config
  },
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
      'react-native-svg': '@tamagui/react-native-svg',
      'react-native-safe-area-context': './shims/react-native-safe-area-context.js',
    },
    resolveExtensions: [
      '.web.tsx',
      '.web.ts',
      '.web.js',
      '.web.jsx',
      '.tsx',
      '.ts',
      '.js',
      '.jsx',
      '.json',
    ],
  },
}

// Only load the plugin when extracting. Under `next dev` (Turbopack) it does nothing, and even
// importing it there changes how Tamagui renders styles on the server (inline styles + hydration
// mismatch), so the require is deliberately lazy.
module.exports = disableExtraction
  ? nextConfig
  : require('@tamagui/next-plugin').withTamagui({
      config: '../../packages/config/src/tamagui.config.ts',
      components: ['tamagui', '@my/ui'],
      appDir: true,
      // Extracted CSS is served by NextTamaguiProvider via <link href="/tamagui.css" />
      outputCSS: './public/tamagui.css',
    })(nextConfig)
