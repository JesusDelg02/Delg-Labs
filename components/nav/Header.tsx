import Link from 'next/link'
import { cn } from '@/lib/utils'
import { variantClasses, sizeClasses } from '@/components/ui/button'
import { MobileMenu } from './MobileMenu'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Delg Labs
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground sm:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className={cn(
            'hidden rounded-full font-medium transition-colors sm:inline-flex sm:items-center sm:justify-center',
            variantClasses.outline,
            sizeClasses.default
          )}
        >
          Let&apos;s Work Together
        </a>
        <MobileMenu />
      </div>
    </header>
  )
}
