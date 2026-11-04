import { CONTACT_THUMB } from '../content/assets'
import type { SiteView } from '../content/live/types'

/**
 * Small rounded media thumbnail + email/phone stack (spec §9).
 * The thumb is one of the day's rotating GIFs beside the contact details; the
 * email and phone links remain the interactive elements (it is decorative).
 */
export default function ContactRow({ site }: { site: SiteView }) {
  return (
    <div className="flex min-w-0 items-center gap-3 md:justify-self-end">
      <span
        aria-hidden="true"
        className="rounded-media shadow-glow-md relative block h-12 w-20 shrink-0 overflow-hidden sm:h-14 sm:w-24 md:h-16 md:w-28"
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
      <p className="flex min-w-0 flex-col text-[13px] leading-snug sm:text-sm">
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
