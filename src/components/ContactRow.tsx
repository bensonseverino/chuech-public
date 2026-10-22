import contactThumb from '../assets/marino/contact-thumb.svg'
import { PlayIcon } from './icons'

/* TODO(asset): contact-thumb.svg is a temporary local placeholder —
   replace with the real showreel thumbnail (or a <video poster>) from the screenshots. */

/**
 * Small rounded video thumbnail + email/phone stack (spec §9).
 * Email is mailto:, phone is tel:+254117954929.
 */
export default function ContactRow() {
  return (
    <div className="flex min-w-0 items-center gap-3 md:justify-self-end">
      <a
        href="mailto:hello@chuechstudio.co.ke"
        aria-label="Play the Chuech Studio showreel"
        className="rounded-media shadow-glow-md relative block h-12 w-20 shrink-0 overflow-hidden sm:h-14 sm:w-24 md:h-16 md:w-28"
      >
        <img
          src={contactThumb}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <PlayIcon className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-white/90 md:h-7 md:w-7" />
      </a>
      <p className="flex min-w-0 flex-col text-[13px] leading-snug sm:text-sm">
        <a
          href="mailto:hello@chuechstudio.co.ke"
          className="font-semibold text-obsidian hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
        >
          hello@chuechstudio.co.ke
        </a>
        <a
          href="tel:+254117954929"
          className="text-obsidian hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
        >
          +254 117 954 929
        </a>
      </p>
    </div>
  )
}
