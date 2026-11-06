import { Reveal } from './ui/Reveal'
import Container from './primitives/Container'
import LongArrowLink from './primitives/LongArrowLink'
import MediaFrame from './primitives/MediaFrame'
import { imageSrc } from '../content/assets'
import { about, ABOUT_IMAGES } from '../data/about'

/**
 * Mission section (about spec §4.2): two columns at md+ — text left (~35%),
 * large rounded image right (~55%, 16:10). The text column is dot-heading, body,
 * then the "Contact ⟶" arrow link. Mobile stacks heading, body, link, image.
 */
export default function MissionSection() {
  const { mission } = about

  return (
    <Reveal
      as="section"
      aria-label={mission.heading}
      className="scroll-mt-24 py-[var(--space-50)] md:py-[var(--space-80)] lg:py-[var(--space-100)]"
      stagger={0.1}
    >
      <Container>
        <div className="grid gap-[40px] md:grid-cols-[35fr_55fr] md:items-start lg:gap-[calc(var(--u)*5)]">
          {/* Text column */}
          <div className="flex flex-col gap-[25px] md:pt-[20px] lg:pt-[calc(var(--u)*1.5)]">
            <div className="flex items-start gap-[14px]">
              {/* Dot bullet (~0.9rem, spec §4.2) */}
              <span
                aria-hidden="true"
                className="mt-[4px] h-[14px] w-[14px] shrink-0 rounded-full bg-obsidian"
              />
              <h2 className="min-w-0 text-[clamp(24px,3.5vw,33px)] leading-[1.15] font-medium tracking-[-0.02em] text-obsidian">
                {mission.heading}
              </h2>
            </div>
            <p className="ml-[28px] text-[16px] leading-[1.6] text-obsidian md:text-[18px]">
              {mission.body}
            </p>
            <div className="ml-[16px]">
              <LongArrowLink
                href={mission.linkHref}
                tone="light"
                thin
                gapClassName="gap-[10px]"
                arrowClassName="w-[34px] md:w-[46px] lg:w-[34px]"
              >
                {mission.linkLabel}
              </LongArrowLink>
            </div>
          </div>

          {/* Image column: ~16:10, large radius (spec §4.2). */}
          <div className="relative w-full">
            <MediaFrame
              src={imageSrc(ABOUT_IMAGES.mission.src)}
              alt={ABOUT_IMAGES.mission.alt}
              radius="media"
              className="w-full"
              style={{ aspectRatio: '16 / 10' }}
            />
          </div>
        </div>
      </Container>
    </Reveal>
  )
}