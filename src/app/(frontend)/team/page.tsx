import type { Metadata } from 'next'
import { Mail, Linkedin, UserRound } from 'lucide-react'
import { getSiteContent } from '@/lib/site-content'
import { ContactCTA, PageIntro } from '@/components/site/Shared'

export const metadata: Metadata = {
  title: 'Our team',
  description: 'Meet Ken Buajitti and Sanjeev Bastodkar, the team behind Buajitti & Associates.',
}

export default async function TeamPage() {
  const { team } = await getSiteContent()
  return (
    <main id="main-content">
      <PageIntro eyebrow="OUR TEAM" title="The people behind your next solution.">
        Microsoft expertise. A practical perspective. A shared commitment to helping your business
        move forward.
      </PageIntro>
      <section className="site-section">
        <div className="site-container team-grid">
          {team.map((member) => (
            <article className="team-profile" key={member.id}>
              <div className="team-photo">
                {member.photo ? (
                  <img src={member.photo} alt={member.photoAlt || member.name} loading="lazy" />
                ) : (
                  <UserRound size={86} strokeWidth={1} aria-hidden="true" />
                )}
              </div>
              <div className="team-profile-copy">
                <span className="eyebrow">{member.role}</span>
                <h2>{member.name}</h2>
                {member.bio && <p>{member.bio}</p>}
                <div className="team-links">
                  {member.email && (
                    <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                      <Mail size={19} aria-hidden="true" /> Email
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on LinkedIn (opens in a new tab)`}
                    >
                      <Linkedin size={19} aria-hidden="true" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <ContactCTA />
    </main>
  )
}
