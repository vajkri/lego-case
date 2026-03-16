'use client'

import {
  BulletList,
  TwoColumnCards,
  EntityCards,
  NumberedSteps,
  CalloutBox,
  DataTable,
  Diagram,
} from '@/components/ui'
import type { ContentBlock } from '@/types/presentation'

interface SlideContentProps {
  heading: string
  blocks: ContentBlock[]
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'bullet-list':
      return <BulletList key={index} heading={block.heading} items={block.items} variant={block.variant} />
    case 'two-column-cards':
      return <TwoColumnCards key={index} cards={block.cards} variant={block.variant} />
    case 'entity-cards':
      return <EntityCards key={index} entities={block.entities} variant={block.variant} />
    case 'numbered-steps':
      return <NumberedSteps key={index} steps={block.steps} variant={block.variant} />
    case 'callout':
      return <CalloutBox key={index} variant={block.variant}>{block.text}</CalloutBox>
    case 'data-table':
      return <DataTable key={index} headers={block.headers} rows={block.rows} variant={block.variant} />
    case 'diagram':
      return <Diagram key={index} content={block.content} caption={block.caption} variant={block.variant} />
  }
}

export function SlideContent({ heading, blocks }: SlideContentProps) {
  return (
    <div className="flex-1 flex flex-col gap-6 w-full max-w-4xl mx-auto px-4 py-8 overflow-y-auto">
      <h2 className="font-display font-bold text-[30px] text-lego-dark leading-tight tracking-tight">
        {heading}
      </h2>
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )
}
