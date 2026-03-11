import type { Metadata } from 'next'
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
      <body>{children}</body>
    </html>
  )
}
