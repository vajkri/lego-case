// SubSlideProgress — promoted shared UI component (was SlideFrame/SubSlideProgress)
// Dot row showing current/visited/upcoming sub-slide progress.
// Animated with Motion: current dot morphs to a wider pill, visited dots fade.
//
// Three visual states, all rendered as the same motion.span with animated properties:
//   - Current: wider pill, LEGO red, full opacity
//   - Visited (i < current): circle, LEGO red at 45% opacity
//   - Upcoming (i > current): circle, grey-pale, full opacity
//
// Size variants:
//   - default (8px dots): h-2, current pill 22px, non-current 8px, gap-1.5
//   - sm (6px dots): h-1.5, current pill 16px, non-current 6px, gap-0.5

'use client'

import { motion } from 'motion/react'

interface SubSlideProgressProps {
  total: number
  current: number  // 0-based index of current sub-slide
  size?: 'default' | 'sm'
}

const SIZE_CONFIG = {
  default: {
    gapClass: 'gap-1.5',
    heightClass: 'h-2',
    currentWidth: 22,
    dotWidth: 8,
  },
  sm: {
    gapClass: 'gap-0.5',
    heightClass: 'h-1.5',
    currentWidth: 16,
    dotWidth: 6,
  },
}

export function SubSlideProgress({ total, current, size = 'default' }: SubSlideProgressProps) {
  const config = SIZE_CONFIG[size]

  return (
    <div className={`flex items-center ${config.gapClass}`} aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => {
        const isCurrent = i === current
        const isVisited = i < current

        return (
          <motion.span
            key={i}
            className={[
              `block ${config.heightClass} rounded-pill`,
              isCurrent || isVisited ? 'bg-lego-red' : 'bg-lego-grey-pale',
            ].join(' ')}
            animate={{
              width: isCurrent ? config.currentWidth : config.dotWidth,
              opacity: isVisited ? 0.45 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          />
        )
      })}
    </div>
  )
}
