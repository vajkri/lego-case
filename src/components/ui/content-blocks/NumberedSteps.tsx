import { BlockVariant, variantStyleMap } from './variants'

interface Step {
  title: string
  description: string
}

interface NumberedStepsProps {
  steps: Step[]
  variant?: BlockVariant
}

const stepNumberColorClasses: Record<BlockVariant, string> = {
  default: 'text-lego-grey',
  red: 'text-lego-red',
  yellow: 'text-lego-yellow-dark',
}

export function NumberedSteps({ steps, variant = 'default' }: NumberedStepsProps) {
  return (
    <div
      className="rounded-md overflow-hidden"
      style={variantStyleMap[variant]}
    >
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex items-start gap-4 p-5 border-b last:border-b-0 border-lego-grey-pale/30"
        >
          <span
            className={`font-display font-extrabold text-2xl leading-tight flex-shrink-0 w-8 text-center ${stepNumberColorClasses[variant]}`}
          >
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-bold text-[18px] text-lego-dark mb-1">
              {step.title}
            </h4>
            <p className="font-body text-base text-lego-dark">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
