'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import BorderBeam from '@/components/magicui/border-beam'
import { cn } from '@/lib/utils'

export default function ServiceCard({ service, index }) {
  const isLive = !!service.url
  const isSuggestion = service.status === 'suggestion'

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={isLive ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        'group relative flex flex-col gap-3 rounded-[18px] border border-border bg-card p-7',
        'shadow-card transition-shadow duration-200',
        isLive && 'hover:shadow-card-hover cursor-pointer',
        isSuggestion && 'opacity-60',
      )}
    >
      {isLive && <BorderBeam />}

      <div className="text-3xl leading-none">{service.icon}</div>

      <div className="flex-1 space-y-1.5">
        <h2 className="text-base font-[650] text-tx tracking-tight leading-snug">
          {service.name}
        </h2>
        <p className="text-sm leading-relaxed text-tx-muted">
          {service.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <Badge variant={isSuggestion ? 'suggestion' : 'default'}>
          {service.category}
        </Badge>
        {isLive && (
          <span className="text-xs font-semibold text-accent opacity-70 group-hover:opacity-100 transition-opacity">
            Open →
          </span>
        )}
        {isSuggestion && (
          <span className="text-xs text-tx-muted/60 italic">Coming soon</span>
        )}
      </div>
    </motion.div>
  )

  if (isLive) {
    return (
      <Link href={service.url} target="_blank" rel="noopener" className="block">
        {card}
      </Link>
    )
  }

  return card
}
