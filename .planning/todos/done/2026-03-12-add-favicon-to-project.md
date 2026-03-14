---
created: 2026-03-12T05:03:48.379Z
title: Add favicon to project
area: ui
files:
  - src/app/layout.tsx
---

## Problem

The project currently has no favicon. Next.js will use a default one, which is not appropriate for a client-facing proposal deck. A branded or neutral favicon should be added before the project is shared.

## Solution

Add a `favicon.ico` (and optionally `icon.png`) to `src/app/` — Next.js App Router picks these up automatically via the file-based metadata API. No code changes needed beyond placing the asset.
