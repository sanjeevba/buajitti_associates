import 'dotenv/config'

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

import { portfolioImages } from '../src/content/portfolio-images'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDirectory = path.join(root, 'public')
const dryRun = process.argv.includes('--dry-run')

function assetPath(image: string) {
  const resolved = path.resolve(publicDirectory, image.replace(/^\//, ''))
  if (!resolved.startsWith(`${publicDirectory}${path.sep}`)) {
    throw new Error('Portfolio images must stay inside public/.')
  }
  return resolved
}

function preservedContent<
  T extends { image?: unknown; imageFit?: unknown; projectURL?: unknown; updatedAt?: unknown },
>(document: T) {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(document)
        .filter(([key]) => !['image', 'imageFit', 'projectURL', 'updatedAt'].includes(key))
        .sort(([a], [b]) => a.localeCompare(b)),
    ),
  )
}

async function main() {
  const assets = await Promise.all(
    portfolioImages.map(async (image) => {
      const filePath = assetPath(image.image)
      await fs.access(filePath)
      const metadata = await sharp(filePath).metadata()
      return {
        slug: image.slug,
        file: path.basename(filePath),
        width: metadata.width,
        height: metadata.height,
        websiteUrl: image.websiteUrl,
      }
    }),
  )
  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          assets,
          policy:
            'Refresh portfolio images and fill missing company website URLs; preserve existing website URLs and other content.',
        },
        null,
        2,
      ),
    )
    return
  }
  if (!process.env.POSTGRES_URL || !process.env.PAYLOAD_SECRET) {
    throw new Error(
      'POSTGRES_URL and PAYLOAD_SECRET are required. Use --dry-run to validate files offline.',
    )
  }

  process.env.DISABLE_PAYLOAD_HMR = 'true'
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  try {
    const targets = await Promise.all(
      portfolioImages.map(async (image) => {
        const result = await payload.find({
          collection: 'portfolio-projects',
          where: { slug: { equals: image.slug } },
          depth: 0,
          limit: 1,
          overrideAccess: true,
        })
        const project = result.docs[0]
        if (!project) throw new Error(`Portfolio entry not found: ${image.slug}`)
        return { image, project }
      }),
    )

    let uploaded = 0
    let updated = 0
    for (const { image, project } of targets) {
      const existing = await payload.find({
        collection: 'media',
        where: { filename: { equals: path.basename(image.image) } },
        depth: 0,
        limit: 1,
        overrideAccess: true,
      })
      let media = existing.docs[0]
      if (!media) {
        media = await payload.create({
          collection: 'media',
          filePath: assetPath(image.image),
          data: { alt: image.alt },
          overrideAccess: true,
        })
        uploaded++
      }
      const projectURL = project.projectURL?.trim() ? project.projectURL : image.websiteUrl
      if (
        project.image === media.id &&
        project.imageFit === image.imageFit &&
        project.projectURL === projectURL
      )
        continue
      const result = await payload.update({
        collection: 'portfolio-projects',
        id: project.id,
        depth: 0,
        data: { image: media.id, imageFit: image.imageFit, projectURL },
        overrideAccess: true,
      })
      if (preservedContent(project) !== preservedContent(result)) {
        throw new Error(`Unexpected content change for ${image.slug}`)
      }
      if (
        result.projectURL !== projectURL ||
        (project.projectURL?.trim() && result.projectURL !== project.projectURL)
      ) {
        throw new Error(`Unexpected website URL change for ${image.slug}`)
      }
      updated++
    }
    console.log(JSON.stringify({ uploaded, updated, otherContentPreserved: true }, null, 2))
  } finally {
    await payload.destroy()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Portfolio image refresh failed.')
  process.exitCode = 1
})
