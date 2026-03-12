# Project Conventions

## Component Organization

### Folder Organization

```
src/components/
├── ui/                   # Generic reusable UI primitives (e.g. Button, Card, Input, Badge, SearchBar)
├── layout/               # Layout primitives (e.g. Stack, Inline, Grid, Container, Cluster)
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

## Tool Preferences

**Code searches:** Serena tools first (`serena-find_file`, `serena-find_symbol`, `serena-search_for_pattern`), then glob → grep → shell.

**Third-party library docs:** Query context7 MCP before writing code that uses any library/framework.

1. `mcp__context7__resolve-library-id` — find library ID
2. `mcp__context7__query-docs` — query relevant docs
3. Write code based on results

Skip context7 if: already queried this session, basic JS/TS syntax, or project-internal code only.
