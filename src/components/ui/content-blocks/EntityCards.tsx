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
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-lego-yellow flex items-center justify-center font-display font-extrabold text-lego-dark text-sm">
            {entity.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-bold text-[18px] text-lego-dark mb-1">
              {entity.title}
            </h4>
            <p className="font-body text-base text-lego-dark">
              {entity.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
