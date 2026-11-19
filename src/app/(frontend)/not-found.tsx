import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="main-content" className="page-intro">
      <div className="site-container">
        <span className="eyebrow">PAGE NOT FOUND</span>
        <h1>Let’s get you back on track.</h1>
        <p>The page you’re looking for could not be found.</p>
        <Link className="button" href="/" style={{ marginTop: '2rem' }}>
          Return home
        </Link>
      </div>
    </main>
  )
}
