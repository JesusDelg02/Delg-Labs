import { Globe, LayoutDashboard, Bot, Boxes } from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Websites',
    description: 'High-performance websites designed around your brand, customers, and business goals.',
    examples: ['Business websites', 'Landing pages', 'E-commerce', 'Interactive websites'],
  },
  {
    icon: LayoutDashboard,
    title: 'Web Applications',
    description: 'Custom software designed around the way your business actually works.',
    examples: ['Dashboards', 'Customer portals', 'Internal tools', 'Management systems'],
  },
  {
    icon: Bot,
    title: 'AI & Automation',
    description: 'AI-powered systems that automate repetitive work and help businesses operate more efficiently.',
    examples: ['AI assistants', 'Customer follow-ups', 'Lead qualification', 'Workflow automation'],
  },
  {
    icon: Boxes,
    title: 'SaaS Products',
    description: 'From idea to production-ready software.',
    examples: ['Subscription platforms', 'Multi-tenant applications', 'AI SaaS', 'Business management platforms'],
  },
]

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-3xl font-semibold sm:text-4xl">What I Build</h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {services.map((service) => (
          <div key={service.title} className="rounded-2xl border border-border bg-card p-8">
            <service.icon className="h-6 w-6 text-accent" />
            <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
            <ul className="mt-4 space-y-1.5">
              {service.examples.map((ex) => (
                <li key={ex} className="text-sm text-muted-foreground/80">
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
