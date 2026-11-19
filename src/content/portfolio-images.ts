export type PortfolioImage = {
  slug: string
  image: string
  alt: string
  imageFit: 'contain' | 'cover'
  websiteUrl: string
  sourceUrl: string
}

/** Download provenance and usage notes are retained in content/portfolio/. */
export const portfolioImages: PortfolioImage[] = [
  {
    slug: 'navy-federal-credit-union',
    image: '/images/portfolio/navy-federal.png',
    alt: 'Navy Federal Credit Union logo',
    imageFit: 'contain',
    websiteUrl: 'https://www.navyfederal.org/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:NavyFederalLogo.png',
  },
  {
    slug: 'wesco-international',
    image: '/images/portfolio/wesco.png',
    alt: 'Wesco International green and charcoal logo',
    imageFit: 'contain',
    websiteUrl: 'https://www.wesco.com/',
    sourceUrl: 'https://dev.wesco.com/us/en/our-company/news-and-insights/our-brand.html',
  },
  {
    slug: 'veterans-affairs',
    image: '/images/portfolio/veterans-affairs.png',
    alt: 'U.S. Department of Veterans Affairs seal and agency name',
    imageFit: 'contain',
    websiteUrl: 'https://www.va.gov/',
    sourceUrl: 'https://design.va.gov/foundation/logos',
  },
  {
    slug: 'state-of-indiana',
    image: '/images/portfolio/in-gov.png',
    alt: 'IN.gov State of Indiana logo',
    imageFit: 'contain',
    websiteUrl: 'https://www.in.gov/core/index.html',
    sourceUrl: 'https://www.in.gov/core/index.html',
  },
  {
    slug: 'nvisionkc',
    image: '/images/portfolio/nvisionkc.png',
    alt: 'nVisionKC logo',
    imageFit: 'contain',
    websiteUrl: 'https://nvisionkc.com/',
    sourceUrl: 'https://nvisionkc.com/',
  },
]
