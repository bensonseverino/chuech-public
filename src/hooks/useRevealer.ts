import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from '@/lib/motion'
import { TRANSITION, markRouteCommitted, transitionState } from '@/lib/transition'

/**
 * Retracts the revealer overlay (scaleY 1 -> 0, anchored to the top)
 * (page-transition spec §3).
 *
 * Runs on mount. The `Revealer` component is keyed by pathname, so it
 * re-mounts and re-plays on every route change. The target is passed by ref
 * rather than queried through a global `.revealer` selector, so the hook can
 * never grab a stale or duplicated overlay.
 */
export function useRevealer(
  target: RefObject<HTMLElement | null>,
  onStart?: () => void,
  onComplete?: () => void,
) {
  useLayoutEffect(() => {
    // The incoming page is now in the DOM — release the view transition so it
    // captures this commit as its "new" snapshot (see `lib/transition.ts`).
    markRouteCommitted()

    const el = target.current
    if (!el) return

    const delay = transitionState.viaTransition
      ? TRANSITION.afterNavDelay
      : TRANSITION.initialLoadDelay

    const ctx = gsap.context(() => {
      // Reduced motion (site-wide policy, index.css): the panel never covers
      // the page, so no full-screen wipe is played. Set before first paint.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(el, { scaleY: 0, transformOrigin: 'top center' })
        transitionState.viaTransition = false
        onComplete?.()
        return
      }

      gsap.set(el, { scaleY: 1, transformOrigin: 'top center' })
      gsap.to(el, {
        scaleY: 0,
        duration: TRANSITION.revealDuration,
        delay,
        ease: TRANSITION.revealEase,
        onStart,
        onComplete: () => {
          transitionState.viaTransition = false
          onComplete?.()
        },
      })
    })

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
