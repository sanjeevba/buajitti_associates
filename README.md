# Buajitti & Associates

A responsive Microsoft Power Platform consultancy website built with Next.js and Payload CMS. Content and original imagery were migrated from [buajittiassociates.com](http://buajittiassociates.com/index.html).

## Run locally

Use Node.js and pnpm versions listed in `package.json`. Copy `.env.example` to `.env` for a fresh installation, set `POSTGRES_URL` and a strong `PAYLOAD_SECRET`, and set `NEXT_PUBLIC_SERVER_URL` to your local or deployed origin. Preserve any existing environment credentials.

```sh
pnpm install
pnpm payload migrate
pnpm seed:legacy:dry-run
pnpm seed:legacy
pnpm dev
```

Open http://localhost:3000 for the website and http://localhost:3000/admin for the CMS. An existing administrator account is preserved. On a fresh database, Payload presents its first-user setup.

The import creates missing content and uploads the original project images and team portraits. Re-running it preserves existing records and editorial changes. It never runs the starter template's destructive seed. Schema push is disabled by default; use committed migrations against shared databases.

For an intentional content-only preview before database setup, set `SITE_CONTENT_SOURCE=legacy`. This renders the archived source data; CMS edits require `SITE_CONTENT_SOURCE=payload` (the default). The contact form always requires the database.

## Edit the website

- **Home Highlights:** the ten original service bullets, now displayed on the dedicated Our Expertise page; add descriptions and adjust display order.
- **Portfolio Projects:** client, project description, date, technologies, image, website URL, and featured placement. The downloaded company logos appear in compact square tiles with **Show the whole image** to keep each logo intact. **Fill the frame** crops a photograph to the square. Each logo and the URL below it link to the company's website.
- **Team Members:** names, roles, photos, and optional biographies/contact links.
- **Site settings:** company name, homepage introduction, About text and benefits, and contact details.
- **Contact Submissions:** enquiries received by the website, visible only to authenticated administrators.

Home highlights, projects, and team members support drafts and published versions. Save and publish a record to show it publicly. The frontend reads published CMS content on each request, so edits do not require rebuilding the website.

The contact form validates name, email, subject and message on the server, rejects cross-site browser submissions, and includes a honeypot. A successful submission is saved in **Contact Submissions**. Email notifications are not configured; review enquiries in the CMS.

## Verify and deploy

```sh
pnpm exec tsc --noEmit
pnpm exec vitest run tests/int/contact.int.spec.ts --config vitest.config.mts
pnpm test:e2e -- tests/e2e/frontend.e2e.spec.ts
pnpm build
```

Set the database, Payload secret, and public site URL in the hosting environment. Set `BLOB_READ_WRITE_TOKEN` for durable Vercel Blob uploads on Vercel; without it, media is stored on the server filesystem, which requires persistent storage. Apply `pnpm payload migrate` before the new deployment serves traffic. Run the legacy import once against the intended database, then publish the app using the existing hosting setup.

See [CMS-SETUP.md](CMS-SETUP.md) for collection/import details and [content/source/README.md](content/source/README.md) for the source audit. Original HTML, source notes and downloaded assets are committed for reproducibility.

Replacement portfolio image sources are recorded in [content/portfolio/README.md](content/portfolio/README.md). `pnpm refresh:portfolio-images --dry-run` validates these files offline; `pnpm refresh:portfolio-images` uploads and assigns them to the existing portfolio entries while preserving other content.
