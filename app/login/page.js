'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { signIn } from '@/lib/auth-client'

function LoginCard() {
  const params = useSearchParams()
  const callbackURL = params.get('next') || '/'

  async function handleMicrosoftSignIn() {
    await signIn.social({ provider: 'microsoft', callbackURL })
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-5">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-card p-10 flex flex-col items-center gap-7">

        <div className="text-center">
          <div className="text-2xl font-bold text-accent tracking-tight">matchcard</div>
          <div className="mt-1.5 text-sm text-tx-muted">Marketplace Automation &amp; AI Tools for NC</div>
        </div>

        <div className="w-full h-px bg-border" />

        <p className="text-sm text-tx-muted text-center">Sign in to access the marketplace</p>

        <button
          onClick={handleMicrosoftSignIn}
          className="flex w-full items-center gap-3 rounded-md bg-[#2F2F2F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1a1a1a] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23">
            <rect x="1"  y="1"  width="10" height="10" fill="#F25022"/>
            <rect x="12" y="1"  width="10" height="10" fill="#7FBA00"/>
            <rect x="1"  y="12" width="10" height="10" fill="#00A4EF"/>
            <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
          </svg>
          Sign in with Microsoft
        </button>

        <p className="text-xs text-tx-muted/70 text-center leading-relaxed">
          Access is restricted to authorised accounts.<br />
          Contact your administrator if you need access.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginCard />
    </Suspense>
  )
}
