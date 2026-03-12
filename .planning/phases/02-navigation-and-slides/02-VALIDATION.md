---
phase: 2
slug: navigation-and-slides
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.0.18 + @testing-library/react ^16.3.2 |
| **Config file** | `vitest.config.ts` (project root) |
| **Quick run command** | `npx vitest run src/components/features/presentation` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/components/features/presentation`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 0 | NAV-01, NAV-03, NAV-04, NAV-05, SLIDE-04 | unit (reducer) | `npx vitest run src/components/features/presentation/__tests__/reducer.test.ts` | ❌ W0 | ⬜ pending |
| 2-01-02 | 01 | 0 | SLIDE-01, SLIDE-03, A11Y-01, A11Y-02, A11Y-04 | unit (component) | `npx vitest run src/components/features/slide/SlideOverlay/__tests__/SlideOverlay.test.tsx` | ❌ W0 | ⬜ pending |
| 2-02-01 | 02 | 1 | NAV-01, NAV-03, NAV-04, NAV-05 | unit (reducer) | `npx vitest run src/components/features/presentation/__tests__/reducer.test.ts` | ❌ W0 | ⬜ pending |
| 2-02-02 | 02 | 1 | SLIDE-04, BACK boundary | unit (reducer) | `npx vitest run --reporter=verbose` | ❌ W0 | ⬜ pending |
| 2-03-01 | 03 | 1 | SLIDE-01, SLIDE-02, SLIDE-03 | unit (component) | `npx vitest run src/components/features/slide` | ❌ W0 | ⬜ pending |
| 2-03-02 | 03 | 1 | A11Y-01, A11Y-02, A11Y-04 | unit (component) | `npx vitest run src/components/features/slide` | ❌ W0 | ⬜ pending |
| 2-04-01 | 04 | 2 | SLIDE-05, A11Y-03, A11Y-05 | manual smoke | keyboard nav in browser | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/features/presentation/__tests__/reducer.test.ts` — stubs covering NAV-01, NAV-03, NAV-04, NAV-05, SLIDE-04, BACK boundary cases, JUMP_TO_STOP
- [ ] `src/components/features/slide/SlideOverlay/__tests__/SlideOverlay.test.tsx` — stubs covering SLIDE-01, SLIDE-03, A11Y-01, A11Y-02, A11Y-04

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Exit animation plays on close | SLIDE-05 | Visual animation not testable in jsdom | Open overlay, press Escape — observe scale-out animation in browser |
| Visible focus indicators | A11Y-03 | Visual ring appearance not reliably testable | Tab through all overlay buttons — confirm visible focus ring on each |
| Overlay renders in layout (not route) | SLIDE-02 | Architecture constraint, not behavior | `npm run build` passes; overlay appears without URL change |
| Code comments present | A11Y-05 | Code review, not automated | Review reducer and SlideOverlay for keyboard navigation comments |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
