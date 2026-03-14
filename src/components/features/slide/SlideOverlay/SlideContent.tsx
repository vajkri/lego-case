'use client'

interface SlideContentProps {
  heading: string
  lines: string[]
}

export function SlideContent({ heading, lines }: SlideContentProps) {
  const intro = lines[0] ?? null
  const bullets = lines.slice(1)

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-4xl mx-auto px-4 py-8">
      {/* Large centered heading */}
      <h2 className="text-4xl font-bold text-center text-lego-dark leading-tight tracking-tight">
        {heading}
      </h2>

      {/* Content card */}
      {(intro || bullets.length > 0) && (
        <div className="w-full rounded-2xl bg-lego-grey-wash border border-lego-grey-pale p-8 flex flex-col gap-6">
          {/* Intro paragraph (lines[0]) */}
          {intro && (
            <p className="text-lego-grey text-lg leading-relaxed">{intro}</p>
          )}

          {/* Numbered list items (lines[1..]) — all shown at once, no stagger */}
          {bullets.length > 0 && (
            <ol className="flex flex-col gap-4">
              {bullets.map((line, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400 text-slate-900 font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-lego-dark text-base leading-relaxed pt-1">{line}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  )
}
