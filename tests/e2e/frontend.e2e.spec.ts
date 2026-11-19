import { test, expect } from '@playwright/test'
import legacy from '../../src/content/legacy-site.json'
import { portfolioImages } from '../../src/content/portfolio-images'

const origin = 'http://localhost:3000'
test.setTimeout(60000)

test('home keeps only the hero and links to the other pages', async ({ page }) => {
  await page.goto(origin)
  await expect(page).toHaveTitle(/Buajitti & Associates/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(legacy.siteSettings.hero.title)
  await expect(page.locator('main > section')).toHaveCount(1)
  await expect(page.locator('.home-hero')).toBeVisible()
  await expect(
    page.locator('.expertise-strip, .highlight-grid, .project-card, .team-preview, .cta-section'),
  ).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Explore our work', exact: true })).toHaveAttribute(
    'href',
    '/portfolio',
  )
  await expect(
    page.getByRole('link', { name: 'Let’s talk about your project', exact: true }),
  ).toHaveAttribute('href', '/contact')
})

test('desktop navigation opens every page and identifies the active page', async ({ page }) => {
  await page.goto(origin)
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  for (const [label, path] of [
    ['About us', '/about'],
    ['Our Expertise', '/expertise'],
    ['Portfolio', '/portfolio'],
    ['Team', '/team'],
    ['Contact us', '/contact'],
  ]) {
    await nav.getByRole('link', { name: label, exact: true }).click()
    await expect(page).toHaveURL(origin + path)
    await expect(nav.getByRole('link', { name: label, exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  }
})

test('About focuses on company approach and three business benefits', async ({ page }) => {
  await page.goto(origin + '/about')
  await expect(page.locator('.benefit-card h3')).toHaveText(
    legacy.siteSettings.about.benefits.map((item) => item.title),
  )
  await expect(page.getByText(legacy.siteSettings.about.description, { exact: true })).toBeVisible()
  await expect(page.locator('.expertise-strip, .highlight-grid')).toHaveCount(0)
  await expect(page.locator('main a[href="/expertise"]')).toBeVisible()
})

test('Our Expertise presents the connected technologies and all service highlights', async ({
  page,
}) => {
  await page.goto(origin + '/expertise')
  await expect(page).toHaveTitle(/Our Expertise/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Our Expertise')
  await expect(page.locator('.expertise-strip')).toContainText('CONNECTED EXPERTISE')
  await expect(page.locator('.highlight-grid > li h3')).toHaveText(
    legacy.homeHighlights.map((item) => item.title),
  )
})

test('portfolio company images link to their websites in compact square tiles', async ({
  page,
}) => {
  await page.goto(origin + '/portfolio')
  await expect(page.locator('.portfolio-project')).toHaveCount(portfolioImages.length)
  const images = page.locator('.portfolio-image-frame img')
  for (let index = 0; index < portfolioImages.length; index++) {
    await images.nth(index).scrollIntoViewIfNeeded()
    await expect
      .poll(() =>
        images
          .nth(index)
          .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
      )
      .toBe(true)
    const replacement = portfolioImages[index]!
    const websiteLink = page.locator('.portfolio-media > a').nth(index)
    await expect(websiteLink).toHaveAttribute('href', replacement.websiteUrl)
    await expect(websiteLink).toContainText(
      replacement.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    )
    await expect(images.nth(index)).toHaveCSS('object-fit', replacement.imageFit)
    await expect(images.nth(index)).toHaveAttribute('alt', replacement.alt)
    expect(await images.nth(index).getAttribute('src')).toContain(
      replacement.image.split('/').pop()!,
    )
    const geometry = await images.nth(index).evaluate((image: HTMLImageElement) => {
      const bounds = image.getBoundingClientRect()
      const frame = image.closest('.portfolio-image-frame')!.getBoundingClientRect()
      return {
        ratio: bounds.width / bounds.height,
        frameWidth: frame.width,
        frameHeight: frame.height,
        insideFrame:
          bounds.left >= frame.left &&
          bounds.right <= frame.right &&
          bounds.top >= frame.top &&
          bounds.bottom <= frame.bottom,
      }
    })
    expect(Math.abs(geometry.ratio - 1)).toBeLessThan(0.01)
    expect(geometry.insideFrame).toBe(true)
    expect(geometry.frameWidth).toBeLessThanOrEqual(280)
    expect(Math.abs(geometry.frameWidth - geometry.frameHeight)).toBeLessThan(1)
  }
  await expect(page.getByText('View full-size image', { exact: true })).toHaveCount(0)
})

test('team shows both original names, roles and portraits', async ({ page }) => {
  await page.goto(origin + '/team')
  await expect(page.locator('.team-profile')).toHaveCount(2)
  for (const member of legacy.teamMembers) {
    await expect(page.getByRole('heading', { name: member.name, exact: true })).toBeVisible()
    await expect(page.getByText(member.role, { exact: true })).toBeVisible()
    const image = page.getByRole('img', { name: member.imageAlt })
    await image.scrollIntoViewIfNeeded()
    await expect
      .poll(() =>
        image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0),
      )
      .toBe(true)
  }
})

test('mobile navigation opens, closes on Escape and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(origin)
  const toggle = page.getByRole('button', { name: 'Open navigation' })
  await toggle.click()
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
  await toggle.click()
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Portfolio', exact: true })
    .click()
  await expect(page).toHaveURL(origin + '/portfolio')
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
})

test('all six pages fit narrow mobile screens without horizontal overflow', async ({ page }) => {
  for (const width of [360, 700, 768]) {
    await page.setViewportSize({ width, height: 800 })
    for (const path of ['/', '/about', '/expertise', '/portfolio', '/team', '/contact']) {
      await page.goto(origin + path)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
        `${path} at ${width}px`,
      ).toBe(true)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }
  }
})

test('contact form validates required fields and recovers from a save error', async ({ page }) => {
  await page.goto(origin + '/contact')
  const submit = page.getByRole('button', { name: 'Send message', exact: true })
  await submit.click()
  await expect(page.locator('#contact-name')).toBeFocused()
  await page.getByLabel('Your name').fill('Website verification')
  await page.getByLabel('Email address').fill('verification@example.com')
  await page.getByLabel('Subject', { exact: false }).fill('Contact form verification')
  await page.getByLabel('Your message').fill('Checking accessible success and error feedback.')
  let attempts = 0
  await page.route('**/api/contact', async (route) => {
    attempts++
    if (attempts === 1)
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Please try again.' }),
      })
    else
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
  })
  await submit.click()
  await expect(page.locator('.form-status')).toContainText('Please try again.')
  await expect(page.locator('#contact-name')).toHaveValue('Website verification')
  await submit.click()
  await expect(page.locator('.form-status')).toContainText('Your enquiry has been received')
  await expect(page.locator('#contact-name')).toHaveValue('')
})

test('public API hides enquiries and exposes only published content', async ({ request }) => {
  expect((await request.get(origin + '/api/contact-submissions')).status()).toBe(403)
  expect(
    (
      await request.post(origin + '/api/contact-submissions', {
        data: { name: 'No direct creation' },
      })
    ).status(),
  ).toBe(403)
  for (const [collection, count] of [
    ['home-highlights', 10],
    ['portfolio-projects', portfolioImages.length],
    ['team-members', 2],
  ] as const) {
    const response = await request.get(`${origin}/api/${collection}?limit=100`)
    expect(response.ok()).toBe(true)
    const data = await response.json()
    expect(data.docs).toHaveLength(count)
    expect(data.docs.every((doc: { _status: string }) => doc._status === 'published')).toBe(true)
  }
})

test('old index URL redirects to the new home', async ({ request }) => {
  const response = await request.get(origin + '/index.html', { maxRedirects: 0 })
  expect(response.status()).toBe(308)
  expect(response.headers().location).toBe('/')
})
