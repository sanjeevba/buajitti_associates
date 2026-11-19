import type { Metadata } from 'next'
import { ChartNoAxesCombined, Cloud, Layers3, Network } from 'lucide-react'

import { ContactCTA, Highlights, PageIntro, SectionHeading } from '@/components/site/Shared'
import { getSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Our Expertise',
  description:
    'Explore our Microsoft Power Platform, Dynamics 365, Azure and business intelligence consulting expertise.',
}

export default async function ExpertisePage() {
  const { highlights } = await getSiteContent()

  return (
    <main id="main-content">
      <PageIntro eyebrow="MICROSOFT SOLUTIONS" title="Our Expertise">
        The platforms and technologies we bring together to build applications, automate work and
        connect your business.
      </PageIntro>
      <section className="expertise-strip" aria-label="Connected expertise">
        <div className="site-container">
          <h2 className="connected-heading">CONNECTED EXPERTISE</h2>
          <ul className="connected-platforms">
            <li className="connected-platform platform-power">
              <span className="connected-platform-icon">
                <Layers3 size={25} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <div>
                <h3>Power Platform</h3>
                <p>Apps &amp; automation</p>
              </div>
            </li>
            <li className="connected-platform platform-dynamics">
              <span className="connected-platform-icon">
                <Network size={25} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <div>
                <h3>Dynamics 365</h3>
                <p>Business applications</p>
              </div>
            </li>
            <li className="connected-platform platform-azure">
              <span className="connected-platform-icon">
                <Cloud size={25} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <div>
                <h3>Microsoft Azure</h3>
                <p>Cloud &amp; integration</p>
              </div>
            </li>
            <li className="connected-platform platform-intelligence">
              <span className="connected-platform-icon">
                <ChartNoAxesCombined size={25} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <div>
                <h3>Business Intelligence</h3>
                <p>Analytics &amp; insights</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section className="site-section capabilities-section">
        <div className="site-container">
          <SectionHeading eyebrow="OUR CAPABILITIES" title="The right tools. Working together.">
            <p>
              From the first application to a connected business ecosystem, we help you put
              Microsoft technology to work.
            </p>
          </SectionHeading>
          <Highlights highlights={highlights} />
        </div>
      </section>
      <ContactCTA />
    </main>
  )
}
