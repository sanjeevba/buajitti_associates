import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { validateHTTPURL } from '../fields/httpURL'

export const PortfolioProjects: CollectionConfig = {
  slug: 'portfolio-projects',
  labels: { singular: 'Portfolio project', plural: 'Portfolio projects' },
  admin: {
    group: 'Website content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'order', '_status'],
    description: 'Client work and case studies displayed in the portfolio.',
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  defaultSort: 'order',
  versions: { drafts: true, maxPerDoc: 25 },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'client', type: 'text' },
    {
      name: 'category',
      type: 'text',
      admin: { description: 'An optional descriptive category, such as Power Platform.' },
    },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Upload an original image. The website preserves its proportions.' },
    },
    {
      name: 'imageFit',
      type: 'select',
      required: true,
      defaultValue: 'contain',
      options: [
        { label: 'Show the whole image (best for screenshots and logos)', value: 'contain' },
        { label: 'Fill the frame (crops image edges)', value: 'cover' },
      ],
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'projectDate',
      type: 'text',
      admin: { description: 'A flexible date or period, such as 2021–2024.' },
    },
    { name: 'projectURL', type: 'text', validate: validateHTTPURL },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      index: true,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
