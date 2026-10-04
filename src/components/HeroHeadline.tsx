import MediaPill from './MediaPill'
import FloatingPill from './FloatingPill'
import heroTeam from '../assets/marino/hero-team.svg'
import heroTerminal from '../assets/marino/hero-terminal.svg'

/* TODO(asset): hero-team.svg & hero-terminal.svg are temporary local placeholders —
   replace with the real photos/videos from the reference screenshots. */

/**
 * "Building Brands That Grow, Scale, & Lead" as controlled line rows (spec §8):
 *  - mobile 5 lines, md+ 4 lines ("That Grow," + "Scale," share a row)
 *  - media pills inline in the flow, mint pills absolutely positioned / duplicated
 *  - h1 carries an aria-label so the heading reads cleanly for assistive tech
 */
export default function HeroHeadline() {
  return (
    <h1
      aria-label="Building Brands That Grow, Scale, & Lead"
      className="relative mt-3 text-[clamp(40px,14.5vw,64px)] leading-[0.95] font-semibold tracking-tight text-obsidian md:mt-6 md:text-[clamp(52px,8.5vw,104px)] md:leading-[0.98] lg:text-[clamp(80px,8vw,128px)]"
    >
      {/* Line 1 — "Building" + revenue pill (top-right, never affects wrapping) */}
      <span className="relative block">
        <span className="block shrink-0 whitespace-nowrap">Building</span>
        <FloatingPill className="absolute top-0 right-0 inline-flex -translate-y-[68%]">
          £100m+ client revenue
        </FloatingPill>
      </span>

      {/* Line 2 — media 1 + "Brands" */}
      <span className="flex items-center gap-[0.16em]">
        <MediaPill
          src={heroTeam}
          className="shadow-glow-md w-[25vw] max-w-[180px] md:w-28 md:max-w-none md:aspect-[2/1] lg:w-32"
        />
        <span className="shrink-0 whitespace-nowrap">Brands</span>
      </span>

      {/* Mobile lines 3–4 / desktop line 3 — "That Grow," / "Scale," + media 2 */}
      <span className="flex flex-col md:flex-row md:items-center md:gap-[0.18em]">
        <span className="shrink-0 whitespace-nowrap">That Grow,</span>
        <span className="flex items-center gap-[0.16em]">
          <span className="shrink-0 whitespace-nowrap">Scale,</span>
          <MediaPill
            src={heroTerminal}
            className="shadow-glow-md w-[32vw] max-w-24 md:max-w-none md:w-36 md:aspect-[9/4]"
          />
        </span>
      </span>

      {/* Mobile line 5 / desktop line 4 — "& Lead" + team pill (left on md+) */}
      <span className="flex items-center gap-[0.16em] md:gap-[0.18em]">
        <FloatingPill className="hidden md:inline-flex">World class team</FloatingPill>
        <span className="shrink-0 whitespace-nowrap">&amp; Lead</span>
        <FloatingPill className="inline-flex md:hidden">World class team</FloatingPill>
      </span>
    </h1>
  )
}
