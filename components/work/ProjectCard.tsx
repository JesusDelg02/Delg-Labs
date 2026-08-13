'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { Project } from '@/lib/projects'

export function ProjectCard({ project }: { project: Project }) {
  const reducedMotion = useReducedMotion()
  const isComingSoon = project.status === 'coming-soon' && !project.url && project.gallery.length === 0

  const content = (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card">
      {project.featured && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
          Featured Project
        </span>
      )}
      {isComingSoon && (
        <span className="absolute right-4 top-4 z-10 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          Coming Soon
        </span>
      )}
      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        <motion.div
          whileHover={reducedMotion ? undefined : { scale: 1.04 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative h-full w-full"
        >
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={project.image.startsWith('http')}
          />
        </motion.div>
      </div>
      <div className="p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          {project.category.join(' · ')}
        </p>
        <h3 className="mt-2 text-2xl font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{project.subtitle}</p>
        {!isComingSoon && (
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
            View project <ArrowUpRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  )

  if (isComingSoon) {
    return <div className="opacity-60">{content}</div>
  }

  return (
    <Link href={`/work/${project.slug}`} className="block">
      {content}
    </Link>
  )
}
