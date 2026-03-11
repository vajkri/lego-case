# Project Conventions

## Component Organization

### Folder Organization

```
src/components/
├── ui/                   # Generic reusable UI primitives (Button, Card, Input, Badge, SearchBar)
├── layout/               # Layout primitives (Stack, Inline, Grid, Container, Cluster)
└── features/             # Feature components, nested by usage
```

### Naming Conventions

| Folder type      | Naming        | Example            |
| ---------------- | ------------- | ------------------ |
| Single export    | `PascalCase/` | `features/Header/` |
| Multiple exports | `lowercase/`  | `features/home/`   |

### Nesting Rules

1. **Page-scoped components** → `features/{page}/Component.tsx`
2. **Standalone features** → `features/FeatureName/`
3. **Sub-components** → nested under parent: `Parent/index.tsx` + `Parent/Child.tsx`

### Feature components

- Page-specific sections (e.g. HeroSection, CategoryPills, OffersLoader, TrustSection, etc.) live in `src/components/features/{page}/`
- Each section gets its own file: `src/components/features/{page}/HeroSection.tsx`, etc.
- One-off components that are page-specific but may grow in complexity belong here — not inline in page files
- Shared layout-level components (Header, Footer, Nav) live in `src/components/features/` subdirectories, e.g. `src/components/features/Footer/`

### UI primitives

- Generic, reusable components live in `src/components/ui/` (Button, Card, Input, Badge, SearchBar, etc.)
- Layout primitives (Stack, Inline, Grid, Container, Cluster) live in `src/components/layout/`

### Barrel exports

- Every component directory has an `index.ts` barrel export
- Export everything in one line, like so: `export * from './Button'`

## Design Token System

### Two-layer architecture

| Layer                     | Location                                   | Purpose                                   | Synced to Figma?   |
| ------------------------- | ------------------------------------------ | ----------------------------------------- | ------------------ |
| Generic + semantic tokens | `tokens/1-generic/` + `tokens/2-semantic/` | Source of truth for design values         | ✅ Yes             |
| Tailwind CSS properties   | `src/styles/theme.css`                     | Where tokens land for Tailwind to consume | No (manual mirror) |

**No automated sync yet** — when adding a design token, update both layers manually. Phase 4.2 will add a build step.

### Where to add a new token

- **Design token** (color, shadow, radius, typography, spacing, motion) → add to `tokens/` first, then mirror to `theme.css`
- **Code-only token** (component sizes, layout constants Figma doesn't care about) → `theme.css` only

### Tailwind class generation from `@theme`

`@theme { --foo-bar: value }` generates utility class `foo-bar`.
`@theme inline { --foo-bar: var(...) }` creates the CSS variable **without** generating a duplicate utility class — use for semantic aliases.

Key generated classes from this project's tokens:

- `--font-size-body-sm` → `text-body-sm` (not `text-[length:var(...)]`)
- `--z-index-overlay` → `z-overlay` (not `z-50`)
- `--drop-shadow-hover` → `drop-shadow-hover` (not `drop-shadow-xl`)
- `--shadow-card` → `shadow-card`
- CSS var shorthand in classes: `h-(--image-size-thumbnail)` not `h-[var(--image-size-thumbnail)]`

### Pitfalls

- `rounded` (bare, no suffix) — `--radius` is not defined; always use `rounded-sm`, `rounded-md`, etc.
- `drop-shadow-*` and `shadow-*` are separate Tailwind utility families; resetting `--shadow-*: initial` does **not** reset `--drop-shadow-*`
- Shadow values use navy-900 (`rgba(26, 25, 41, ...)`) not pure black — keep consistent
- **Tailwind v4 auto-scans all files including markdown docs.** `CLAUDE.md`, `.planning/**`, `.serena/**`, and `.claude/**` are excluded via `@source not` in `src/styles/globals.css`. Do not write example Tailwind arbitrary-value class names in documentation — they get picked up as real classes and generate invalid CSS.
- **Diagnosing CSS parse errors in `globals.css`:** The compiled output (`globals.css`) failing to parse usually means Tailwind picked up a bad class name from a content file, not a bug in `theme.css` itself. Check `@source not` exclusions first.

## Tool Preferences

**Code searches:** Serena tools first (`serena-find_file`, `serena-find_symbol`, `serena-search_for_pattern`), then glob → grep → shell.

**Third-party library docs:** Query context7 MCP before writing code that uses any library/framework.

1. `mcp__context7__resolve-library-id` — find library ID
2. `mcp__context7__query-docs` — query relevant docs
3. Write code based on results

Skip context7 if: already queried this session, basic JS/TS syntax, or project-internal code only.
