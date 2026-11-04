import { CONTACT_THUMB } from '../content/assets'
import { MEDIA_PILL_SIZE } from './primitives/mediaPillSize'
import type { SiteView } from '../content/live/types'

/**
 * Rounded media thumbnail + email/phone stack (spec §9).
 * The thumb is one of the day's rotating GIFs beside the contact details; the
 * email and phone links remain the interactive elements (it is decorative).
 * It shares the one media-pill size (hero + experience + contact can never
 * drift apart) and now carries the same per-breakpoint scale.
 */
export default function ContactRow({ site }: { site: SiteView }) {
  return (
    <div className="flex min-w-0 items-center gap-[calc(var(--u)*1.1)] md:justify-self-end">
      <span
        aria-hidden="true"
        className={`rounded-media shadow-glow-md relative block shrink-0 overflow-hidden ${MEDIA_PILL_SIZE}`}
      >
        <img
          src={CONTACT_THUMB}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </span>
      <p className="flex min-w-0 flex-col text-sm leading-snug md:text-[15px]">
        <a
          href={site.email.href}
          className="font-semibold text-obsidian hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
        >
          {site.email.label}
        </a>
        <a
          href={site.phone.href}
          className="text-obsidian hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
        >
          {site.phone.label}
        </a>
      </p>
    </div>
  )
}
