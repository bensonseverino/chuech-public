import type { NavigateFunction } from 'react-router'

/**
 * Page transition config (page-transition spec §2). Timings and easings live
 * here and nowhere else — `useRevealer` and the clip-path keyframes in
 * `triggerPageTransition` both read from this object.
 */
export const TRANSITION = {
  clipDuration: 1500, // ms: view-transition clip-path expansion
  clipEasing: 'cubic-bezier(0.9, 0, 0.1, 1)',
  revealDuration: 1.25, // s: GSAP revealer retraction
  revealEase: 'power4.inOut',
  initialLoadDelay: 0.6, // s: revealer delay on first page load
  afterNavDelay: 0.9, // s: revealer delay after a route transition (starts while the clip-path finishes)
} as const

/** Shared flag so the revealer knows whether it mounted from a route transition or a hard load. */
export const transitionState = { viaTransition: false }

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* -------------------------------------------------------------------------
   Route-commit signal
   -------------------------------------------------------------------------
   The app uses `createBrowserRouter` + `RouterProvider`, so routing is a data
   router: `navigate()` applies the new route asynchronously (React Router
   dispatches the state update inside `startTransition`). The spec's
   `flushSync(() => navigate(to))` therefore cannot pull the render forward —
   measured here, the update callback returned with `location.pathname` already
   changed but the DOM still showing the outgoing page, so the view transition
   captured the *old* page as the "new" snapshot.

   Instead the update callback waits for the incoming page to be committed to
   the DOM. `Revealer` is keyed by pathname, so its mount is exactly that
   moment; it calls `markRouteCommitted()` from its layout effect, after the
   whole commit's DOM mutations are in place. The wait is bounded so a missing
   revealer can never hang a transition — measured commit times are ~30ms in a
   production build and up to ~800ms in dev, so the bound leaves headroom.
*/

const COMMIT_TIMEOUT = 2000

let settleRoute: (() => void) | null = null

/** Called by the revealer as soon as the incoming page is in the DOM. */
export function markRouteCommitted() {
  const settle = settleRoute
  settleRoute = null
  settle?.()
}

function routeCommitted() {
  return new Promise<void>((resolve) => {
    const finish = () => {
      window.clearTimeout(timer)
      if (settleRoute === finish) settleRoute = null
      resolve()
    }
    const timer = window.setTimeout(finish, COMMIT_TIMEOUT)
    settleRoute = finish
  })
}

/**
 * Navigate with the clip-path view transition (page-transition spec §2).
 *
 * The View Transitions API is used natively — the project runs React Router on
 * `createBrowserRouter`, so the tutorial's `next-view-transitions` package does
 * not apply. Falls back to a plain `navigate()` when the API is unsupported
 * (older Firefox/Safari) or the user prefers reduced motion.
 */
export function triggerPageTransition(
  navigate: NavigateFunction,
  to: string,
  currentPath: string,
  scrollToTop?: () => void,
) {
  // Ignore navigation to the page we're already on.
  if (to === currentPath) return

  const supportsVT = typeof document.startViewTransition === 'function'

  if (!supportsVT || prefersReducedMotion()) {
    transitionState.viaTransition = false
    navigate(to)
    scrollToTop?.()
    return
  }

  transitionState.viaTransition = true

  const transition = document.startViewTransition(async () => {
    // Register before navigating: the revealer signals this the moment the
    // incoming page is committed, and the browser captures the new snapshot
    // only once this promise settles.
    const committed = routeCommitted()
    navigate(to)
    await committed
    // Scroll reset happens inside the update callback so the snapshot of the
    // incoming page is taken at the top, not at the old scroll offset.
    scrollToTop?.()
  })

  // `ready` rejects when the transition is skipped (e.g. one is already
  // running); there is nothing to animate then and it must not surface as an
  // unhandled rejection in the console.
  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)', // thin horizontal line
            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // full screen
          ],
        },
        {
          duration: TRANSITION.clipDuration,
          easing: TRANSITION.clipEasing,
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
    .catch(() => {})
}
