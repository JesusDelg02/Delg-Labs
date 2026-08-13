'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const items = [
  'WEB DESIGN',
  'WEB DEVELOPMENT',
  'AI',
  'AUTOMATION',
  'SAAS',
  'UI/UX',
  'PRODUCT DEVELOPMENT',
]

export function CapabilityStrip() {
  const reducedMotion = useReducedMotion()
  const loop = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-border bg-card/40 py-4">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap text-sm font-medium tracking-widest text-muted-foreground"
        animate={reducedMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={reducedMotion ? undefined : { duration: 24, ease: 'linear', repeat: Infinity }}
      >
        {loop.map((item, i) => (
          <span key={`${item}-${i}`}>{item}</span>
        ))}
      </motion.div>
    </div>
  )
}
