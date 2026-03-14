// SubSlideProgress — dot row showing current/visited/upcoming sub-slide progress
// Purely decorative (aria-hidden). Three dot states:
//   - Current: wider pill 22×8px, LEGO red
//   - Visited (i < current): 8×8 circle, LEGO red at 45% opacity
//   - Upcoming (i > current): 8×8 circle, grey-pale

interface SubSlideProgressProps {
  total: number
  current: number  // 0-based index of current sub-slide
}

export function SubSlideProgress({ total, current }: SubSlideProgressProps) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => {
        if (i === current) {
          // Current dot: wider pill
          return (
            <span
              key={i}
              className="block w-[22px] h-2 rounded-pill bg-lego-red"
            />
          )
        }
        if (i < current) {
          // Visited dot: circle, reduced opacity
          return (
            <span
              key={i}
              className="block w-2 h-2 rounded-full bg-lego-red opacity-45"
            />
          )
        }
        // Upcoming dot: grey circle
        return (
          <span
            key={i}
            className="block w-2 h-2 rounded-full bg-lego-grey-pale"
          />
        )
      })}
    </div>
  )
}
