import { Banner } from '@payloadcms/ui/elements/Banner'
import Link from 'next/link'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Buajitti &amp; Associates</h4>
      </Banner>
      <p>Manage your website using the collections below.</p>
      <ul className={`${baseClass}__instructions`}>
        <li>
          <Link href="/admin/collections/home-highlights">Home highlights</Link>: update and reorder
          the technology and service highlights on the Our Expertise page.
        </li>
        <li>
          <Link href="/admin/collections/portfolio-projects">Portfolio projects</Link>: edit client
          work, upload images and choose how each image fits.
        </li>
        <li>
          <Link href="/admin/collections/team-members">Team members</Link>: manage names, roles,
          biographies and portraits.
        </li>
        <li>
          <Link href="/admin/globals/site-settings">Site settings</Link>: edit home and about copy
          and company contact details.
        </li>
        <li>
          <Link href="/admin/collections/contact-submissions">Contact submissions</Link>: read
          website enquiries.
        </li>
      </ul>
      <p>
        Save content as a draft while editing, then publish it to make it visible on the website.
      </p>
      <a href="/" target="_blank" rel="noopener noreferrer">
        View website
      </a>
    </div>
  )
}

export default BeforeDashboard
