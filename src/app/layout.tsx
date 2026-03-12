import type { Metadata } from 'next'
import { PresentationProvider, KeyboardController } from '@/components/features/presentation'
import { OverlayPresence } from '@/components/features/slide'
import './globals.css'

export const metadata: Metadata = {
  title: 'LEGO Migration Proposal',
  description: 'Frontend architecture proposal for kids.lego.com',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PresentationProvider>
          {/* KeyboardController: no visual output, only attaches window keydown listener */}
          <KeyboardController />
          <OverlayPresence />
          {children}
        </PresentationProvider>
      </body>
    </html>
  )
}
