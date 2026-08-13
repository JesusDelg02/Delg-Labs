import Link from 'next/link'
import type { Project } from '@/lib/projects'

export function CaseStudyCTA({ project }: { project: Project }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h2 className="text-2xl font-semibold">Have a similar project in mind?</h2>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/#contact"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-secondary"
        >
          Start a Project
        </Link>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/50"
          >
            Visit live site
          </a>
        )}
      </div>
    </section>
  )
}
