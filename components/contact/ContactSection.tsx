import { ContactForm } from './ContactForm'

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-24">
      <h2 className="text-center text-3xl font-semibold sm:text-4xl">Have an idea worth building?</h2>
      <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
        Tell me what you&apos;re trying to build, what problem you&apos;re solving, or what you&apos;d
        like to improve.
      </p>
      <div className="mt-10">
        <ContactForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Prefer email?{' '}
        <a href="mailto:hello@delglabs.com" className="text-accent transition-colors hover:text-accent-secondary">
          Contact me directly.
        </a>
      </p>
    </section>
  )
}
