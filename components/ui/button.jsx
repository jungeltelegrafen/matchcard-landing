import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-default',
  {
    variants: {
      variant: {
        default:  'bg-primary text-white hover:opacity-90 active:scale-[0.98]',
        accent:   'bg-accent text-white hover:opacity-90 active:scale-[0.98]',
        outline:  'border border-border bg-transparent hover:bg-accent-light text-tx',
        ghost:    'bg-transparent text-tx-muted hover:text-tx hover:bg-accent-light',
      },
      size: {
        sm:  'px-3 py-1.5 text-sm',
        md:  'px-5 py-2.5 text-sm',
        lg:  'px-7 py-3 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

export function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
