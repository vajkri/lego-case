// StopBadge — red pill badge showing stop number and label
// Displays "STOP N · LABEL" in Baloo 2 (display font), uppercase, white on LEGO red.

interface StopBadgeProps {
  stopIndex: number   // 0-based — renders as "STOP {stopIndex + 1}"
  stopLabel: string
}

export function StopBadge({ stopIndex, stopLabel }: StopBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-pill bg-lego-red text-white font-display font-bold text-sm uppercase tracking-wide">
      {stopIndex + 1}. {stopLabel}
    </span>
  )
}
