// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'

import { validateContact } from '@/lib/contact'

const create = vi.fn().mockResolvedValue({ id: 1 })
vi.mock('payload', () => ({ getPayload: vi.fn(async () => ({ create })) }))
vi.mock('@payload-config', () => ({ default: {} }))

const valid = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  subject: 'Power Apps project',
  message: 'We would like to discuss automating our business processes.',
}

describe('Contact validation', () => {
  it('trims the four allowed fields and excludes unexpected input', () => {
    expect(validateContact({ ...valid, name: ' Alex Morgan ', admin: true })).toEqual({
      ok: true,
      data: valid,
      spam: false,
    })
  })

  it.each([
    null,
    [],
    { ...valid, email: 'invalid' },
    { ...valid, message: ' ' },
    { ...valid, subject: 'x'.repeat(201) },
    { ...valid, email: 'a@example.com\r\nBcc:other@example.com' },
  ])('rejects invalid or oversized input', (input) => {
    expect(validateContact(input).ok).toBe(false)
  })
})

describe('Contact endpoint', () => {
  const send = async (body: unknown, origin = 'http://localhost:3000') => {
    const { POST } = await import('@/app/(frontend)/api/contact/route')
    return POST(
      new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json', origin },
        body: JSON.stringify(body),
      }),
    )
  }

  it('persists a validated enquiry without exposing its contents', async () => {
    create.mockClear()
    const response = await send(valid)
    expect(response.status).toBe(201)
    expect(create).toHaveBeenCalledWith({
      collection: 'contact-submissions',
      data: valid,
      overrideAccess: true,
    })
    expect(await response.json()).toEqual({ success: true })
  })

  it('rejects cross-site submissions before writing', async () => {
    create.mockClear()
    expect((await send(valid, 'https://unrelated.example')).status).toBe(403)
    expect(create).not.toHaveBeenCalled()
  })

  it('silently discards honeypot submissions', async () => {
    create.mockClear()
    expect((await send({ ...valid, website: 'spam' })).status).toBe(200)
    expect(create).not.toHaveBeenCalled()
  })

  it('returns a recoverable error when persistence fails', async () => {
    create.mockRejectedValueOnce(new Error('database unavailable'))
    expect((await send(valid)).status).toBe(503)
  })
})
