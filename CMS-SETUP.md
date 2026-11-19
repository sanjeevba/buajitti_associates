# Buajitti & Associates CMS

This website uses the existing Payload 3 / Next.js application and PostgreSQL database. The original website was reviewed and archived at `content/source/index.html`; the cleaned source content and local image inventory are in `src/content/legacy-site.json`.

## Configure and start

1. Install dependencies with `pnpm install`.
2. Configure `.env` using `.env.example`: set `POSTGRES_URL`, `PAYLOAD_SECRET` and `NEXT_PUBLIC_SERVER_URL`.
3. Run `pnpm payload migrate` to apply the tracked schema migrations.
4. Run `pnpm seed:legacy:dry-run` to validate the archived source and local assets without connecting to a database.
5. Run `pnpm seed:legacy` to import the original website content and project/team images.
6. Run `pnpm dev` and open `http://localhost:3000`. Sign in at `/admin` with the existing administrator account; on a new database, create the first account through Payload's setup screen.

The import creates 10 home highlights, 5 portfolio projects, 2 team members, 7 media records and site settings. The portfolio includes the original three entries plus the State of Indiana (IN.gov) and nVisionKC. All imported content is published. It creates missing records only; running it again preserves existing records and editorial changes. It does not create users or submit contact messages. Portfolio records are matched by slug, team members by name, home highlights by title and media by filename.

Schema push is disabled by default so starting a development server does not silently change a shared database. Use the tracked migrations. `PAYLOAD_DB_PUSH=true` is available for a disposable local database; leave it false for shared and production databases. If an existing database was previously managed with Payload's development push mode, the migrate command can ask you to acknowledge its development migration marker. Review the target database and pending migration before confirming. Do not run reset, fresh or refresh against an existing website database.

## Editing website content

| Payload area        | What it controls                                                          |
| ------------------- | ------------------------------------------------------------------------- |
| Home highlights     | The technology highlights on Our Expertise. Use `order` to arrange them.  |
| Portfolio projects  | Client/project details, technologies, dates, links and images.            |
| Team members        | Names, roles, optional biographies, portraits and contact links.          |
| Site settings       | Company name, home introduction, about copy/benefits and contact details. |
| Media               | Uploaded images and accessible alternative text.                          |
| Contact submissions | Private enquiries submitted through the website contact form.             |

Home highlights, portfolio projects and team members support drafts and version history. Publish a record to display it publicly; draft records are private to signed-in administrators. Only signed-in administrators can change content. Site settings take effect when saved.

Portfolio previews use compact square tiles, up to 280px wide, with rounded corners. The downloaded company logos use **Show the whole image** and white padding so their complete artwork stays visible. **Fill the frame** crops photographs into the square. Set the project's website URL to display it below the logo and make both the logo and URL open the company website. Keep alternative text descriptive. The original team page did not supply biographies or working social profiles, so those fields are intentionally empty.

The curated portfolio image manifest is `src/content/portfolio-images.ts`; provenance and downloaded source details are documented in `content/portfolio/`. New legacy imports use these replacement images and organization website URLs. The two additional organization profiles are in `src/content/additional-portfolio.ts`. To add those entries to an existing installation, run `pnpm portfolio:add-organizations --dry-run`, then `pnpm portfolio:add-organizations`. Existing records are preserved. Run `pnpm refresh:portfolio-images` to apply curated images and fill missing website URLs for matching entries. Repeated runs skip records already using the replacements.

## Storage and contact messages

When `BLOB_READ_WRITE_TOKEN` is configured, Payload stores media in Vercel Blob. Without it, uploads use `public/media`; that directory requires persistent writable storage when hosting outside local development. The checked-in source images under `public/images/legacy` remain available for the explicit legacy preview.

The contact form validates and saves messages in the private Contact submissions collection. Public visitors cannot read messages or create them through Payload's generic collection API; the website's validated contact endpoint handles creation. Email delivery requires a separately configured email adapter and notification workflow; saving a submission does not itself send an email.

`SITE_CONTENT_SOURCE=payload` reads the published CMS content. `SITE_CONTENT_SOURCE=legacy` provides a preview from the checked-in source content without a database; it does not import records. Complete the migration and seed before switching a fresh installation to Payload content.

## Production

Set the database, Payload secret, public server URL and durable media storage variables on the host. Apply `pnpm payload migrate` before building the application with `pnpm build`. Run `pnpm seed:legacy` once when provisioning the initial site, then manage future content through `/admin`. Keep production schema push disabled. Existing unrelated pages, posts, categories and users are retained by this change.
