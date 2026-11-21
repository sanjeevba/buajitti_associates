import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Buajitti &amp; Associates</h4>
      </Banner>
      <a href="/" target="_blank" rel="noopener noreferrer">
        View website
      </a>
    </div>
  )
}

export default BeforeDashboard
