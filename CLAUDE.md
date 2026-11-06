# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Yarn 4 monorepo (Tamagui + Solito starter) with one shared UI/feature codebase rendered by a Next.js web app and an Expo native app. It shows posts from the public JSONPlaceholder API. Node 22 and Yarn 4.5.0 (`.yarn/releases`, `nodeLinker: node-modules`) are required.

## Commands

Run from the repo root:

- `yarn` — install. `postinstall` runs `tamagui check` and `yarn build`.
- `yarn web` — build workspace packages, then `next dev` in `apps/next`.
- `yarn native` — `expo start -c` in `apps/expo`. `yarn ios` / `yarn android` do a native `expo run:*`. `yarn ios` first runs `scripts/fix-xcode-env.mjs`.
- `yarn native:prebuild` — `expo prebuild`.
- `yarn build` — runs `build` in every workspace except `next-app`. This compiles `@my/config` and `@my/ui` to `dist/` with `tamagui-build`.
- `yarn web:prod` / `yarn web:prod:serve` — production Next build (`next build --webpack`, with Tamagui style extraction), then serve on port 8151.
- `yarn web:extract` — webpack dev server with the Tamagui extractor on (`DISABLE_EXTRACTION=false`). Plain `yarn web` is Turbopack with runtime styles and no extraction.
- `yarn watch` — watch-build all packages (`ultra`).
- `yarn test` — `vitest run` from the root (single thread). `yarn test:watch` for watch mode.
- Single test: `yarn vitest run apps/next/__tests__/build.test.ts` (add `-t "<name>"` to filter).
- Lint/format: `yarn biome check .` (the only lint script is `yarn lint` in `apps/next`). Biome config is in `biome.json` (single quotes, no semicolons, width 100, `noConsoleLog` is an error, `useImportType` is an error).
- Playwright e2e specs live in `apps/next/e2e`. The Vitest configs exclude them, so run them with `npx playwright test` from `apps/next`.

`__tests__/dev.test.ts` and `build.test.ts` spawn the real Next dev server and build, so they are slow. `dev.test.ts` needs port 3000 and the `.next/dev` lock, so stop any running `yarn web` before `yarn test`. The husky `pre-commit` hook runs `yarn test`, and CI (`.github/workflows/test.yml`) runs the same.

## Architecture

Workspaces: `apps/next` (web, `next-app`), `apps/expo` (native, `expo-app`), `packages/app`, `packages/ui` (`@my/ui`), `packages/config` (`@my/config`).

**Code is shared through `packages/app`, imported as `app/...`.** Features are organized by folder under `packages/app/features/<feature>/` (not a `screens/` folder). Both apps' route files are thin wrappers around the same feature screens. `packages/app/index.ts` is intentionally empty. Do not add re-exports there, because they break Next tree shaking. Import by deep path, e.g. `app/features/posts/list-screen`.

**Routing is duplicated per platform, with Solito bridging navigation.** Web uses the Next App Router (`apps/next/app/`). Native uses Expo Router (`apps/expo/app/`). The two route trees must be kept in sync by hand. Currently they have `/`, `/posts`, `/posts/[id]` and `/user/[id]`. Shared screens navigate with `solito/link`, `solito/navigation` and `useParams`, which work on both platforms. The `solito` dependency is yarn-patched (`.yarn/patches`).

**Data fetching differs by platform, which is the main non-obvious pattern.** `packages/app/features/posts/api.ts` holds `fetchPosts` / `fetchPost`, with a base URL from `process.env.API_BASE_URL` that falls back to JSONPlaceholder.
- Web: the Next route files are async Server Components (`dynamic = 'force-dynamic'`). They call the API on the server and pass data as props to `*-screen.tsx`. `API_BASE_URL` is server-only, with no `NEXT_PUBLIC_` prefix, so it never reaches the browser. A missing post calls `notFound()`.
- Native: there is no server, so `features/posts/native.tsx` wraps the same screens with client-side fetch (`useAsync` plus loading and error `Status`). The screens (`list-screen.tsx`, `detail-screen.tsx`) are pure presentational components that take data as props. Keep new data features in this shape: shared screen, plus a server route on web, plus a native wrapper.

**UI and theming.** `@my/config` (`packages/config/src/tamagui.config.ts`) builds the Tamagui config on `@tamagui/config/v5`, with custom fonts and animations. `.native.ts` / `.web.tsx` platform-suffixed files are used throughout (animations, safe-area, toast, theme switch). `@my/ui` re-exports Tamagui plus custom components, and screens import primitives from `@my/ui` rather than `tamagui`. `packages/app/provider` has the `Provider` for native and `NextTamaguiProvider` for web. `packages/config` and `packages/ui` are consumed from `dist/` by the build, so run `yarn build` (or `yarn watch`) after editing them.

**Next config notes** (`apps/next/next.config.js`):
- Two bundlers are in play. `next dev` uses Turbopack (runtime styles). Production builds use `--webpack` because `@tamagui/next-plugin` only hooks webpack, which is what produces the extracted atomic CSS in `public/tamagui.css` (a generated file that `NextTamaguiProvider` links). Aliases are therefore declared twice: `turbopack.resolveAlias` and the `webpack` function. Keep them in sync.
- The plugin is `require`d lazily and only when extraction is on (`DISABLE_EXTRACTION` unset means extract everywhere except `next dev`). Do not move that require to the top of the file: merely importing it in the Turbopack dev server makes Tamagui SSR emit inline styles, which causes hydration mismatches.
- `typescript.ignoreBuildErrors` is `true`, so type errors do not fail `next build`. Run `tsc` yourself.
- `react-native` is aliased to `react-native-web` through `turbopack.resolveAlias`, with `.web.*` extensions resolved first.
- `react-native-safe-area-context` is shimmed (`apps/next/shims`).
- Native-ish packages must be listed in `transpilePackages`.

## Dependency rules

- JS-only cross-platform dependencies go in `packages/app`. Anything with native code goes in `apps/expo`.
- If the same library is installed in two workspaces, the versions must match exactly. Root `resolutions` pin `react`, `react-native`, `react-native-web`, `tamagui` and `@tamagui/*` (React 19.1, RN 0.81.5, Tamagui 2.0.0-rc.16). Upgrade Tamagui with `yarn upgrade:tamagui`.
- Vercel deploys with root `apps/next` (see `apps/next/vercel.json`).
- `npx check-dependency-version-consistency .` reports version mismatches across workspaces (it is a root dependency). Keep it clean after changing any `package.json`.
- `turbo.json` exists but no script calls `turbo`. Builds go through `yarn workspaces foreach`.

## Tooling notes

- `.mcp.json` registers the XcodeBuildMCP server for iOS simulator builds.
- `README.md` is project-specific: screenshots (`docs/screenshots/`), the stack's pros and cons, and setup. The original starter's `pages-example` and `pagesMode` tips were removed because this repo uses only the App Router.
