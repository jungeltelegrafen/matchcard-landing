import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
        <Link href="/" className="text-[15px] font-bold text-accent tracking-tight select-none">
          matchcard
        </Link>
      </div>
    </header>
  )
}
