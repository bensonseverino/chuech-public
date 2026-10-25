import { useRef, type RefObject } from 'react'
import { useGSAP, gsap, DUR, EASE } from '@/lib/motion'

/**
 * On-load entrance for above-the-fold hero content (smooth-scroll spec §7):
 * every `[data-hero-block]` inside the returned root rises 40px and fades in
 * with a small stagger — it never waits for scroll, and under
 * `prefers-reduced-motion` nothing runs, so the hero is simply there.
 *
 * Returns the ref to attach to the hero's root element.
 */
export function useHeroLoad<T extends HTMLElement>(): RefObject<T | null> {
  const root = useRef<T>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const blocks = root.current?.querySelectorAll('[data-hero-block]')
        if (!blocks?.length) return
        gsap.from(blocks, {
          y: 40,
          opacity: 0,
          duration: DUR.base,
          ease: EASE.out,
          stagger: 0.08,
        })
      })
    },
    { scope: root },
  )

  return root
}
