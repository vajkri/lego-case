---
phase: 4
slug: content-and-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-14
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm test -- --reporter=verbose src/data/topics` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- src/data/topics/__tests__/stops.test.ts`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green (excluding pre-existing CarElement/MinifigHead failures)
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | PERF-01 | unit | `npm test -- src/data/topics` | ✅ (needs update) | ⬜ pending |
| 04-01-02 | 01 | 1 | PERF-01 | unit | `npm test -- src/components/ui/content-blocks` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 1 | PERF-03 | unit | `npm test -- src/components/features/slide` | ✅ (needs update) | ⬜ pending |
| 04-03-01 | 03 | 2 | PERF-01 | build | `npm run build` | N/A | ⬜ pending |
| 04-03-02 | 03 | 2 | PERF-02 | manual | `npm run build && npm start` | N/A | ⬜ pending |
| 04-03-03 | 03 | 2 | PERF-03 | manual | Browser console check | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No new test files needed. Existing files require updates:
- [ ] `src/data/topics/__tests__/stops.test.ts` — update `lines` assertions to `blocks` assertions (covers PERF-01 structural integrity)
- [ ] `src/components/features/slide/SlideOverlay/__tests__/SlideOverlay.test.tsx` — verify test still passes after `SlideContent` props change

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| App interactive < 3s | PERF-02 | Requires browser timing | `npm run build && npm start`, measure time to interactive |
| No console errors in production | PERF-03 | Requires browser console | Open built site, check DevTools console for errors |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
