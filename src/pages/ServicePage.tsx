import ServiceHero from '../components/sections/ServiceHero'
import FeaturePanel from '../components/sections/FeaturePanel'
import ProjectCarousel from '../components/sections/ProjectCarousel'
import PillarsPanel from '../components/sections/PillarsPanel'
import CallbackPanel from '../components/sections/CallbackPanel'
import ExperienceSection from '../components/sections/ExperienceSection'
import FaqSection from '../components/sections/FaqSection'
import { useServicePage } from '../content/live/hooks'
import Seo from '../seo/Seo'
import JsonLd from '../seo/JsonLd'
import { service, breadcrumbs } from '../seo/structured-data'
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

  // Re-measure ScrollTriggers when the CMS payload replaces the fallback.
  useScrollRefresh(page)

  const { tag, slugs, limit } = page.projects
  // `projects` are the published CMS works. Their tags come from the categories
  // chosen in the CMS, so a service page only shows work in its own category.
  const filtered = slugs
    ? slugs.flatMap((entry) => projects.filter((project) => project.slug === entry))
    : projects.filter((project) => project.tags.includes(tag))
  // No fallback to the full list: on a Branding page, unrelated published work
  // must not appear just because nothing was tagged for that service.
  const carousel = filtered.slice(0, limit)

  return (
    <>
      <Seo path={`/${slug}`} />
      <JsonLd
        data={[service(`/${slug}`), breadcrumbs(`/${slug}`)].filter(
          (node): node is NonNullable<typeof node> => node !== null,
        )}
      />
      <ServiceHero hero={page.hero} />
      <FeaturePanel feature={page.feature} />
      {carousel.length > 0 ? (
        <ProjectCarousel
          heading={page.projects.heading}
          viewAll={page.projects.viewAll}
          projects={carousel}
          regionLabel={page.projects.regionLabel}
        />
      ) : null}
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
        jsonLd
      />
    </>
  )
}
