---
created: 2026-03-14T10:58:02.570Z
title: Footer unclickable during slides — hide or restructure for map-only use
area: ui
files:
  - src/components/features/presentation/PresentationFooter.tsx
  - src/components/features/slide/SlideOverlay/SlideOverlay.tsx
---

## Problem

The PresentationFooter buttons cannot be clicked when the slide overlay is showing. The slide overlay (`z-40`, `absolute inset-0`) covers the footer, making it unreachable.

Broader design question: should the footer only belong to the map view and be hidden when slides are showing? This avoids having both a fixed footer and a fixed header (the red stud bar) visible simultaneously, which is risky on smaller screens or zoomed-in views (accessibility consideration — reduced viewport space).

## Solution

Options to evaluate:
1. **Hide footer during slides** — simplest. Footer is map-only. Slide overlay has its own nav (left/right arrows). Recovers vertical space. Consider: how does the user return to map? (close button in header already handles this)
2. **Show footer above overlay** — raise z-index. But then two sets of nav controls are visible (footer arrows + slide arrows), which is confusing.
3. **Transform footer during slides** — e.g. collapse to minimal bar or move nav into slide chrome.

Option 1 seems cleanest. The slide overlay already has full navigation (back/advance arrows, close button). The footer's map toggle button ("Map" / "Zoom in") is the only unique control — and the close button in the stud header serves the same purpose.
