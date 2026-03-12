// src/components/features/map/MapSvg.tsx
// The illustrated SVG world map — stylized terrain in LEGO instruction booklet style.
// Rural idyll (left) → modern city (right), mirroring the AngularJS → React narrative.
// This component is purely decorative: no interactive elements, no stop markers, no car.
// Stop nodes and the car are overlaid as HTML elements in MapCanvas.
'use client'

import { RoadPath } from './RoadPath'

interface MapSvgProps {
  className?: string
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
        {/* Sky gradient — bright light blue from Screenshot 1 */}
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5BB8E8" />
          <stop offset="60%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#C5E8F7" />
        </linearGradient>
        {/* Grass gradient — bright green from Screenshot 1 */}
        <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7DC86A" />
          <stop offset="100%" stopColor="#4FA83A" />
        </linearGradient>
        {/* Mountain gradient */}
        <linearGradient id="mountainGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8BDD4" />
          <stop offset="100%" stopColor="#7A95B2" />
        </linearGradient>
        <linearGradient id="mountainGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BFD0E0" />
          <stop offset="100%" stopColor="#8FA8C4" />
        </linearGradient>
      </defs>

      {/* ── SKY ── */}
      <rect width="1400" height="800" fill="url(#skyGrad)" />

      {/* ── GRASS — gentle undulating horizon line ── */}
      <path
        d="M 0,445 Q 150,430 300,440 Q 450,450 600,435 Q 750,420 900,432 Q 1050,444 1200,436 Q 1300,430 1400,438 L 1400,800 L 0,800 Z"
        fill="url(#grassGrad)"
      />
      {/* Grass texture dots — subtle variation */}
      <circle cx="160" cy="520" r="3" fill="#5AB845" opacity="0.4" />
      <circle cx="320" cy="560" r="3" fill="#5AB845" opacity="0.4" />
      <circle cx="480" cy="540" r="2.5" fill="#5AB845" opacity="0.4" />
      <circle cx="640" cy="580" r="3" fill="#5AB845" opacity="0.4" />
      <circle cx="800" cy="555" r="2.5" fill="#5AB845" opacity="0.4" />
      <circle cx="960" cy="545" r="3" fill="#5AB845" opacity="0.4" />
      <circle cx="1120" cy="565" r="2.5" fill="#5AB845" opacity="0.4" />

      {/* ── SUN (upper left) ── */}
      <circle cx="110" cy="105" r="48" fill="#FFD93D" />
      {/* Sun rays */}
      <line x1="110" y1="47" x2="110" y2="28" stroke="#FFD93D" strokeWidth="4" strokeLinecap="round" />
      <line x1="110" y1="163" x2="110" y2="182" stroke="#FFD93D" strokeWidth="4" strokeLinecap="round" />
      <line x1="52" y1="105" x2="33" y2="105" stroke="#FFD93D" strokeWidth="4" strokeLinecap="round" />
      <line x1="168" y1="105" x2="187" y2="105" stroke="#FFD93D" strokeWidth="4" strokeLinecap="round" />
      <line x1="69" y1="64" x2="56" y2="51" stroke="#FFD93D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="151" y1="146" x2="164" y2="159" stroke="#FFD93D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="151" y1="64" x2="164" y2="51" stroke="#FFD93D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="69" y1="146" x2="56" y2="159" stroke="#FFD93D" strokeWidth="3.5" strokeLinecap="round" />

      {/* ── MOUNTAINS / HILLS (left area, behind road) ── */}
      {/* Back mountain — larger, slightly darker */}
      <path d="M 150,445 L 290,255 L 430,445 Z" fill="url(#mountainGrad1)" opacity="0.85" />
      {/* Snow cap */}
      <path d="M 290,255 L 265,320 L 315,320 Z" fill="white" opacity="0.9" />
      {/* Front-left smaller hill */}
      <path d="M 80,445 L 175,330 L 270,445 Z" fill="url(#mountainGrad2)" opacity="0.7" />
      {/* Right smaller hill */}
      <path d="M 380,445 L 460,355 L 545,445 Z" fill="url(#mountainGrad2)" opacity="0.65" />

