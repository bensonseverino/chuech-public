import HeroSection from '../components/HeroSection'
import ClientLogoStrip from '../components/ClientLogoStrip'
import IntroStatement from '../components/IntroStatement'
import LatestWork from '../components/sections/LatestWork'
import ServicesSection from '../components/sections/ServicesSection'
import ExperienceSection from '../components/sections/ExperienceSection'
import FaqSection from '../components/sections/FaqSection'
import { useSiteChrome, useHomeContent } from '../content/live/hooks'
import { useMetaDescription, usePageTitle } from '../hooks/usePageTitle'

/**
 * Home page assembly in the real live order (remaining-sections spec §4):
 * hero → logo strip → intro → latest work (with its testimonial slider) →
 * services → experience (giant marquee stage + brief CTA) →
 * FAQ (+ the founder block). The header/footer come from `RootLayout`.
 *
 * All copy, images and links come from `_home` and its collections; the
 * hard-coded modules render until the CMS request lands.
 */
export default function Home() {
  const view = useHomeContent()
  const { site } = useSiteChrome()

  usePageTitle(view.seo.title)
  useMetaDescription(view.seo.description)

  return (
    <>
      <HeroSection hero={view.hero} site={site} />
      <ClientLogoStrip clients={view.clients} />
      <IntroStatement
        text={view.introStatement.text}
        cta={view.introStatement.cta}
        dotAfterFirstMark
      />
      <LatestWork
        view={view.latestWork}
        projects={view.projects}
        testimonials={view.testimonials}
      />
      <ServicesSection heading={view.services.heading} services={view.servicesList} />
      <ExperienceSection stats={view.stats} />
      <FaqSection faq={view.faq} founder={view.founder} />
    </>
  )
}
