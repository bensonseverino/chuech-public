import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import { useLenis } from '@/providers/lenis-context'
import { ScrollTrigger } from '@/lib/motion'
import { anchorOffset } from '@/lib/anchor'

/**
 * Resets scroll on navigation, handles `#hash` on route change, and refreshes
 * ScrollTrigger after the new page mounts (smooth-scroll spec §5).
 *
 * The spec passes `-NAV_OFFSET` directly; here it goes through `anchorOffset`
 * because Lenis already subtracts the target's own `scroll-margin-top` and the
 * site's anchors carry `scroll-mt-24` — same final landing, no double offset.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  useLayoutEffect(() => {
    let id = 0
    if (hash) {
      id = requestAnimationFrame(() => {
        let el: HTMLElement | null = null
        try { el = document.querySelector(hash) } catch { /* invalid selector */ }
        if (!el) return
        if (lenis) lenis.scrollTo(el, { offset: anchorOffset(el), duration: 1.4 })
        else el.scrollIntoView()
      })
    } else {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
      else window.scrollTo(0, 0)
      id = requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    return () => cancelAnimationFrame(id)
  }, [pathname, hash, lenis])

  return null
}
