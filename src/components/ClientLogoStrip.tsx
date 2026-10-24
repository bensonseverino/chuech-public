import Marquee from './primitives/Marquee'
import type { ClientView } from '../content/live/types'

/*
 * Marquee order and wordmark styling from the reference (change spec §4).
 * `size` is a multiplier of `--u`; the max() floor keeps wordmarks legible
 * below lg. CMS clients arrive with a resolved logo URL; a client without one
 * still renders as the styled wordmark, which is the local fallback.
 */
const WORDMARK_STYLES: Record<string, { className: string; size: number }> = {
  emap: { className: 'font-bold tracking-[0.15em]', size: 2.2 },
  'WR Partners': { className: 'font-semibold tracking-wide', size: 1.7 },
  'Hard Rock Cafe': { className: 'font-extrabold tracking-tight', size: 1.9 },
  ISTOBAL: { className: 'font-bold tracking-[0.25em]', size: 2.6 },
  'LEONARDO Hotels': { className: 'font-medium tracking-[0.15em]', size: 1.8 },
  HITACHI: { className: 'font-bold tracking-[0.05em]', size: 2.9 },
  'Haines Watts': { className: 'font-semibold tracking-wide', size: 1.9 },
  VISLINK: { className: 'font-bold tracking-[0.1em]', size: 2.4 },
  'AP NUT': { className: 'font-extrabold tracking-tight', size: 3.4 },
}

/**
 * White logo strip on a hairline top border — one seamless looping marquee at
 * every breakpoint. Below lg the type floors at 12px and the gaps tighten;
 * lg+ keeps the exact unit geometry from the reference (change spec §4).
 */
export default function ClientLogoStrip({ clients }: { clients: ClientView[] }) {
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
          {clients.map((client) => {
            const wordmark = WORDMARK_STYLES[client.name] ?? {
              className: 'font-semibold tracking-wide',
              size: 2,
            }

            return (
              <li key={client.name} className="shrink-0">
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.name}
                    loading="lazy"
                    decoding="async"
                    className="h-[max(20px,calc(var(--u)*2.2))] w-auto max-w-none"
                  />
                ) : (
                  <span
                    className={`whitespace-nowrap text-obsidian uppercase ${wordmark.className}`}
                    style={{ fontSize: `max(12px, calc(var(--u)*${wordmark.size}))` }}
                  >
                    {client.name}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </Marquee>
    </section>
  )
}
