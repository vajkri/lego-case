# Code Style & Conventions

## TypeScript
- Strict mode enabled
- No explicit return types required for React components (inferred)
- Path alias: `@/*` maps to `./src/*` — always use it for imports

## React / Next.js
- App Router (no Pages Router)
- Functional components only
- Static export (`output: 'export'`) — no SSR/ISR features

## Component Patterns
- Barrel exports: every directory has `index.ts` with `export * from './ComponentName'`
- UI primitives in `src/components/ui/`
- Feature components nested by page/area in `src/components/features/`
- Layout primitives in `src/components/layout/`
- Never use raw `<button>` — always use the `Button` component from `@/components/ui`
- Always use `focus-visible` for focus styles, never bare `focus`

## CSS / Tailwind
- Tailwind CSS v4 via PostCSS plugin
- Design tokens in `globals.css` `@theme` block (colors, fonts, radii, shadows)
- rgba-based values (tints, depth shadows) must be `:root` CSS variables, NOT in `@theme` (Tailwind v4 drops rgba from @theme)
- Reference rgba vars via `style={{ }}` or `[background:var(--name)]` arbitrary syntax
- Variant system for content blocks: `variantStyleMap` in `variants.ts`, applied via `style={}` prop
- Use `.section-container` utility for consistent horizontal padding

## Design Tokens (key ones)
- Colors: `lego-red`, `lego-yellow`, `lego-blue`, `lego-green`, `lego-dark`, `lego-grey-*`, `lego-cream`
- Fonts: `font-display` (Baloo 2), `font-body` (DM Sans)
- Color semantics: Red=current, Yellow=action, Green=visited, Grey=inactive

## Testing
- Vitest with jsdom + Testing Library
- Test files colocated in `__tests__/` directories within component folders
- Setup file: `vitest.setup.ts`
