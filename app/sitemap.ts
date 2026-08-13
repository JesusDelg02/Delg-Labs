import type { MetadataRoute } from 'next'
import { projects } from '@/lib/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://delglabs.com'
  const projectRoutes = projects
    .filter((p) => p.hasCaseStudy)
    .map((p) => ({
      url: `${base}/work/${p.slug}`,
      lastModified: new Date(),
    }))

  return [{ url: base, lastModified: new Date() }, ...projectRoutes]
}
