import MediaPill from './MediaPill'
import FloatingPill from './FloatingPill'
import heroTeam from '../assets/marino/hero-team.svg'
import heroTerminal from '../assets/marino/hero-terminal.svg'
import contactThumb from '../assets/marino/contact-thumb.svg'

/* TODO(asset): the three media frames use the temporary local placeholders
   (hero-team / hero-terminal / contact-thumb). Swap in the real reference media. */

// Headline line metrics (change spec §2b): 6.73 units, pitch ≈ 1.0em.
const LINE = { fontSize: 'calc(var(--u)*6.732)', lineHeight: '1.0' } as const

const FRAME = { width: 'calc(var(--u)*9.07)' } as const

/**
 * Desktop (lg+) hero — change spec §2.
 *  1. Building Brands  [Media A]
 *  2.   [Media B]  That Grow, Scale,
 *  3. & Lead  <description beside> / <Media C under the description>
 * Contact details are a single right-aligned line at the bottom right.
 */
export default function HeroDesktop() {
  return (
    <div>
      <h1
        aria-label="Building Brands That Grow, Scale, & Lead"
        className="mt-[calc(var(--u)*1.7)] font-semibold tracking-[-0.0163em] text-obsidian"
      >
        {/* Line 1 — Building Brands + Media A (revenue pill on its corner) */}
        <span className="flex items-center gap-[calc(var(--u)*2)]">
          <span className="shrink-0 whitespace-nowrap" style={LINE}>
            Building Brands
          </span>
          <span className="relative inline-block shrink-0" style={{ width: 'calc(var(--u)*9.07)', zIndex: 10 }}>
            <MediaPill className="shadow-glow-md" src={heroTeam} style={FRAME} />
            <FloatingPill
              variant="b"
              className="absolute z-20 inline-flex"
              style={{
                left: 'calc(100% - var(--u)*1.6)',
                top: 'calc(100% - var(--u)*1.2)',
                width: 'calc(var(--u)*12.3)',
                height: 'calc(var(--u)*3.27)',
                minHeight: 'calc(var(--u)*3.27)',
                padding: 0,
                fontSize: 'calc(var(--u)*0.93)',
                justifyContent: 'center',
              }}
            >
              £100m+ client revenue
            </FloatingPill>
          </span>
        </span>

        {/* Line 2 — Media B (indented) + That Grow, Scale, (team pill on B) */}
        <span className="flex items-center gap-[calc(var(--u)*1.77)] pl-[calc(var(--u)*3.55)]">
          <span className="relative inline-block shrink-0" style={{ width: 'calc(var(--u)*9.07)', zIndex: 10 }}>
            <MediaPill className="shadow-glow-md" src={heroTerminal} style={FRAME} />
            <FloatingPill
              className="absolute z-20 inline-flex"
              style={{
                right: 'calc(100% - var(--u)*1.3)',
                top: '48%',
                width: 'calc(var(--u)*10.2)',
                height: 'calc(var(--u)*3.3)',
                minHeight: 'calc(var(--u)*3.3)',
                padding: 0,
                fontSize: 'calc(var(--u)*0.93)',
                justifyContent: 'center',
              }}
            >
              World class team
            </FloatingPill>
          </span>
          <span className="shrink-0 whitespace-nowrap" style={LINE}>
            That Grow, Scale,
          </span>
        </span>

        {/* Line 3 — & Lead + description.
            The description is an inline-block, so its *last line* baseline sits on
            the `& Lead` baseline (change spec §2d). Media C is taken out of flow and
            anchored to the description's left edge, hanging below it (§2c). */}
        <span className="block pb-[calc(var(--u)*6.93)]">
          <span className="inline-block align-baseline whitespace-nowrap" style={LINE}>
            &amp; Lead
          </span>
          <span
            className="relative ml-[calc(var(--u)*1.73)] inline-block align-baseline"
            style={{ maxWidth: 'calc(var(--u)*27.5)' }}
          >
            <span className="block text-[calc(var(--u)*0.9)] leading-[1.3] text-obsidian">
              <strong className="font-semibold text-obsidian">Manchester-born, globally trusted</strong>{' '}
              &ndash; we&rsquo;ve generated{' '}
              <strong className="font-semibold text-obsidian">£100M+ in client revenue</strong> and
              manage £250K in monthly ad spend, backed by a{' '}
              <strong className="font-semibold text-obsidian">world-class</strong> team built to
              improve the bottom line.
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-[calc(100%+var(--u)*1.85)] left-0 inline-block"
              style={{ width: 'calc(var(--u)*9.07)' }}
            >
              {/* Large soft, fully-feathered halo behind Media C (§2g). */}
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 'calc(var(--u)*17)',
                  height: 'calc(var(--u)*17)',
                  background:
                    'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 22%, transparent) 0%, color-mix(in srgb, var(--color-primary) 0%, transparent) 70%)',
                }}
              />
              <MediaPill className="shadow-glow-lg relative z-10" src={contactThumb} style={FRAME} />
            </span>
          </span>
        </span>
      </h1>

      {/* Contact details — one right-aligned line, bottom right of the hero. */}
      <div className="flex justify-end">
        <p className="flex items-baseline gap-[calc(var(--u)*0.65)] text-[calc(var(--u)*0.85)]">
          <a
            href="mailto:hello@marino.co.uk"
            className="font-semibold text-obsidian hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
          >
            hello@marino.co.uk
          </a>
          <a
            href="tel:01616606263"
            className="text-obsidian hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
          >
            0161 660 6263
          </a>
        </p>
      </div>
    </div>
  )
}
