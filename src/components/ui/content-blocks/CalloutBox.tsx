import React from 'react'
import { variantStyleMap } from './variants'

interface CalloutBoxProps {
  children: React.ReactNode
}

export function CalloutBox({ children }: CalloutBoxProps) {
  return (
    <div
      className="rounded-md p-6 border-l-4 border-lego-yellow"
      style={variantStyleMap['yellow']}
    >
      <div className="font-body text-base text-lego-dark">
        {children}
      </div>
    </div>
  )
}
