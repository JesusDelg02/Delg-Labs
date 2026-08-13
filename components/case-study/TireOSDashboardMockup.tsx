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
