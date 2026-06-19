import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-600 transition-colors',
  {
    variants: {
      variant: {
        default:    'bg-accent-soft text-accent border border-accent/20',
        suggestion: 'bg-gray-100 text-gray-400 border border-gray-200',
        live:       'bg-emerald-50 text-emerald-600 border border-emerald-200',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
