---
phase: 3
slug: map-and-car-animation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 + @testing-library/react 16.3.2 |
| **Config file** | `vitest.config.ts` (root) |
| **Quick run command** | `npx vitest run src/components/features/presentation/__tests__/reducer.test.ts` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/components/features/presentation/__tests__/reducer.test.ts`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| State types update | TBD | 0 | NAV-04 | unit | `npx vitest run src/components/features/presentation/__tests__/reducer.test.ts` | ✅ needs update | ⬜ pending |
| ARRIVE action + reducer | TBD | 0 | CAR-02 | unit | `npx vitest run src/components/features/presentation/__tests__/reducer.test.ts` | ✅ needs new cases | ⬜ pending |
| ADVANCE two-step flow | TBD | 0 | NAV-04 | unit | `npx vitest run src/components/features/presentation/__tests__/reducer.test.ts` | ✅ needs new cases | ⬜ pending |
| StopNode LEGO marker | TBD | W0 | MAP-02, MAP-03 | unit (render) | `npx vitest run src/components/features/map/__tests__/StopNode.test.tsx` | ❌ W0 | ⬜ pending |
| CarElement motion path | TBD | W0 | CAR-01, CAR-02, CAR-03 | unit (render) | `npx vitest run src/components/features/map/__tests__/CarElement.test.tsx` | ❌ W0 | ⬜ pending |
| MapCanvas SVG renders | TBD | W0 | MAP-01 | smoke (visual) | human verification | manual-only | ⬜ pending |
| Car travel smooth 60fps | TBD | final | CAR-04 | manual | DevTools Performance tab | manual-only | ⬜ pending |
| MAP-04 progress indicator | TBD | TBD | MAP-04 | unit (render) | included in StopNode/MapCanvas tests | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/features/map/__tests__/StopNode.test.tsx` — stubs covering MAP-02 (focusable button, aria-label), MAP-03 (three visual states: unvisited/visited/active render correctly)
- [ ] `src/components/features/map/__tests__/CarElement.test.tsx` — stubs covering CAR-01 (renders at correct stop), CAR-02 (offsetDistance prop matches STOP_OFFSETS[targetStop]), CAR-03 (uses offsetPath not top/left)
- [ ] Update existing `src/components/features/presentation/__tests__/reducer.test.ts` — add `isCarTraveling: false` and `visitedStops: []` to all existing test fixtures; add new cases for: ARRIVE action, ADVANCE-during-travel no-op, two-step ADVANCE flow (travel → parked → slide)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| SVG world map renders with illustrated terrain, correct palette, all 5 stop labels visible | MAP-01 | SVG visual design — not automatable | Open app in browser, confirm map looks correct against inspiration screenshots |
| Car travel animation smooth, no dropped frames | CAR-04 | Frame rate is a runtime performance metric | Open Chrome DevTools → Performance tab, trigger car travel, confirm no frame drops below 60fps |
| Car auto-rotates to face direction of travel | CAR-02 | CSS `offsetRotate: auto` — visual-only verification | Trigger forward and backward travel; confirm car faces the correct direction |
| Arrival spring/bounce animation plays | CAR-01 | Visual animation quality | After car arrives at stop, confirm visible spring/bounce on car element |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
