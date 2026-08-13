'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function Positioning() {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative overflow-hidden px-6 py-24" ref={ref}>
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[420px] w-[420px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[radial-gradient(circle,_var(--color-accent-secondary)_0%,_transparent_70%)] opacity-[0.1] blur-[90px]"
      />
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 sm:items-center sm:gap-16">
        <div>
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
        </div>
        <p className="text-muted-foreground sm:text-lg">
          A website can attract customers. A well-designed digital product can help run the
          business behind it. I combine design, development, AI, automation, and business
          thinking to create complete digital products.
        </p>
      </div>
    </section>
  )
}
