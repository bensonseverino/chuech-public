import ExperienceSection from '@/components/sections/ExperienceSection'
import { about } from '@/data/about'
import { EXPERIENCE_PILL_SRCS } from '@/content/assets'
import type { HomeView } from '@/content/live/types'

/**
 * Stats marquee for About page (§4.6). Wraps the existing ExperienceSection
 * component with About-specific stats data from about.ts.
 * The ExperienceSection expects HomeView['stats'] shape; we adapt here.
 */
export default function StatsMarquee() {
  const { stats } = about

  // Adapt About stats to HomeView['stats'] shape. The section renders
  // `marquee[0]` and `marquee[1]` as separate giant texts, and About has one
  // phrase — the empty second slot renders nothing, so no duplicate reads back
  // to back inside the loop.
  const adaptedStats: HomeView['stats'] = {
    marquee: [stats.marqueeText],
    pills: [stats.pillA, stats.pillB],
    frames: [
      { src: EXPERIENCE_PILL_SRCS[0], alt: '', focus: undefined },
      { src: EXPERIENCE_PILL_SRCS[1], alt: '', focus: undefined },
      { src: EXPERIENCE_PILL_SRCS[2], alt: '', focus: undefined },
    ],
    cta: {
      text: stats.cta.text,
      label: stats.cta.label,
      to: stats.cta.href,
    },
  }

  return <ExperienceSection stats={adaptedStats} />
}