import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug } from '@/lib/projects'
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
import { CaseStudySection } from '@/components/case-study/CaseStudySection'
import { CaseStudyGallery } from '@/components/case-study/CaseStudyGallery'
import { CaseStudyCTA } from '@/components/case-study/CaseStudyCTA'
import { TireOSDashboardMockup } from '@/components/case-study/TireOSDashboardMockup'

export const metadata: Metadata = {
  title: 'TireOS — Delg Labs',
  description:
    'A concept for an AI-powered operating system for tire businesses — inventory, customers, sales, appointments, and AI insights in one platform.',
}

export default function TireOSPage() {
  const project = getProjectBySlug('tireos')
  if (!project) notFound()

  return (
    <>
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
          <li>AI assistant surfacing what needs attention across the business</li>
          <li>Unified dashboard: revenue, inventory, appointments, customers, profit</li>
          <li>Inventory tracking with reorder suggestions</li>
          <li>Customer management with service history</li>
          <li>Automation for repetitive scheduling and follow-up work</li>
        </ul>
      </CaseStudySection>
      <TireOSDashboardMockup />
      <CaseStudySection title="Results / intended impact">
        <p>{project.results}</p>
      </CaseStudySection>
      <CaseStudySection title="Technology">
        <p>{project.technologies.join(', ')}</p>
      </CaseStudySection>
      <CaseStudyGallery images={project.gallery} />
      <CaseStudyCTA project={project} />
    </>
  )
}
