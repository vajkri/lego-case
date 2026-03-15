---
created: 2026-03-15T09:39:32.017Z
title: Enlarge stop nodes and preserve brick colors when visited
area: ui
files:
  - src/components/features/ (stop node components)
---

## Problem

Stop nodes on the road map need more visual prominence. Currently they are too small relative to the road, and when visited they lose their characteristic brick color entirely (switching to green). The desired behavior is:

1. **Size:** Stop nodes should be ~125% of their current size
2. **Color on visit:** Only the stop *label* should turn green when visited — the node itself should keep its original brick color (red, yellow, etc.)
3. **Road alignment:** After resizing, stop node placement must remain correctly aligned with the road path

## Solution

- Scale stop node dimensions to 125% of current values
- Refactor visited-state styling so the node body retains its brick color and only the label text/badge changes to green
- Verify/adjust road-relative positioning after size change
