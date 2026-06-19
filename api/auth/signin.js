export const config = { runtime: 'edge' }

export default function handler(request) {
  const url = new URL(request.url)
  const next = url.searchParams.get('next') || '/'

  if (!process.env.AZURE_CLIENT_ID) {
    return Response.redirect(new URL('/', url.origin))
  }

  const params = new URLSearchParams({
    client_id:     process.env.AZURE_CLIENT_ID,
    response_type: 'code',
    redirect_uri:  `${url.origin}/api/auth/callback`,
    scope:         'openid email profile',
    state:         next,
  })

  return Response.redirect(
    `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize?${params}`
  )
}
