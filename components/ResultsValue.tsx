import { Sparkles, Clock, LineChart } from 'lucide-react'

const items = [
  {
    icon: Sparkles,
    title: 'Better Experience',
    description: 'Make businesses look professional and trustworthy.',
  },
  {
    icon: Clock,
    title: 'Less Manual Work',
    description: 'Automate repetitive processes.',
  },
  {
    icon: LineChart,
    title: 'Better Decisions',
    description: 'Turn business data into useful insights.',
  },
]

export function ResultsValue() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-3xl font-semibold sm:text-4xl">
        Technology is only useful when it creates value.
      </h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-card p-8">
            <item.icon className="h-6 w-6 text-accent" />
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
