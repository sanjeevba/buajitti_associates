import Link from 'next/link'
import type { SiteSettings } from '@/lib/site-content'
import { Brand } from './SiteHeader'

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="site-footer">
      <div className="site-container footer-main">
        <div className="footer-brand">
          <Brand companyName={settings.companyName} />
          <p>Thoughtful technology. Better ways to do business.</p>
        </div>
        <div className="footer-navigation">
          <h2>Explore</h2>
          <nav aria-label="Footer navigation">
            <Link href="/about">About us</Link>
            <Link href="/expertise">Our Expertise</Link>
            <Link href="/portfolio">Our work</Link>
            <Link href="/team">Our team</Link>
            <Link href="/contact">Contact us</Link>
          </nav>
        </div>
        <div className="footer-contact">
          <h2>Start a conversation</h2>
          <div className="footer-contact-links">
            <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>
            <a href={`tel:${settings.contact.phone.replace(/[^+\d]/g, '')}`}>
              {settings.contact.phone}
            </a>
          </div>
          <address>{settings.contact.address}</address>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <p>
          © {new Date().getFullYear()} {settings.companyName}. All rights reserved.
        </p>
        <span>Power Platform · Dynamics 365 · Azure</span>
      </div>
    </footer>
  )
}
