# Feature Research

**Domain:** Custom interactive presentation web app (conference/client pitch)
**Researched:** 2026-03-11
**Confidence:** HIGH

## Context

This presentation is a LEGO migration proposal built in Next.js App Router — the stack choice IS the argument. The audience is mixed: engineers who will scrutinize code quality and architecture decisions, and stakeholders who need the business case. Features must serve a live presenter delivering to a room, not a self-guided browser experience.

The core metaphor (LEGO world map, animated car traveling between topic "cities") is already decided. This research identifies which surrounding features make that metaphor sing vs. which are scope traps.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features where absence breaks the presentation or signals incompetence to the LEGO audience.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Keyboard navigation (arrow keys, space) | Every modern presentation tool supports this; presenter needs hands-free control | LOW | Arrow Left/Right for between topics, within sub-slides. Space advances. Escape returns to map from slide. |
| Fullscreen mode | Presentations run fullscreen; browser chrome is distracting and unprofessional | LOW | Use browser Fullscreen API (`document.documentElement.requestFullscreen()`). Keyboard shortcut F or button. |
| Slide transitions (animated) | Bare content without transitions feels unfinished and undermines the "polished React demo" message | MEDIUM | The map-to-slide zoom IS the transition — this is already architecturally central, not an add-on. |
| Progress indicator | Audience and presenter need orientation: "where are we in 14 topics?" | LOW | Can be a simple city-count (3/14), a progress bar, or dots. Map view provides spatial progress inherently. |
| `prefers-reduced-motion` support | WCAG 2.3.3 (AAA) and 2.3.1 (A) requirements; also signals accessibility competence to LEGO | LOW | Framer Motion has built-in `useReducedMotion()` hook. Animations dissolve/skip rather than play when active. |
| ARIA roles and live regions for slide changes | Screen reader users need announcements when slide content changes | MEDIUM | `aria-live="polite"` on slide container. `aria-roledescription="slide"` on slide elements. Proper heading structure within each slide. |
| Visible keyboard focus indicators | WCAG 2.4.7 — focus must be visible; critical for keyboard-only navigation demo | LOW | CSS `:focus-visible` with high-contrast ring. Never suppress focus outlines. |
| Responsive to viewport (desktop-first) | Presentations run on varied projectors and monitors; fixed pixel layouts break | LOW | Use viewport units and fluid sizing. 16:9 aspect ratio container with letterboxing fallback. |
| No FOUC / instant load | Opening slide loads blank then flashes = amateur signal | LOW | Next.js static export, no async content fetching on first paint. |
| Slide content for all 14 topics | The content IS the proposal; missing topics = incomplete proposal | HIGH | All 14 topics from `proposal-content.md` must be authored. This is the highest-effort table-stakes item. |

### Differentiators (Competitive Advantage)

Features that make this presentation memorable to a LEGO audience and signal React+Next.js competence.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| LEGO world map with animated car travel | Playful, on-brand, memorable — turns a standard pitch into a story. Audience remembers the journey, not just slides. | HIGH | Core metaphor. SVG or canvas map with 14 city nodes; Framer Motion path animation for car. Central to the product, not an add-on. |
| Full-screen city zoom-in takeover | The transition FROM map TO slide is itself a visual argument ("we can do animation"). Makes each topic arrival feel like an event. | HIGH | AnimatePresence + layout animation or custom zoom. The map scales up/zooms to the city, then slides fill screen. |
| Return-to-map animation (zoom-out) | Reinforces spatial narrative — audience sees where they've been and where they're going. Completes the journey metaphor. | MEDIUM | Reverse of zoom-in. Visited cities should have a "visited" visual state (e.g., darker, checkmark). |
| Multi-slide support per topic with sub-navigation | Some topics need 3-4 steps (e.g., Migration Steps). Linear sub-slides within a city before returning to map. | MEDIUM | State machine: map → city arrival → sub-slide 1 → sub-slide 2 → sub-slide N → return to map. |
| Visited city visual state | Shows audience/presenter progress spatially. Reinforces narrative arc. | LOW | Visited cities get a visual treatment (color, icon). Purely CSS/state, low complexity. |
| LEGO-inspired visual design (tokens, typography) | Signals brand fluency — presenter understands LEGO's visual language. Shows design-system thinking in action. | MEDIUM | Design tokens for LEGO colors (yellow, red, black, white), LEGO typefaces or close equivalents. Must be design-system-ready for when Figma Make design arrives. |
| "Meta" demonstration (built in what it recommends) | For engineers: the presentation IS the proof of concept. Opening the browser devtools should show clean React components. | LOW | This is free — it's the natural result of building in Next.js App Router. Mention it explicitly in the Summary slide. |
| Touch/swipe support | If presenter uses a tablet or the audience browses later on mobile, swipe feels native. Adds polish with minimal effort in Framer Motion. | LOW | `drag` prop with `dragConstraints` or `onPanEnd` detecting swipe direction. Left/right swipe = next/previous. |

### Anti-Features (Commonly Requested, Often Problematic)

