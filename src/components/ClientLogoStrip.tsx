import Marquee from './primitives/Marquee'
import { Reveal } from './ui/Reveal'
import type { ClientView } from '../content/live/types'

/*
 * Marquee order from the reference (change spec §4). Local clients arrive with
 * resolved logo URLs (square lockups with the brand name inside the mark) and
 * render as images; a client without a logo still renders as the styled
 * wordmark, which is the CMS fallback.
 */

/**
 * White logo strip on a hairline top border — one seamless looping marquee at
 * every breakpoint. Below lg the type floors at 12px and the gaps tighten;
 * lg+ keeps the exact unit geometry from the reference (change spec §4).
 */
export default function ClientLogoStrip({ clients }: { clients: ClientView[] }) {
  return (
    <Reveal
      as="section"
      aria-label="Clients"
      className="mt-4 md:mt-6 lg:mt-0"
      style={{ paddingBlock: 'max(16px, calc(var(--u)*2.6))' }}
    >
      <Marquee seconds={40}>
        {/* The padding-right on the list is what makes the duplicated track
            wrap seamlessly (the Marquee `gap` prop would not be responsive). */}
        <ul className="flex items-center gap-8 pr-8 sm:gap-10 sm:pr-10 lg:gap-[calc(var(--u)*15.5)] lg:pr-[calc(var(--u)*15.5)]">
          {clients.map((client) => (
            <li key={client.name} className="shrink-0">
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  decoding="async"
                  className="h-[80px] w-auto max-w-none"
                />
              ) : (
                <span
                  className="whitespace-nowrap text-obsidian uppercase font-semibold tracking-wide"
                  style={{ fontSize: `max(12px, calc(var(--u)*2))` }}
                >
                  {client.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </Marquee>
    </Reveal>
  )
}
