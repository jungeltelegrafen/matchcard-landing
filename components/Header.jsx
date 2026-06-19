'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-base font-bold text-accent tracking-tight">
          matchcard
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/cv-generator">
            <Button variant="ghost" size="sm">CV Generator</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">Sign in</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
