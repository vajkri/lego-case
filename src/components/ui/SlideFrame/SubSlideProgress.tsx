// SubSlideProgress — dot row showing current/visited/upcoming sub-slide progress
// Animated with Motion: current dot morphs to a wider pill, visited dots fade.
// Three visual states, all rendered as the same motion.span with animated properties:
//   - Current: 22×8px pill, LEGO red, full opacity
//   - Visited (i < current): 8×8 circle, LEGO red at 45% opacity
//   - Upcoming (i > current): 8×8 circle, grey-pale, full opacity

'use client'

import { motion } from 'motion/react'

interface SubSlideProgressProps {
  total: number
  current: number  // 0-based index of current sub-slide
}

export function SubSlideProgress({ total, current }: SubSlideProgressProps) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => {
        const isCurrent = i === current
        const isVisited = i < current

        return (
          <motion.span
            key={i}
            className={[
              'block h-2 rounded-pill',
              isCurrent || isVisited ? 'bg-lego-red' : 'bg-lego-grey-pale',
            ].join(' ')}
            animate={{
              width: isCurrent ? 22 : 8,
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
