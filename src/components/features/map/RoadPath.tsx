'use client'

// IMPORTANT: ROAD_PATH_D and STOP_OFFSETS must always be updated together.
// ROAD_PATH_D is used by both the visual <path> in MapSvg AND the car's CSS offsetPath.
// Changing one without the other will cause the car to travel off the visual road.

// Road winds from rural lower-left to urban upper-right across a 1400x800 viewBox.
// Designed as an S-curve route: starts low-left, dips then climbs through countryside,
// rises through mid-map, and ascends to the cityscape upper-right.
export const ROAD_PATH_D =
  'M 80,600 C 140,580 180,540 240,510 C 300,480 340,520 400,500 C 460,480 490,430 560,400 C 630,370 680,420 750,390 C 820,360 860,300 940,270 C 1020,240 1080,290 1160,255 C 1220,228 1270,210 1320,200'

// Stop offsets along the path — percentage of total path length.
// 5 values corresponding to stops 0–4.
// Design-time constants — update together with ROAD_PATH_D if path geometry changes.
// These are design-time estimates; adjust after visual verification in the browser.
export const STOP_OFFSETS: readonly string[] = ['5%', '28%', '52%', '75%', '95%'] as const

export function RoadPath() {
  return (
    <>
      {/* Road shadow / base layer for depth */}
      <path
        d={ROAD_PATH_D}
        stroke="#8B7355"
        strokeWidth={18}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
      />
      {/* Main road surface */}
      <path
        d={ROAD_PATH_D}
        stroke="#C8A05A"
        strokeWidth={14}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center dashed line markings */}
      <path
        d={ROAD_PATH_D}
        stroke="#D4B870"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="20,18"
        opacity={0.8}
      />
    </>
  )
}
