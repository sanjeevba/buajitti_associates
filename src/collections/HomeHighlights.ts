import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

export const HomeHighlights: CollectionConfig = {
  slug: 'home-highlights',
  labels: { singular: 'Home highlight', plural: 'Home highlights' },
  admin: {
    group: 'Website content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', '_status'],
    description: 'The editable technology and service highlights on the Our Expertise page.',
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
    { name: 'title', type: 'text', required: true, maxLength: 100 },
    { name: 'description', type: 'textarea', maxLength: 500 },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Optional icon identifier used by the website.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      required: true,
      index: true,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
