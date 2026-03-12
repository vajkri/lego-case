import type { Metadata } from 'next'
import { PresentationProvider, KeyboardController, PresentationFooter } from '@/components/features/presentation'
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
          <KeyboardController />
          <div className="flex flex-col h-screen">
            {/* Content area — slide overlay and map both live here */}
            <div className="flex-1 relative overflow-hidden">
              <OverlayPresence />
              {children}
            </div>
            {/* Footer always visible, both on map and slide views */}
            <PresentationFooter />
          </div>
        </PresentationProvider>
      </body>
    </html>
  )
}
