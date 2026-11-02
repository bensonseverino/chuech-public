import MediaPill from './MediaPill'
import FloatingPill from './FloatingPill'
import { MEDIA_PILL_SIZE } from './primitives/mediaPillSize'
import { HERO_PILL_SRCS } from '../content/assets'

/**
 * "Building Brands That Grow, Scale, & Lead" as controlled line rows (spec §8):
 *  - mobile 5 lines, md+ 4 lines ("That Grow," + "Scale," share a row)
 *  - media pills inline in the flow, mint pills absolutely positioned / duplicated
 *  - h1 carries an aria-label so the heading reads cleanly for assistive tech
 */
export default function HeroHeadline({
  pills,
}: {
  pills: [string, string]
}) {
  return (
    <h1
      aria-label="Building Brands That Grow, Scale, & Lead"
      className="relative mt-3 text-[clamp(40px,14.5vw,64px)] leading-[0.95] font-semibold tracking-tight text-obsidian md:mt-6 md:text-[clamp(52px,8.5vw,104px)] md:leading-[0.98] lg:text-[clamp(80px,8vw,128px)]"
    >
      {/* Line 1 — "Building" + revenue pill (top-right, never affects wrapping) */}
      <span className="relative block">
        <span className="block shrink-0 whitespace-nowrap">Building</span>
        <FloatingPill className="absolute top-0 right-0 inline-flex -translate-y-[68%]">
          {pills[0]}
        </FloatingPill>
      </span>

      {/* Line 2 — media 1 + "Brands" */}
      <span className="flex items-center gap-[0.16em]">
        <MediaPill
          src={HERO_PILL_SRCS[0]}
          asSlot={false}
          alt=""
          className={`shadow-glow-md ${MEDIA_PILL_SIZE}`}
          priority
        />
        <span className="shrink-0 whitespace-nowrap">Brands</span>
      </span>

      {/* Mobile lines 3–4 / desktop line 3 — "That Grow," / "Scale," + media 2 */}
      <span className="flex flex-col md:flex-row md:items-center md:gap-[0.18em]">
        <span className="shrink-0 whitespace-nowrap">That Grow,</span>
        <span className="flex items-center gap-[0.16em]">
          <span className="shrink-0 whitespace-nowrap">Scale,</span>
          <MediaPill
            src={HERO_PILL_SRCS[1]}
            asSlot={false}
            alt=""
            className={`shadow-glow-md ${MEDIA_PILL_SIZE}`}
          />
        </span>
      </span>

      {/* Mobile line 5 / desktop line 4 — "& Lead" + team pill (left on md+) */}
      <span className="flex items-center gap-[0.16em] md:gap-[0.18em]">
        <span className="hidden md:inline-flex">
          <FloatingPill>{pills[1]}</FloatingPill>
        </span>
        <span className="shrink-0 whitespace-nowrap">&amp; Lead</span>
        <span className="inline-flex md:hidden">
          <FloatingPill>{pills[1]}</FloatingPill>
        </span>
      </span>
    </h1>
  )
}
