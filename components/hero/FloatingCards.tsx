'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Bot, Globe, Boxes, Workflow, LineChart } from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const cards = [
  { label: 'AI', icon: Bot, top: '8%', left: '10%', depth: 1 },
  { label: 'WEBSITE', icon: Globe, top: '20%', left: '68%', depth: 1.6 },
  { label: 'SAAS', icon: Boxes, top: '55%', left: '4%', depth: 1.2 },
  { label: 'AUTOMATION', icon: Workflow, top: '68%', left: '62%', depth: 0.8 },
  { label: 'ANALYTICS', icon: LineChart, top: '40%', left: '40%', depth: 1.4 },
]

function Card({ label, icon: Icon, top, left, depth, mx, my }: (typeof cards)[number] & {
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
      className="absolute flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground shadow-lg shadow-black/20 backdrop-blur"
    >
      <Icon className="h-3.5 w-3.5 text-accent" />
      {label}
    </motion.div>
  )
}

function StaticCards({ className }: { className?: string }) {
  return (
    <div className={`relative mx-auto mt-16 grid max-w-md grid-cols-3 gap-3 ${className ?? ''}`}>
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/80 px-3 py-3 text-center text-xs font-medium tracking-wide text-muted-foreground"
        >
          <c.icon className="h-4 w-4 text-accent" />
          {c.label}
        </div>
      ))}
    </div>
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
    return <StaticCards />
  }

  return (
    <>
      <StaticCards className="md:hidden" />
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
