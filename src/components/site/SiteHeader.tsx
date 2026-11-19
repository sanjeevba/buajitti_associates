'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About us' },
  { href: '/expertise', label: 'Our Expertise' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/team', label: 'Team' },
]

export function Brand({ companyName }: { companyName: string }) {
  return (
    <Link href="/" className="site-brand" aria-label={`${companyName} home`}>
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
      </span>
      <span className="brand-name">
        {companyName.replace(/\s+LTD\.?$/i, '')}
        <small>MICROSOFT SOLUTIONS CONSULTING</small>
      </span>
    </Link>
  )
}

export function SiteHeader({ companyName }: { companyName: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])
  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Brand companyName={companyName} />
        <button
          ref={toggle}
          type="button"
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-controls="site-navigation"
          aria-expanded={open}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="site-navigation"
          className={`site-nav${open ? ' is-open' : ''}`}
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="button button-small"
            aria-current={pathname === '/contact' ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            Contact us
          </Link>
        </nav>
      </div>
    </header>
  )
}
