import { useEffect, useRef, useState } from 'react'
import Button from '../components/primitives/Button'
import GooglyEyes from '../components/not-found/GooglyEyes'
import { eyesConfig } from '../components/not-found/eyes.config'
import { ROUTES } from '../routes'
import { gsap, useGSAP, EASE } from '../lib/motion'
import { useEyeTracking } from '../hooks/useEyeTracking'
import { usePageTitle } from '../hooks/usePageTitle'

/**
 * The not-found hero itself — two googly eyes, the "404, Page Not Found."
 * heading, and the home pill button. Exported separately so dynamic routes
 * (e.g. a CMS-fed `/work/:slug` with no matching project) can render the
 * same view in-page without changing the URL (404 spec §1). SEO (title +
 * `noindex`) stays with `NotFoundPage`.
 */
export function NotFoundView() {
  const rootRef = useRef<HTMLElement>(null)
  const eyesRef = useRef<HTMLDivElement>(null)
  const pupilFirst = useRef<HTMLSpanElement>(null)
  const pupilSecond = useRef<HTMLSpanElement>(null)
  const buttonRef = useRef<HTMLSpanElement>(null)

  /* Tracking starts only after the entrance finishes (404 spec §4.6). */
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  /* Under reduced motion there is no entrance to wait for. */
  const [trackingReady, setTrackingReady] = useState(reducedMotion)

  /*
   * Entrance (404 spec §4.6): eyes pop in with a subtle scale + fade, the
   * right eye ~0.08s behind the left; heading and button use the site's
   * existing fade + rise with a light stagger. Under reduced motion nothing
   * runs — everything is simply present.
   */
  useGSAP(
    () => {
      if (reducedMotion) {
        return
      }
      const eyes = eyesRef.current?.querySelectorAll('[data-eye]')
      const tl = gsap.timeline({ onComplete: () => setTrackingReady(true) })
      if (eyes?.length === 2) {
        tl.from(eyes[0], {
          scale: eyesConfig.entrance.fromScale,
          opacity: 0,
          duration: eyesConfig.entrance.duration,
          ease: EASE.out,
          transformOrigin: 'center',
        }, 0)
        tl.from(eyes[1], {
          scale: eyesConfig.entrance.fromScale,
          opacity: 0,
          duration: eyesConfig.entrance.duration,
          ease: EASE.out,
          transformOrigin: 'center',
        }, eyesConfig.entrance.rightDelay)
      }
      tl.from('[data-notfound-block]', {
        y: eyesConfig.heroLoad.rise,
        opacity: 0,
        duration: eyesConfig.heroLoad.duration,
        ease: EASE.out,
        stagger: eyesConfig.heroLoad.stagger,
      }, 0)
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  useEyeTracking({ eyesRef, pupilRefs: [pupilFirst, pupilSecond], buttonRef, enabled: trackingReady, reducedMotion })

  return (
    <section ref={rootRef} className="not-found flex flex-col items-center pb-[3.5rem] pt-[8.5rem] sm:min-h-[100svh] sm:justify-center sm:pb-[8rem] sm:pt-0">
      <GooglyEyes eyesRef={eyesRef} pupilRefs={[pupilFirst, pupilSecond]} />

      {/*
        One <h1> (404 spec §5): weight/tracking via the `.not-found h1`
        styles in `GooglyEyes.css`, balancing allowed on mobile with
        text-wrap: balance.
      */}
      <h1 data-notfound-block className="mt-[2.5rem] text-center text-[var(--color-obsidian)] text-balance sm:mt-[4rem]">
        404, Page Not Found.
      </h1>
      {/* Screen-reader context, visually hidden (404 spec §5). */}
      <p className="sr-only">The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.</p>

      {/* Home pill button (obsidian bg, mint on hover) — transition-aware. */}
      <span ref={buttonRef} data-notfound-block className="mt-[2rem] inline-flex sm:mt-[2.5rem]">
        <Button
          variant="dark"
          to={ROUTES.home}
          className="w-[13.5rem] sm:w-[14rem] sm:h-[3.2rem] lg:h-[3.4rem]"
          style={{ fontSize: '1rem' }}
        >
          Please Take Me Home
        </Button>
      </span>
    </section>
  )
}

/**
 * `/does-not-exist`, `/culture`, `/testimonials` — the catch-all page (404
 * spec §1): nav + footer come from `RootLayout` and the route uses the
 * existing page transition as-is. Sets the 404 document title and a
 * `noindex` robots directive only while mounted (restored on unmount — the
 * SPA fallback is HTTP 200 on Cloudflare Pages, so unknown URLs must never
 * be indexable).
 */
export default function NotFoundPage() {
  usePageTitle('404 | Page not found | Chuech studio')

  useEffect(() => {
    let tag = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const previousContent = tag?.getAttribute('content') ?? null
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'robots'
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', 'noindex')
    return () => {
      if (previousContent !== null) tag?.setAttribute('content', previousContent)
      else tag?.remove()
    }
  }, [])

  return <NotFoundView />
}
