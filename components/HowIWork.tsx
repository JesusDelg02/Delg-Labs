'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const steps = [
  { n: '01', title: 'Discover', description: 'Understand the business, audience, goals, and problems.' },
  { n: '02', title: 'Design', description: 'Turn ideas into a clear user experience and visual system.' },
  { n: '03', title: 'Build', description: 'Develop the website, application, automation, or SaaS product.' },
  { n: '04', title: 'Launch & Improve', description: 'Deploy, optimize, measure, and continue improving.' },
]

export function HowIWork() {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="process" className="mx-auto max-w-6xl px-6 py-24" ref={ref}>
      <h2 className="text-3xl font-semibold sm:text-4xl">From idea to launch.</h2>
      <div className="mt-12 grid gap-8 sm:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.n}
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, ease: 'easeOut', delay: reducedMotion ? 0 : i * 0.1 }}
            className="border-t border-border pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0"
          >
            <span className="text-sm font-medium text-accent">{step.n}</span>
            <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