      {/* ── CLOUDS at VARIED heights ── */}
      {/* Cloud 1 — large, upper-center (y≈75) */}
      <g transform="translate(480, 75)">
        <ellipse cx="0" cy="0" rx="72" ry="36" fill="white" opacity="0.92" />
        <ellipse cx="58" cy="-12" rx="50" ry="28" fill="white" opacity="0.92" />
        <ellipse cx="-52" cy="-8" rx="42" ry="24" fill="white" opacity="0.92" />
      </g>
      {/* Cloud 2 — medium, lower in sky (y≈145) — near center-right */}
      <g transform="translate(780, 145)">
        <ellipse cx="0" cy="0" rx="58" ry="28" fill="white" opacity="0.88" />
        <ellipse cx="46" cy="-9" rx="38" ry="21" fill="white" opacity="0.88" />
        <ellipse cx="-42" cy="-5" rx="34" ry="19" fill="white" opacity="0.88" />
      </g>
      {/* Cloud 3 — small, very high right (y≈48) */}
      <g transform="translate(1050, 48)">
        <ellipse cx="0" cy="0" rx="44" ry="22" fill="white" opacity="0.90" />
        <ellipse cx="35" cy="-7" rx="30" ry="17" fill="white" opacity="0.90" />
        <ellipse cx="-30" cy="-5" rx="26" ry="15" fill="white" opacity="0.90" />
      </g>
      {/* Cloud 4 — medium-small, mid-left (y≈108) */}
      <g transform="translate(260, 108)">
        <ellipse cx="0" cy="0" rx="46" ry="23" fill="white" opacity="0.82" />
        <ellipse cx="36" cy="-7" rx="30" ry="17" fill="white" opacity="0.82" />
        <ellipse cx="-32" cy="-4" rx="26" ry="15" fill="white" opacity="0.82" />
      </g>
      {/* Cloud 5 — small, upper-right (y≈90) */}
      <g transform="translate(1220, 90)">
        <ellipse cx="0" cy="0" rx="38" ry="19" fill="white" opacity="0.85" />
        <ellipse cx="30" cy="-6" rx="25" ry="14" fill="white" opacity="0.85" />
        <ellipse cx="-26" cy="-4" rx="22" ry="13" fill="white" opacity="0.85" />
      </g>

      {/* ── TREES (scattered, rural feel) ── */}
      {/* Tree helper — trunk + round canopy */}
      {/* Left area trees */}
      <g transform="translate(95, 490)">
        <rect x="-4" y="0" width="8" height="22" fill="#8B6914" rx="2" />
        <circle cx="0" cy="-12" r="18" fill="#3D9E2A" />
        <circle cx="0" cy="-12" r="18" fill="#4DB535" opacity="0.6" />
      </g>
      <g transform="translate(140, 510)">
        <rect x="-3" y="0" width="6" height="18" fill="#8B6914" rx="2" />
        <circle cx="0" cy="-10" r="14" fill="#3D9E2A" />
        <circle cx="0" cy="-10" r="14" fill="#4DB535" opacity="0.6" />
      </g>
      <g transform="translate(560, 470)">
        <rect x="-4" y="0" width="8" height="20" fill="#8B6914" rx="2" />
        <circle cx="0" cy="-11" r="16" fill="#3D9E2A" />
        <circle cx="0" cy="-11" r="16" fill="#4DB535" opacity="0.6" />
      </g>
      <g transform="translate(620, 500)">
        <rect x="-3" y="0" width="6" height="16" fill="#8B6914" rx="2" />
        <circle cx="0" cy="-9" r="13" fill="#3D9E2A" />
      </g>
      <g transform="translate(690, 480)">
        <rect x="-4" y="0" width="8" height="20" fill="#8B6914" rx="2" />
        <circle cx="0" cy="-11" r="16" fill="#3D9E2A" />
        <circle cx="0" cy="-11" r="16" fill="#4DB535" opacity="0.5" />
      </g>
      <g transform="translate(850, 510)">
        <rect x="-3" y="0" width="6" height="17" fill="#8B6914" rx="2" />
        <circle cx="0" cy="-9" r="13" fill="#3D9E2A" />
      </g>
      <g transform="translate(920, 490)">
        <rect x="-3.5" y="0" width="7" height="19" fill="#8B6914" rx="2" />
        <circle cx="0" cy="-10" r="15" fill="#3D9E2A" />
        <circle cx="0" cy="-10" r="15" fill="#4DB535" opacity="0.5" />
      </g>

      {/* ── POND (lower-left rural area) ── */}
      <ellipse cx="430" cy="620" rx="80" ry="38" fill="#4EB0D8" opacity="0.8" />
      <ellipse cx="430" cy="620" rx="68" ry="28" fill="#6EC8EA" opacity="0.5" />
      {/* Pond reflection highlight */}
      <ellipse cx="415" cy="610" rx="25" ry="8" fill="white" opacity="0.2" />

      {/* ── WINDMILL (left-center, between mountains and road) ── */}
      {/* Tower */}
      <path d="M 300,540 L 308,470 L 316,470 L 324,540 Z" fill="#C8B48A" />
      {/* Tower highlight */}
      <path d="M 308,470 L 310,540 L 308,540 Z" fill="#D8C49A" opacity="0.5" />
      {/* Windmill hub */}
      <circle cx="314" cy="468" r="6" fill="#A08060" />
      {/* Windmill blades — 4 arms */}
      <g transform="translate(314, 468)">
        {/* Top blade */}
        <rect x="-4" y="-48" width="8" height="42" fill="#D4C4A0" rx="3" />
        {/* Right blade */}
        <rect x="6" y="-4" width="42" height="8" fill="#C8B890" rx="3" />
        {/* Bottom blade */}
        <rect x="-4" y="6" width="8" height="42" fill="#D4C4A0" rx="3" />
        {/* Left blade */}
        <rect x="-48" y="-4" width="42" height="8" fill="#C8B890" rx="3" />
        {/* Center cap */}
        <circle cx="0" cy="0" r="5" fill="#8A6840" />
      </g>

