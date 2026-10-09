import HeroSection from '../components/HeroSection'
import ClientLogoStrip from '../components/ClientLogoStrip'
import IntroStatement from '../components/IntroStatement'
import LatestWork from '../components/sections/LatestWork'
import ServicesSection from '../components/sections/ServicesSection'
import ExperienceSection from '../components/sections/ExperienceSection'
import FaqSection from '../components/sections/FaqSection'
import { usePageTitle } from '../hooks/usePageTitle'

/**
 * Home page assembly in the real live order (remaining-sections spec §4):
 * hero → logo strip → intro → latest work (with its testimonial slider) →
 * services → experience (giant marquee stage + brief CTA) →
 * FAQ. The header/footer and the page wrapper now live in `RootLayout`
 * (services spec §3.1) so every route shares them.
 */
export default function Home() {
  usePageTitle('Marino | Web Design Agency Manchester')

  return (
    <>
      <HeroSection />
      <ClientLogoStrip />
      <IntroStatement />
      <LatestWork />
      <ServicesSection />
      <ExperienceSection />
      <FaqSection />
    </>
  )
}
