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
    slug: 'jszuss',
    title: 'Jszuss',
    subtitle: 'Immersive Business Website',
    description:
      'A highly interactive 3D web experience for a web-design and AI-receptionist studio — scroll-driven 3D hero, GSAP-choreographed parallax and tilt, built to make a business stand out from a template site.',
    category: ['Web Design', '3D', 'Frontend', 'Interactive Experience'],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Three.js', 'React Three Fiber', 'GSAP'],
    featured: false,
    status: 'live',
    hasCaseStudy: true,
    image: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fjszuss.netlify.app%2F?w=800',
    gallery: [],
    challenge:
      'A web-design studio\'s own website is a credibility test — it has to prove the studio can build the exact kind of high-end, technically ambitious site it sells to clients.',
    solution:
      'Built a single-page site with a scroll- and pointer-driven Three.js hero (a wireframe icosahedron reacting to both), GSAP ScrollTrigger parallax between the 3D layer and the foreground copy, and tilt-on-hover service cards — all gated behind a `prefers-reduced-motion` check and a static fallback on mobile so the effects never cost a real visitor a usable page.',
    results:
      'Live production site with a real client case study built in (a bilingual tire-shop redesign), running on Netlify.',
    url: 'https://jszuss.netlify.app',
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
