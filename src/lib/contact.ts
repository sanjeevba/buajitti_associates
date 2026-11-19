export type ContactInput = {
  name: string
  email: string
  subject: string
  message: string
}

export function validateContact(
  value: unknown,
): { ok: true; data: ContactInput; spam: boolean } | { ok: false; error: string } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: 'Please complete the contact form.' }
  }

  const input = value as Record<string, unknown>
  const limits = { name: 120, email: 254, subject: 200, message: 5000 } as const
  const data: ContactInput = { name: '', email: '', subject: '', message: '' }
  for (const field of Object.keys(limits) as (keyof ContactInput)[]) {
    if (typeof input[field] !== 'string') {
      return { ok: false, error: `Please enter your ${field}.` }
    }
    const text = input[field].trim()
    if (!text || text.length > limits[field]) {
      return {
        ok: false,
        error: `Please enter a ${field} of no more than ${limits[field]} characters.`,
      }
    }
    data[field] = text
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }
  if (/[\r\n]/.test(data.name + data.email + data.subject)) {
    return { ok: false, error: 'Please use a single line for your name, email and subject.' }
  }

  return { ok: true, data, spam: typeof input.website === 'string' && !!input.website.trim() }
}
