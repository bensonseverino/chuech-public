import {
  useCallback, useRef,
  type MouseEvent as ReactMouseEvent, type ReactNode,
} from 'react'
import { Link, NavLink, useLocation, useNavigate, type LinkProps, type NavLinkProps, type To } from 'react-router'
import { gsap, ScrollTrigger, EASE } from '@/lib/motion'
import { useLenis } from '@/providers/lenis-context'
import { TransitionContext, usePageTransition } from './transition-context'

/**
 * Two-panel wipe (mint, then obsidian) around every internal navigation
 * (smooth-scroll spec §6). The route swaps behind the cover, scroll resets via
 * `ScrollManager`, then the panels lift away. Back/forward are instant.
 *
 * The app uses `createBrowserRouter` + `RouterProvider`, so this provider lives
 * in the root layout route (spec §6 note) rather than above the router.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const lenis = useLenis()
  const overlay = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  const go = useCallback(
    (to: string) => {
      const el = overlay.current
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!el || reduced) { navigate(to); return }
      if (busy.current) return
      busy.current = true
      lenis?.stop()

      const panels = el.querySelectorAll('[data-panel]')
      gsap.timeline({
        onComplete: () => {
          gsap.set(el, { display: 'none' })
          lenis?.start()
          busy.current = false
          ScrollTrigger.refresh()
        },
      })
        .set(el, { display: 'block' })
        .fromTo(panels, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: EASE.inOut, stagger: 0.08 })
        .add(() => navigate(to))
        .to({}, { duration: 0.2 }) // let the new route mount and settle
        .to(panels, { yPercent: -100, duration: 0.7, ease: EASE.inOut, stagger: 0.08 })
    },
    [navigate, lenis],
  )

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div ref={overlay} aria-hidden="true" className="fixed inset-0 z-[9999]" style={{ display: 'none' }}>
        {/* Existing colour tokens: `primary` is the mint, `obsidian` the black. */}
        <div data-panel className="absolute inset-0 bg-primary" />
        <div data-panel className="absolute inset-0 bg-obsidian" />
      </div>
    </TransitionContext.Provider>
  )
}

/* ---------- Links ---------- */

function useTransitionClick(to: To, onClick?: React.MouseEventHandler<HTMLAnchorElement>) {
  const { go } = usePageTransition()
  const location = useLocation()
  return (e: ReactMouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const target = typeof to === 'string' ? to : `${to.pathname ?? ''}${to.search ?? ''}${to.hash ?? ''}`
    // Resolved against the current URL (not the origin) so relative targets
    // like `?page=2` keep their pathname and fall through as same-page links.
    const url = new URL(target, window.location.href)
    if (url.pathname === location.pathname) return // same page: default router behaviour
    e.preventDefault()
    go(url.pathname + url.search + url.hash)
  }
}

export function TransitionLink({ to, onClick, ...rest }: LinkProps) {
  return <Link to={to} onClick={useTransitionClick(to, onClick)} {...rest} />
}

export function TransitionNavLink({ to, onClick, ...rest }: NavLinkProps) {
  return <NavLink to={to} onClick={useTransitionClick(to, onClick)} {...rest} />
}
