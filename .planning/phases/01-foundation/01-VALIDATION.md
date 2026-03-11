---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + @testing-library/react — Wave 0 installs |
| **Config file** | vitest.config.ts — Wave 0 creates |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm test -- --passWithNoTests` |
| **Estimated runtime** | ~30 seconds (build) + ~5 seconds (tests) |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm test -- --passWithNoTests`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~35 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 0 | FOUND-01 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 0 | FOUND-03 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 0 | FOUND-04 | unit | `npm test -- --passWithNoTests` | ❌ W0 | ⬜ pending |
| 1-01-04 | 01 | 0 | FOUND-05 | unit | `npm test -- --passWithNoTests` | ❌ W0 | ⬜ pending |
| 1-01-05 | 01 | 0 | FOUND-06 | unit | `npm test -- --passWithNoTests` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 1 | FOUND-01, FOUND-03 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 1-02-02 | 02 | 1 | FOUND-02 | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 1-03-01 | 03 | 1 | FOUND-04 | unit | `npm test -- --passWithNoTests` | ❌ W0 | ⬜ pending |
| 1-03-02 | 03 | 1 | FOUND-03 | unit | `npm test -- --passWithNoTests` | ❌ W0 | ⬜ pending |
| 1-04-01 | 04 | 1 | FOUND-05, FOUND-06, QUAL-02 | unit | `npm test -- --passWithNoTests` | ❌ W0 | ⬜ pending |
| 1-05-01 | 05 | 2 | FOUND-07, QUAL-01, QUAL-03 | manual | `ls src/components/` + visual check | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — install `vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] `src/data/topics/__tests__/stops.test.ts` — covers FOUND-05, FOUND-06
- [ ] `src/components/features/presentation/__tests__/PresentationProvider.test.tsx` — covers FOUND-03, FOUND-04, NAV-01 stub

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Component structure matches `ui/`, `layout/`, `features/` | FOUND-07, QUAL-01 | Directory structure — no runtime assertion | `ls src/components/` and verify three folders exist |
| No hardcoded strings in component JSX | QUAL-02 | ESLint rule would require custom plugin; not worth the overhead for Phase 1 | Code review: grep for string literals inside JSX in `src/components/` |
| Developer can understand codebase in < 5 minutes | FOUND-07 | Subjective readability criterion | Fresh eyes review: check file names, folder structure, and component responsibility |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 35s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
