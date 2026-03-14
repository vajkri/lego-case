# LEGO-themed presentation

An interactive web presentation built as an alternative to traditional slide decks. Instead of flipping through flat slides, follow a journey across an illustrated map. Each stop reveals content through animated overlays.

## Stack

- **Next.js** (App Router, static export)
- **React 19** with TypeScript
- **Tailwind CSS v4** (CSS-first config)
- **Motion** (Framer Motion v12) for slide transitions and car animation
- **Vitest** + React Testing Library

## Running locally

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Use arrow keys or click stop markers to navigate.

## Controls

| Key | Action |
|-----|--------|
| `→` / `Space` | Next stop or next slide |
| `←` | Previous stop or slide |
| `Escape` | Close slide overlay |
| Click stop marker | Jump to that stop |

## Architecture highlights

- **State-driven navigation** — no URL routing; a reducer manages current stop, slide index, car travel state, and visited stops
- **CSS motion path** — car follows an SVG path via `offset-path` / `offset-distance`, GPU-composited
- **Full-bleed scenery** — sky and grass extend edge-to-edge via CSS background layers while SVG content stays centered
- **Ambient animations** — cloud drift, sun glow, windmill rotation via SVG SMIL; all respect `prefers-reduced-motion`
- **Accessibility** — keyboard-navigable, ARIA labels, focus trapping in overlays, reduced motion support
