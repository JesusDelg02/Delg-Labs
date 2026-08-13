'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function Positioning() {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center" ref={ref}>
      <p className="text-3xl font-semibold text-muted-foreground sm:text-4xl">
        I don&apos;t just build websites.
      </p>
      <motion.p
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl"
      >
        I build systems.
      </motion.p>
      <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
        A website can attract customers. A well-designed digital product can help run the business
        behind it. I combine design, development, AI, automation, and business thinking to create
        complete digital products.
      </p>
    </section>
  )
}
