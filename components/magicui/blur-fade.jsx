'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function BlurFade({ children, delay = 0, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: 'blur(8px)', y: 16 }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
