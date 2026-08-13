export interface Project {
  slug: string
  title: string
  subtitle: string
  description: string
  category: string[]
  technologies: string[]
  featured: boolean
  status: 'live' | 'coming-soon'
  hasCaseStudy: boolean
  image: string
  gallery: string[]
  challenge: string
  solution: string
  results: string
  url?: string
}

export const projects: Project[] = [
  {
    slug: 'tireos',
    title: 'TireOS',
    subtitle: 'AI-powered operating system for tire businesses',
    description:
      'A concept for an all-in-one business platform combining inventory, customers, sales, appointments, suppliers, analytics, automation, and AI-powered business intelligence — designed and prototyped as a flagship interface project.',
    category: ['SaaS', 'AI', 'Business Software', 'Full-Stack'],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'OpenAI API'],
    featured: true,
    status: 'coming-soon',
    hasCaseStudy: true,
    image: '/projects/tireos-dashboard.svg',
    gallery: [
      '/projects/tireos-inventory.svg',
      '/projects/tireos-customers.svg',
      '/projects/tireos-appointments.svg',
    ],
    challenge:
      'Tire shops run their business across disconnected tools — a paper ticket system for appointments, a separate point of sale, a spreadsheet for inventory, and a phone that rings constantly for things the business itself already knows the answer to.',
    solution:
      'Instead of forcing business owners to manage inventory, customers, appointments, sales, and communication across disconnected tools, TireOS brings the entire operation into one intelligent platform — with an AI layer that surfaces what needs attention instead of making the owner go looking for it.',
    results:
      'Designed and prototyped as a concept: a working interface and component system demonstrating how a full business-management SaaS product would look and behave, not a shipped product with live customers.',
    url: undefined,
  },
  {
    slug: 'miller-multi-service',
    title: 'Miller Multi Service',
    subtitle: 'Bilingual redesign for a Miami tire shop',
    description:
      'A bilingual redesign for a Miami tire, battery, and alignment shop — replacing a dated, English-only template site with a fast, modern one-page site that leads with clear services, hours, and walk-in/same-day messaging.',
    category: ['Web Design', 'Local Business', 'Bilingual', 'Frontend'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    featured: false,
    status: 'live',
    hasCaseStudy: true,
    image: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fstately-lokum-37512b.netlify.app%2F?w=800',
    gallery: [],
    challenge:
      'Miller Multi Service was running on a dated, English-only template site — cluttered layout, no clear service pricing, and no way to reach Spanish-speaking customers.',
    solution:
      'Rebuilt as a fast, bilingual (English/Spanish) one-page site that leads with clear services, walk-in hours, and same-day service — the things customers actually decide on.',
    results: 'Real client project, live in production.',
    url: 'https://stately-lokum-37512b.netlify.app/',
  },
  {
    slug: 'ai-automation',
    title: 'AI Business Automation',
    subtitle: 'Reducing repetitive work, one workflow at a time',
    description:
      'A concept for an AI-powered automation layer that watches for repetitive business tasks — new leads, missed calls, follow-up emails — and handles them automatically, so nothing falls through the cracks.',
    category: ['AI', 'Automation'],
    technologies: ['Next.js', 'TypeScript', 'OpenAI API', 'Webhooks', 'Workflow engine'],
    featured: false,
    status: 'coming-soon',
    hasCaseStudy: true,
    image: '/projects/ai-automation-workflow.svg',
    gallery: [],
    challenge:
      'Small businesses lose leads and slow down responses because follow-ups, qualification, and scheduling all depend on someone remembering to do them by hand.',
    solution:
      'An automation system that listens for triggers — a new form submission, a missed call, an unanswered email — and runs a defined workflow: qualify the lead, draft a reply, book a slot on the calendar. Response time stops depending on who happens to be free.',
    results:
      'Designed and prototyped as a concept: a workflow-builder interface and a sample automation run, not a shipped product with live customers.',
    url: undefined,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
