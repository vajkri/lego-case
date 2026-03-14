'use client'

type ButtonVariant = 'yellow' | 'red' | 'grey'
type ButtonSize = 'icon' | 'label'

interface ButtonProps {
  variant: ButtonVariant
  size?: ButtonSize
  onClick?: () => void
  disabled?: boolean
  'aria-label'?: string
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  yellow: 'bg-lego-yellow text-lego-dark border-b-4 border-lego-yellow-dark hover:brightness-105 active:translate-y-0.5 active:border-b-2',
  red:    'bg-lego-red text-white border-b-4 border-lego-red-dark hover:brightness-110 active:translate-y-0.5 active:border-b-2',
  grey:   'bg-lego-grey-wash text-lego-grey border-b-4 border-lego-grey-pale hover:brightness-95 active:translate-y-0.5 active:border-b-2',
}

const sizeClasses: Record<ButtonSize, string> = {
  icon:  'w-12 h-12 flex items-center justify-center',
  label: 'h-12 px-[22px] flex items-center gap-2',
}

export function Button({
  variant,
  size = 'label',
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
  children,
  className,
}: ButtonProps) {
  const disabledClasses = disabled ? 'opacity-40 cursor-not-allowed' : ''

  return (
    <button
      type="button"
      data-testid="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel}
      className={[
        'rounded-lg font-display font-extrabold transition-all',
        variantClasses[variant],
        sizeClasses[size],
        disabledClasses,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}
