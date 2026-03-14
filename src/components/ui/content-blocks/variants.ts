import type React from 'react'

export type BlockVariant = 'default' | 'red' | 'yellow'

export const variantStyleMap: Record<BlockVariant, React.CSSProperties> = {
  default: {
    background: 'white',
    border: '3px solid var(--color-lego-grey-pale)',
    boxShadow: 'var(--depth-default)',
  },
  red: {
    background: 'var(--lego-red-tint)',
    border: '3px solid var(--lego-red-tint-md)',
    boxShadow: 'var(--depth-red)',
  },
  yellow: {
    background: 'var(--lego-yellow-tint)',
    border: '3px solid var(--lego-yellow-tint-md)',
    boxShadow: 'var(--depth-yellow)',
  },
}
