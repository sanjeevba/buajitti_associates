'use client'

import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, LoaderCircle } from 'lucide-react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'pending') return
    const form = new FormData(event.currentTarget)
    setStatus('pending')
    setMessage('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(form)),
      })
      const result = (await response.json()) as { error?: string; message?: string }
      if (!response.ok)
        throw new Error(
          result.error ||
            result.message ||
            'We couldn’t save your message. Please try again or contact us directly.',
        )
      setStatus('success')
      setMessage('Thank you. Your enquiry has been received by our team.')
      formRef.current?.reset()
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again or contact us directly.',
      )
    }
  }
  return (
    <form ref={formRef} className="contact-form" onSubmit={submit} aria-busy={status === 'pending'}>
      <h2>Tell us what you have in mind.</h2>
      <p>Share a little about your project or the challenge you’re working through.</p>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="contact-name">
            Your name <span>(required)</span>
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            placeholder="Full name"
          />
        </div>
        <div className="form-field">
          <label htmlFor="contact-email">
            Email address <span>(required)</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@company.com"
          />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="contact-subject">
          Subject <span>(required)</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          required
          maxLength={200}
          placeholder="How can we help?"
        />
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">
          Your message <span>(required)</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={5000}
          placeholder="Tell us about your goals, current systems, or project requirements."
        />
      </div>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="form-note">We’ll use your details to respond to your enquiry.</p>
      <button type="submit" className="button" disabled={status === 'pending'}>
        {status === 'pending' && (
          <LoaderCircle className="loading-icon" size={18} aria-hidden="true" />
        )}
        {status === 'pending' ? 'Sending your message…' : 'Send message'}
      </button>
      <div
        aria-live="polite"
        aria-atomic="true"
        className={`form-status ${status === 'error' ? 'form-error' : ''}`}
      >
        {message && (
          <p>
            {status === 'success' && <CheckCircle2 size={20} aria-hidden="true" />}
            {message}
          </p>
        )}
      </div>
    </form>
  )
}
