import { usePageTitle, useMetaDescription } from '@/hooks/usePageTitle'
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
  usePageTitle('About | Chuech studio')
  useMetaDescription(
    'Learn about Chuech studio — who we are, what we do, and how we help brands grow.',
  )

  return (
    <>
      <AboutHero />
      <MissionSection />
      <BuiltByCard />
      <ServicesCard />
      <ResultsBlock />
      <StatsMarquee />
    </>
  )
}