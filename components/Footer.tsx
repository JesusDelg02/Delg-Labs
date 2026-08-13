import type { LucideIcon } from 'lucide-react'

interface SocialLink {
  label: string
  href: string
  icon: LucideIcon
}

// Populate with real URLs when available — e.g. { label: 'GitHub', href: 'https://github.com/...', icon: Github }
const socialLinks: SocialLink[] = []

const navLinks = [
  { href: '/#work', label: 'Work' },
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-lg font-semibold">Delg Labs</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Building digital products for ambitious businesses.
          </p>
        </div>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
        {socialLinks.length > 0 && (
          <div className="flex gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        )}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} Delg Labs. All rights reserved.
      </p>
    </footer>
  )
}
