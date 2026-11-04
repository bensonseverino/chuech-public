import Marquee from '../primitives/Marquee'
import { Reveal } from '../ui/Reveal'
import MediaFrame from '../primitives/MediaFrame'
import FloatPill from '../primitives/FloatPill'
import Button from '../primitives/Button'
import { MEDIA_PILL_SIZE } from '../primitives/mediaPillSize'
import { EXPERIENCE_PILL_SRCS } from '../../content/assets'
import type { HomeView } from '../../content/live/types'
import './ExperienceSection.css'

/**
 * "Decades of experience" section (experience spec, replaces §5.5 StatsBand
 * and §5.6 BriefCta).
 *
 * One floating-stage composition at every breakpoint: a giant scrolling
 * headline with two mint pills and three glowing frames floating around it,
 * plus the one-line CTA. The frame anchors scale with the viewport — mobile
 * and tablet anchors live in the `< 1024px` half of ExperienceSection.css,
 * the large-screen anchors (matching the approved reference) in the
 * `>= 1024px` half.
 */
export default function ExperienceSection({ stats }: { stats: HomeView['stats'] }) {
  const [pillOne, pillTwo] = stats.pills
  const [mediaOne, mediaTwo, mediaThree] = EXPERIENCE_PILL_SRCS
  const srText = `${stats.marquee[0] ?? ''}. ${stats.marquee[1] ?? ''}. ${pillOne}. ${pillTwo}.`

  return (
    <Reveal as="section" aria-label="Chuech Studio in focus" className="stats-section scroll-mt-24">
      <p className="sr-only">{srText}</p>

      <div className="stats-stage" aria-hidden="true">
        <div className="stats-marquee">
          <Marquee speed={100} bleed>
            <span className="stats-text">
              {stats.marquee[0]}
              <i className="stats-dot" />
            </span>
            <span className="stats-text">
              {stats.marquee[1]}
              <i className="stats-dot" />
            </span>
          </Marquee>
        </div>

        <MediaFrame
          className={`stats-float stats-m1 ${MEDIA_PILL_SIZE}`}
          radius="card md:media"
          src={mediaOne}
        />
        {/* On large screens the pills take the hero-footprint geometry
            (17px label, 3.3em tall, 1.77em side padding) so the stage reads
            like the reference: the sm size stays for phones and tablets. */}
        <FloatPill
          className="stats-float stats-p1 lg:px-[1.77em] lg:h-[3.3em] lg:text-[17px]"
          size="sm"
          variant="a"
        >
          {pillOne}
        </FloatPill>
        <MediaFrame
          className={`stats-float stats-m2 ${MEDIA_PILL_SIZE}`}
          radius="card md:media"
          src={mediaTwo}
        />
        <FloatPill
          className="stats-float stats-p2 lg:px-[1.77em] lg:h-[3.3em] lg:text-[17px]"
          size="sm"
          variant="b"
        >
          {pillTwo}
        </FloatPill>
        <MediaFrame
          className={`stats-float stats-m3 ${MEDIA_PILL_SIZE}`}
          radius="media"
          halo
          src={mediaThree}
        />
      </div>

      <div className="stats-cta px-4">
        <p className="font-semibold text-obsidian text-[16px] md:text-[17px]">
          {stats.cta.text}
        </p>
        <Button variant="mint" href={stats.cta.to}>
          {stats.cta.label}
        </Button>
      </div>
    </Reveal>
  )
}
