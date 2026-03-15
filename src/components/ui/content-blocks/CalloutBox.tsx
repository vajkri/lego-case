import React from 'react'
import { BlockVariant, variantStyleMap } from './variants'

const borderColorClasses: Record<BlockVariant, string> = {
  default: 'border-lego-grey',
  red: 'border-lego-red',
  yellow: 'border-lego-yellow',
}

interface CalloutBoxProps {
  children: React.ReactNode
  variant?: BlockVariant
}

export function CalloutBox({ children, variant = 'yellow' }: CalloutBoxProps) {
  return (
    <div
      className={`rounded-md p-6 border-l-4 ${borderColorClasses[variant]}`}
      style={variantStyleMap[variant]}
    >
      <div className="font-body text-lg text-lego-dark">
        {children}
      </div>
    </div>
  )
}
