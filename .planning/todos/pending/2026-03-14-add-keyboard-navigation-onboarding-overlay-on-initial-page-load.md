---
created: 2026-03-14T19:43:00.022Z
title: Add keyboard navigation onboarding overlay on initial page load
area: ui
files: []
---

## Problem

First-time users have no indication that the presentation is keyboard-navigable (ArrowLeft/Right, Space, Escape). There's no onboarding or hint overlay that explains the available controls on initial page load.

## Solution

Show a keyboard navigation onboarding overlay on first visit:
- Display on initial page load explaining available keyboard shortcuts (arrows, space, escape)
- Include a "Don't show this again" checkbox
- Close button dismisses the overlay
- When "Don't show this again" is checked and the user closes, persist the preference to localStorage with a ~30-day TTL (store a timestamp, check expiry on load)
- If TTL has expired, show the onboarding again
