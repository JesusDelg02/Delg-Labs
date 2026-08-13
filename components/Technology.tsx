const groups = [
  { label: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { label: 'Backend', items: ['Node.js', 'PostgreSQL', 'Prisma'] },
  { label: 'AI', items: ['OpenAI APIs', 'AI agents', 'Automation'] },
  { label: 'Infrastructure', items: ['Vercel', 'Stripe', 'GitHub'] },
]

export function Technology() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-3xl font-semibold sm:text-4xl">Technology</h2>
      <div className="mt-10 flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border sm:flex-row sm:divide-x sm:divide-y-0">
        {groups.map((group) => (
          <div key={group.label} className="flex-1 p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-accent">{group.label}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
