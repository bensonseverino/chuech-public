/* TODO(asset): logos are styled text wordmarks as a fallback — replace with the
   real logo SVGs (emap, WR Partners, Hard Rock Cafe, ISTOBAL, LEONARDO Hotels,
   HITACHI, Haines Watts, VISLINK, Applied Nutrition). */

import Marquee from './primitives/Marquee'

/* Marquee order as seen in the reference (change spec §4). `size` is a
   multiplier of `--u`; the max() floor in the span keeps the wordmarks
   legible below lg, where the unit (min(1vw, 18.27px)) would shrink them
   to ~6–13px. */
const MARQUEE_LOGOS: { name: string; className: string; size: number }[] = [
  { name: 'emap', className: 'font-bold tracking-[0.15em]', size: 2.2 },
  { name: 'WR Partners', className: 'font-semibold tracking-wide', size: 1.7 },
  { name: 'Hard Rock Cafe', className: 'font-extrabold tracking-tight', size: 1.9 },
  { name: 'ISTOBAL', className: 'font-bold tracking-[0.25em]', size: 2.6 },
  { name: 'LEONARDO Hotels', className: 'font-medium tracking-[0.15em]', size: 1.8 },
  { name: 'HITACHI', className: 'font-bold tracking-[0.05em]', size: 2.9 },
  { name: 'Haines Watts', className: 'font-semibold tracking-wide', size: 1.9 },
  { name: 'VISLINK', className: 'font-bold tracking-[0.1em]', size: 2.4 },
  { name: 'AP NUT', className: 'font-extrabold tracking-tight', size: 3.4 },
]

/**
 * White logo strip on a hairline top border — one seamless looping marquee at
 * every breakpoint. Below lg the type floors at 12px and the gaps tighten;
 * lg+ keeps the exact unit geometry from the reference (change spec §4).
 */
export default function ClientLogoStrip() {
  return (
    <section
      aria-label="Clients"
      className="mt-4 border-t border-silver bg-white md:mt-6 lg:mt-0"
      style={{ paddingBlock: 'max(16px, calc(var(--u)*2.6))' }}
    >
      <Marquee seconds={40}>
        {/* The padding-right on the list is what makes the duplicated track
            wrap seamlessly (the Marquee `gap` prop would not be responsive). */}
        <ul className="flex items-center gap-8 pr-8 sm:gap-10 sm:pr-10 lg:gap-[calc(var(--u)*15.5)] lg:pr-[calc(var(--u)*15.5)]">
          {MARQUEE_LOGOS.map((logo) => (
            <li key={logo.name} className="shrink-0">
              <span
                className={`whitespace-nowrap text-obsidian uppercase ${logo.className}`}
                style={{ fontSize: `max(12px, calc(var(--u)*${logo.size}))` }}
              >
                {logo.name}
              </span>
            </li>
          ))}
        </ul>
      </Marquee>
    </section>
  )
}
