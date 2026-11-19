import type { TextFieldSingleValidation } from 'payload'

export const validateHTTPURL: TextFieldSingleValidation = (value) => {
  if (!value) return true
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) || 'Enter an http:// or https:// URL.'
  } catch {
    return 'Enter a complete URL, including https://.'
  }
}
