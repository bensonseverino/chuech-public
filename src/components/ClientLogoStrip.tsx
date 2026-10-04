/* TODO(asset): logos are styled text wordmarks as a fallback — replace with the
   real logo SVGs (emap, WR Partners, Hard Rock Cafe, ISTOBAL, LEONARDO Hotels,
   HITACHI, Haines Watts, VISLINK, Applied Nutrition). */

import Marquee from './primitives/Marquee'

type ClientLogo = {
  name: string
  mobile: boolean
  className: string
}

const LOGOS: ClientLogo[] = [
  { name: 'Applied Nutrition', mobile: false, className: 'font-extrabold tracking-tight' },
  { name: 'EMAP', mobile: false, className: 'font-black tracking-[0.3em]' },
  { name: 'WR Partners', mobile: true, className: 'font-semibold tracking-wide' },
  { name: 'Hard Rock Cafe', mobile: true, className: 'font-extrabold tracking-tight' },
  { name: 'Istobal', mobile: true, className: 'font-bold tracking-[0.25em]' },
  { name: 'Leonardo Hotels', mobile: false, className: 'font-medium tracking-[0.15em]' },
  { name: 'Hitachi', mobile: false, className: 'font-bold tracking-tight' },
]

/* Marquee order as seen in the reference (change spec §4). Size is a
   multiplier of `--u` so logo heights vary roughly 1.6–3.6 units. */
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

const MARQUEE_GAP = 'calc(var(--u)*15.5)'

/**
 * White logo strip on a hairline top border.
 *  - below lg: unchanged 3-logos / scrollable row (spec §10)
 *  - lg+: the shared Marquee primitive (dark logos, full opacity, 40s)
 */
export default function ClientLogoStrip() {
  return (
    <>
      {/* --- below lg: unchanged --- */}
      <section aria-label="Clients" className="mt-4 border-t border-silver bg-white md:mt-6 lg:hidden">
        <div className="no-scrollbar overflow-x-auto">
          <ul className="mx-auto flex min-w-full w-max max-w-[1440px] items-center justify-between gap-2 px-3 py-4 sm:gap-6 sm:px-4 md:px-8 md:py-6">
            {LOGOS.map(({ name, mobile, className }) => (
              <li key={name} className={mobile ? 'shrink-0' : 'hidden shrink-0 sm:block'}>
                <span
                  className={`text-[clamp(8px,3vw,13px)] whitespace-nowrap text-obsidian uppercase sm:text-sm md:text-base ${className}`}
                >
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- lg+: seamless dark marquee (shared primitive) --- */}
      <section
        aria-label="Clients"
        className="hidden border-t border-silver bg-white lg:block"
        style={{ paddingBlock: 'calc(var(--u)*2.6)' }}
      >
        <Marquee seconds={40} gap={MARQUEE_GAP}>
          <ul className="flex items-center" style={{ gap: MARQUEE_GAP }}>
            {MARQUEE_LOGOS.map((logo) => (
              <li key={logo.name} className="shrink-0">
                <span
                  className={`whitespace-nowrap text-obsidian uppercase ${logo.className}`}
                  style={{ fontSize: `calc(var(--u)*${logo.size})` }}
                >
                  {logo.name}
                </span>
              </li>
            ))}
          </ul>
        </Marquee>
      </section>
    </>
  )
}
