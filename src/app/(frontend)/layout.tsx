import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import React from 'react'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { getSiteContent } from '@/lib/site-content'
import { getServerSideURL } from '@/utilities/getURL'
import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'Buajitti & Associates | Power Platform Consulting',
    template: '%s | Buajitti & Associates',
  },
  description:
    'Microsoft certified developers helping businesses connect applications, automate processes, and make better use of their data with Power Platform and Dynamics 365.',
  openGraph: {
    type: 'website',
    siteName: 'Buajitti & Associates',
    title: 'Buajitti & Associates | Power Platform Consulting',
    description: 'Practical Power Platform and Dynamics 365 solutions, built around your business.',
  },
  icons: { icon: '/favicon.svg' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getSiteContent()
  return (
    <html lang="en" className={GeistSans.variable} data-theme="light">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader companyName={settings.companyName} />
        {children}
        <SiteFooter settings={settings} />
      </body>
    </html>
  )
}
