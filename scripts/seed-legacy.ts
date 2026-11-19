import 'dotenv/config'

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Payload } from 'payload'

import legacy from '../src/content/legacy-site.json'
import { additionalPortfolioProjects } from '../src/content/additional-portfolio'
import { portfolioImages } from '../src/content/portfolio-images'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDirectory = path.join(root, 'public')
const dryRun = process.argv.includes('--dry-run')
const portfolioProjects = [...legacy.portfolioProjects, ...additionalPortfolioProjects]

function localAssetPath(assetPath: string): string {
  const resolved = path.resolve(publicDirectory, assetPath.replace(/^\//, ''))
  if (!resolved.startsWith(`${publicDirectory}${path.sep}`)) {
    throw new Error('Source asset path must stay inside public/.')
  }
  return resolved
}

async function importMedia(payload: Payload, assetPath: string, alt: string): Promise<number> {
  const filename = path.basename(assetPath)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs[0]) return existing.docs[0].id

  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: localAssetPath(assetPath),
  })
  return doc.id
}

async function main(): Promise<void> {
  // Validate the complete local source before opening a database connection.
  await Promise.all(legacy.assets.map((asset) => fs.access(localAssetPath(asset.path))))
  await Promise.all(portfolioImages.map((asset) => fs.access(localAssetPath(asset.image))))

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          source: legacy.source.url,
          localAssets: legacy.assets.length,
          replacementPortfolioImages: portfolioImages.length,
          homeHighlights: legacy.homeHighlights.length,
          portfolioProjects: portfolioProjects.length,
          teamMembers: legacy.teamMembers.length,
          globals: ['site-settings'],
          policy:
            'Create missing source records only. Existing records and settings are preserved.',
        },
        null,
        2,
      ),
    )
    return
  }

  if (!process.env.POSTGRES_URL || !process.env.PAYLOAD_SECRET) {
    throw new Error(
      'POSTGRES_URL and PAYLOAD_SECRET are required. Use --dry-run to validate source files without a database.',
    )
  }

  // Standalone imports must not keep Next.js's development HMR WebSocket open.
  process.env.DISABLE_PAYLOAD_HMR = 'true'
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  try {
    let created = 0
    let skipped = 0

    for (const item of legacy.homeHighlights) {
      const existing = await payload.find({
        collection: 'home-highlights',
        where: { title: { equals: item.title } },
        limit: 1,
        depth: 0,
      })
      if (existing.docs.length) {
        skipped++
        continue
      }
      await payload.create({
        collection: 'home-highlights',
        data: { ...item, _status: 'published' },
      })
      created++
    }

    for (const item of portfolioProjects) {
      const existing = await payload.find({
        collection: 'portfolio-projects',
        where: { slug: { equals: item.slug } },
        limit: 1,
        depth: 0,
      })
      if (existing.docs.length) {
        skipped++
        continue
      }
      const { image, imageAlt, technologies, ...data } = item
      const replacement = portfolioImages.find((asset) => asset.slug === item.slug)
      await payload.create({
        collection: 'portfolio-projects',
        data: {
          ...data,
          image: await importMedia(
            payload,
            replacement?.image || image,
            replacement?.alt || imageAlt,
          ),
          imageFit: replacement?.imageFit || 'cover',
          projectURL: replacement?.websiteUrl || '',
          technologies: technologies.map((name) => ({ name })),
          _status: 'published',
        },
      })
      created++
    }

    for (const item of legacy.teamMembers) {
      const existing = await payload.find({
        collection: 'team-members',
        where: { name: { equals: item.name } },
        limit: 1,
        depth: 0,
      })
      if (existing.docs.length) {
        skipped++
        continue
      }
      const { photo, imageAlt, ...data } = item
      await payload.create({
        collection: 'team-members',
        data: { ...data, photo: await importMedia(payload, photo, imageAlt), _status: 'published' },
      })
      created++
    }

    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    if (!settings.hero?.title) {
      const { companyName, about, contact } = legacy.siteSettings
      const { eyebrow, title, description } = legacy.siteSettings.hero
      await payload.updateGlobal({
        slug: 'site-settings',
        data: { companyName, hero: { eyebrow, title, description }, about, contact },
      })
      created++
    } else {
      skipped++
    }

    console.log(
      JSON.stringify({ created, skipped, policy: 'Existing content was preserved.' }, null, 2),
    )
  } finally {
    await payload.destroy()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Legacy content import failed.')
  process.exitCode = 1
})
