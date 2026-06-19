import { betterFetch } from '@better-fetch/fetch'
import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!api/auth|login|_next|favicon).*)'],
}

export default async function middleware(request) {
  // Auth disabled until Azure env vars are configured
  if (!process.env.AZURE_CLIENT_ID) return NextResponse.next()

  const { data: session } = await betterFetch('/api/auth/get-session', {
    baseURL: request.nextUrl.origin,
    headers: { cookie: request.headers.get('cookie') || '' },
  })

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
