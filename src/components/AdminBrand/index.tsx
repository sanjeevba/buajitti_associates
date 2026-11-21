import React from 'react'

const BrandMark = ({ className, label }: { className: string; label?: string }) => (
  <svg
    aria-hidden={label ? undefined : true}
    aria-label={label}
    className={className}
    fill="none"
    role={label ? 'img' : undefined}
    viewBox="0 0 40 48"
  >
    <g transform="translate(2 10) skewY(-15)">
      <path d="M0 0h26a8 8 0 0 1 0 16H0z" fill="currentColor" />
      <path d="M0 21h17a8 8 0 0 1 0 16H0z" fill="currentColor" opacity=".72" />
    </g>
  </svg>
)

export const AdminLogo = () => (
  <div aria-label="Buajitti & Associates" className="admin-brand">
    <BrandMark className="admin-brand__mark" />
    <span className="admin-brand__name">
      Buajitti &amp; Associates
      <span className="admin-brand__tagline">Microsoft solutions consulting</span>
    </span>
  </div>
)

export const AdminIcon = () => <BrandMark className="admin-icon" label="Dashboard" />
