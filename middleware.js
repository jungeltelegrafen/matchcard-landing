export const config = {
  matcher: ['/((?!api/auth|login).*)'],
}

export default async function middleware(request) {
  // Auth is disabled until Azure env vars are configured
  if (!process.env.AZURE_CLIENT_ID) {
    return new Response(null, { status: 200 })
  }

  const url = new URL(request.url)

  const session = getCookie(request, '__session')
  if (session && await verifySession(session)) {
    return new Response(null, { status: 200 })
  }

  const next = encodeURIComponent(url.pathname + url.search)
  return Response.redirect(new URL(`/login.html?next=${next}`, url.origin))
}

function getCookie(request, name) {
  const header = request.headers.get('cookie') || ''
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

async function verifySession(token) {
  try {
    const [data, sig] = token.split('|')
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(process.env.SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    )
    const valid = await crypto.subtle.verify(
      'HMAC', key,
      hexToBuffer(sig),
      new TextEncoder().encode(data)
    )
    if (!valid) return false
    const { exp } = JSON.parse(atob(data))
    return Date.now() < exp
  } catch {
    return false
  }
}

function hexToBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2)
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  return bytes
}
