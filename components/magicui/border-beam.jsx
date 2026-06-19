'use client'
import { cn } from '@/lib/utils'

export default function BorderBeam({ className }) {
  return (
    <span
      className={cn(
        'absolute inset-0 rounded-[inherit] pointer-events-none',
        'overflow-hidden',
        className
      )}
    >
      <span
        className="absolute inset-[-2px] rounded-[inherit] animate-[spin_4s_linear_infinite]"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, #C97B4B 10%, transparent 20%)',
        }}
      />
      <span className="absolute inset-[1px] rounded-[inherit] bg-card" />
    </span>
  )
}
