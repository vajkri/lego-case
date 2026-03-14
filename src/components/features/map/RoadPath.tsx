'use client'

// IMPORTANT: ROAD_PATH_D and STOP_OFFSETS must always be updated together.
// ROAD_PATH_D is the single source of truth for both:
//   1. The visual <path> stroke rendered in MapSvg
//   2. The car element's CSS offsetPath (`style={{ offsetPath: path("...") }}`)
// Changing one without the other will cause the car to travel off the visual road.

// Road winds across a 1400×800 viewBox:
// Rural idyll lower-left → winding S-curve → city entrance upper-right
// Path has two natural "dips" creating the winding quality of the inspiration screenshots.
export const ROAD_PATH_D =
  'M 85,715 C 160,655 230,585 325,560 C 420,535 450,645 540,630 C 630,615 675,490 770,470 C 865,450 905,570 1000,555 C 1080,540 1150,425 1205,380'

// Car starts here before any stop is visited — the very beginning of the road.
export const CAR_START_OFFSET = '0%'

// Approximate offsetDistance % for each stop index 0–4.
// Computed to match the path inflection points visually.
// These are design-time constants — update together with ROAD_PATH_D if path changes.
export const STOP_OFFSETS: readonly string[] = [
  '10%',  // Stop 0 — slightly ahead of road start so car visibly drives there
  '22%',  // Stop 1 — first rise (≈325, 560)
  '44%',  // Stop 2 — first dip (≈540, 630)
  '65%',  // Stop 3 — second rise (≈770, 470)
  '97%',  // Stop 4 — city entrance (≈1205, 380)
] as const

export function RoadPath() {
  return (
    <g>
      {/* Subtle edge lines — muted road border */}
      <path
        d={ROAD_PATH_D}
        fill="none"
        stroke="#5C6370"
        strokeWidth={40}
        strokeLinecap="round"
      />
      {/* Road surface — soft grey */}
      <path
        d={ROAD_PATH_D}
        fill="none"
        stroke="#6E7685"
        strokeWidth={34}
        strokeLinecap="round"
      />
      {/* Centre dashes — yellow, dashed */}
      <path
        d={ROAD_PATH_D}
        fill="none"
        stroke="#F0D640"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="20 14"
      />
    </g>
  )
}
