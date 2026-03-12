# Phase 3: Map and Car Animation - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the Phase 1 blank canvas placeholder (`MapCanvas.tsx`) with a real illustrated SVG world map, LEGO-themed stop node markers, a red LEGO car element, and animated car travel along the road path between stops. Includes the two-step interaction model (travel first, open overlay on second input) and visited/unvisited stop visual states. Slide content and design tokens are Phase 4.

</domain>

<decisions>
## Implementation Decisions

### World map visual
- Stylized illustrated terrain map — NOT a real geographic world map
- Aesthetic: flat illustration style (game map / LEGO instruction booklet feel)
- Narrative: road starts in rural idyll (left side) and ends at a modern city (right side) — mirrors the AngularJS → React modernization story
- Visual elements to include (from inspiration screenshots):
  - Sky and grass color palette from Screenshot 1 (brighter/lighter than Screenshot 2)
  - Pond, mountains from Screenshot 1
  - Road color from Screenshot 1
  - Buildings/cityscape on the right side of the map (Screenshot 2)
  - Clouds at varied heights (not all at the same level)
  - Sun
  - Windmill, small fence
  - Balanced density — not too crowded, not too empty (Screenshot 1 as reference)
- What to avoid/improve vs the screenshots:
  - Road curves should be more curvy and "prettier" (both screenshots)
  - Sky and grass should not be as dark as in Screenshot 2
  - Clouds at varied heights (Screenshot 2's uniform height is wrong)
  - Placement of decorative elements should feel intentional, not random
  - Cows were a nice idea but looked weird — omit or redesign
- Built by the **frontend-design skill** with the two screenshots as direct visual reference
  - Screenshots at: `.planning/assets/map-inspiration/Screenshot 2026-03-12 at 16.24.55.png` and `.planning/assets/map-inspiration/Screenshot 2026-03-12 at 16.32.10.png`
  - **User uploads both screenshots at execution time** — required reference input to frontend-design
  - frontend-design has creative freedom: use screenshots as inspiration and improve on what's noted above

### Car element
- Red LEGO car — Claude's discretion for exact SVG design, with Screenshot 1 car as visual reference
- Auto-rotates to face direction of travel (`offsetRotate` auto via CSS motion path)
- Arrival animation: small spring/bounce when car reaches destination stop
- **Two-step interaction model** (new — changes Phase 2 reducer behavior):
  - Step 1: ADVANCE on map → car travels to next stop, car parks with arrival animation, stop becomes active
  - Step 2: ADVANCE / Space / click (while on map, car parked) → slide overlay opens
  - This replaces the Phase 2 behavior where ADVANCE on map immediately opened the overlay
- Input during travel: research best UX practice (Claude's discretion) — options are ignore input, skip to destination, or queue. Implement whichever is most appropriate for presentation context.

### Travel path
- One continuous winding road SVG path connecting all 5 stops in sequence
- The road is both the visual road on the illustrated map AND the `offsetPath` for the car animation
- The path shape is determined during map design (frontend-design skill)
- Road must be more curvy and "prettier" than the Figma Make references
- Car travels forward (stop 0→1→2→3→4) and backward (stop 4→3→2→1→0) along the same path
- Backward travel: car reverses along the road path (same path, reversed direction)

### Stop node markers
- LEGO-themed location marker (not a generic map pin — Claude and frontend-design design it)
- Always-visible stop name label (below or beside the marker — never hidden on hover)
- Three visual states:
  - **Unvisited**: hollow / muted marker
  - **Visited**: filled LEGO yellow marker
  - **Active / current stop**: brighter or with a focus ring — distinct from both visited and unvisited
- Each marker is a focusable `<button>` with keyboard tab order and screen reader label (MAP-02)
- Clicking a stop marker dispatches `JUMP_TO_STOP` (existing Phase 2 action)

### Progress indicator (MAP-04)
- The Phase 2 slide overlay footer already has a progress indicator (numbered circles 1–5)
- The map view needs its own visible progress indicator showing current position in the journey
- The marker states (visited/active/unvisited) on the map serve as the primary visual progress cue
- A separate progress bar or counter is Claude's discretion — keep it simple and non-intrusive

### State machine changes required
- Phase 2 reducer's `ADVANCE` on `mode='map'` currently opens the slide overlay immediately
- Phase 3 introduces an intermediate state: car traveling and car parked (arrived but overlay not open yet)
- Requires either a new `mode` value (`'traveling'`) or an `isCarTraveling: boolean` flag in `PresentationState`
- New flow: `mode='map'` + ADVANCE → travel state → arrival → `mode='map'` again (car parked) → ADVANCE → `mode='slide'`
- This is a breaking change to NAV-04; planner must coordinate state machine update

### Claude's Discretion
- Exact SVG implementation of the LEGO-themed location marker
- Exact car SVG design (red LEGO car, Screenshot 1 as reference)
- Whether to add `mode: 'traveling'` or use a boolean flag for travel state
- Input handling during car travel (research best UX practice)
- Road path `d` attribute values — designed as part of the frontend-design SVG creation
- Stop coordinate values in data files — updated to match real map positions after SVG is built
- Progress indicator design on the map view (beyond the marker states)

</decisions>

<specifics>
## Specific Ideas

- The road/map narrative (idyll → city) directly mirrors the proposal's argument: AngularJS legacy (rural, old-fashioned) → React+Next.js (modern, urban). This metaphor should be legible to the audience.
- "I want control over when to open the slides" — the two-step model gives the presenter a beat to pause at each stop before committing to the content. This is intentional pacing, not a technical detail.
- Stop labels always visible — audience can orient to the journey without needing to hover. Important for a live presentation context.
- Screenshot 1 (16.24.55): reference for sky/grass colors, pond, mountains, road color, car, overall density/balance
- Screenshot 2 (16.32.10): reference for the idyll→city narrative, buildings, sun, windmill, fence concept, cloud concept (but not the uniform cloud heights)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `MapCanvas.tsx` (`src/components/features/map/`): Phase 1 placeholder — Phase 3 replaces the div/background with an inline SVG map. The `stops.map()` loop and `StopNode` rendering structure is reusable.
- `StopNode.tsx` (`src/components/features/map/`): Phase 1 button component. Phase 3 replaces the button visual with the LEGO marker, but the click handler (`triggerRef` + `JUMP_TO_STOP` dispatch) is already correct.
- `usePresentation` hook: `state.currentStop`, `state.mode`, `dispatch` — already available for all map/car logic
- `stops[]` from `src/data/topics/`: coordinates are placeholder percentages — Phase 3 must update all 5 stop coordinate values after the SVG map is built
- `OverlayPresence` + `SlideOverlay`: no changes needed — Phase 3 only changes WHEN the overlay opens (on second ADVANCE), not HOW it opens

### Established Patterns
- `'use client'` boundary required on all animation components (car travel uses Framer Motion)
- `MotionConfig reducedMotion="user"` at provider level — car animation inherits this automatically
- State-driven navigation: reducer handles all state transitions, components are display-only
- CSS motion path (`offsetPath` / `offsetDistance`) via Framer Motion for the car travel

### Integration Points
- `PresentationState` + `Action` types (`src/types/presentation.ts`): may need new state field for travel mode — planner to decide whether to add `mode: 'traveling'` or `isCarTraveling: boolean`
- `presentationReducer` (`src/components/features/presentation/`): ADVANCE on map changes behavior — needs travel → parked → overlay flow
- Stop coordinate values in `src/data/topics/stop-0*.ts`: 5 placeholder coordinates must be updated to match actual SVG positions after frontend-design builds the map
- `KeyboardController`: may need to ignore inputs during car travel — planner handles

</code_context>

<deferred>
## Deferred Ideas

- Visual grouping / clustering of stops on map by theme — not needed with 5 stops on a single road
- Per-stop visual variation (different building types per stop matching the stop's content) — nice idea, defer to Phase 4 polish if time allows
- Touch/swipe gesture support — v2 backlog (ENH-02)

</deferred>

---

*Phase: 03-map-and-car-animation*
*Context gathered: 2026-03-12*
