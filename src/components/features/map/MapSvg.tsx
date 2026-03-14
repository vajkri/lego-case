'use client'

// Illustrated SVG world map — LEGO instruction booklet aesthetic.
// Narrative: rural idyll (left) → modern city (right), mirroring AngularJS → React journey.
// Purely decorative — no interactive elements. Stop nodes and car overlaid by MapCanvas.
// viewBox: 1400×800. Designed for full-screen desktop presentation.

import { useState, useEffect } from 'react'
import { RoadPath } from './RoadPath'

// Shared viewBox dimensions — used by MapCanvas for overlay coordinate mapping
export const MAP_VIEWBOX = { width: 1400, height: 800 } as const

// Grass horizon y-position within the viewBox — used by MapCanvas for full-bleed background alignment
export const HORIZON_Y = 355

interface MapSvgProps {
  className?: string
}

// Reusable lollipop tree — LEGO flat-illustration style
function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-4 * s} y={0} width={8 * s} height={24 * s} fill="#6B4A1E" rx={2} />
      <circle cx={0} cy={-18 * s} r={22 * s} fill="#1E8A14" />
      <circle cx={0} cy={-18 * s} r={22 * s} fill="#34C020" opacity={0.55} />
      {/* canopy highlight */}
      <circle cx={-6 * s} cy={-26 * s} r={8 * s} fill="#50D838" opacity={0.4} />
    </g>
  )
}

// Flat-bottom cloud with rounded bumps — matches LEGO illustration inspiration
function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* Flat base */}
      <rect x={-52} y={-4} width={104} height={20} fill="white" rx={8} />
      {/* Left bump */}
      <circle cx={-26} cy={-6} r={18} fill="white" />
      {/* Centre bump — tallest */}
      <circle cx={8} cy={-16} r={24} fill="white" />
      {/* Right bump */}
      <circle cx={36} cy={-4} r={15} fill="white" />
    </g>
  )
}

// Cloud drift distance — slightly more than viewBox width for seamless wrapping
const CLOUD_DRIFT = 1600

const CLOUD_CONFIGS = [
  { x: 235, y: 35, s: 0.8, dur: 190, begin: 0 },
  { x: 425, y: 115, s: 1.32, dur: 165, begin: -55 },
  { x: 672, y: 55, s: 0.9, dur: 175, begin: -115 },
  { x: 940, y: 150, s: 1.05, dur: 155, begin: -85 },
  { x: 1175, y: 75, s: 0.75, dur: 200, begin: -30 },
  // Extra clouds for constant sky coverage
  { x: 100, y: 90, s: 0.95, dur: 185, begin: -130 },
  { x: 800, y: 130, s: 0.7, dur: 170, begin: -70 },
] as const

