'use client'
import { cn } from '@/lib/utils'

export default function ShimmerButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3',
        'bg-primary text-white font-semibold text-sm',
        'transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:animate-shimmer before:bg-gradient-to-r',
        'before:from-transparent before:via-white/10 before:to-transparent',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
