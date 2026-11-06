import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import SiteHeader from './SiteHeader'
import SiteFooter from './sections/SiteFooter'
import { useSiteContent } from '../content/live/hooks'
import { SmoothScrollProvider } from '../providers/SmoothScrollProvider'
import { ScrollManager } from './transition/ScrollManager'
import Revealer from './Revealer'
import { ROUTES } from '../routes'

/**
 * Router shell (services spec §3.1): sticky header, `<main id="main">` with the
 * routed page, black footer. The header/footer used to live inside `Home`; they
 * move here so every route shares them. The wrapper div is kept on the page
 * layout so the sticky nav layer still travels the whole document.
 *
 * This route also hosts the smooth-scroll stack (smooth-scroll spec §6/§9):
 * one Lenis instance, `ScrollManager`, which owns scroll-on-navigation (top, or
 * the `#hash` target) plus the ScrollTrigger refresh, and the page-transition
 * `Revealer` (page-transition spec §6) — so this component only keeps the focus
 * move that assistive tech relies on.
 */
export default function RootLayout() {
  const { pathname, hash } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const initialised = useRef(false)
  const content = useSiteContent()
  // `/contact` paints the shell behind the floating header obsidian too, so the
  // gap around the nav matches the hero and the page never flashes fog at the
  // top (contact spec §2). Every other route keeps the shared fog canvas.
  const darkShell = pathname === ROUTES.contact

  useEffect(() => {
    // A real `#hash` target scrolls (ScrollManager) but keeps focus where it is;
    // anything else moves focus to `main` after the very first render.
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) return
    }

    if (!initialised.current) {
      initialised.current = true
      return
    }
    mainRef.current?.focus()
  }, [pathname, hash])

  return (
    <SmoothScrollProvider>
      <ScrollManager />
      {/* Keyed by pathname so it remounts and replays on every route change. */}
      <Revealer key={pathname} />
      <div
        className={`min-h-svh font-sans text-obsidian antialiased ${darkShell ? 'bg-obsidian' : 'bg-fog'}`}
        style={{ overflowX: 'clip' }}
      >
        <SiteHeader site={content.site} navigation={content.navigation} />
        <main id="main" ref={mainRef} tabIndex={-1} className="focus:outline-none">
          <Outlet context={content} />
        </main>
        <SiteFooter footer={content.footer} site={content.site} />
      </div>
    </SmoothScrollProvider>
  )
}
