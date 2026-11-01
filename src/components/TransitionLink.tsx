import { forwardRef, type MouseEvent as ReactMouseEvent } from 'react'
import {
  Link, NavLink, useLocation, useNavigate,
  type LinkProps, type NavLinkProps, type To,
} from 'react-router'
import { triggerPageTransition } from '@/lib/transition'
import { useLenis } from '@/providers/lenis-context'

/**
 * Drop-in replacement for React Router's `Link` / `NavLink` that routes
 * internal clicks through the page transition (page-transition spec §5).
 * Props, refs, `className` and children pass straight through, so swapped
 * links keep their styling and active states exactly as they were.
 */

/** Shared click logic for both link flavours. */
function useTransitionClick(
  to: To,
  onClick?: React.MouseEventHandler<HTMLAnchorElement>,
  target?: string,
) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const lenis = useLenis()

  return (e: ReactMouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return

    // Let the browser handle new tabs, modified clicks, and non-left clicks.
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      (target && target !== '_self')
    )
      return

    const href =
      typeof to === 'string' ? to : `${to.pathname ?? ''}${to.search ?? ''}${to.hash ?? ''}`

    // Hash-only links and external URLs keep default behaviour.
    if (href.startsWith('#') || /^https?:\/\//.test(href)) return

    // Resolved against the current URL so relative targets like `?page=2`
    // keep their pathname. A same-page navigation (only search/hash differ)
    // falls through to the router: there is no page to transition to, and the
    // revealer is keyed by pathname so it would not replay anyway.
    const url = new URL(href, window.location.href)
    if (url.origin !== window.location.origin) return
    if (url.pathname === pathname) return

    e.preventDefault()
    triggerPageTransition(navigate, url.pathname + url.search + url.hash, pathname, () => {
      // Reuse the site's single Lenis instance (smooth-scroll) when it exists.
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
      else window.scrollTo(0, 0)
    })
  }
}

export const TransitionLink = forwardRef<HTMLAnchorElement, LinkProps>(
  function TransitionLink({ to, onClick, target, ...rest }, ref) {
    return (
      <Link
        ref={ref}
        to={to}
        target={target}
        onClick={useTransitionClick(to, onClick, target)}
        {...rest}
      />
    )
  },
)

/**
 * `NavLink` equivalent. The site's nav active state is computed from
 * `useLocation` rather than `NavLink`'s own classes, but this keeps the same
 * drop-in promise for any future `NavLink` call site.
 */
export const TransitionNavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function TransitionNavLink({ to, onClick, target, ...rest }, ref) {
    return (
      <NavLink
        ref={ref}
        to={to}
        target={target}
        onClick={useTransitionClick(to, onClick, target)}
        {...rest}
      />
    )
  },
)
