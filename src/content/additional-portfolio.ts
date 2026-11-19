type PortfolioSourceProject = {
  title: string
  slug: string
  client: string
  category: string
  description: string
  technologies: string[]
  projectDate: string
  image: string
  imageAlt: string
  imageFit: 'contain' | 'cover'
  order: number
  featured: boolean
}

/** Organization profiles requested after the original website migration. */
export const additionalPortfolioProjects: PortfolioSourceProject[] = [
  {
    title: 'State of Indiana (IN.gov)',
    slug: 'state-of-indiana',
    client: 'State of Indiana',
    category: 'Government',
    description:
      'Indiana’s official government portal connects residents, businesses and visitors with state information, agencies and online services.',
    technologies: [],
    projectDate: '',
    image: '/images/portfolio/in-gov.png',
    imageAlt: 'IN.gov State of Indiana logo',
    imageFit: 'contain',
    order: 4,
    featured: false,
  },
  {
    title: 'nVisionKC',
    slug: 'nvisionkc',
    client: 'nVisionKC',
    category: 'Technology consulting',
    description:
      'nVisionKC is a technology consultancy providing business automation, collaboration, application modernization and data analytics services.',
    technologies: [],
    projectDate: '',
    image: '/images/portfolio/nvisionkc.png',
    imageAlt: 'nVisionKC logo',
    imageFit: 'contain',
    order: 5,
    featured: false,
  },
]
