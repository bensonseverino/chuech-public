import { useState } from 'react'
import { contact } from '@/data/contact'

/**
 * Full-bleed Google Maps embed (contact spec §5). The iframe needs no API key:
 * the `output=embed` endpoint renders the pin, place card and Google
 * attribution natively. A warm-grey canvas with a small spinner card covers the
 * initial load and fades out as soon as the iframe reports `load`, so the dark
 * page never flashes white.
 */
export default function ContactMap() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative h-[561px] w-full overflow-hidden bg-map-loading sm:h-[422px] lg:h-[433px]">
      <iframe
        title="Chuech studio location"
        src={`https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`}
        width="100%"
        height="100%"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-4 left-4 flex h-[88px] w-[240px] items-center justify-center rounded-card bg-white shadow-float transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <svg
          className="h-5 w-5 animate-spin text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            strokeOpacity="0.25"
          />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
