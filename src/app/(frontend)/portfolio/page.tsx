import type { Metadata } from 'next'
import { Layers3, ExternalLink } from 'lucide-react'
import { getSiteContent } from '@/lib/site-content'
import { ContactCTA, PageIntro } from '@/components/site/Shared'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Explore the organizations in the Buajitti & Associates portfolio, with details and links to their websites.',
}

export default async function PortfolioPage() {
  const { projects } = await getSiteContent()
  return (
    <main id="main-content">
      <PageIntro eyebrow="OUR PORTFOLIO" title="Good technology. Meaningful work.">
        A closer look at the businesses and organizations we’ve supported with Microsoft solutions.
      </PageIntro>
      <section className="site-section">
        <div className="site-container portfolio-list">
          {projects.map((project) => (
            <article key={project.id} id={project.slug} className="portfolio-project">
              <div className="portfolio-media">
                {project.image ? (
                  <a
                    href={project.projectURL || project.image}
                    target="_blank"
                    rel="noreferrer"
                    className="portfolio-image-link"
                    aria-label={
                      project.projectURL
                        ? `Visit ${project.client || project.title} website (opens in a new tab)`
                        : `View ${project.client || project.title} image (opens in a new tab)`
                    }
                  >
                    <div
                      className={`portfolio-image-frame${project.imageFit === 'contain' ? ' portfolio-image-contain' : ''}`}
                    >
                      <img
                        src={project.image}
                        alt={project.imageAlt || project.title}
                        loading="lazy"
                        style={{ objectFit: project.imageFit || 'contain' }}
                      />
                    </div>
                    {project.projectURL && (
                      <span className="image-caption">
                        {project.projectURL.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        <ExternalLink size={14} aria-hidden="true" />
                      </span>
                    )}
                  </a>
                ) : (
                  <div className="portfolio-image-frame">
                    <Layers3 size={64} aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="portfolio-copy">
                <span className="eyebrow">{project.category || 'MICROSOFT SOLUTIONS'}</span>
                <h2>{project.title}</h2>
                <p className="project-description">{project.description}</p>
                <dl className="project-facts">
                  <div>
                    <dt>Client</dt>
                    <dd>{project.client}</dd>
                  </div>
                  {project.projectDate && (
                    <div>
                      <dt>Project date</dt>
                      <dd>{project.projectDate}</dd>
                    </div>
                  )}
                </dl>
                {project.technologies.length > 0 && (
                  <ul className="technology-tags" aria-label="Technologies">
                    {project.technologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <ContactCTA />
    </main>
  )
}
