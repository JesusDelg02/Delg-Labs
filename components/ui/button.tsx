'use client'

import { forwardRef, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'default' | 'lg'
  magnetic?: boolean
}

export const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent text-white hover:bg-accent-secondary',
  outline: 'border border-border text-foreground hover:border-accent/50',
  ghost: 'text-foreground hover:bg-card',
}

export const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', magnetic = false, children, ...props }, ref) => {
    const reducedMotion = useReducedMotion()
    const innerRef = useRef<HTMLButtonElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 200, damping: 20 })
    const springY = useSpring(y, { stiffness: 200, damping: 20 })

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || reducedMotion || !innerRef.current) return
      const rect = innerRef.current.getBoundingClientRect()
      x.set((e.clientX - rect.left - rect.width / 2) * 0.25)
      y.set((e.clientY - rect.top - rect.height / 2) * 0.25)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    return (
      <motion.button
        ref={(node) => {
          innerRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        style={magnetic && !reducedMotion ? { x: springX, y: springY } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium transition-colors',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'
