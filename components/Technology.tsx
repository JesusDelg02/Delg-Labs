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
      <div className="mt-10 grid gap-8 sm:grid-cols-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-medium uppercase tracking-widest text-accent">{group.label}</p>
            <ul className="mt-3 space-y-1.5">
              {group.items.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
