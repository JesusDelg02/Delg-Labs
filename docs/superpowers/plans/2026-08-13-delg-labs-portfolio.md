# Delg Labs Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Delg Labs premium portfolio site per `docs/superpowers/specs/2026-08-13-delg-labs-portfolio-design.md` — homepage with 13 sections, two project case study pages, a working contact form, and SEO plumbing.

**Architecture:** Next.js 15 App Router + TypeScript + Tailwind CSS v4, Server Components by default with `"use client"` only where interactivity/hooks/Framer Motion require it. One typed project data array (`lib/projects.ts`) drives both the homepage "Selected Work" cards and the two case-study routes. Contact form is a client component calling a server action that sends via Resend.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide icons, Zod, react-hook-form, Resend, `@vercel/analytics`, `clsx` + `tailwind-merge`.

## Global Constraints

- Brand name: **Delg Labs**. Positioning: "Digital Product Developer" — never "Web Developer" anywhere in copy.
- Tailwind v4: use `@import "tailwindcss";` + a native `@theme { ... }` block in `app/globals.css`. Do **not** create a `tailwind.config.js` or use `@tailwind base/components/utilities` — v4's PostCSS plugin (`@tailwindcss/postcss`, installed by `create-next-app` automatically) does not read a JS config or process those directives without an explicit `@config` bridge, and the `@theme` approach avoids that whole class of bug entirely (this exact mistake cost multiple fix rounds on the last project's Tailwind v4 setup — do not repeat it).
- Color tokens (define once in `app/globals.css`'s `@theme` block, task 2): `--color-background: #09090B`, `--color-foreground: #FAFAFA`, `--color-card: #18181B`, `--color-card-foreground: #FAFAFA`, `--color-muted: #141417`, `--color-muted-foreground: #A1A1AA`, `--color-border: rgba(255,255,255,0.08)`, `--color-accent: #3B82F6`, `--color-accent-secondary: #6366F1`, `--color-destructive: #DC2626`, `--color-ring: #3B82F6`.
- Font: Inter only (via `next/font/google`, variable weight), no second display font — headings differentiated by weight/tracking, not a separate typeface.
- CTA hover states use `transition-colors`, never bare `transition` (bare `transition` includes `transform`/`opacity` in its default property list, which can fight animation libraries writing to those same properties on the same element — carried over from a real bug on the previous project).
- Every component that animates on scroll, hover, or mount must check `prefers-reduced-motion` via the shared `useReducedMotion` hook (`hooks/use-reduced-motion.ts`, task 3) and render its final state directly (no animation) when reduced motion is preferred — no exceptions, established from the first animated component rather than retrofitted.
- Animate only `transform`/`opacity` in Framer Motion `animate`/`whileInView`/`whileHover` props — never `width`/`height`/`top`/`left`.
- No fabricated content anywhere: TireOS case study copy must describe it as a designed/prototyped concept, never as a shipped product with real customers or real metrics. Testimonials section shows only the "Client testimonial coming soon" placeholder. Social links footer renders nothing (empty array) until real URLs are supplied.
- `RESEND_API_KEY` is read from `process.env` only — never hardcoded, never logged, never sent to the client. The contact server action must not throw an unhandled exception if the key is missing or the Resend call fails; it returns a typed error result instead.
- All new components are Server Components unless they use hooks, event handlers, or Framer Motion — in which case add `"use client"` as the first line of the file.
- Path alias `@/*` maps to the project root (default `create-next-app` TS config) — import shared code as `@/lib/...`, `@/components/...`, `@/hooks/...`.

---

### Task 1: Scaffold project + install dependencies

**Files:**
- Create: entire Next.js scaffold in `delg-labs-site/` (already has `docs/` and `.git/` — scaffold into the same directory)

**Interfaces:**
- Produces: a running `npm run dev` dev server, `package.json` with all deps installed

- [ ] **Step 1: Scaffold Next.js with TypeScript, Tailwind, App Router, `src/` disabled, import alias `@/*`**

```bash
cd "C:/Users/jesus/Downloads/skills/delg-labs-site"
npx --yes create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
```

If prompted about the directory not being empty (it has `docs/`/`.git/`), choose the option that keeps existing files and only adds the scaffold — do **not** pass any `--overwrite`/force flag that deletes unrelated files (a prior project lost its `docs/` folder this exact way; verify `docs/superpowers/specs/2026-08-13-delg-labs-portfolio-design.md` still exists immediately after scaffolding, before proceeding).

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install framer-motion lucide-react zod react-hook-form @hookform/resolvers resend @vercel/analytics clsx tailwind-merge
```

- [ ] **Step 3: Verify dev server runs**

```bash
npm run dev
```

Open the printed localhost URL in the Browser pane. Confirm the default Next.js starter page renders with no console errors, then stop the dev server.

- [ ] **Step 4: Verify `docs/` survived and commit**

```bash
ls docs/superpowers/specs/
git add -A
git commit -m "Scaffold Next.js App Router project with core dependencies"
```

---

### Task 2: Tailwind v4 theme + root layout + fonts

**Files:**
- Modify: `app/globals.css` (replace with `@theme` block per Global Constraints)
- Modify: `app/layout.tsx` (Inter font, base metadata, dark background)
- Delete: `app/page.tsx` default content (replaced with a placeholder, real homepage comes in task 16)
- Delete: any default scaffold assets not referenced (e.g. `public/*.svg` from the starter, `app/favicon.ico` can stay)

**Interfaces:**
- Produces: Tailwind utility classes using the color tokens from Global Constraints (`bg-background`, `text-foreground`, `bg-card`, `text-accent`, etc.) available in every component; `<html>` has `className="dark"`-equivalent baseline (site is dark-only, no light mode toggle per spec)

- [ ] **Step 1: Replace `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-background: #09090B;
  --color-foreground: #FAFAFA;
  --color-card: #18181B;
  --color-card-foreground: #FAFAFA;
  --color-muted: #141417;
  --color-muted-foreground: #A1A1AA;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-accent: #3B82F6;
  --color-accent-secondary: #6366F1;
  --color-destructive: #DC2626;
  --color-ring: #3B82F6;
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-background text-foreground antialiased;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 2: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Delg Labs — Digital Product Developer',
  description:
    'I design and build websites, web applications, AI systems, and SaaS products for businesses.',
  metadataBase: new URL('https://delglabs.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Add the font family to the theme** — append to the `@theme` block in `app/globals.css`:

```css
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
```

(This line goes inside the same `@theme { ... }` block from Step 1 — add it alongside the color tokens, not as a separate block.)

- [ ] **Step 4: Replace `app/page.tsx` with a placeholder**

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <p className="text-muted-foreground">Delg Labs — under construction</p>
    </main>
  )
}
```

- [ ] **Step 5: Remove unused starter assets referenced only by the old `page.tsx`** (check `public/next.svg`, `public/vercel.svg` — delete if nothing in the current codebase imports them; leave `public/favicon.ico` alone)

- [ ] **Step 6: Verify in browser**

```bash
npm run dev
```

Confirm full-viewport dark background (`#09090B`), Inter font applied (check via `javascript_tool`: `getComputedStyle(document.body).fontFamily` should include `Inter`), no console errors. Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add Tailwind v4 dark theme, Inter font, base layout"
```

---

### Task 3: Shared lib — utils, reduced-motion hook, project data model

**Files:**
- Create: `lib/utils.ts`
- Create: `hooks/use-reduced-motion.ts`
- Create: `lib/projects.ts`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string`, `useReducedMotion(): boolean`, `interface Project`, `projects: Project[]`, `getProjectBySlug(slug: string): Project | undefined` — consumed by every later component/section task

- [ ] **Step 1: Write `lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Write `hooks/use-reduced-motion.ts`**

```typescript
'use client'

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false
}
```

- [ ] **Step 3: Write `lib/projects.ts`**

```typescript
export interface Project {
  slug: string
  title: string
  subtitle: string
  description: string
  category: string[]
  technologies: string[]
  featured: boolean
  status: 'live' | 'coming-soon'
  image: string
  gallery: string[]
  challenge: string
  solution: string
  results: string
  url?: string
}

export const projects: Project[] = [
  {
    slug: 'tireos',
    title: 'TireOS',
    subtitle: 'AI-powered operating system for tire businesses',
    description:
      'A concept for an all-in-one business platform combining inventory, customers, sales, appointments, suppliers, analytics, automation, and AI-powered business intelligence — designed and prototyped as a flagship interface project.',
    category: ['SaaS', 'AI', 'Business Software', 'Full-Stack'],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'OpenAI API'],
    featured: true,
    status: 'coming-soon',
    image: '/projects/tireos-dashboard.svg',
    gallery: ['/projects/tireos-dashboard.svg', '/projects/tireos-inventory.svg'],
    challenge:
      'Tire shops run their business across disconnected tools — a paper ticket system for appointments, a separate point of sale, a spreadsheet for inventory, and a phone that rings constantly for things the business itself already knows the answer to.',
    solution:
      'Instead of forcing business owners to manage inventory, customers, appointments, sales, and communication across disconnected tools, TireOS brings the entire operation into one intelligent platform — with an AI layer that surfaces what needs attention instead of making the owner go looking for it.',
    results:
      'Designed and prototyped as a concept: a working interface and component system demonstrating how a full business-management SaaS product would look and behave, not a shipped product with live customers.',
    url: undefined,
  },
  {
    slug: 'jszuss',
    title: 'Jszuss',
    subtitle: 'Immersive Business Website',
    description:
      'A highly interactive 3D web experience for a web-design and AI-receptionist studio — scroll-driven 3D hero, GSAP-choreographed parallax and tilt, built to make a business stand out from a template site.',
    category: ['Web Design', '3D', 'Frontend', 'Interactive Experience'],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Three.js', 'React Three Fiber', 'GSAP'],
    featured: false,
    status: 'live',
    image: '/projects/jszuss-hero.png',
    gallery: ['/projects/jszuss-hero.png', '/projects/jszuss-mobile.png'],
    challenge:
      'A web-design studio\u2019s own website is a credibility test — it has to prove the studio can build the exact kind of high-end, technically ambitious site it sells to clients.',
    solution:
      'Built a single-page site with a scroll- and pointer-driven Three.js hero (a wireframe icosahedron reacting to both), GSAP ScrollTrigger parallax between the 3D layer and the foreground copy, and tilt-on-hover service cards — all gated behind a `prefers-reduced-motion` check and a static fallback on mobile so the effects never cost a real visitor a usable page.',
    results:
      'Live production site with a real client case study built in (a bilingual tire-shop redesign), running on Netlify.',
    url: 'https://jszuss.netlify.app',
  },
  {
    slug: 'ai-automation',
    title: 'AI Business Automation',
    subtitle: 'Reducing repetitive work, one workflow at a time',
    description:
      'An automation system designed to reduce repetitive work and help businesses respond to customers faster.',
    category: ['AI', 'Automation'],
    technologies: [],
    featured: false,
    status: 'coming-soon',
    image: '/projects/coming-soon.svg',
    gallery: [],
    challenge: '',
    solution: '',
    results: '',
    url: undefined,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
```

- [ ] **Step 4: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add shared utils, reduced-motion hook, and project data model"
```

---

### Task 4: UI primitives (Button, Input, Textarea, Select, Label)

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/textarea.tsx`
- Create: `components/ui/label.tsx`
- Create: `components/ui/select.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils` (Task 3)
- Produces: `<Button variant="primary" | "outline" | "ghost" size="default" | "lg" magnetic?: boolean>`, `<Input>`, `<Textarea>`, `<Label>`, `<Select>` (native `<select>` wrapper) — consumed by every section and the contact form in later tasks. Also exports `variantClasses` and `sizeClasses` (the `Record` maps used internally by `Button`) so Tasks 5 and 6 can style plain `<a>` tags identically to `Button` without invalid `<a>`-inside-`<button>` nesting.

- [ ] **Step 1: Write `components/ui/button.tsx`**

```tsx
'use client'

import { forwardRef, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'default' | 'lg'
  magnetic?: boolean
}

export const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent text-white hover:bg-accent-secondary',
  outline: 'border border-border text-foreground hover:border-accent/50',
  ghost: 'text-foreground hover:bg-card',
}

export const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', magnetic = false, children, ...props }, ref) => {
    const reducedMotion = useReducedMotion()
    const innerRef = useRef<HTMLButtonElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 200, damping: 20 })
    const springY = useSpring(y, { stiffness: 200, damping: 20 })

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || reducedMotion || !innerRef.current) return
      const rect = innerRef.current.getBoundingClientRect()
      x.set((e.clientX - rect.left - rect.width / 2) * 0.25)
      y.set((e.clientY - rect.top - rect.height / 2) * 0.25)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    return (
      <motion.button
        ref={(node) => {
          innerRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        style={magnetic && !reducedMotion ? { x: springX, y: springY } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium transition-colors',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'
```

- [ ] **Step 2: Write `components/ui/input.tsx`**

```tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/40',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
```

- [ ] **Step 3: Write `components/ui/textarea.tsx`**

```tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/40',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
```

- [ ] **Step 4: Write `components/ui/label.tsx`**

```tsx
import { cn } from '@/lib/utils'

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('mb-1.5 block text-sm font-medium text-foreground', className)}
      {...props}
    />
  )
}
```

- [ ] **Step 5: Write `components/ui/select.tsx`**

```tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/40',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = 'Select'
```

- [ ] **Step 6: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add shared UI primitives: Button, Input, Textarea, Label, Select"
```

---

### Task 5: Header nav + animated mobile menu

**Files:**
- Create: `components/nav/Header.tsx`
- Create: `components/nav/MobileMenu.tsx`

**Interfaces:**
- Consumes: `Button` from `@/components/ui/button` (Task 4), `useReducedMotion` from `@/hooks/use-reduced-motion` (Task 3)
- Produces: `<Header />`, default export, no props — mounted in `app/layout.tsx` in Task 16

- [ ] **Step 1: Write `components/nav/MobileMenu.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const reducedMotion = useReducedMotion()

  return (
    <div className="sm:hidden">
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={reducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-x-4 top-16 z-30 flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 shadow-xl"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-background"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Write `components/nav/Header.tsx`**

```tsx
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
```

Note: this uses `variantClasses`/`sizeClasses` exported from `components/ui/button.tsx` (Task 4) to style a plain anchor identically to `Button`, since `Button` renders a native `<button>` and nesting `<a>` inside a `<button>` is invalid HTML — this pattern (styled `<a>` reusing `Button`'s class maps instead of nesting inside `Button`) is used everywhere a CTA needs to be a real link.

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Verify in browser** — temporarily mount `<Header />` at the top of `app/page.tsx`'s placeholder (above the existing `<p>`), run `npm run dev`, confirm the sticky header renders with nav links (desktop) and the hamburger menu opens/closes with animation (mobile — use `resize_window` mobile preset). Then revert `app/page.tsx` back to the plain placeholder from Task 2 (Header gets mounted for real in Task 16's root layout, not here) — this task's verification is temporary only, don't leave the import in `page.tsx`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add sticky header nav with animated mobile menu"
```

---

### Task 6: Hero section with interactive floating cards

**Files:**
- Create: `components/hero/FloatingCards.tsx`
- Create: `components/hero/Hero.tsx`
- Create: `hooks/use-media-query.ts`

**Interfaces:**
- Consumes: `useReducedMotion` from `@/hooks/use-reduced-motion` (Task 3)
- Produces: `<Hero />`, default export, no props; `useMediaQuery(query: string): boolean` — reusable, not hero-specific, may be consumed by later responsive logic

- [ ] **Step 1: Write `hooks/use-media-query.ts`**

```typescript
'use client'

import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}
```

- [ ] **Step 2: Write `components/hero/FloatingCards.tsx`**

```tsx
'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useMediaQuery } from '@/hooks/use-media-query'

const cards = [
  { label: 'AI', top: '8%', left: '10%', depth: 1 },
  { label: 'WEBSITE', top: '20%', left: '68%', depth: 1.6 },
  { label: 'SAAS', top: '55%', left: '4%', depth: 1.2 },
  { label: 'AUTOMATION', top: '68%', left: '62%', depth: 0.8 },
  { label: 'ANALYTICS', top: '40%', left: '40%', depth: 1.4 },
]

function Card({ label, top, left, depth, mx, my }: (typeof cards)[number] & {
  mx: ReturnType<typeof useMotionValue<number>>
  my: ReturnType<typeof useMotionValue<number>>
}) {
  const x = useTransform(mx, (v) => v * depth * 0.02)
  const y = useTransform(my, (v) => v * depth * 0.02)
  const springX = useSpring(x, { stiffness: 120, damping: 20 })
  const springY = useSpring(y, { stiffness: 120, damping: 20 })

  return (
    <motion.div
      style={{ top, left, x: springX, y: springY }}
      className="absolute rounded-xl border border-border bg-card/80 px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur"
    >
      {label}
    </motion.div>
  )
}

export function FloatingCards() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const containerRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mx.set(e.clientX - rect.left - rect.width / 2)
    my.set(e.clientY - rect.top - rect.height / 2)
  }

  if (reducedMotion || isMobile) {
    return (
      <div className="relative mx-auto mt-16 grid max-w-md grid-cols-3 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-border bg-card/80 px-3 py-2 text-center text-xs font-medium tracking-wide text-muted-foreground"
          >
            {c.label}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative mx-auto mt-16 h-72 max-w-2xl"
    >
      {cards.map((c) => (
        <Card key={c.label} {...c} mx={mx} my={my} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Write `components/hero/Hero.tsx`**

```tsx
import { cn } from '@/lib/utils'
import { variantClasses, sizeClasses } from '@/components/ui/button'
import { FloatingCards } from './FloatingCards'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-28 text-center sm:py-36">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Currently accepting new projects
      </div>
      <h1 className="mx-auto mt-8 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
        I build digital products that move businesses forward.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
        I design and develop websites, web applications, AI systems, and SaaS products that turn
        ideas and business problems into real digital experiences.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="#work"
          className={cn('inline-flex items-center justify-center rounded-full font-medium transition-colors', variantClasses.primary, sizeClasses.lg)}
        >
          View My Work
        </a>
        <a
          href="#contact"
          className={cn('inline-flex items-center justify-center rounded-full font-medium transition-colors', variantClasses.outline, sizeClasses.lg)}
        >
          Start a Project
        </a>
      </div>
      <FloatingCards />
    </section>
  )
}
```

Note: reuses `variantClasses`/`sizeClasses` from `components/ui/button.tsx` (Task 4) on plain anchors, same reason as Task 5's Header — `Button` renders a native `<button>`, and these two CTAs must be real navigational links, not buttons. This means the hero CTAs don't get `Button`'s magnetic hover effect; `Button`'s `magnetic` prop remains available for actual `<button>` elements (e.g. the contact form's submit button in Task 14).

- [ ] **Step 4: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Verify in browser** — temporarily mount `<Hero />` in `app/page.tsx`, run `npm run dev`. Desktop: confirm the 5 labeled cards float around the hero and shift position as the mouse moves across the hero area. Mobile (`resize_window` mobile preset, reload): confirm the cards render as a static 3-column grid instead, no cursor tracking. Revert `app/page.tsx` afterward (mounted for real in Task 16).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add hero section with cursor-parallax floating cards"
```

---

### Task 7: Capability strip marquee

**Files:**
- Create: `components/CapabilityStrip.tsx`

**Interfaces:**
- Consumes: `useReducedMotion` from `@/hooks/use-reduced-motion` (Task 3)
- Produces: `<CapabilityStrip />`, default export, no props

- [ ] **Step 1: Write `components/CapabilityStrip.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const items = [
  'WEB DESIGN',
  'WEB DEVELOPMENT',
  'AI',
  'AUTOMATION',
  'SAAS',
  'UI/UX',
  'PRODUCT DEVELOPMENT',
]

export function CapabilityStrip() {
  const reducedMotion = useReducedMotion()
  const loop = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-border bg-card/40 py-4">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap text-sm font-medium tracking-widest text-muted-foreground"
        animate={reducedMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={reducedMotion ? undefined : { duration: 24, ease: 'linear', repeat: Infinity }}
      >
        {loop.map((item, i) => (
          <span key={`${item}-${i}`}>{item}</span>
        ))}
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add auto-scrolling capability strip"
```

---

### Task 8: ProjectCard + Selected Work section

**Files:**
- Create: `components/work/ProjectCard.tsx`
- Create: `components/work/SelectedWork.tsx`

**Interfaces:**
- Consumes: `projects` from `@/lib/projects` (Task 3), `useReducedMotion` from `@/hooks/use-reduced-motion` (Task 3)
- Produces: `<SelectedWork />`, default export, no props

- [ ] **Step 1: Write `components/work/ProjectCard.tsx`**

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { Project } from '@/lib/projects'

export function ProjectCard({ project }: { project: Project }) {
  const reducedMotion = useReducedMotion()
  const isComingSoon = project.status === 'coming-soon' && !project.url && project.gallery.length === 0

  const content = (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card">
      {project.featured && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
          Featured Project
        </span>
      )}
      {project.status === 'coming-soon' && (
        <span className="absolute right-4 top-4 z-10 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          Coming Soon
        </span>
      )}
      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        <motion.div
          whileHover={reducedMotion ? undefined : { scale: 1.04 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full w-full"
        >
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </div>
      <div className="p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          {project.category.join(' · ')}
        </p>
        <h3 className="mt-2 text-2xl font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{project.subtitle}</p>
        {!isComingSoon && (
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
            View project <ArrowUpRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  )

  if (isComingSoon) {
    return <div className="opacity-60">{content}</div>
  }

  return (
    <Link href={`/work/${project.slug}`} className="block">
      {content}
    </Link>
  )
}
```

- [ ] **Step 2: Write `components/work/SelectedWork.tsx`**

```tsx
import { projects } from '@/lib/projects'
import { ProjectCard } from './ProjectCard'

export function SelectedWork() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-3xl font-semibold sm:text-4xl">Selected Work</h2>
      <p className="mt-3 text-muted-foreground">A few things I&apos;ve designed and built.</p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add project cards and Selected Work section"
```

---

### Task 9: Services + Positioning sections

**Files:**
- Create: `components/Services.tsx`
- Create: `components/Positioning.tsx`

**Interfaces:**
- Consumes: `useReducedMotion` from `@/hooks/use-reduced-motion` (Task 3)
- Produces: `<Services />`, `<Positioning />`, both default export, no props

- [ ] **Step 1: Write `components/Services.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `components/Positioning.tsx`**

```tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function Positioning() {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center" ref={ref}>
      <p className="text-3xl font-semibold text-muted-foreground sm:text-4xl">
        I don&apos;t just build websites.
      </p>
      <motion.p
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl"
      >
        I build systems.
      </motion.p>
      <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
        A website can attract customers. A well-designed digital product can help run the business
        behind it. I combine design, development, AI, automation, and business thinking to create
        complete digital products.
      </p>
    </section>
  )
}
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add services grid and positioning statement section"
```

---

### Task 10: How I Work timeline

**Files:**
- Create: `components/HowIWork.tsx`

**Interfaces:**
- Consumes: `useReducedMotion` from `@/hooks/use-reduced-motion` (Task 3)
- Produces: `<HowIWork />`, default export, no props

- [ ] **Step 1: Write `components/HowIWork.tsx`**

```tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const steps = [
  { n: '01', title: 'Discover', description: 'Understand the business, audience, goals, and problems.' },
  { n: '02', title: 'Design', description: 'Turn ideas into a clear user experience and visual system.' },
  { n: '03', title: 'Build', description: 'Develop the website, application, automation, or SaaS product.' },
  { n: '04', title: 'Launch & Improve', description: 'Deploy, optimize, measure, and continue improving.' },
]

export function HowIWork() {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="process" className="mx-auto max-w-6xl px-6 py-24" ref={ref}>
      <h2 className="text-3xl font-semibold sm:text-4xl">From idea to launch.</h2>
      <div className="mt-12 grid gap-8 sm:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.n}
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, ease: 'easeOut', delay: reducedMotion ? 0 : i * 0.1 }}
            className="border-t border-border pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0"
          >
            <span className="text-sm font-medium text-accent">{step.n}</span>
            <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Verify in browser** — mount temporarily in `app/page.tsx`, confirm horizontal 4-column layout on desktop (`sm:` breakpoint and above) and a stacked vertical layout with left border on mobile (`resize_window` mobile preset). Revert `app/page.tsx` after.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add How I Work responsive timeline section"
```

---

### Task 11: About + Technology sections

**Files:**
- Create: `components/About.tsx`
- Create: `components/Technology.tsx`
- Create: `public/portrait-placeholder.svg`

**Interfaces:**
- Produces: `<About />`, `<Technology />`, both default export, no props

- [ ] **Step 1: Create `public/portrait-placeholder.svg`**

```svg
<svg width="480" height="480" viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="480" height="480" fill="#18181B"/>
  <circle cx="240" cy="190" r="80" fill="#27272A"/>
  <path d="M100 440c0-90 63-140 140-140s140 50 140 140" fill="#27272A"/>
  <text x="240" y="460" text-anchor="middle" fill="#71717A" font-family="sans-serif" font-size="14">Portrait placeholder</text>
</svg>
```

- [ ] **Step 2: Write `components/About.tsx`**

```tsx
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
```

- [ ] **Step 3: Write `components/Technology.tsx`**

```tsx
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
```

- [ ] **Step 4: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add about section with placeholder portrait and technology list"
```

---

### Task 12: Results/Value + Testimonials sections

**Files:**
- Create: `components/ResultsValue.tsx`
- Create: `components/Testimonials.tsx`

**Interfaces:**
- Produces: `<ResultsValue />`, `<Testimonials />`, both default export, no props. `Testimonials` accepts an optional `testimonials` prop (empty array default) so real testimonials can be added later without changing the component's shape.

- [ ] **Step 1: Write `components/ResultsValue.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `components/Testimonials.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add results/value section and placeholder-ready testimonials"
```

---

### Task 13: Contact schema + server action (Resend)

**Files:**
- Create: `lib/contact-schema.ts`
- Create: `actions/contact.ts`

**Interfaces:**
- Produces: `contactSchema: z.ZodSchema`, `type ContactFormValues = z.infer<typeof contactSchema>`, `submitContactForm(values: ContactFormValues): Promise<{ success: true } | { success: false; error: string }>` — consumed by `ContactForm` in Task 14

- [ ] **Step 1: Write `lib/contact-schema.ts`**

```typescript
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  company: z.string().optional(),
  projectType: z.enum(['Website', 'Web Application', 'AI / Automation', 'SaaS', 'Other']),
  budget: z.enum([
    'Under $2,000',
    '$2,000–$5,000',
    '$5,000–$10,000',
    '$10,000+',
    'Not sure yet',
  ]),
  message: z.string().min(10, 'Tell me a bit more — at least 10 characters'),
})

export type ContactFormValues = z.infer<typeof contactSchema>
```

- [ ] **Step 2: Write `actions/contact.ts`**

```typescript
'use server'

import { Resend } from 'resend'
import { contactSchema, type ContactFormValues } from '@/lib/contact-schema'

type ContactResult = { success: true } | { success: false; error: string }

export async function submitContactForm(values: ContactFormValues): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, error: 'Please check the form and try again.' }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('submitContactForm: RESEND_API_KEY is not set')
    return { success: false, error: 'Something went wrong. Please try again later.' }
  }

  const { name, email, company, projectType, budget, message } = parsed.data

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: 'Delg Labs <onboarding@resend.dev>',
      to: process.env.CONTACT_INBOX_EMAIL ?? 'hello@delglabs.com',
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || 'n/a'}`,
        `Project type: ${projectType}`,
        `Budget: ${budget}`,
        '',
        message,
      ].join('\n'),
    })
    return { success: true }
  } catch (err) {
    console.error('submitContactForm: Resend call failed', err)
    return { success: false, error: 'Something went wrong. Please try again later.' }
  }
}
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add contact form schema and Resend server action"
```

---

### Task 14: Contact form + Contact section

**Files:**
- Create: `components/contact/ContactForm.tsx`
- Create: `components/contact/ContactSection.tsx`

**Interfaces:**
- Consumes: `contactSchema`, `ContactFormValues` from `@/lib/contact-schema` (Task 13), `submitContactForm` from `@/actions/contact` (Task 13), `Input`/`Textarea`/`Label`/`Select`/`Button` from `@/components/ui/*` (Task 4)
- Produces: `<ContactSection />`, default export, no props

- [ ] **Step 1: Write `components/contact/ContactForm.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { contactSchema, type ContactFormValues } from '@/lib/contact-schema'
import { submitContactForm } from '@/actions/contact'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (values: ContactFormValues) => {
    setStatus('loading')
    const result = await submitContactForm(values)
    if (result.success) {
      setStatus('success')
      reset()
    } else {
      setStatus('error')
      setErrorMessage(result.error)
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="h-8 w-8 text-accent" />
        <p className="text-foreground">
          Thanks — your project details were received. I&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <Input id="company" {...register('company')} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="projectType">Project type</Label>
          <Select id="projectType" {...register('projectType')}>
            <option value="Website">Website</option>
            <option value="Web Application">Web Application</option>
            <option value="AI / Automation">AI / Automation</option>
            <option value="SaaS">SaaS</option>
            <option value="Other">Other</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Select id="budget" {...register('budget')}>
            <option value="Under $2,000">Under $2,000</option>
            <option value="$2,000–$5,000">$2,000–$5,000</option>
            <option value="$5,000–$10,000">$5,000–$10,000</option>
            <option value="$10,000+">$10,000+</option>
            <option value="Not sure yet">Not sure yet</option>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} {...register('message')} />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
      </div>
      {status === 'error' && <p className="text-sm text-destructive">{errorMessage}</p>}
      <Button type="submit" size="lg" variant="primary" disabled={status === 'loading'}>
        {status === 'loading' ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Sending
          </span>
        ) : (
          'Start a Conversation'
        )}
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Write `components/contact/ContactSection.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Verify in browser** — mount `<ContactSection />` temporarily in `app/page.tsx`, run `npm run dev`. Submit the form with invalid data (empty name) and confirm inline validation errors appear without a page reload. Submit with valid data and no `RESEND_API_KEY` set — confirm the loading spinner shows briefly, then the error state renders a message (not a thrown exception / Next.js error overlay). Check `read_console_messages` for the expected `console.error` log and no unhandled exception. Revert `app/page.tsx` after.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add contact form with validation, loading, success, and error states"
```

---

### Task 15: Footer

**Files:**
- Create: `components/Footer.tsx`

**Interfaces:**
- Produces: `<Footer />`, default export, no props. Social links array is empty per Global Constraints — component renders nothing in that slot until real URLs are added, but the rendering logic (map over an array of `{ label, href, icon }`) is already correct so adding entries later requires no structural change.

- [ ] **Step 1: Write `components/Footer.tsx`**

```tsx
import type { LucideIcon } from 'lucide-react'

interface SocialLink {
  label: string
  href: string
  icon: LucideIcon
}

// Populate with real URLs when available — e.g. { label: 'GitHub', href: 'https://github.com/...', icon: Github }
const socialLinks: SocialLink[] = []

const navLinks = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
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
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add footer with nav, empty-until-populated social links, and copyright"
```

---

### Task 16: Assemble homepage + mount Header/Footer in root layout

**Files:**
- Modify: `app/layout.tsx` (mount `<Header />` and `<Footer />` around `{children}`)
- Modify: `app/page.tsx` (compose all 11 section components in order)

**Interfaces:**
- Consumes: every component produced in Tasks 5–15

- [ ] **Step 1: Update `app/layout.tsx`** — add the imports and wrap `{children}`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { Header } from '@/components/nav/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Delg Labs — Digital Product Developer',
  description:
    'I design and build websites, web applications, AI systems, and SaaS products for businesses.',
  metadataBase: new URL('https://delglabs.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Replace `app/page.tsx`**

```tsx
import { Hero } from '@/components/hero/Hero'
import { CapabilityStrip } from '@/components/CapabilityStrip'
import { SelectedWork } from '@/components/work/SelectedWork'
import { Services } from '@/components/Services'
import { Positioning } from '@/components/Positioning'
import { HowIWork } from '@/components/HowIWork'
import { About } from '@/components/About'
import { Technology } from '@/components/Technology'
import { ResultsValue } from '@/components/ResultsValue'
import { Testimonials } from '@/components/Testimonials'
import { ContactSection } from '@/components/contact/ContactSection'

export default function Home() {
  return (
    <>
      <Hero />
      <CapabilityStrip />
      <SelectedWork />
      <Services />
      <Positioning />
      <HowIWork />
      <About />
      <Technology />
      <ResultsValue />
      <Testimonials />
      <ContactSection />
    </>
  )
}
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Verify in browser** — `npm run dev`, scroll the full homepage top to bottom, confirm every section renders in order with no console errors, all nav anchor links (`#work`, `#services`, `#about`, `#process`, `#contact`) scroll to the right section, header stays sticky.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Assemble full homepage and mount header/footer in root layout"
```

---

### Task 17: Shared case-study layout pieces

**Files:**
- Create: `components/case-study/CaseStudyHero.tsx`
- Create: `components/case-study/CaseStudySection.tsx`
- Create: `components/case-study/CaseStudyGallery.tsx`
- Create: `components/case-study/CaseStudyCTA.tsx`

**Interfaces:**
- Produces: `<CaseStudyHero project={Project} />`, `<CaseStudySection title={string} children={ReactNode} />`, `<CaseStudyGallery images={string[]} />`, `<CaseStudyCTA project={Project} />` — consumed by both case study pages in Tasks 18–19

- [ ] **Step 1: Write `components/case-study/CaseStudyHero.tsx`**

```tsx
import type { Project } from '@/lib/projects'

export function CaseStudyHero({ project }: { project: Project }) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">
        {project.category.join(' · ')}
      </p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{project.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{project.subtitle}</p>
    </section>
  )
}
```

- [ ] **Step 2: Write `components/case-study/CaseStudySection.tsx`**

```tsx
export function CaseStudySection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4 text-muted-foreground">{children}</div>
    </section>
  )
}
```

- [ ] **Step 3: Write `components/case-study/CaseStudyGallery.tsx`**

```tsx
import Image from 'next/image'

export function CaseStudyGallery({ images }: { images: string[] }) {
  if (images.length === 0) return null

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-6 sm:grid-cols-2">
        {images.map((src) => (
          <div key={src} className="relative aspect-video overflow-hidden rounded-2xl border border-border">
            <Image src={src} alt="Project screenshot" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write `components/case-study/CaseStudyCTA.tsx`**

```tsx
import Link from 'next/link'
import type { Project } from '@/lib/projects'

export function CaseStudyCTA({ project }: { project: Project }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h2 className="text-2xl font-semibold">Have a similar project in mind?</h2>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/#contact"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-secondary"
        >
          Start a Project
        </Link>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/50"
          >
            Visit live site
          </a>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add reusable case-study layout building blocks"
```

---

### Task 18: TireOS dashboard mockup + case study page

**Files:**
- Create: `components/case-study/TireOSDashboardMockup.tsx`
- Create: `public/projects/tireos-dashboard.svg`
- Create: `public/projects/tireos-inventory.svg`
- Create: `app/work/tireos/page.tsx`

**Interfaces:**
- Consumes: `getProjectBySlug` from `@/lib/projects` (Task 3), all `CaseStudy*` components from Task 17
- Produces: route `/work/tireos`

- [ ] **Step 1: Create `public/projects/tireos-dashboard.svg`** (flagship card image used on the homepage `ProjectCard`)

```svg
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="800" fill="#09090B"/>
  <rect x="40" y="40" width="1120" height="80" rx="12" fill="#18181B" stroke="#27272A"/>
  <text x="70" y="90" fill="#FAFAFA" font-family="sans-serif" font-size="24" font-weight="600">TireOS</text>
  <rect x="40" y="140" width="270" height="140" rx="12" fill="#18181B" stroke="#27272A"/>
  <text x="65" y="180" fill="#A1A1AA" font-family="sans-serif" font-size="14">Revenue</text>
  <text x="65" y="230" fill="#3B82F6" font-family="sans-serif" font-size="32" font-weight="700">$48,210</text>
  <rect x="330" y="140" width="270" height="140" rx="12" fill="#18181B" stroke="#27272A"/>
  <text x="355" y="180" fill="#A1A1AA" font-family="sans-serif" font-size="14">Appointments</text>
  <text x="355" y="230" fill="#FAFAFA" font-family="sans-serif" font-size="32" font-weight="700">86</text>
  <rect x="620" y="140" width="270" height="140" rx="12" fill="#18181B" stroke="#27272A"/>
  <text x="645" y="180" fill="#A1A1AA" font-family="sans-serif" font-size="14">Inventory</text>
  <text x="645" y="230" fill="#FAFAFA" font-family="sans-serif" font-size="32" font-weight="700">1,204</text>
  <rect x="910" y="140" width="250" height="140" rx="12" fill="#18181B" stroke="#27272A"/>
  <text x="935" y="180" fill="#A1A1AA" font-family="sans-serif" font-size="14">Profit</text>
  <text x="935" y="230" fill="#22C55E" font-family="sans-serif" font-size="32" font-weight="700">$12,860</text>
  <rect x="40" y="310" width="1120" height="260" rx="12" fill="#18181B" stroke="#27272A"/>
  <text x="65" y="345" fill="#A1A1AA" font-family="sans-serif" font-size="14">AI Insights</text>
  <text x="65" y="380" fill="#FAFAFA" font-family="sans-serif" font-size="16">3 customers are due for tire rotation this week</text>
  <text x="65" y="410" fill="#FAFAFA" font-family="sans-serif" font-size="16">Brand X tires trending 18% above forecast — reorder suggested</text>
  <text x="65" y="440" fill="#FAFAFA" font-family="sans-serif" font-size="16">Saturday appointments 92% booked</text>
</svg>
```

- [ ] **Step 2: Create `public/projects/tireos-inventory.svg`**

```svg
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="800" fill="#09090B"/>
  <rect x="40" y="40" width="1120" height="720" rx="12" fill="#18181B" stroke="#27272A"/>
  <text x="70" y="90" fill="#FAFAFA" font-family="sans-serif" font-size="24" font-weight="600">Inventory</text>
  <g font-family="sans-serif" font-size="16" fill="#A1A1AA">
    <text x="70" y="150">SKU</text>
    <text x="300" y="150">Brand</text>
    <text x="550" y="150">Size</text>
    <text x="750" y="150">Stock</text>
    <text x="950" y="150">Status</text>
  </g>
  <line x1="70" y1="170" x2="1130" y2="170" stroke="#27272A"/>
  <g font-family="sans-serif" font-size="15" fill="#FAFAFA">
    <text x="70" y="210">TR-2201</text><text x="300" y="210">Michelin</text><text x="550" y="210">225/55R17</text><text x="750" y="210">24</text>
    <text x="70" y="250">TR-2202</text><text x="300" y="250">Goodyear</text><text x="550" y="250">215/60R16</text><text x="750" y="250">6</text>
    <text x="70" y="290">TR-2203</text><text x="300" y="290">Bridgestone</text><text x="550" y="290">235/45R18</text><text x="750" y="290">31</text>
  </g>
</svg>
```

- [ ] **Step 3: Write `components/case-study/TireOSDashboardMockup.tsx`**

```tsx
import Image from 'next/image'

export function TireOSDashboardMockup() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-border">
        <Image
          src="/projects/tireos-dashboard.svg"
          alt="TireOS dashboard concept showing revenue, appointments, inventory, and AI insights"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1024px"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write `app/work/tireos/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug } from '@/lib/projects'
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
import { CaseStudySection } from '@/components/case-study/CaseStudySection'
import { CaseStudyGallery } from '@/components/case-study/CaseStudyGallery'
import { CaseStudyCTA } from '@/components/case-study/CaseStudyCTA'
import { TireOSDashboardMockup } from '@/components/case-study/TireOSDashboardMockup'

export const metadata: Metadata = {
  title: 'TireOS — Delg Labs',
  description:
    'A concept for an AI-powered operating system for tire businesses — inventory, customers, sales, appointments, and AI insights in one platform.',
}

export default function TireOSPage() {
  const project = getProjectBySlug('tireos')
  if (!project) notFound()

  return (
    <>
      <CaseStudyHero project={project} />
      <CaseStudySection title="Project overview">
        <p>{project.description}</p>
      </CaseStudySection>
      <CaseStudySection title="The problem">
        <p>{project.challenge}</p>
      </CaseStudySection>
      <CaseStudySection title="The solution">
        <p>{project.solution}</p>
      </CaseStudySection>
      <CaseStudySection title="Key features">
        <ul className="list-disc space-y-2 pl-5">
          <li>AI assistant surfacing what needs attention across the business</li>
          <li>Unified dashboard: revenue, inventory, appointments, customers, profit</li>
          <li>Inventory tracking with reorder suggestions</li>
          <li>Customer management with service history</li>
          <li>Automation for repetitive scheduling and follow-up work</li>
        </ul>
      </CaseStudySection>
      <TireOSDashboardMockup />
      <CaseStudySection title="Results / intended impact">
        <p>{project.results}</p>
      </CaseStudySection>
      <CaseStudySection title="Technology">
        <p>{project.technologies.join(', ')}</p>
      </CaseStudySection>
      <CaseStudyGallery images={project.gallery} />
      <CaseStudyCTA project={project} />
    </>
  )
}
```

- [ ] **Step 5: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Verify in browser** — `npm run dev`, navigate to `/work/tireos`, confirm the case study renders top to bottom including the dashboard mockup image, no console errors, "Explore TireOS" flow works by clicking the homepage project card.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add TireOS dashboard mockup and case study page"
```

---

### Task 19: Jszuss case study page

**Files:**
- Create: `app/work/jszuss/page.tsx`

**Interfaces:**
- Consumes: `getProjectBySlug` from `@/lib/projects` (Task 3), all `CaseStudy*` components from Task 17

- [ ] **Step 1: Write `app/work/jszuss/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getProjectBySlug } from '@/lib/projects'
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
import { CaseStudySection } from '@/components/case-study/CaseStudySection'
import { CaseStudyCTA } from '@/components/case-study/CaseStudyCTA'

export const metadata: Metadata = {
  title: 'Jszuss — Delg Labs',
  description:
    'A scroll- and pointer-driven 3D web experience built for a web-design and AI-receptionist studio.',
}

function sitePreviewUrl(url: string, width = 800) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${width}`
}

export default function JszussPage() {
  const project = getProjectBySlug('jszuss')
  if (!project) notFound()

  return (
    <>
      <CaseStudyHero project={project} />
      <CaseStudySection title="Project overview">
        <p>{project.description}</p>
      </CaseStudySection>
      <CaseStudySection title="The challenge">
        <p>{project.challenge}</p>
      </CaseStudySection>
      <CaseStudySection title="The approach">
        <p>{project.solution}</p>
      </CaseStudySection>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
            {project.url && (
              <Image
                src={sitePreviewUrl(project.url)}
                alt="Jszuss desktop screenshot"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            )}
          </div>
          <div className="relative mx-auto aspect-[9/16] w-56 overflow-hidden rounded-2xl border border-border sm:mx-0">
            {project.url && (
              <Image
                src={sitePreviewUrl(project.url, 400)}
                alt="Jszuss mobile screenshot"
                fill
                className="object-cover object-top"
                sizes="224px"
                unoptimized
              />
            )}
          </div>
        </div>
      </section>
      <CaseStudySection title="Results">
        <p>{project.results}</p>
      </CaseStudySection>
      <CaseStudySection title="Technology">
        <p>{project.technologies.join(', ')}</p>
      </CaseStudySection>
      <CaseStudyCTA project={project} />
    </>
  )
}
```

Note: `next/image` requires remote image domains to be allow-listed in `next.config.ts` for optimized loading — this page uses `unoptimized` on both remote `<Image>`s specifically to avoid that config requirement for a single external screenshot service (matches the plain-`<img>` approach already proven on the Jszuss site itself; acceptable since these are small, already-compressed screenshots, not primary page content needing full optimization).

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Verify in browser** — `npm run dev`, navigate to `/work/jszuss`, confirm the case study renders with the live desktop/mobile screenshots of `jszuss.netlify.app` (may briefly show the mshots "Generating Preview" placeholder on first load, same as observed on the Jszuss site itself — acceptable), no console errors, "Visit live site" CTA links to the correct URL.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add Jszuss case study page with live site screenshots"
```

---

### Task 20: SEO — sitemap, robots, OG images, structured data

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `app/opengraph-image.tsx`
- Modify: `app/work/tireos/page.tsx` (add JSON-LD)
- Modify: `app/work/jszuss/page.tsx` (add JSON-LD)

**Interfaces:**
- Consumes: `projects` from `@/lib/projects` (Task 3)

- [ ] **Step 1: Write `app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next'
import { projects } from '@/lib/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://delglabs.com'
  const projectRoutes = projects
    .filter((p) => p.status === 'live' || p.slug === 'tireos')
    .map((p) => ({
      url: `${base}/work/${p.slug}`,
      lastModified: new Date(),
    }))

  return [{ url: base, lastModified: new Date() }, ...projectRoutes]
}
```

- [ ] **Step 2: Write `app/robots.ts`**

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://delglabs.com/sitemap.xml',
  }
}
```

- [ ] **Step 3: Write `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090B',
          color: '#FAFAFA',
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        Delg Labs
        <div style={{ fontSize: 28, color: '#A1A1AA', marginTop: 20, fontWeight: 400 }}>
          Digital Product Developer
        </div>
      </div>
    ),
    size
  )
}
```

- [ ] **Step 4: Add JSON-LD to `app/work/tireos/page.tsx`** — insert directly after the `if (!project) notFound()` line, before the returned JSX, and render it inside the returned fragment as the first child:

```tsx
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    creator: { '@type': 'Person', name: 'Delg Labs' },
  }
```

Then add as the first element inside the returned `<>...</>`:

```tsx
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

- [ ] **Step 5: Add the same JSON-LD pattern to `app/work/jszuss/page.tsx`** (same shape, `project.title`/`project.description` from the Jszuss project entry)

- [ ] **Step 6: Verify it compiles and builds**

```bash
npx tsc --noEmit
npm run build
```

Expected: no errors. Confirm `/sitemap.xml`, `/robots.txt`, and `/opengraph-image` routes are listed in the build output.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add sitemap, robots.txt, OG image generation, and structured data"
```

---

### Task 21: Final integration pass

**Files:**
- No new files — verification-only task

- [ ] **Step 1: Full desktop walkthrough**

```bash
npm run dev
```

Walk through `/`, `/work/tireos`, `/work/jszuss` in the Browser pane at desktop size. Confirm: no console errors, every homepage section renders in the spec's order, hero floating cards respond to cursor movement, project cards scale on hover and link correctly (TireOS and Jszuss link to case studies, AI Business Automation renders muted/non-clickable), contact form full flow (validation → loading → success/error), all nav anchors scroll correctly, fonts render as Inter throughout.

- [ ] **Step 2: Mobile walkthrough**

`resize_window` mobile preset (375px), reload each of the 3 routes. Confirm: mobile menu opens/closes, hero floating cards replaced by the static grid, How I Work timeline stacks vertically, no horizontal scroll anywhere, contact form fields are full-width and usable, case study screenshots stack in a single column.

- [ ] **Step 3: Responsive breakpoint spot-check**

Using `resize_window` with explicit widths, spot-check 320px, 768px, 1024px, 1440px on the homepage — confirm no layout breaks or overlapping text at any of them.

- [ ] **Step 4: Reduced-motion audit**

```bash
grep -rn "useReducedMotion" components app hooks
```

Confirm every component that calls Framer Motion's `animate`/`whileHover`/`whileInView`/looping `animate` props also imports and checks `useReducedMotion` from `@/hooks/use-reduced-motion`. Cross-reference the list against: `Button` (magnetic), `MobileMenu`, `FloatingCards`, `CapabilityStrip`, `ProjectCard`, `Positioning`, `HowIWork`. Any animated component missing from the grep output is a real gap — fix it before continuing (add the hook and gate the animation, following the exact pattern already used in the other components).

- [ ] **Step 5: Production build check**

```bash
npm run build
```

Expected: build completes with no TypeScript or bundling errors. Note the reported page sizes for `/`, `/work/tireos`, `/work/jszuss` in the final report for the record.

- [ ] **Step 6: Commit (only if Steps 1–5 required fixes)**

```bash
git add -A
git commit -m "Fix integration issues found in final verification pass"
```

If no fixes were needed, skip this commit.

---
