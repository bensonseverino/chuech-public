import { PlayIcon } from './icons'
import { imageSrc } from '../content/assets'
import type { SiteView } from '../content/live/types'

/**
 * Small rounded video thumbnail + email/phone stack (spec §9).
 * The showreel thumb is the third Home hero frame; the contact details come
 * from the site settings document.
 */
export default function ContactRow({ site, thumb }: { site: SiteView; thumb: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 md:justify-self-end">
      <a
        href={site.email.href}
        aria-label={`Play the ${site.companyName} showreel`}
        className="rounded-media shadow-glow-md relative block h-12 w-20 shrink-0 overflow-hidden sm:h-14 sm:w-24 md:h-16 md:w-28"
      >
        <img
          src={imageSrc(thumb)}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <PlayIcon className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white/90 md:h-7 md:w-7" />
      </a>
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