      {/* ── FENCE (near road, bottom-left) ── */}
      <g fill="none" stroke="#D8D0B8" strokeWidth="2.5" strokeLinecap="round">
        {/* Posts */}
        <line x1="130" y1="620" x2="130" y2="645" />
        <line x1="155" y1="618" x2="155" y2="643" />
        <line x1="180" y1="616" x2="180" y2="641" />
        <line x1="205" y1="615" x2="205" y2="640" />
        <line x1="230" y1="614" x2="230" y2="639" />
        <line x1="255" y1="614" x2="255" y2="639" />
        <line x1="280" y1="615" x2="280" y2="640" />
        {/* Rails */}
        <line x1="128" y1="630" x2="282" y2="628" />
        <line x1="128" y1="641" x2="282" y2="639" />
      </g>

      {/* ── ROAD ── */}
      <RoadPath />

      {/* ── BUILDINGS / CITYSCAPE (right side, upper area) ── */}
      {/* Background tall building */}
      <rect x="1300" y="248" width="44" height="192" fill="#4A5B6A" rx="3" />
      <rect x="1308" y="262" width="8" height="10" fill="#A8C8E0" opacity="0.75" />
      <rect x="1326" y="262" width="8" height="10" fill="#A8C8E0" opacity="0.75" />
      <rect x="1308" y="284" width="8" height="10" fill="#A8C8E0" opacity="0.75" />
      <rect x="1326" y="284" width="8" height="10" fill="#A8C8E0" opacity="0.75" />
      <rect x="1308" y="306" width="8" height="10" fill="#A8C8E0" opacity="0.75" />
      <rect x="1326" y="306" width="8" height="10" fill="#A8C8E0" opacity="0.75" />
      <rect x="1308" y="328" width="8" height="10" fill="#A8C8E0" opacity="0.75" />
      <rect x="1326" y="328" width="8" height="10" fill="#A8C8E0" opacity="0.75" />

      {/* Tallest center building */}
      <rect x="1090" y="268" width="58" height="172" fill="#5A6B7A" rx="3" />
      <rect x="1100" y="282" width="10" height="13" fill="#B0D0E8" opacity="0.8" />
      <rect x="1122" y="282" width="10" height="13" fill="#B0D0E8" opacity="0.8" />
      <rect x="1100" y="308" width="10" height="13" fill="#B0D0E8" opacity="0.8" />
      <rect x="1122" y="308" width="10" height="13" fill="#B0D0E8" opacity="0.8" />
      <rect x="1100" y="334" width="10" height="13" fill="#B0D0E8" opacity="0.8" />
      <rect x="1122" y="334" width="10" height="13" fill="#B0D0E8" opacity="0.8" />
      <rect x="1100" y="360" width="10" height="13" fill="#B0D0E8" opacity="0.8" />
      <rect x="1122" y="360" width="10" height="13" fill="#B0D0E8" opacity="0.8" />

      {/* Mid-right building */}
      <rect x="1160" y="298" width="50" height="142" fill="#7A8B9A" rx="3" />
      <rect x="1170" y="312" width="9" height="11" fill="#A8C8E0" opacity="0.8" />
      <rect x="1190" y="312" width="9" height="11" fill="#A8C8E0" opacity="0.8" />
      <rect x="1170" y="336" width="9" height="11" fill="#A8C8E0" opacity="0.8" />
      <rect x="1190" y="336" width="9" height="11" fill="#A8C8E0" opacity="0.8" />
      <rect x="1170" y="360" width="9" height="11" fill="#A8C8E0" opacity="0.8" />
      <rect x="1190" y="360" width="9" height="11" fill="#A8C8E0" opacity="0.8" />

      {/* Short wide building */}
      <rect x="1218" y="328" width="72" height="112" fill="#8A9BAA" rx="3" />
      <rect x="1228" y="342" width="11" height="13" fill="#A8C8E0" opacity="0.8" />
      <rect x="1253" y="342" width="11" height="13" fill="#A8C8E0" opacity="0.8" />
      <rect x="1228" y="368" width="11" height="13" fill="#A8C8E0" opacity="0.8" />
      <rect x="1253" y="368" width="11" height="13" fill="#A8C8E0" opacity="0.8" />
      <rect x="1228" y="394" width="11" height="13" fill="#A8C8E0" opacity="0.8" />
      <rect x="1253" y="394" width="11" height="13" fill="#A8C8E0" opacity="0.8" />

      {/* Left building of cityscape */}
      <rect x="1048" y="310" width="36" height="130" fill="#6A7A88" rx="3" />
      <rect x="1056" y="324" width="8" height="10" fill="#A8C8E0" opacity="0.75" />
      <rect x="1056" y="347" width="8" height="10" fill="#A8C8E0" opacity="0.75" />
      <rect x="1056" y="370" width="8" height="10" fill="#A8C8E0" opacity="0.75" />

      {/* Building antenna / detail on tallest */}
      <rect x="1116" y="255" width="4" height="18" fill="#3A4B5A" />
      <circle cx="1118" cy="253" r="3" fill="#CC4444" />
    </svg>
  )
}
