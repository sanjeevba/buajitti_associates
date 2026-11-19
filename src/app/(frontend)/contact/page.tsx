import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { getSiteContent } from '@/lib/site-content'
import { PageIntro } from '@/components/site/Shared'
import { ContactForm } from '@/components/site/ContactForm'

export const metadata: Metadata = {
  title: 'Contact us',
  description:
    'Talk to Buajitti & Associates about your Power Platform, Dynamics 365, or Azure project.',
}

export default async function ContactPage() {
  const { settings } = await getSiteContent()
  const { contact } = settings
  return (
    <main id="main-content">
      <PageIntro eyebrow="CONTACT US" title="Let’s make your next move a good one.">
        Have a project in mind or a process that could work better? We’d like to hear about it.
      </PageIntro>
      <section className="site-section">
        <div className="site-container contact-layout">
          <aside className="contact-details">
            <span className="eyebrow">GET IN TOUCH</span>
            <h2>A conversation is a good place to start.</h2>
            <p>
              Connect with our team to discuss your business and the right Microsoft solutions for
              it.
            </p>
            <div className="contact-detail">
              <Mail size={23} aria-hidden="true" />
              <div>
                <h3>Email us</h3>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            </div>
            <div className="contact-detail">
              <Phone size={23} aria-hidden="true" />
              <div>
                <h3>Call us</h3>
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a>
              </div>
            </div>
            <div className="contact-detail">
              <MapPin size={23} aria-hidden="true" />
              <div>
                <h3>Our address</h3>
                <address>{contact.address}</address>
              </div>
            </div>
          </aside>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
