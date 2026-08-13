import { projects } from '@/lib/projects'
import { ProjectCard } from './ProjectCard'

export function SelectedWork() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-3xl font-semibold sm:text-4xl">Selected Work</h2>
      <p className="mt-3 text-muted-foreground">A few things I&apos;ve designed and built.</p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}
