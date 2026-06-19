import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!api/auth|login|_next|favicon).*)'],
}

export default async function middleware(request) {
  if (!process.env.AZURE_CLIENT_ID) return NextResponse.next()

  const session = getCookie(request, '__session')
  if (session && await verifySession(session)) return NextResponse.next()

  const url  = request.nextUrl.clone()
  const next = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)
  url.pathname = '/login'
  url.search   = `?next=${next}`
  return NextResponse.redirect(url)
}

function getCookie(request, name) {
  return request.cookies.get(name)?.value ?? null
}

async function verifySession(token) {
  try {
    const [data, sig] = token.split('|')
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(process.env.SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    )
    const valid = await crypto.subtle.verify(
      'HMAC', key, hexToBuffer(sig), new TextEncoder().encode(data)
    )
    if (!valid) return false
    const { exp } = JSON.parse(atob(data))
    return Date.now() < exp
  } catch { return false }
}

function hexToBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2)
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  return bytes
}