export function MapSvg({ className }: MapSvgProps) {
  // Respect prefers-reduced-motion — disable all ambient animations
  const [animate, setAnimate] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setAnimate(!mq.matches)
    const handler = (e: MediaQueryListEvent) => setAnimate(!e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <svg
      viewBox="0 0 1400 800"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
    >
      <defs>
        {/* Pond */}
        <radialGradient id="ms-pond" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#7AD8F4" />
          <stop offset="100%" stopColor="#28A8CC" />
        </radialGradient>
      </defs>

      {/* ── SUN — upper left, warm glow + studs ── */}
      <circle cx={128} cy={118} r={76} fill="#FFD830" opacity={0.25}>
        {animate && <animate attributeName="opacity" values="0.15;0.45;0.15" dur="4s" repeatCount="indefinite" />}
      </circle>
      <circle cx={128} cy={118} r={62} fill="#FFD830" opacity={0.3}>
        {animate && <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" begin="0.4s" />}
      </circle>
      <circle cx={128} cy={118} r={56} fill="#FFD830" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180
        return (
          <line
            key={`sun-${deg}`}
            x1={128 + Math.cos(rad) * 68}
            y1={118 + Math.sin(rad) * 68}
            x2={128 + Math.cos(rad) * 88}
            y2={118 + Math.sin(rad) * 88}
            stroke="#FFD830"
            strokeWidth={5.5}
            strokeLinecap="round"
          />
        )
      })}
      {/* Sun studs */}
      <circle cx={118} cy={108} r={5} fill="rgba(255,255,255,0.22)" />
      <circle cx={138} cy={108} r={5} fill="rgba(255,255,255,0.22)" />
      <circle cx={118} cy={128} r={5} fill="rgba(255,255,255,0.22)" />
      <circle cx={138} cy={128} r={5} fill="rgba(255,255,255,0.22)" />

      {/* ── CLOUDS — drift leftward, seamless wrap via duplicate at +CLOUD_DRIFT ── */}
      {CLOUD_CONFIGS.map((c, i) => (
        <g key={`cloud-${i}`}>
          {animate && (
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to={`-${CLOUD_DRIFT} 0`}
              dur={`${c.dur}s`}
              begin={`${c.begin}s`}
              repeatCount="indefinite"
            />
          )}
          <Cloud x={c.x} y={c.y} s={c.s} />
          <Cloud x={c.x + CLOUD_DRIFT} y={c.y} s={c.s} />
        </g>
      ))}

      {/* ── 4. CITY BUILDINGS — right side, bases at horizon ── */}

      {/* B1 — LEGO Green */}
      <rect x={1200} y={191} width={46} height={164} fill="#00A850" rx={3} />
      <rect x={1200} y={191} width={46} height={9} fill="#00CC60" rx={2} />
      {/* Roof studs */}
      <circle cx={1212} cy={197} r={3.5} fill="rgba(255,255,255,0.15)" />
      <circle cx={1224} cy={197} r={3.5} fill="rgba(255,255,255,0.15)" />
      <circle cx={1236} cy={197} r={3.5} fill="rgba(255,255,255,0.15)" />
      {[210, 235, 260, 285].map((y) =>
        [1212, 1232].map((x) => (
          <rect key={`g${x}${y}`} x={x} y={y} width={10} height={12} fill="#A0ECC0" rx={1} opacity={0.85} />
        ))
      )}

      {/* B2 — LEGO Red, tallest */}
      <rect x={1250} y={107} width={52} height={248} fill="#E3000B" rx={3} />
      <rect x={1250} y={107} width={52} height={10} fill="#FF2828" rx={2} />
      {/* Roof studs */}
      <circle cx={1264} cy={113} r={3.5} fill="rgba(255,200,200,0.2)" />
      <circle cx={1276} cy={113} r={3.5} fill="rgba(255,200,200,0.2)" />
      <circle cx={1288} cy={113} r={3.5} fill="rgba(255,200,200,0.2)" />
      {/* Antenna */}
      <rect x={1273} y={95} width={4} height={16} fill="#AA0000" />
      <circle cx={1275} cy={93} r={4} fill="#FF2222" />
      {[127, 155, 183, 211, 239, 267, 295].map((y) =>
        [1262, 1290].map((x) => (
          <rect key={`r${x}${y}`} x={x} y={y} width={12} height={14} fill="#FFB8B0" rx={1} opacity={0.82} />
        ))
      )}

      {/* B3 — LEGO Blue */}
      <rect x={1306} y={125} width={48} height={230} fill="#0055BF" rx={3} />
      <rect x={1306} y={125} width={48} height={10} fill="#1068E8" rx={2} />
      {/* Roof studs */}
      <circle cx={1318} cy={131} r={3.5} fill="rgba(150,200,255,0.2)" />
      <circle cx={1330} cy={131} r={3.5} fill="rgba(150,200,255,0.2)" />
      <circle cx={1342} cy={131} r={3.5} fill="rgba(150,200,255,0.2)" />
      {[144, 172, 200, 228, 256, 284].map((y) =>
        [1316, 1340].map((x) => (
          <rect key={`b${x}${y}`} x={x} y={y} width={12} height={13} fill="#98C8FF" rx={1} opacity={0.82} />
        ))
      )}

      {/* B4 — LEGO Orange, fully within canvas */}
      <rect x={1356} y={155} width={42} height={200} fill="#FF6600" rx={3} />
      <rect x={1356} y={155} width={42} height={9} fill="#FF8830" rx={2} />
      {/* Roof studs */}
      <circle cx={1368} cy={160} r={3.5} fill="rgba(255,220,160,0.2)" />
      <circle cx={1380} cy={160} r={3.5} fill="rgba(255,220,160,0.2)" />
      <circle cx={1392} cy={160} r={3.5} fill="rgba(255,220,160,0.2)" />
      {[174, 201, 228, 255, 282].map((y) =>
        [1366, 1386].map((x) => (
          <rect key={`o${x}${y}`} x={x} y={y} width={10} height={13} fill="#FFD8A0" rx={1} opacity={0.82} />
        ))
      )}

      {/* Grass texture — LEGO-stud dot scatter (background provided by MapCanvas) */}
      {[
        [148,400],[268,426],[388,408],[510,420],[632,462],[752,412],[872,434],[992,404],[1112,420],[1232,410],
        [208,470],[328,490],[448,466],[568,494],[688,458],[808,482],[928,464],[1048,454],[1168,468],
        [178,540],[298,554],[418,534],[538,548],[658,528],[778,542],[898,532],[1018,524],
        [148,610],[268,628],[448,608],[568,624],[688,604],[808,618],[928,608],[1048,598],
      ].map(([x, y], i) => (
        <circle
          key={`gd${i}`}
          cx={x}
          cy={y}
          r={3.2}
          fill={i % 4 === 0 ? '#CC2200' : '#2A8A10'}
          opacity={0.36}
        />
      ))}

      {/* ── 6. MOUNTAINS — left side, stepped bricks, on top of grass ── */}
      {/* Far background hill — subtle stepped */}
      <rect x={40} y={335} width={150} height={20} fill="#A0A4AA" opacity={0.25} rx={1} />
      <rect x={60} y={318} width={110} height={17} fill="#A0A4AA" opacity={0.2} rx={1} />
      <rect x={80} y={303} width={70} height={15} fill="#A0A4AA" opacity={0.15} rx={1} />
      {/* Big stepped mountain */}
      <rect x={112} y={330} width={280} height={25} fill="#6E7278" rx={1} />
      <rect x={147} y={305} width={210} height={25} fill="#7E8288" rx={1} />
      <rect x={182} y={280} width={140} height={25} fill="#8A8E94" rx={1} />
      <rect x={212} y={255} width={80} height={25} fill="#9A9EA4" rx={1} />
      <rect x={227} y={233} width={50} height={22} fill="#AAAFB4" rx={1} />
      <rect x={237} y={215} width={30} height={18} fill="white" rx={1} />
      {/* Snow cap studs */}
      <circle cx={246} cy={222} r={3.5} fill="rgba(180,180,180,0.3)" />
      <circle cx={258} cy={222} r={3.5} fill="rgba(180,180,180,0.3)" />
      {/* Smaller stepped mountain */}
      <rect x={352} y={330} width={180} height={25} fill="#7E8288" rx={1} />
      <rect x={377} y={305} width={130} height={25} fill="#8E9298" rx={1} />
      <rect x={402} y={280} width={80} height={25} fill="#9EA2A8" rx={1} />
      <rect x={422} y={262} width={40} height={18} fill="white" rx={1} />
      <circle cx={437} cy={269} r={3} fill="rgba(180,180,180,0.3)" />
      <circle cx={448} cy={269} r={3} fill="rgba(180,180,180,0.3)" />

      {/* ── 7. TREES — lollipop clusters, organic y-stagger ── */}
      {/* Left rural cluster */}
      <Tree x={60}  y={395} s={1.1} />
      <Tree x={120} y={432} s={0.9} />
      <Tree x={148} y={410} s={1.0} />
      {/* Between stop 1 & 2 */}
      <Tree x={365} y={405} s={0.85} />
      <Tree x={418} y={442} s={1.0}  />
      <Tree x={448} y={418} s={0.75} />
      {/* Centre-right — space for pond */}
      <Tree x={872} y={630} s={0.9}  />
      <Tree x={928} y={662} s={0.8}  />
      <Tree x={956} y={642} s={0.85} />
      {/* Near city entrance */}
      <Tree x={990} y={400} s={0.9}  />
      <Tree x={1044} y={438} s={0.8}  />

      {/* ── 8. POND — centre-right area, clear of road ── */}
      <ellipse cx={740} cy={710} rx={90} ry={46} fill="url(#ms-pond)" opacity={0.9} />
      <ellipse cx={728} cy={702} rx={60} ry={24} fill="#8CE0F8" opacity={0.45} />
      <ellipse cx={718} cy={696} rx={22} ry={8} fill="white" opacity={0.28} />

      {/* ── 9. WINDMILL — bottom right, cream/beige, rotated 25° ── */}
      {/* Tower */}
      <path d="M 1178,740 L 1186,662 L 1194,662 L 1202,740 Z" fill="#C8B48A" />
      <path d="M 1186,662 L 1188,740 L 1186,740 Z" fill="#D8C49A" opacity={0.5} />
      {/* Hub */}
      <circle cx={1190} cy={660} r={8} fill="#A08060" />
      {/* 4 blades — counter-clockwise rotation (leftward wind) */}
      <g transform="translate(1190,660)">
        <g transform="rotate(25)">
          {animate && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="25"
              to="-335"
              dur="20s"
              repeatCount="indefinite"
            />
          )}
          <rect x={-5} y={-54} width={10} height={48} fill="#D4C4A0" rx={3} opacity={0.96} />
          <rect x={6}  y={-5}  width={48} height={10} fill="#C8B890" rx={3} opacity={0.96} />
          <rect x={-5} y={6}   width={10} height={48} fill="#D4C4A0" rx={3} opacity={0.96} />
          <rect x={-54} y={-5} width={48} height={10} fill="#C8B890" rx={3} opacity={0.96} />
        </g>
        <circle cx={0} cy={0} r={5} fill="#8A6840" />
      </g>

      {/* ── 10. PICKET FENCE — far left, on grass ── */}
      <g fill="none" stroke="#CABF96" strokeWidth={3} strokeLinecap="round">
        {[30, 56, 82, 108, 134, 160, 186, 212, 238].map((x, i) => (
          <line key={`fp${i}`} x1={x} y1={420 + i * 1.2} x2={x} y2={450 + i * 1.2} />
        ))}
        <line x1={28}  y1={429} x2={240} y2={432} />
        <line x1={28}  y1={441} x2={240} y2={444} />
      </g>

      {/* ── 11. ROAD — rendered last, on top of all terrain ── */}
      <RoadPath />
    </svg>
  )
}
