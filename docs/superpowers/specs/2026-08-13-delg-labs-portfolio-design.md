# Delg Labs Portfolio — Design

## Purpose
Premium personal portfolio for a developer ("Delg Labs") who builds websites, web apps, AI systems, automation, and SaaS. Positions the developer as a digital-product studio, not a generic freelancer. Three goals: win website clients, demonstrate advanced dev ability (dashboards/AI/SaaS), build personal brand.

## Stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- shadcn/ui components where appropriate (buttons, form inputs, cards)
- Framer Motion for all animation/motion
- Lucide icons — no emoji, no stock photos, no generic dev illustrations
- Server actions for the contact form (no separate API route)
- Deploy target: Vercel
- Analytics: `@vercel/analytics` (privacy-conscious, no-ops until deployed, never blocks render)
- Email: Resend, via `RESEND_API_KEY` env var the user sets themselves (never pasted into chat/committed)

## Brand
- Name: **Delg Labs**
- Positioning: "Digital Product Developer" — never "Web Developer"
- Primary headline: "I build digital products that move businesses forward."
- Primary CTA: "Start a Project" / Secondary CTA: "View My Work"

## Routes
- `/` — full one-page marketing site (all sections below)
- `/work/tireos` — TireOS case study
- `/work/jszuss` — Jszuss (Immersive Business Website) case study
- `app/sitemap.ts`, `app/robots.ts` — SEO
- `app/opengraph-image.tsx` (or per-route) — dynamic OG image generation via Next.js `ImageResponse`

## Homepage Sections (in order)
1. Sticky nav — logo/name, Work/Services/About/Process/Contact anchors, "Let's Work Together" CTA, animated mobile menu
2. Hero — headline, supporting copy, primary/secondary CTA, availability indicator ("Currently accepting new projects"), interactive floating-card visual (desktop: cursor-parallax cards for AI/Website/SaaS/Automation/Analytics; mobile: simplified static/animated composition)
3. Capability strip — subtle auto-scrolling marquee (WEB DESIGN, WEB DEVELOPMENT, AI, AUTOMATION, SAAS, UI/UX, PRODUCT DEVELOPMENT)
4. Selected Work — large editorial project cards (not a boring grid), pulled from the project data model
5. Services — 4 cards: Websites, Web Applications, AI & Automation, SaaS Products
6. Positioning statement — "I don't just build websites." → reveals "I build systems." with supporting copy
7. How I Work — 4-step process (Discover/Design/Build/Launch & Improve), horizontal timeline desktop, vertical mobile
8. About — professional-focused bio, placeholder portrait, capability list
9. Technology — elegant (not a logo wall) grouped list: Frontend / Backend / AI / Infrastructure
10. Results/Value — "Technology is only useful when it creates value" + 3 concepts (Better Experience, Less Manual Work, Better Decisions)
11. Testimonials — placeholder component, explicitly labeled "Client testimonial coming soon," built so real ones drop in later
12. Contact — form (Name/Email/Company/Project type/Budget/Message), validated client+server side, loading/success/error states, "Prefer email? Contact me directly" fallback
13. Footer — brand, tagline, nav links, social links (empty until real URLs provided — component built, array empty for now), © year

## Project Data Model
`lib/projects.ts`, single typed array, so adding a project later means adding one object:
```ts
interface Project {
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
```

### Project 1 — TireOS (featured)
Concept/mockup showcase, not a shipped product — case study copy is framed honestly ("designed and prototyped a concept for...", not "shipped to N customers"). Polished static dashboard mockup UI (Revenue, Inventory, Appointments, Customers, Profit, AI insights panels) built as real Tailwind/React components rendering plausible static data, not a working backend. Full case study at `/work/tireos`: hero, overview, problem, solution, key features (AI assistant, dashboard, inventory, customer management, automation), technology, process, gallery, CTA.

### Project 2 — Immersive Business Website (Jszuss)
Real, live project — the Jszuss site already built (3D hero, GSAP parallax/tilt/scroll-reveals). Case study links to `https://jszuss.netlify.app`. Screenshots via the same `mshots` live-screenshot technique used in the Jszuss case study itself (real captures, not fabricated).

### Project 3 — AI Business Automation (coming soon)
`status: 'coming-soon'`. Card renders visibly muted/disabled (no case study link), short description only. Data model already supports it so flipping to `live` later is a one-field change plus a case study page.

## Contact Form
- Fields: Name, Email, Company, Project type (Website/Web Application/AI-Automation/SaaS/Other), Budget (Under $2k / $2k–5k / $5k–10k / $10k+ / Not sure yet), Message
- Client-side validation (Zod + react-hook-form) mirrored server-side in the server action
- States: idle → loading → success ("Thanks — your project details were received. I'll get back to you soon.") → error (generic, non-leaky message)
- Server action calls Resend; if `RESEND_API_KEY` is unset or the call fails, the action returns the error state gracefully — never throws an unhandled exception, never exposes the key or provider error details to the client

## Animation Rules
- Framer Motion throughout: scroll reveals, text reveals, hover states, project-image scale-on-hover, magnetic CTA buttons, subtle cursor effects (desktop only), animated dashboard elements in the TireOS mockup
- One shared `useReducedMotion` pattern (wrapping Framer Motion's own hook) — every animated component checks it and renders final state directly when reduced motion is preferred, established from the first animated component rather than retrofitted
- Animate only `transform`/`opacity` for scroll/hover choreography

## SEO
- Per-route metadata via Next.js Metadata API (dynamic titles/descriptions)
- `sitemap.ts`, `robots.ts`
- OG images generated per route via `ImageResponse`
- Semantic HTML, proper heading hierarchy, structured data (`Person`/`CreativeWork` JSON-LD) on relevant pages

## Accessibility & Performance
- Keyboard navigation and visible focus states throughout (no `outline-none` without a replacement)
- Semantic landmarks (`<main>`, `<nav>`, `<footer>`), ARIA only where semantic HTML isn't enough
- `next/image` for all images, lazy-loaded below the fold
- Code-split anything heavy (none of the current scope needs client-side 3D — the floating hero cards are CSS/Framer Motion, not WebGL)
- Contrast checked against the dark palette before shipping (lesson carried over from the Jszuss build, where this was caught only in final review)

## Placeholders (explicit, swap later)
- Portrait image — placeholder graphic, clearly a placeholder
- Testimonials — "Client testimonial coming soon" label, no fabricated quotes
- Social links — footer/nav component built, empty array (user said not ready yet)
- `RESEND_API_KEY` — user sets in their own `.env.local`, never committed or pasted in chat

## Non-goals
- No CMS backend (data model is a static TS array, not a database)
- No user accounts/auth
- No blog
- No real analytics dashboard beyond what Vercel Analytics provides out of the box
