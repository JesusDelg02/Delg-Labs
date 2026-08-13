import Image from 'next/image'

const areas = ['Web development', 'Product design', 'AI', 'Automation', 'SaaS', 'Business software']

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 sm:grid-cols-2 sm:items-center">
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-border">
          <Image src="/portrait-placeholder.svg" alt="Portrait placeholder" fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl">A developer who thinks beyond the interface.</h2>
          <p className="mt-4 text-muted-foreground">
            I enjoy building things that solve real problems. My work sits at the intersection of
            design, technology, AI, and business.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {areas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
