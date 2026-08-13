import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug } from '@/lib/projects'
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
import { CaseStudySection } from '@/components/case-study/CaseStudySection'
import { CaseStudyCTA } from '@/components/case-study/CaseStudyCTA'
import { AIAutomationMockup } from '@/components/case-study/AIAutomationMockup'

export const metadata: Metadata = {
  title: 'AI Business Automation — Delg Labs',
  description:
    'A concept for an AI-powered automation layer that qualifies leads, drafts replies, and books appointments automatically.',
}

export default function AIAutomationPage() {
  const project = getProjectBySlug('ai-automation')
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
      <CaseStudySection title="The problem">
        <p>{project.challenge}</p>
      </CaseStudySection>
      <CaseStudySection title="The solution">
        <p>{project.solution}</p>
      </CaseStudySection>
      <CaseStudySection title="Key features">
        <ul className="list-disc space-y-2 pl-5">
          <li>Trigger on a new lead, missed call, or unanswered email</li>
          <li>AI qualification step that reads the incoming message and scores it</li>
          <li>Branching actions: book a call on the calendar, or send a personalized reply</li>
          <li>Owner notification log so nothing happens silently</li>
        </ul>
      </CaseStudySection>
      <AIAutomationMockup />
      <CaseStudySection title="Results / intended impact">
        <p>{project.results}</p>
      </CaseStudySection>
      <CaseStudySection title="Technology">
        <p>{project.technologies.join(', ')}</p>
      </CaseStudySection>
      <CaseStudyCTA project={project} />
    </>
  )
}
