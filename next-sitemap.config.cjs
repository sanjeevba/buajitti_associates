const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/search',
    '/posts',
    '/posts/*',
    '/posts-sitemap.xml',
    '/pages-sitemap.xml',
  ],
  additionalPaths: async () =>
    ['/', '/about', '/expertise', '/portfolio', '/team', '/contact'].map((path) => ({
      loc: path,
      changefreq: 'monthly',
      priority: path === '/' ? 1 : 0.8,
    })),
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
  },
}