Features to explicitly NOT build in v1.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Speaker notes window | Standard in Reveal.js/PowerPoint; presenters expect it | Opens a second browser window; complex to sync state between windows; adds scope for a single-presenter internal pitch where presenter knows the content | Put any cue text directly in slide TypeScript data files as a `notes` field — available in source code during prep, not runtime |
| Real-time audience Q&A / polling | Interactive engagement features are popular in conference tools | Backend requirement; this is a static app; single-presenter pitch not a large conference talk | Prepare structured FAQ slides or a dedicated Q&A slide at the end |
| PDF / print export | Stakeholders may want to share the deck afterward | CSS print stylesheets for this design (map + animations) are extremely fragile; Puppeteer-based PDF generation needs a build step or server | Export the content from `proposal-content.md` as a separate simple PDF. The interactive app and the leave-behind doc are different products. |
| URL-per-slide deep linking | Standard in Reveal.js (e.g., `/#/3/2`); useful for sharing specific slides | Adds Next.js router complexity; this is a live presentation, not a self-guided website; sharing individual slides out of context weakens the narrative | Share the root URL. The map metaphor requires experiencing the journey from start. |
| Auto-advancing slides / timer | Conference keynotes sometimes use auto-advance | Presenter loses control; mismatch between speaking pace and slides = awkward silence or rushed content | Manual navigation only. Presenter is in control. |
| Offline PWA / Service Worker | Ensures it works without internet at venue | Adds complexity; Next.js static export already deployable and cacheable via CDN; a simple reload works | Deploy to Vercel/Netlify and test WiFi in advance. Static assets are browser-cached after first load anyway. |
| CMS integration | "Make it easy to update content after the pitch" | This is a one-time proposal, not an ongoing product; CMS adds build complexity and runtime dependencies | Content lives in TypeScript data files. If content changes, update the file and redeploy (takes ~2 minutes). |
| Animations on every micro-interaction | Looks impressive in demos | Adds cognitive load; slows perceived performance; WCAG 2.3.3 concerns; may feel frenetic compared to LEGO's measured brand tone | Reserve animation for navigation transitions (map travel, slide zoom). Static content within slides. |

---

## Feature Dependencies

```
[Map View with City Nodes]
    └──requires──> [14 Topic Data Structure]
                       └──requires──> [Content authored from proposal-content.md]

[Car Travel Animation]
    └──requires──> [Map View with City Nodes]
    └──requires──> [Framer Motion / Animation Library]

[City Zoom-In Takeover]
    └──requires──> [Map View with City Nodes]
    └──requires──> [Framer Motion / Animation Library]
    └──requires──> [Keyboard Navigation State Machine]

[Multi-Slide Sub-Navigation]
    └──requires──> [City Zoom-In Takeover]
    └──requires──> [Keyboard Navigation State Machine]

[Return-to-Map Animation]
    └──requires──> [City Zoom-In Takeover]

[Visited City Visual State]
    └──requires──> [Navigation State Machine (tracks visited)]

[prefers-reduced-motion]
    └──enhances──> [Car Travel Animation]
    └──enhances──> [City Zoom-In Takeover]
    └──enhances──> [All Framer Motion transitions]

[Touch/Swipe Support]
    └──enhances──> [Keyboard Navigation State Machine]
    └──requires──> [Framer Motion gesture API]

[ARIA Live Regions]
    └──enhances──> [City Zoom-In Takeover] (announces slide arrival)
    └──enhances──> [Multi-Slide Sub-Navigation] (announces sub-slide change)

[Fullscreen Mode]
    └──requires──> [Browser Fullscreen API]
    └──independent of──> [Navigation State Machine]

[LEGO Visual Design Tokens]
    └──required by──> [All visual components]
    └──must exist before──> [Map View styling, Slide content styling]
```

### Dependency Notes

- **Content data structure requires authoring first:** The navigation state machine, map city nodes, and slide rendering all depend on a typed data structure for 14 topics. This is the first thing to design architecturally.
- **Map + Car requires animation library:** Framer Motion is already decided; no alternative evaluation needed. Install early.
- **Zoom-in is the critical path:** City Zoom-In Takeover is the most complex single feature and the centerpiece of the UX. Multi-slide sub-navigation and return-to-map both depend on it. It cannot be deferred.
- **prefers-reduced-motion is a cross-cutting concern:** Not a discrete feature — needs to be applied to every Framer Motion animation from day one, not retrofitted later.
- **Visited state is free:** Once navigation state tracks current/visited cities for the map, the visual state is CSS-only. No extra state work needed.
- **Touch/swipe and keyboard navigation share the same state machine:** They are inputs into the same navigation logic, not separate systems.

---

## MVP Definition

### Launch With (v1)

Minimum viable for a professional LEGO pitch.

