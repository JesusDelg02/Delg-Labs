export interface Testimonial {
  quote: string
  author: string
  role: string
}

export function Testimonials({ testimonials = [] }: { testimonials?: Testimonial[] }) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <h2 className="text-3xl font-semibold sm:text-4xl">What clients say</h2>
      {testimonials.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-10 text-muted-foreground">
          Client testimonial coming soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote key={t.author} className="rounded-2xl border border-border bg-card p-6 text-left">
              <p className="text-sm text-foreground">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-xs text-muted-foreground">
                {t.author} — {t.role}
              </footer>
            </blockquote>
          ))}
        </div>
      )}
    </section>
  )
}
