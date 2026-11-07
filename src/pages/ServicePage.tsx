import ServiceHero from '../components/sections/ServiceHero'
import FeaturePanel from '../components/sections/FeaturePanel'
import ProjectCarousel from '../components/sections/ProjectCarousel'
import PillarsPanel from '../components/sections/PillarsPanel'
import CallbackPanel from '../components/sections/CallbackPanel'
import ExperienceSection from '../components/sections/ExperienceSection'
import FaqSection from '../components/sections/FaqSection'
import { useServicePage } from '../content/live/hooks'
import { useMetaDescription, usePageTitle } from '../hooks/usePageTitle'
import { useScrollRefresh } from '../hooks/useScrollRefresh'

/**
 * Service sub-page template (web-design spec §1). It owns the section order
 * and the vertical rhythm only — every block reads its copy and assets from the
 * CMS service-page document (`/api/public/pages/:slug`), with the typed local
 * module as the fallback.
 *
 * The dark "What's happening?" article carousel is deliberately absent (spec
 * §1 / §5.9): the FAQ runs straight into the footer.
 */
export default function ServicePage({ slug }: { slug: string }) {
  const { page, projects, stats, testimonials } = useServicePage(slug)

  usePageTitle(page.seo.title)
  useMetaDescription(page.seo.description)
  // Re-measure ScrollTriggers when the CMS payload replaces the fallback.
  useScrollRefresh(page)

  const { tag, slugs, limit } = page.projects
  const filtered =
    slugs
      ? slugs.flatMap((entry) => projects.filter((project) => project.slug === entry))
      : projects.filter((project) => project.tags.includes(tag))
  /* Falls back to the shared order when nothing carries the tag
     (ppc spec §3.3); every existing slug already matches, so this is inert
     for the earlier pages. */
  const carousel = (filtered.length > 0 ? filtered : projects).slice(0, limit)

  return (
    <>
      <ServiceHero hero={page.hero} />
      <FeaturePanel feature={page.feature} />
      <ProjectCarousel
        heading={page.projects.heading}
        viewAll={page.projects.viewAll}
        projects={carousel}
        regionLabel={page.projects.regionLabel}
      />
      <PillarsPanel pillars={page.pillars} />
      <CallbackPanel why={page.why} testimonials={testimonials} />
      <ExperienceSection stats={stats} />
      {/* PPC spec §3.7/§11: PPC allows several FAQs open at once and emits
          FAQPage JSON-LD; the earlier pages keep their single-open look and
          stay untouched. */}
      <FaqSection
        faq={page.faq}
        align="end"
        icon="arrow"
        showFounder={false}
        bottomSpace="80px"
        multiple={slug === 'ppc'}
        jsonLd={slug === 'ppc'}
      />
    </>
  )
}
