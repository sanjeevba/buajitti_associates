import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Contact submission', plural: 'Contact submissions' },
  admin: {
    group: 'Enquiries',
    useAsTitle: 'subject',
    defaultColumns: ['name', 'email', 'subject', 'createdAt'],
    description:
      'Messages submitted through the website contact form. Only signed-in staff can read these.',
  },
  access: {
    // Only the validated server endpoint may create enquiries via the trusted Local API.
    create: () => false,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    { name: 'email', type: 'email', required: true },
    { name: 'subject', type: 'text', required: true, maxLength: 200 },
    { name: 'message', type: 'textarea', required: true, maxLength: 5000 },
  ],
  timestamps: true,
}
