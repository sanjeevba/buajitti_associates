import Link from 'next/link'
import { getSiteContent } from '@/lib/site-content'
import { PlatformVisual } from '@/components/site/Shared'
import { Check } from 'lucide-react'

export default async function HomePage() {
  const { settings } = await getSiteContent()
  return (
    <main id="main-content">
      <section id="hero" className="home-hero">
        <div className="site-container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">{settings.hero.eyebrow}</span>
            <h1>{settings.hero.title}</h1>
            <p>{settings.hero.description}</p>
            <div className="hero-actions">
              <Link className="button" href="/contact">
                Let’s talk about your project
              </Link>
              <Link className="button button-outline" href="/portfolio">
                Explore our work
              </Link>
            </div>
            <div className="hero-assurance">
              <Check size={17} aria-hidden="true" />
              <span>Microsoft certified developers. Business-first thinking.</span>
            </div>
          </div>
          <PlatformVisual />
        </div>
      </section>
    </main>
  )
}
