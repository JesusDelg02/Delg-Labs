import Image from 'next/image'

export function AIAutomationMockup() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-border">
        <Image
          src="/projects/ai-automation-workflow.svg"
          alt="AI automation workflow concept: new lead trigger, AI qualification step, and branching follow-up actions"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1024px"
        />
      </div>
    </div>
  )
}
