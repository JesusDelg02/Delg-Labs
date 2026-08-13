import { cn } from '@/lib/utils'
import { variantClasses, sizeClasses } from '@/components/ui/button'
import { FloatingCards } from './FloatingCards'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-28 text-center sm:py-36">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Currently accepting new projects
      </div>
      <h1 className="mx-auto mt-8 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
        I build digital products that move businesses forward.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
        I design and develop websites, web applications, AI systems, and SaaS products that turn
        ideas and business problems into real digital experiences.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="#work"
          className={cn('inline-flex items-center justify-center rounded-full font-medium transition-colors', variantClasses.primary, sizeClasses.lg)}
        >
          View My Work
        </a>
        <a
          href="#contact"
          className={cn('inline-flex items-center justify-center rounded-full font-medium transition-colors', variantClasses.outline, sizeClasses.lg)}
        >
          Start a Project
        </a>
      </div>
      <FloatingCards />
    </section>
  )
}
