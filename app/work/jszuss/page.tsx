import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getProjectBySlug } from '@/lib/projects'
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
import { CaseStudySection } from '@/components/case-study/CaseStudySection'
import { CaseStudyCTA } from '@/components/case-study/CaseStudyCTA'

export const metadata: Metadata = {
  title: 'Jszuss — Delg Labs',
  description:
    'A scroll- and pointer-driven 3D web experience built for a web-design and AI-receptionist studio.',
}

function sitePreviewUrl(url: string, width = 800) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${width}`
}

export default function JszussPage() {
  const project = getProjectBySlug('jszuss')
  if (!project) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    creator: { '@type': 'Person', name: 'Delg Labs' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CaseStudyHero project={project} />
      <CaseStudySection title="Project overview">
        <p>{project.description}</p>
      </CaseStudySection>
      <CaseStudySection title="The challenge">
        <p>{project.challenge}</p>
      </CaseStudySection>
      <CaseStudySection title="The approach">
        <p>{project.solution}</p>
      </CaseStudySection>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
            {project.url && (
              <Image
                src={sitePreviewUrl(project.url)}
                alt="Jszuss desktop screenshot"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            )}
          </div>
          <div className="relative mx-auto aspect-[9/16] w-56 overflow-hidden rounded-2xl border border-border sm:mx-0">
            {project.url && (
              <Image
                src={sitePreviewUrl(project.url, 400)}
                alt="Jszuss mobile screenshot"
                fill
                className="object-cover object-top"
                sizes="224px"
                unoptimized
              />
            )}
          </div>
        </div>
      </section>
      <CaseStudySection title="Results">
        <p>{project.results}</p>
      </CaseStudySection>
      <CaseStudySection title="Technology">
        <p>{project.technologies.join(', ')}</p>
      </CaseStudySection>
      <CaseStudyCTA project={project} />
    </>
  )
}
