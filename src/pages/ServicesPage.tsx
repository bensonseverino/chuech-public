import PageHero from '../components/PageHero'
import ServicesSection from '../components/sections/ServicesSection'
import ClientLogoStrip from '../components/ClientLogoStrip'
import IntroStatement from '../components/IntroStatement'
import LatestWork from '../components/sections/LatestWork'
import ExperienceSection from '../components/sections/ExperienceSection'
import { asset } from '../content/assets'
import { useMetaDescription, usePageTitle } from '../hooks/usePageTitle'
import {
  SERVICES_HERO,
  SERVICES_HERO_CONTACT,
  PAGE_SERVICES,
  SERVICES_INTRO,
  SERVICES_WORK_INTRO,
} from '../content/services'

/** Same copy and bold phrases as the Home hero description (§4.1). */
function HeroDescription() {
  return (
    <>
      <strong className="font-semibold text-obsidian">
        We design and build purposeful websites
      </strong>{' '}
      that make brands{' '}
      <strong className="font-semibold text-obsidian">
        clearer, stronger, and easier to choose
      </strong>
      , backed by a team that cares about the details.
    </>
  )
}

/**
 * `/services` (services spec §1): a thin composition — PageHero, the services
 * rows (page variant), logo strip, intro statement (no CTA), latest work (with
 * the services intro) and the unchanged experience section. Header/footer come
 * from `RootLayout`.
 */
export default function ServicesPage() {
  usePageTitle('Services | Chuech Studio')
  useMetaDescription(
    'Explore branding, web design, SEO, PPC, and video services from Chuech Studio, a Nairobi-based digital partner.',
  )

  return (
    <>
      <PageHero
        label={SERVICES_HERO.label}
        title={SERVICES_HERO.title}
        pills={SERVICES_HERO.pills}
        image={{ src: asset(SERVICES_HERO.image) }}
        description={<HeroDescription />}
        contact={SERVICES_HERO_CONTACT}
      />
      <ServicesSection services={PAGE_SERVICES} showBadge={false} variant="page" />
      <ClientLogoStrip />
      <IntroStatement
        text={SERVICES_INTRO.text}
        highlights={[...SERVICES_INTRO.highlights]}
        cta={null}
      />
      <LatestWork intro={SERVICES_WORK_INTRO} />
      <ExperienceSection />
    </>
  )
}
