import { BlockVariant, variantStyleMap } from './variants'

interface BulletListProps {
  heading?: string
  items: string[]
  variant?: BlockVariant
}

const dotColorClasses: Record<BlockVariant, string> = {
  default: 'bg-lego-grey',
  red: 'bg-lego-red',
  yellow: 'bg-lego-yellow',
}

export function BulletList({ heading, items, variant = 'default' }: BulletListProps) {
  return (
    <div
      className="rounded-md p-6"
      style={variantStyleMap[variant]}
    >
      {heading && (
        <h3 className="font-display font-bold text-[22px] text-lego-dark mb-4">
          {heading}
        </h3>
      )}
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 font-body text-lg">
            <span
              className={`mt-[7px] flex-shrink-0 w-2 h-2 rounded-full ${dotColorClasses[variant]}`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
