import SiteHeader from '../components/SiteHeader'
import HeroSection from '../components/HeroSection'
import ClientLogoStrip from '../components/ClientLogoStrip'
import IntroStatement from '../components/IntroStatement'
import LatestWork from '../components/sections/LatestWork'
import ServicesSection from '../components/sections/ServicesSection'
import ExperienceSection from '../components/sections/ExperienceSection'
import Insights from '../components/sections/Insights'
import CaseStudy from '../components/sections/CaseStudy'
import FaqSection from '../components/sections/FaqSection'
import SiteFooter from '../components/sections/SiteFooter'

/**
 * Page assembly in the real live order (remaining-sections spec §4):
 * hero → logo strip → intro → latest work (with its testimonial slider) →
 * services → experience (giant marquee stage + brief CTA) → insights →
 * case study → FAQ → footer.
 */
export default function Home() {
  return (
    <div className="min-h-svh bg-fog font-sans text-obsidian antialiased" style={{ overflowX: 'clip' }}>
      <SiteHeader />
      <main>
        <HeroSection />
        <ClientLogoStrip />
        <IntroStatement />
        <LatestWork />
        <ServicesSection />
        <ExperienceSection />
        <Insights />
        <CaseStudy />
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  )
}
