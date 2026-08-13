const areas = ['Web development', 'Product design', 'AI', 'Automation', 'SaaS', 'Business software']

export function About() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h2 className="text-3xl font-semibold sm:text-4xl">A developer who thinks beyond the interface.</h2>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        I enjoy building things that solve real problems. My work sits at the intersection of
        design, technology, AI, and business.
      </p>
      <ul className="mt-6 flex flex-wrap justify-center gap-2">
        {areas.map((area) => (
          <li
            key={area}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
          >
            {area}
          </li>
        ))}
      </ul>
    </section>
  )
}
