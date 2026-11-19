import type { Metadata } from 'next'
import Link from 'next/link'
import { Workflow, ChartNoAxesCombined, Network } from 'lucide-react'
import { getSiteContent } from '@/lib/site-content'
import { ContactCTA, PageIntro } from '@/components/site/Shared'

export const metadata: Metadata = {
  title: 'About us',
  description:
    'Meet the thinking behind Buajitti & Associates: scalable Microsoft solutions, business automation, intelligence, and integration.',
}
const benefitIcons = [Workflow, ChartNoAxesCombined, Network]

export default async function AboutPage() {
  const { settings } = await getSiteContent()
  return (
    <main id="main-content">
      <PageIntro eyebrow="ABOUT BUAJITTI & ASSOCIATES" title={settings.about.title}>
        {settings.about.introduction}
      </PageIntro>
      <section className="site-section">
        <div className="site-container about-story">
          <div className="about-story-heading">
            <span className="eyebrow">OUR APPROACH</span>
            <h2>
              Built for today.
              <br />
              Ready for what’s next.
            </h2>
            <Link className="text-link" href="/team">
              Meet the people behind the work
            </Link>
          </div>
          <div className="about-story-copy">
            <p className="lead-copy">{settings.about.description}</p>
            <p>
              Our Microsoft certified development team brings together expertise in Power Platform,
              Dynamics 365, and Azure. We connect the tools your business relies on, with your
              requirements and return on investment in mind.
            </p>
            <Link className="text-link" href="/expertise">
              Explore our Microsoft expertise
            </Link>
          </div>
        </div>
      </section>
      <section className="site-section section-tint">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">HOW WE HELP</span>
              <h2>Make technology work harder for you.</h2>
            </div>
          </div>
          <div className="benefit-grid">
            {settings.about.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index % benefitIcons.length]
              return (
                <article className="benefit-card" key={benefit.title}>
                  <span className="benefit-icon">
                    <Icon size={28} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>
      <ContactCTA />
    </main>
  )
}
