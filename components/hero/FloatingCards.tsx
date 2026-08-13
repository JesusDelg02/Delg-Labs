'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const cards = [
  { label: 'AI', top: '8%', left: '10%', depth: 1 },
  { label: 'WEBSITE', top: '20%', left: '68%', depth: 1.6 },
  { label: 'SAAS', top: '55%', left: '4%', depth: 1.2 },
  { label: 'AUTOMATION', top: '68%', left: '62%', depth: 0.8 },
  { label: 'ANALYTICS', top: '40%', left: '40%', depth: 1.4 },
]

function Card({ label, top, left, depth, mx, my }: (typeof cards)[number] & {
  mx: ReturnType<typeof useMotionValue<number>>
  my: ReturnType<typeof useMotionValue<number>>
}) {
  const x = useTransform(mx, (v) => v * depth * 0.02)
  const y = useTransform(my, (v) => v * depth * 0.02)
  const springX = useSpring(x, { stiffness: 120, damping: 20 })
  const springY = useSpring(y, { stiffness: 120, damping: 20 })

  return (
    <motion.div
      style={{ top, left, x: springX, y: springY }}
      className="absolute rounded-xl border border-border bg-card/80 px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur"
    >
      {label}
    </motion.div>
  )
}

export function FloatingCards() {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mx.set(e.clientX - rect.left - rect.width / 2)
    my.set(e.clientY - rect.top - rect.height / 2)
  }

  if (reducedMotion) {
    return (
      <div className="relative mx-auto mt-16 grid max-w-md grid-cols-3 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-border bg-card/80 px-3 py-2 text-center text-xs font-medium tracking-wide text-muted-foreground"
          >
            {c.label}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="relative mx-auto mt-16 grid max-w-md grid-cols-3 gap-3 md:hidden">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-border bg-card/80 px-3 py-2 text-center text-xs font-medium tracking-wide text-muted-foreground"
          >
            {c.label}
          </div>
        ))}
      </div>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative mx-auto mt-16 hidden h-72 max-w-2xl md:block"
      >
        {cards.map((c) => (
          <Card key={c.label} {...c} mx={mx} my={my} />
        ))}
      </div>
    </>
  )
}
