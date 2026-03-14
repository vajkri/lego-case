---
created: 2026-03-12T19:44:23.949Z
title: Clean up shadows for map elements
area: ui
files:
  - src/components/features/map/MapSvg.tsx
  - src/components/features/map/RoadPath.tsx
---

## Problem

Map elements (mountains, buildings, trees, road) have inconsistent or missing shadow treatment. The road has a drop shadow (`translate(3,6)` with `rgba(0,0,0,0.28)`), but other elements like mountains and buildings lack matching shadow styles. This creates an uneven depth perception across the illustrated scene.

## Solution

- **Road shadow must go** — the current drop shadow (`translate(3,6)`) makes the road look like it's hovering above the grass instead of being painted on it
- Other element shadows (buildings, mountains, trees) should feel organic and grounded, not uniform or mechanical
- Audit all map elements in MapSvg.tsx and RoadPath.tsx for shadow consistency with the LEGO instruction booklet aesthetic
