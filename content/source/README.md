# Source content audit

Source: http://buajittiassociates.com/index.html, retrieved 18 November 2026. Original HTML is preserved as `index.html`; the media manifest is `assets.json`. Cleaned, structured site content is in `src/content/legacy-site.json`.

## Inventory

- Ten home consulting bullets, in their original order.
- About copy covering growth, return on investment, automation, analytics and integrations.
- Three portfolio records: Navy Federal Credit Union, Wesco International and Veterans Affairs. Original dates and category are preserved as text.
- Two team members, with their original roles and portraits. The source supplies no biographies, individual contact details or working social profiles.
- Four client logos: nVisionKC, IN.gov, Navy Federal Credit Union and Wesco.
- Contact address, phone and email. Standard form fields are name, email, subject and message.
- Four original skills and percentages are retained as archival source data.
- Fourteen downloaded images, all successful.

## Editorial decisions and source defects

The About copy was malformed HTML with spelling errors and broken list markup. It has been split into readable paragraphs and three distinct benefits. Generic placeholder footer services, empty social links, newsletter controls and the unlabeled call-to-action section were not migrated into the clean content model. No qualifications, project outcomes, testimonials or team biographies were invented. The original site says "Microsoft certified developers"; this claim was retained as supplied.

The contact block uses "Warm Spring Road" while the footer uses "Warm Springs Road". Structured content uses the footer spelling. The Veterans Affairs dates remain "October 2019 & August 2022" rather than forcing two engagements into one timestamp.

## Image presentation

All three portfolio images are raster composites with text and logos. Their source dimensions differ: Navy Federal 1024 x 607, Wesco 1024 x 579, Veterans Affairs 1024 x 596. Use one consistent frame (16:10 or 16:9), an explicit maximum size, and `object-fit: contain`; `cover` clips captions and logos. These originals contain social badges and low-resolution text baked into the image. Retaining the source images preserves supplied content; new clean artwork would require new assets.

Portraits: Ken Buajitti 452 x 548, Sanjeev Bastodkar 516 x 640. Use a consistent portrait frame and `object-fit: cover`, with a centre/top focus.

Hero illustration 780 x 646; skills illustration 1024 x 630; background 1920 x 995. All are generic illustration or stock imagery from the existing template. The old favicon and Apple touch icon are template assets and should be replaced with the new site's identity.
