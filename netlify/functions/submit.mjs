const verifyURL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export const handler = async (event) => {
  const params = new URLSearchParams(event.body || '')
  const token = params.get('cf-turnstile-response')

  if (!token) {
    return { statusCode: 400, body: 'Missing Turnstile token' }
  }

  const body = new URLSearchParams({
    secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
    response: token
  })

  const result = await fetch(verifyURL, {
    method: 'POST',
    body
  }).then(r => r.json())

  if (!result.success) {
    return { statusCode: 403, body: 'Verification failed' }
  }

  return {
    statusCode: 303,
    headers: { Location: '/dashboard/', 'Cache-Control': 'no-store' },
    body: ''
  }
}
