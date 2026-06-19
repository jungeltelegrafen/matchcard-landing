import { cn } from '@/lib/utils'

export default function AnimatedGradientText({ children, className }) {
  return (
    <span className={cn('animated-gradient-text', className)}>
      {children}
    </span>
  )
}
