---
created: 2026-03-15T09:43:20.545Z
title: EntityCards initials circle color should match variant
area: ui
files:
  - src/components/ui/content-blocks/EntityCards.tsx:24-26
---

## Problem

The EntityCards component's initials circle (the badge showing initials like "TS", "MF", etc.) always uses the same color regardless of the variant prop. When a red variant is used, the initials circle should also be red — currently it stays the default color, breaking visual consistency with the variant system.

## Solution

- Read the `variant` prop in EntityCards and apply variant-aware colors to the initials circle (lines 24-26)
- Map variant to circle background/border colors (e.g. red variant → red circle, yellow variant → yellow circle, default → current default)
- May need to extend `variantStyleMap` or create a parallel mapping for the initials badge