- [ ] Navigation state machine (current topic, current sub-slide, visited topics) — backbone of everything
- [ ] 14 topic data files authored from `proposal-content.md` — without this, nothing to present
- [ ] Map view with all 14 city nodes visible and labeled — spatial orientation
- [ ] Animated car traveling between cities — core metaphor, directly signals animation capability
- [ ] City zoom-in full-screen takeover — the signature interaction; absence breaks the concept
- [ ] Return-to-map animation — completes the journey metaphor; zoom-in without zoom-out feels broken
- [ ] Multi-slide sub-navigation for topics with multiple slides — required for content completeness
- [ ] Keyboard navigation (arrows, space, escape) — table stakes + accessibility demonstration
- [ ] LEGO-inspired visual design tokens — must look credible to a LEGO audience
- [ ] Visited city visual state — low-effort orientation cue, reinforces the journey narrative
- [ ] `prefers-reduced-motion` throughout — signals accessibility competence; must be v1 not retrofit
- [ ] ARIA live regions for slide changes — accessibility credibility requirement
- [ ] Visible focus indicators — WCAG compliance signal
- [ ] Fullscreen mode — presentation context requires it

### Add After Validation (v1.x)

Add if presentation will be shared publicly or reused.

- [ ] Touch/swipe support — add if presenter uses tablet or audience gets self-guided URL
- [ ] Slide content refinement based on live feedback — iterate content after first delivery

### Future Consideration (v2+)

Defer unless project scope expands significantly.

- [ ] Speaker notes mode — only if reused for multiple presenters who don't know the content
- [ ] Print/export leave-behind — only if stakeholders explicitly request shareable artifact (export from `proposal-content.md` as separate document, not from the app)
- [ ] URL-per-slide deep linking — only if app becomes a self-guided reference

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| 14 topic content authoring | HIGH | HIGH | P1 |
| Navigation state machine | HIGH | MEDIUM | P1 |
| Map view + city nodes | HIGH | MEDIUM | P1 |
| Car travel animation | HIGH | MEDIUM | P1 |
| City zoom-in takeover | HIGH | HIGH | P1 |
| Return-to-map animation | HIGH | MEDIUM | P1 |
| Multi-slide sub-navigation | HIGH | MEDIUM | P1 |
| Keyboard navigation | HIGH | LOW | P1 |
| LEGO visual design tokens | HIGH | MEDIUM | P1 |
| `prefers-reduced-motion` | HIGH | LOW | P1 |
| ARIA live regions | MEDIUM | MEDIUM | P1 |
| Fullscreen mode | HIGH | LOW | P1 |
| Visited city visual state | MEDIUM | LOW | P1 |
| Visible focus indicators | MEDIUM | LOW | P1 |
| Touch/swipe support | LOW | LOW | P2 |
| Speaker notes | LOW | HIGH | P3 |
| URL-per-slide deep links | LOW | MEDIUM | P3 |
| Print/PDF export | LOW | HIGH | P3 |
| CMS integration | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

This is a bespoke presentation, not a general-purpose tool. The relevant comparison is: what do polished interactive web presentations built by senior engineers look like vs. what gets built fast?

| Feature | Reveal.js default | Pitch / Google Slides | This project |
|---------|------------------|-----------------------|--------------|
| Navigation | Keyboard + click | Click + keyboard | Keyboard-first + touch |
| Slide transitions | CSS animations (fade, slide, zoom) | Smooth cross-fade | Framer Motion custom zoom (map metaphor) |
| Progress indicator | Slide count or dots | Progress bar | City count + map spatial position |
| Speaker notes | Separate browser window (S key) | Presenter view | Omitted v1 (content in data files) |
| PDF export | Print stylesheet | Built-in export | Omitted v1 (separate document) |
| Accessibility | Partial (depends on implementation) | Partial | Full WCAG AA — deliberate signal |
| Custom animation | Via CSS/JS plugins | Not possible | Framer Motion, full control |
| Brand alignment | Generic | Generic | LEGO-themed, on-brand |
| Meta argument | No | No | Built in what it recommends |

---

## Sources

- [reveal.js — The HTML Presentation Framework](https://revealjs.com/) — feature reference for table stakes
- [reveal.js Speaker View](https://revealjs.com/speaker-view/) — speaker notes implementation reference
- [Presenting Slides — Quarto/Reveal.js](https://quarto.org/docs/presentations/revealjs/presenting.html) — PDF export, URL routing patterns
- [prefers-reduced-motion — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) — motion accessibility
- [W3C WCAG C39: Using prefers-reduced-motion](https://www.w3.org/WAI/WCAG21/Techniques/css/C39) — WCAG technique
- [Making Carousels and Sliders Accessible — TestParty](https://testparty.ai/blog/carousel-slider-accessibility) — ARIA patterns for slide-like interfaces
- [React gesture animations — Framer Motion](https://www.framer.com/motion/gestures/) — touch/swipe implementation
- [iSpring: Interactive Presentation Software 2026](https://www.ispringsolutions.com/blog/10-interactive-presentation-software-grab-and-hold-an-audiences-attention) — feature landscape survey
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/) — keyboard navigation requirements

---
*Feature research for: LEGO Migration Proposal — Interactive Presentation*
*Researched: 2026-03-11*
