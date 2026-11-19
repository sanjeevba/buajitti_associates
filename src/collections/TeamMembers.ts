import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { validateHTTPURL } from '../fields/httpURL'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team member', plural: 'Team members' },
  admin: {
    group: 'Website content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order', '_status'],
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
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'email', type: 'email' },
    { name: 'linkedin', type: 'text', validate: validateHTTPURL },
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
