import Link from 'next/link'
import {
  AppWindow,
  ChartNoAxesCombined,
  Cloud,
  Database,
  GitBranch,
  Layers3,
  Lightbulb,
  Network,
  Workflow,
  Zap,
  Bot,
  Check,
} from 'lucide-react'
import type { HomeHighlight, PortfolioProject } from '@/lib/site-content'
import type { LucideIcon } from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  'power apps': AppWindow,
  apps: AppWindow,
  'app-window': AppWindow,
  'power automate': Workflow,
  automate: Workflow,
  workflow: Workflow,
  'power pages': Layers3,
  pages: Layers3,
  layers: Layers3,
  'power virtual agents': Bot,
  agents: Bot,
  bot: Bot,
  'power bi': ChartNoAxesCombined,
  analytics: ChartNoAxesCombined,
  chart: ChartNoAxesCombined,
  'dynamics 365': Network,
  dynamics: Network,
  network: Network,
  dataverse: Database,
  database: Database,
  'azure functions': Zap,
  functions: Zap,
  zap: Zap,
  'azure devops': GitBranch,
  devops: GitBranch,
  'git-branch': GitBranch,
  copilot: Lightbulb,
  lightbulb: Lightbulb,
}

export function Highlights({ highlights }: { highlights: HomeHighlight[] }) {
  return (
    <ul className="highlight-grid">
      {highlights.map((item) => {
        const Icon =
          icons[item.icon.trim().toLowerCase()] || icons[item.title.toLowerCase()] || Layers3
        return (
          <li key={item.id}>
            <span className="highlight-icon">
              <Icon aria-hidden="true" size={22} strokeWidth={1.7} />
            </span>
            <div>
              <h3>{item.title}</h3>
              {item.description && <p>{item.description}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  )
}

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="page-intro">
      <div className="site-container">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{children}</p>
      </div>
    </section>
  )
}

export function ContactCTA() {
  return (
    <section id="contact" className="cta-section">
      <div className="site-container cta-inner">
        <div>
          <span className="eyebrow">LET’S BUILD SOMETHING USEFUL</span>
          <h2>
            What could work better
            <br />
            in your business?
          </h2>
          <p>Tell us where you are today. Let’s explore what comes next.</p>
        </div>
        <Link className="button button-white" href="/contact">
          Talk to our team
        </Link>
      </div>
    </section>
  )
}

export function ProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <article className="project-card">
      <Link
        className="project-card-image"
        href={`/portfolio#${project.slug}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        {project.image ? (
          <img
            src={project.image}
            alt=""
            loading="lazy"
            style={{ objectFit: project.imageFit || 'contain' }}
          />
        ) : (
          <span className="project-image-placeholder">
            <Layers3 size={52} />
          </span>
        )}
      </Link>
      <div className="project-card-body">
        <span className="project-category">{project.category || 'Dynamics 365'}</span>
        <h3>
          <Link href={`/portfolio#${project.slug}`}>{project.client || project.title}</Link>
        </h3>
        <p>{project.description}</p>
        <Link className="text-link" href={`/portfolio#${project.slug}`}>
          Explore project
        </Link>
      </div>
    </article>
  )
}

export function PlatformVisual() {
  return (
    <div
      className="platform-visual"
      role="img"
      aria-label="Power Apps brings apps and automation together with Microsoft Azure, Dynamics 365 and Power BI around your business."
    >
      <div className="visual-grid" />
      <div className="visual-heading">
        <span className="visual-label">A CONNECTED MICROSOFT ECOSYSTEM</span>
        <span className="visual-symbol" aria-hidden="true">
          +
        </span>
      </div>
      <svg viewBox="0 0 550 400" className="connection-lines" aria-hidden="true">
        <path d="M275 200 L125 95 M275 200 L425 95 M275 200 L125 305 M275 200 L425 305 M275 200 L275 355" />
      </svg>
      <div className="visual-node node-apps">
        <span>
          <AppWindow size={23} />
        </span>
        <strong>Power Apps</strong>
        <small>Apps &amp; automation</small>
      </div>
      <div className="visual-node node-azure">
        <span>
          <Cloud size={23} />
        </span>
        <strong>Microsoft Azure</strong>
        <small>Cloud &amp; integration</small>
      </div>
      <div className="visual-center">
        <div className="center-emblem">
          <Layers3 size={32} />
        </div>
        <strong>Your business</strong>
        <small>Connected. Simplified.</small>
      </div>
      <div className="visual-node node-data">
        <span>
          <Database size={23} />
        </span>
        <strong>Dynamics 365</strong>
        <small>Bring it all together</small>
      </div>
      <div className="visual-node node-insights">
        <span>
          <ChartNoAxesCombined size={23} />
        </span>
        <strong>Power BI</strong>
        <small>See the bigger picture</small>
      </div>
      <div className="visual-bottom">
        <Check size={15} />
        <span>Built around the way you work</span>
      </div>
    </div>
  )
}
