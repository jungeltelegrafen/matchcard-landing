// Better-auth client stub — not wired up yet.
//
// When Azure AD is configured and matchcard.no auth is live, replace this
// with the real client:
//
//   import { createAuthClient } from 'better-auth/react'
//
//   export const authClient = createAuthClient({
//     baseURL: import.meta.env.VITE_AUTH_BASE_URL, // https://matchcard.no
//   })
//
// Then in App.jsx you can guard the whole app like this:
//
//   const { data: session, isPending } = authClient.useSession()
//   if (isPending) return <Spinner />
//   if (!session)  return <button onClick={() => authClient.signIn.social({ provider: 'microsoft' })}>Sign in</button>

export const authClient = {
  useSession: () => ({ data: null, isPending: false }),
  signIn:     { social: async () => {} },
  signOut:    async () => {},
}
