import Seo from '@/seo/Seo'
import JsonLd from '@/seo/JsonLd'
import { breadcrumbs } from '@/seo/structured-data'
import AboutHero from '@/components/AboutHero'
import MissionSection from '@/components/MissionSection'
import BuiltByCard from '@/components/BuiltByCard'
import ServicesCard from '@/components/ServicesCard'
import ResultsBlock from '@/components/ResultsBlock'
import StatsMarquee from '@/components/StatsMarquee'

/**
 * `/about` (about spec §1): hero → mission → built-by card + photo strip →
 * services card → results/work block → stats marquee. Header/footer, the
 * transition revealer and Lenis all come from `RootLayout`, as on every route.
 *
 * Copy and data live in `src/data/about.ts`; the work block reads the same
 * home-page content (CMS or fallback) as the home "Work" section.
 */
export default function AboutPage() {
  return (
    <>
      <Seo path="/about" />
      <JsonLd data={breadcrumbs('/about')!} />
      <AboutHero />
      <MissionSection />
      <BuiltByCard />
      <ServicesCard />
      <ResultsBlock />
      <StatsMarquee />
    </>
  )
}