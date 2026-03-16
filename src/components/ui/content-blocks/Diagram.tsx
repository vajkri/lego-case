import { BlockVariant, variantStyleMap } from './variants'

interface DiagramProps {
  content: string
  caption?: string
  variant?: BlockVariant
}

const captionColorClasses: Record<BlockVariant, string> = {
  default: 'text-lego-grey',
  red: 'text-lego-red-dark',
  yellow: 'text-lego-yellow-dark',
}

export function Diagram({ content, caption, variant = 'default' }: DiagramProps) {
  return (
    <div
      className="rounded-md overflow-hidden"
      style={variantStyleMap[variant]}
    >
      {/* Diagram area with subtle grid background */}
      <div
        className="px-6 py-5 overflow-x-auto"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(109,110,112,0.08) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        <pre
          className="text-[15px] leading-[1.6] text-lego-dark whitespace-pre"
          style={{ fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, monospace' }}
        >
          {content}
        </pre>
      </div>

      {/* Caption bar */}
      {caption && (
        <div className="px-6 py-3 border-t border-lego-grey-pale/30">
          <p className={`font-display font-bold text-[14px] ${captionColorClasses[variant]}`}>
            {caption}
          </p>
        </div>
      )}
    </div>
  )
}
