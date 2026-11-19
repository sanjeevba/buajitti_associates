import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Website content',
    description: 'Company details and content for the home, about and contact pages.',
  },
  access: { read: anyone, update: authenticated },
  fields: [
    { name: 'companyName', type: 'text', required: true, defaultValue: 'Buajitti & Associates' },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'about',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'introduction', type: 'textarea', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'benefits',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'address', type: 'textarea', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
      ],
    },
  ],
}
