import type { Metadata } from 'next'
import { Baloo_2, DM_Sans } from 'next/font/google'
import { PresentationProvider, KeyboardController, PresentationFooter } from '@/components/features/presentation'
import { OverlayPresence } from '@/components/features/slide'
import './globals.css'

const baloo2 = Baloo_2({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-baloo2',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})

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
    <html lang="en" className={`${baloo2.variable} ${dmSans.variable}`}>
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
