import { cache } from 'react'

import legacy from '@/content/legacy-site.json'
import { additionalPortfolioProjects } from '@/content/additional-portfolio'
import { portfolioImages } from '@/content/portfolio-images'
import type { Media } from '@/payload-types'

export type SiteSettings = {
  companyName: string
  hero: { eyebrow: string; title: string; description: string }
  about: {
    title: string
    introduction: string
    description: string
    benefits: { title: string; description: string }[]
  }
  contact: { address: string; phone: string; email: string }
}

export type HomeHighlight = {
  id: string
  title: string
  description: string
  icon: string
  order: number
}

export type PortfolioProject = {
  id: string
  title: string
  slug: string
  client: string
  category: string
  description: string
  technologies: string[]
  projectDate: string
  projectURL: string
  image: string
  imageAlt: string
  imageFit: 'contain' | 'cover'
  order: number
  featured: boolean
}

export type TeamMember = {
  id: string
  name: string
  role: string
  bio: string
  photo: string
  photoAlt: string
  email: string
  linkedin: string
  order: number
}

export type SiteContent = {
  settings: SiteSettings
  highlights: HomeHighlight[]
  projects: PortfolioProject[]
  team: TeamMember[]
}

/** A deliberate source preview, useful before the first database migration/import. */
export function getLegacySiteContent(): SiteContent {
  return {
    settings: legacy.siteSettings,
    highlights: legacy.homeHighlights.map((item) => ({
      ...item,
      id: `legacy-highlight-${item.order}`,
      description: '',
      icon: '',
    })),
    projects: [...legacy.portfolioProjects, ...additionalPortfolioProjects].map((item) => {
      const replacement = portfolioImages.find((image) => image.slug === item.slug)
      return {
        ...item,
        id: item.slug,
        projectURL: replacement?.websiteUrl || '',
        image: replacement?.image || item.image,
        imageAlt: replacement?.alt || item.imageAlt,
        imageFit: replacement?.imageFit || 'cover',
      }
    }),
    team: legacy.teamMembers.map((item) => ({
      ...item,
      id: `legacy-team-${item.order}`,
      photoAlt: item.imageAlt,
      email: '',
      linkedin: '',
    })),
  }
}

function mediaValue(value: number | Media | null | undefined) {
  return value && typeof value === 'object' ? value : null
}

/** Only published CMS records are exposed. Empty collections stay empty. */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  if (process.env.SITE_CONTENT_SOURCE === 'legacy') return getLegacySiteContent()

  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ])
  const payload = await getPayload({ config })
  const [settings, highlights, projects, team] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', overrideAccess: false }),
    payload.find({
      collection: 'home-highlights',
      overrideAccess: false,
      draft: false,
      pagination: false,
      sort: 'order',
    }),
    payload.find({
      collection: 'portfolio-projects',
      overrideAccess: false,
      draft: false,
      pagination: false,
      depth: 1,
      sort: 'order',
    }),
    payload.find({
      collection: 'team-members',
      overrideAccess: false,
      draft: false,
      pagination: false,
      depth: 1,
      sort: 'order',
    }),
  ])

  return {
    settings: {
      companyName: settings.companyName,
      hero: {
        eyebrow: settings.hero.eyebrow || '',
        title: settings.hero.title,
        description: settings.hero.description,
      },
      about: {
        title: settings.about.title,
        introduction: settings.about.introduction,
        description: settings.about.description || '',
        benefits: (settings.about.benefits || []).map(({ title, description }) => ({
          title,
          description,
        })),
      },
      contact: {
        address: settings.contact.address,
        phone: settings.contact.phone,
        email: settings.contact.email,
      },
    },
    highlights: highlights.docs.map((item) => ({
      id: String(item.id),
      title: item.title,
      description: item.description || '',
      icon: item.icon || '',
      order: item.order || 0,
    })),
    projects: projects.docs.map((item) => {
      const image = mediaValue(item.image)
      return {
        id: String(item.id),
        title: item.title,
        slug: item.slug || '',
        client: item.client || '',
        category: item.category || '',
        description: item.description,
        technologies: (item.technologies || []).map((technology) => technology.name),
        projectDate: item.projectDate || '',
        projectURL: item.projectURL || '',
        image: image?.url || '',
        imageAlt: image?.alt || item.title,
        imageFit: item.imageFit === 'cover' ? 'cover' : 'contain',
        order: item.order || 0,
        featured: item.featured || false,
      }
    }),
    team: team.docs.map((item) => {
      const photo = mediaValue(item.photo)
      return {
        id: String(item.id),
        name: item.name,
        role: item.role,
        bio: item.bio || '',
        photo: photo?.url || '',
        photoAlt: photo?.alt || `${item.name}, ${item.role}`,
        email: item.email || '',
        linkedin: item.linkedin || '',
        order: item.order || 0,
      }
    }),
  }
})
