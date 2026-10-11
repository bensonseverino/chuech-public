import ServiceHero from '../components/sections/ServiceHero'
import FeaturePanel from '../components/sections/FeaturePanel'
import ProjectCarousel from '../components/sections/ProjectCarousel'
import PillarsPanel from '../components/sections/PillarsPanel'
import CallbackPanel from '../components/sections/CallbackPanel'
import ExperienceSection from '../components/sections/ExperienceSection'
import FaqSection from '../components/sections/FaqSection'
import { PROJECTS } from '../content/projects'
import { useMetaDescription, usePageTitle } from '../hooks/usePageTitle'
import type { ServicePageContent } from '../content/services/web-design'

/**
 * Service sub-page template (web-design spec §1). It owns the section order
 * and the vertical rhythm only — every block reads its copy and assets from the
 * typed content object, so Branding, SEO, PPC and Video can reuse it later.
 *
 * The dark "What's happening?" article carousel is deliberately absent (spec
 * §1 / §5.9): the FAQ runs straight into the footer.
 */
export default function ServicePage({ content }: { content: ServicePageContent }) {
  usePageTitle(content.seo.title)
  useMetaDescription(content.seo.description)

  const { tag, slugs, limit } = content.projects
  const projects = (
    slugs
      ? slugs.flatMap((slug) => PROJECTS.filter((project) => project.slug === slug))
      : PROJECTS.filter((project) => project.tags.includes(tag))
  ).slice(0, limit)

  return (
    <>
      <ServiceHero hero={content.hero} />
      <FeaturePanel feature={content.feature} />
      <ProjectCarousel
        heading={content.projects.heading}
        viewAll={content.projects.viewAll}
        projects={projects}
        regionLabel={content.projects.regionLabel}
      />
      <PillarsPanel pillars={content.pillars} />
      <CallbackPanel why={content.why} />
      <ExperienceSection />
      <FaqSection
        heading={content.faq.heading}
        align="end"
        icon="arrow"
        items={content.faq.items}
        intro={null}
        showFounder={false}
        bottomSpace="80px"
      />
    </>
  )
}
