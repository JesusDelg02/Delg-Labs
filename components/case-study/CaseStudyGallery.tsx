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
