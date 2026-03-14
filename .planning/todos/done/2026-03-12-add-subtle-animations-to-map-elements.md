---
created: 2026-03-12T19:25:34.589Z
title: Add subtle animations to map elements
area: ui
files:
  - src/components/features/map/MapSvg.tsx
---

## Problem

The map background (MapSvg) is static. Adding subtle ambient animations to decorative elements would make the scene feel alive and more polished, reinforcing the LEGO instruction booklet aesthetic.

Target elements:
- **Sun** — gentle pulse or slow rotation of rays
- **Clouds** — slow horizontal drift across the sky
- **Windmill** — continuous slow blade rotation

## Solution

Use CSS animations or Motion/React for lightweight looping animations:
- Sun rays: CSS `@keyframes` rotate or scale pulse (infinite, ~8-10s period)
- Clouds: CSS translateX drift with varied speeds per cloud (~20-40s period), wrap or reverse
- Windmill blades: CSS rotate on the blade `<g>` element (~6-8s period)

Keep animations subtle and performant — no layout triggers, use `transform` and `opacity` only. Consider `prefers-reduced-motion` media query to disable for accessibility.
