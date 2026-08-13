import type { Project } from '@/lib/projects'

export function CaseStudyHero({ project }: { project: Project }) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">
        {project.category.join(' · ')}
      </p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{project.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{project.subtitle}</p>
    </section>
  )
}
