import { validateContact } from '@/lib/contact'

export const runtime = 'nodejs'

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get('origin')
  const allowedOrigins = new Set([new URL(request.url).origin])
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    allowedOrigins.add(new URL(process.env.NEXT_PUBLIC_SERVER_URL).origin)
  }
  if (origin && !allowedOrigins.has(origin)) {
    return Response.json({ error: 'Please submit the form from our website.' }, { status: 403 })
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Please submit a valid contact form.' }, { status: 415 })
  }
  if (Number(request.headers.get('content-length') || 0) > 16000) {
    return Response.json({ error: 'Your message is too long.' }, { status: 413 })
  }

  let body: unknown
  try {
    const text = await request.text()
    if (text.length > 16000) {
      return Response.json({ error: 'Your message is too long.' }, { status: 413 })
    }
    body = JSON.parse(text)
  } catch {
    return Response.json({ error: 'Please submit a valid contact form.' }, { status: 400 })
  }

  const result = validateContact(body)
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 })
  if (result.spam) return Response.json({ success: true })

  try {
    const [{ getPayload }, { default: config }] = await Promise.all([
      import('payload'),
      import('@payload-config'),
    ])
    const payload = await getPayload({ config })
    // Public REST creation is disabled. Only validated fields enter this trusted server write.
    await payload.create({
      collection: 'contact-submissions',
      data: result.data,
      overrideAccess: true,
    })
    return Response.json({ success: true }, { status: 201 })
  } catch {
    return Response.json(
      {
        error: 'We could not save your enquiry. Please try again, or contact us by email or phone.',
      },
      { status: 503 },
    )
  }
}
