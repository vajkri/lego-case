# Codebase Structure

```
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout (fonts, metadata)
│   ├── page.tsx                 # Home page → renders MapCanvas
│   ├── globals.css              # Design tokens (@theme + :root vars)
│   └── icon.svg
├── components/
│   ├── ui/                      # Reusable UI primitives
│   │   ├── Button/              # 4 variants (yellow/red/grey/ghost), 2 sizes
│   │   ├── SlideFrame/          # Slide chrome: SlideFrame, StopBadge, SubSlideProgress
│   │   ├── content-blocks/      # 6 content block types + variant system
│   │   └── index.ts             # Barrel export
│   ├── layout/                  # Layout primitives (currently minimal)
│   └── features/
│       ├── map/                 # Map view: MapCanvas, MapSvg, StopNode, RoadPath, CarElement, MapProgressIndicator
│       ├── slide/               # Slide overlay: SlideOverlay, SlideContent, OverlayPresence
│       └── presentation/        # Presentation state: PresentationProvider, PresentationFooter, KeyboardController
├── data/
│   └── topics/                  # Content data: 5 stop files (stop-01 through stop-05) + index
└── types/
    └── presentation.ts          # Core type definitions
```

## Naming Conventions
- **PascalCase folders** for single-export components (e.g. `Button/`)
- **lowercase folders** for multi-export groups (e.g. `content-blocks/`)
- Every component directory has `index.ts` barrel exports

## Key Architectural Patterns
- Content lives in typed TypeScript data files (`src/data/topics/`)
- Presentation state managed via Zustand store in PresentationProvider
- Keyboard navigation handled by KeyboardController component
- Slide overlay uses animation presence pattern (OverlayPresence → SlideOverlay)
- Nav arrows are inlined as ReactNode slots in SlideFrame (not separate components)
- All components import from `@/components/ui` barrel
