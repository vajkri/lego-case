import { BlockVariant, variantStyleMap } from './variants'

interface Entity {
  initials: string
  title: string
  description: string
}

interface EntityCardsProps {
  entities: Entity[]
  variant?: BlockVariant
}

const initialsCircleClasses: Record<BlockVariant, string> = {
  default: 'bg-lego-grey-light text-white',
  red: 'bg-lego-red text-white',
  yellow: 'bg-lego-yellow text-lego-dark',
}

export function EntityCards({ entities, variant = 'yellow' }: EntityCardsProps) {
  return (
    <div className="space-y-3">
      {entities.map((entity, index) => (
        <div
          key={index}
          data-testid="entity-card"
          className="flex items-start gap-4 rounded-md p-5"
          style={variantStyleMap[variant]}
        >
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-display font-extrabold text-sm ${initialsCircleClasses[variant]}`}>
            {entity.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-bold text-[18px] text-lego-dark mb-1">
              {entity.title}
            </h4>
            <p className="font-body text-lg text-lego-dark">
              {entity.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
