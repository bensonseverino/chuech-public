import PageHero from '../components/PageHero'
import ServicesSection from '../components/sections/ServicesSection'
import ClientLogoStrip from '../components/ClientLogoStrip'
import IntroStatement from '../components/IntroStatement'
import LatestWork from '../components/sections/LatestWork'
import ExperienceSection from '../components/sections/ExperienceSection'
import Inline from '../content/live/inline'
import { useServicesContent, useSiteChrome } from '../content/live/hooks'
import { useMetaDescription, usePageTitle } from '../hooks/usePageTitle'

/**
 * `/services` (services spec §1): a thin composition — PageHero, the services
 * rows (page variant), logo strip, intro statement (no CTA), latest work (with
 * the services intro) and the unchanged experience section. Header/footer come
 * from `RootLayout`.
 *
 * `_services` supplies the hero, intro and latest-work intro; the rows and the
 * shared bands come from their collections/documents.
 */
export default function ServicesPage() {
  const view = useServicesContent()
  const { site } = useSiteChrome()

  usePageTitle(view.seo.title)
  useMetaDescription(view.seo.description)

  return (
    <>
      <PageHero
        label={view.hero.label}
        title={view.hero.title}
        pills={view.hero.pills}
        image={{ src: view.hero.image.src, alt: view.hero.image.alt }}
        description={<Inline text={view.hero.description} reveal="load" />}
        contact={{ email: site.email, phone: site.phone }}
      />
      <ServicesSection
        heading={view.hero.label}
        services={view.services}
        showBadge={false}
        variant="page"
      />
      <ClientLogoStrip clients={view.clients} />
      <IntroStatement text={view.introStatement.text} cta={null} />
      <LatestWork
        view={view.latestWork}
        intro={view.latestWorkIntro}
        projects={view.projects}
        testimonials={view.testimonials}
      />
      <ExperienceSection stats={view.stats} />
    </>
  )
}
