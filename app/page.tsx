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
