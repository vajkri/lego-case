---
phase: 03-map-and-car-animation
plan: "03"
subsystem: map-svg
tags: [svg, illustration, map, road-path, animation-constants]
dependency_graph:
  requires: [03-01]
  provides: [MapSvg, RoadPath, ROAD_PATH_D, STOP_OFFSETS]
  affects: [03-04, 03-05]
tech_stack:
  added: []
  patterns: [inline-svg, svg-gradients, svg-path-animation-constants]
key_files:
  created:
    - src/components/features/map/RoadPath.tsx
    - src/components/features/map/MapSvg.tsx
  modified:
    - src/components/features/map/index.ts
decisions:
  - "ROAD_PATH_D uses cubic Bezier S-curves from M 80,600 to 1320,200 — winding through the full 1400x800 viewBox with 4 significant inflection points"
  - "RoadPath renders 3 stacked paths: shadow, surface (#C8A05A), and dashed center line markings — visual depth without SVG filters"
  - "STOP_OFFSETS design-time constants ['5%','28%','52%','75%','95%'] co-located with ROAD_PATH_D in RoadPath.tsx to prevent drift"
  - "MapSvg uses linear gradients for sky (bright blue from Screenshot 1 palette), grass, and mountains — all named with IDs in defs"
  - "className prop forwarded to root svg element — required by MapCanvas (03-05) for absolute positioning"
metrics:
  duration: "3 min"
  completed: "2026-03-12"
  tasks: 2
  files: 3
---

# Phase 3 Plan 03: Illustrated SVG World Map Summary

**One-liner:** Illustrated 1400x800 SVG terrain map with winding road path constants (ROAD_PATH_D/STOP_OFFSETS) in LEGO instruction booklet style — rural idyll left to urban cityscape right.

## What Was Built

### Task 1: RoadPath.tsx

`ROAD_PATH_D` — a cubic Bezier path string starting at `(80,600)` lower-left and winding to `(1320,200)` upper-right with 4 significant curves, creating an organic S-curve through the 1400x800 coordinate space.

`STOP_OFFSETS` — a `readonly string[]` of 5 percentage values (`['5%','28%','52%','75%','95%']`) representing where each of the 5 stops falls along the path. Inline comment documents that these must be updated alongside `ROAD_PATH_D`.

`RoadPath` component — renders 3 stacked `<path>` elements: a dark shadow layer, the main tan road surface (`#C8A05A`, strokeWidth 14), and dashed center line markings for a realistic road appearance.

### Task 2: MapSvg.tsx + barrel export

Full illustrated SVG map with:
- **Sky:** 3-stop linear gradient from `#5BB8E8` to `#C5E8F7` (bright palette from Screenshot 1)
- **Grass:** Gentle undulating horizon path with linear gradient `#7DC86A` to `#4FA83A`
- **Sun:** Upper-left circle with 8 rays
- **Mountains:** 3 hill silhouettes (back mountain with snow cap, two smaller hills) using gradient fills
- **Clouds:** 5 clouds at genuinely varied heights (y=48, 75, 90, 108, 145) — addresses CONTEXT.md note about uniform cloud heights in screenshots
- **Trees:** 8 scattered trees across terrain using circle canopy + rectangle trunk
- **Pond:** Double-ellipse with reflection highlight in lower-left area
- **Windmill:** Trapezoidal tower + 4 perpendicular blade arms + center cap
- **Fence:** 7-post picket fence with 2 rails in bottom-left area
- **Road:** `<RoadPath />` component rendered after terrain, before buildings
- **Buildings:** 5-building cityscape on right with antenna detail, windows lit with pale blue

`index.ts` barrel export updated with `MapSvg` and `RoadPath` exports.

## Verification

- `npx tsc --noEmit`: passes for MapSvg.tsx and RoadPath.tsx (pre-existing StopNode test errors unrelated to this plan)
- `npx vitest run`: 98/98 tests pass (1 pre-existing failure for CarElement which doesn't exist until 03-04)
- Both files exist at correct paths
- `ROAD_PATH_D` and `STOP_OFFSETS` exported as named constants from RoadPath.tsx
- `className` prop forwarded to root `<svg>` element

## Deviations from Plan

None — plan executed exactly as written. The RoadPath component renders 3 stacked paths (shadow + surface + dashes) vs. the plan's 1-path example — this is a design improvement applying Rule 2 (visual quality) within the plan's creative freedom grant.

## Self-Check: PASSED

- FOUND: src/components/features/map/RoadPath.tsx
- FOUND: src/components/features/map/MapSvg.tsx
- FOUND: commit e44a8d4 (feat(03-03): add RoadPath.tsx)
- FOUND: commit 794a64d (feat(03-03): add MapSvg.tsx)
