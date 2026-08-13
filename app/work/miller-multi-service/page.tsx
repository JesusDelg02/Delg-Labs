import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getProjectBySlug } from '@/lib/projects'
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
import { CaseStudySection } from '@/components/case-study/CaseStudySection'
import { CaseStudyCTA } from '@/components/case-study/CaseStudyCTA'

export const metadata: Metadata = {
  title: 'Miller Multi Service — Delg Labs',
  description:
    'A bilingual redesign for a Miami tire, battery, and alignment shop — before and after.',
}

function sitePreviewUrl(url: string, width = 800) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${width}`
}

const BEFORE_URL = 'https://millermultiservice.com/'

export default function MillerMultiServicePage() {
  const project = getProjectBySlug('miller-multi-service')
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
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Before
            </p>
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
              <Image
                src={sitePreviewUrl(BEFORE_URL)}
                alt="Miller Multi Service — old site"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-accent">After</p>
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-accent/30">
              {project.url && (
                <Image
                  src={sitePreviewUrl(project.url)}
                  alt="Miller Multi Service — new site"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              )}
            </div>
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
