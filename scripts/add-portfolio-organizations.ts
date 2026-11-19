import 'dotenv/config'

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { additionalPortfolioProjects } from '../src/content/additional-portfolio'
import { portfolioImages } from '../src/content/portfolio-images'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDirectory = path.join(root, 'public')
const dryRun = process.argv.includes('--dry-run')

function localAssetPath(image: string): string {
  const resolved = path.resolve(publicDirectory, image.replace(/^\//, ''))
  if (!resolved.startsWith(`${publicDirectory}${path.sep}`)) {
    throw new Error('Portfolio images must stay inside public/.')
  }
  return resolved
}

async function main(): Promise<void> {
  // Validate only the requested additions before opening a database connection.
  const additions = await Promise.all(
    additionalPortfolioProjects.map(async (project) => {
      const asset = portfolioImages.find((image) => image.slug === project.slug)
      if (!asset) throw new Error(`Portfolio image metadata not found: ${project.slug}`)
      const filePath = localAssetPath(asset.image)
      await fs.access(filePath)
      return { project, asset, filePath }
    }),
  )

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          projects: additions.map(({ project, asset }) => ({
            slug: project.slug,
            title: project.title,
            image: asset.image,
            websiteUrl: asset.websiteUrl,
          })),
          policy:
            'Create only missing organization profiles and media. Preserve all existing records.',
        },
        null,
        2,
      ),
    )
    return
  }

  if (!process.env.POSTGRES_URL || !process.env.PAYLOAD_SECRET) {
    throw new Error(
      'POSTGRES_URL and PAYLOAD_SECRET are required. Use --dry-run to validate local files offline.',
    )
  }

  process.env.DISABLE_PAYLOAD_HMR = 'true'
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  try {
    const existingProjects = await payload.find({
      collection: 'portfolio-projects',
      depth: 0,
      pagination: false,
      overrideAccess: true,
    })
    let created = 0
    let skipped = 0
    let uploaded = 0

    for (const { project, asset, filePath } of additions) {
      const existing = await payload.find({
        collection: 'portfolio-projects',
        where: { slug: { equals: project.slug } },
        depth: 0,
        limit: 1,
        overrideAccess: true,
      })
      if (existing.docs.length) {
        skipped++
        continue
      }

      const foundMedia = await payload.find({
        collection: 'media',
        where: { filename: { equals: path.basename(asset.image) } },
        depth: 0,
        limit: 1,
        overrideAccess: true,
      })
      let media = foundMedia.docs[0]
      if (!media) {
        media = await payload.create({
          collection: 'media',
          filePath,
          data: { alt: asset.alt },
          overrideAccess: true,
        })
        uploaded++
      }

      const { image: _image, imageAlt: _imageAlt, technologies, ...content } = project
      await payload.create({
        collection: 'portfolio-projects',
        data: {
          ...content,
          image: media.id,
          imageFit: asset.imageFit,
          projectURL: asset.websiteUrl,
          technologies: technologies.map((name) => ({ name })),
          _status: 'published',
        },
        overrideAccess: true,
      })
      created++
    }

    for (const original of existingProjects.docs) {
      const current = await payload.findByID({
        collection: 'portfolio-projects',
        id: original.id,
        depth: 0,
        overrideAccess: true,
      })
      if (JSON.stringify(current) !== JSON.stringify(original)) {
        throw new Error(`Existing portfolio content changed unexpectedly: ${original.slug}`)
      }
    }

    console.log(
      JSON.stringify({ created, skipped, uploaded, existingProjectsPreserved: true }, null, 2),
    )
  } finally {
    await payload.destroy()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Adding portfolio organizations failed.')
  process.exitCode = 1
})
