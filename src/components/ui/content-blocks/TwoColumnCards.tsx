import { BlockVariant, variantStyleMap } from './variants'

interface Card {
  title: string
  description: string
}

interface TwoColumnCardsProps {
  cards: Card[]
  variant?: BlockVariant
}

export function TwoColumnCards({ cards, variant = 'default' }: TwoColumnCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          data-testid="two-col-card"
          className="rounded-md p-5"
          style={variantStyleMap[variant]}
        >
          <h4 className="font-display font-bold text-[18px] text-lego-dark mb-2">
            {card.title}
          </h4>
          <p className="font-body text-lg text-lego-dark">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  )
}
