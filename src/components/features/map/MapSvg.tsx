'use client'

// Illustrated SVG world map — LEGO instruction booklet aesthetic.
// Narrative: rural idyll (left) → modern city (right), mirroring AngularJS → React journey.
// Purely decorative — no interactive elements. Stop nodes and car overlaid by MapCanvas.
// viewBox: 1400×800. Designed for full-screen desktop presentation.

import { RoadPath } from './RoadPath'

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

export function MapSvg({ className }: MapSvgProps) {
  return (
    <svg
      viewBox="0 0 1400 800"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <defs>
        {/* Sky — bright LEGO cerulean */}
        <linearGradient id="ms-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3AAEE0" />
          <stop offset="45%" stopColor="#62C8EE" />
          <stop offset="100%" stopColor="#A8DFF5" />
        </linearGradient>
        {/* Grass — vivid LEGO green */}
        <linearGradient id="ms-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#58CC3A" />
          <stop offset="60%" stopColor="#44B028" />
          <stop offset="100%" stopColor="#349A18" />
        </linearGradient>
        {/* Mountain gradients — grey */}
        <linearGradient id="ms-mt-big" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#8A8E94" />
          <stop offset="100%" stopColor="#5C6068" />
        </linearGradient>
        <linearGradient id="ms-mt-sm" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#9A9EA4" />
          <stop offset="100%" stopColor="#6E7278" />
        </linearGradient>
        {/* Pond */}
        <radialGradient id="ms-pond" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#7AD8F4" />
          <stop offset="100%" stopColor="#28A8CC" />
        </radialGradient>
      </defs>

      {/* ── 1. SKY ── */}
      <rect width="1400" height="800" fill="url(#ms-sky)" />

      {/* ── 2. SUN — upper left ── */}
      <circle cx={148} cy={118} r={56} fill="#FFD830" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180
        return (
          <line
            key={`sun-${deg}`}
            x1={148 + Math.cos(rad) * 68}
            y1={118 + Math.sin(rad) * 68}
            x2={148 + Math.cos(rad) * 88}
            y2={118 + Math.sin(rad) * 88}
            stroke="#FFD830"
            strokeWidth={5.5}
            strokeLinecap="round"
          />
        )
      })}

      {/* ── 3. CLOUDS — staggered heights for organic feel ── */}
      <Cloud x={235} y={35} s={0.8} />
      <Cloud x={425} y={115} s={1.32} />
      <Cloud x={672} y={55} s={0.9} />
      <Cloud x={940} y={150} s={1.05} />
      <Cloud x={1175} y={75} s={0.75} />

      {/* ── 4. MOUNTAINS — left side, grey, bases aligned with grass horizon y≈380 ── */}
      {/* Far background hill */}
      <path d="M 0,380 L 85,335 L 170,380 Z" fill="#A0A4AA" opacity={0.38} />
      {/* Big mountain */}
      <path d="M 48,380 L 222,215 L 398,380 Z" fill="url(#ms-mt-big)" />
      <path d="M 222,215 L 222,380 L 398,380 Z" fill="rgba(0,0,0,0.10)" />
      {/* Big snow cap */}
      <path d="M 222,215 L 200,273 L 244,273 Z" fill="white" opacity={0.96} />
      <path d="M 222,215 L 222,273 L 244,273 Z" fill="#D8EEFF" opacity={0.45} />
      {/* Smaller mountain */}
      <path d="M 282,380 L 412,275 L 544,380 Z" fill="url(#ms-mt-sm)" opacity={0.92} />
      <path d="M 412,275 L 412,380 L 544,380 Z" fill="rgba(0,0,0,0.08)" />
      {/* Smaller snow cap */}
      <path d="M 412,275 L 396,312 L 428,312 Z" fill="white" opacity={0.93} />
      <path d="M 412,275 L 412,312 L 428,312 Z" fill="#D8EEFF" opacity={0.4} />

      {/* ── 5. CITY BUILDINGS — right side, bases at horizon (y≈350) ── */}

      {/* B1 — LEGO Green */}
      <rect x={1200} y={186} width={46} height={164} fill="#00A850" rx={3} />
      <rect x={1200} y={186} width={46} height={9} fill="#00CC60" rx={2} />
      {[205, 230, 255, 280].map((y) =>
        [1212, 1232].map((x) => (
          <rect key={`g${x}${y}`} x={x} y={y} width={10} height={12} fill="#A0ECC0" rx={1} opacity={0.85} />
        ))
      )}

      {/* B2 — LEGO Red, tallest */}
      <rect x={1250} y={102} width={52} height={248} fill="#E3000B" rx={3} />
      <rect x={1250} y={102} width={52} height={10} fill="#FF2828" rx={2} />
      {/* Antenna */}
      <rect x={1273} y={90} width={4} height={16} fill="#AA0000" />
      <circle cx={1275} cy={88} r={4} fill="#FF2222" />
      {[122, 150, 178, 206, 234, 262, 290].map((y) =>
        [1262, 1290].map((x) => (
          <rect key={`r${x}${y}`} x={x} y={y} width={12} height={14} fill="#FFB8B0" rx={1} opacity={0.82} />
        ))
      )}

      {/* B3 — LEGO Blue */}
      <rect x={1306} y={120} width={48} height={230} fill="#0055BF" rx={3} />
      <rect x={1306} y={120} width={48} height={10} fill="#1068E8" rx={2} />
      {[139, 167, 195, 223, 251, 279].map((y) =>
        [1316, 1340].map((x) => (
          <rect key={`b${x}${y}`} x={x} y={y} width={12} height={13} fill="#98C8FF" rx={1} opacity={0.82} />
        ))
      )}

      {/* B4 — LEGO Orange, fully within canvas */}
      <rect x={1356} y={150} width={42} height={200} fill="#FF6600" rx={3} />
      <rect x={1356} y={150} width={42} height={9} fill="#FF8830" rx={2} />
      {[169, 196, 223, 250, 277].map((y) =>
        [1366, 1386].map((x) => (
          <rect key={`o${x}${y}`} x={x} y={y} width={10} height={13} fill="#FFD8A0" rx={1} opacity={0.82} />
        ))
      )}

      {/* ── 6. GRASS — horizon at y≈350, gently undulating ── */}
      <path
        d="M 0,360 Q 185,345 370,357 Q 555,370 740,353 Q 925,340 1110,347 Q 1260,357 1400,343 L 1400,800 L 0,800 Z"
        fill="url(#ms-grass)"
      />
      {/* Grass texture — LEGO-stud dot scatter */}
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

      {/* ── 8. POND — centre area, 20% bigger, clear of road ── */}
      <ellipse cx={680} cy={710} rx={90} ry={46} fill="url(#ms-pond)" opacity={0.9} />
      <ellipse cx={668} cy={702} rx={60} ry={24} fill="#8CE0F8" opacity={0.45} />
      <ellipse cx={658} cy={696} rx={22} ry={8} fill="white" opacity={0.28} />

      {/* ── 9. WINDMILL — bottom right corner, cream/beige, rotated 25° ── */}
      {/* Tower */}
      <path d="M 1128,740 L 1136,662 L 1144,662 L 1152,740 Z" fill="#C8B48A" />
      <path d="M 1136,662 L 1138,740 L 1136,740 Z" fill="#D8C49A" opacity={0.5} />
      {/* Hub */}
      <circle cx={1140} cy={660} r={8} fill="#A08060" />
      {/* 4 blades — rotated 25° so shape reads clearly as windmill */}
      <g transform="translate(1140,660) rotate(25)">
        <rect x={-5} y={-54} width={10} height={48} fill="#D4C4A0" rx={3} opacity={0.96} />
        <rect x={6}  y={-5}  width={48} height={10} fill="#C8B890" rx={3} opacity={0.96} />
        <rect x={-5} y={6}   width={10} height={48} fill="#D4C4A0" rx={3} opacity={0.96} />
        <rect x={-54} y={-5} width={48} height={10} fill="#C8B890" rx={3} opacity={0.96} />
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
