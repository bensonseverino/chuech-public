import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import SiteHeader from './SiteHeader'
import SiteFooter from './sections/SiteFooter'

/**
 * Router shell (services spec §3.1): sticky header, `<main id="main">` with the
 * routed page, black footer. The header/footer used to live inside `Home`; they
 * move here so every route shares them. The wrapper div is kept on the page
 * layout so the sticky nav layer still travels the whole document.
 *
 * Scroll handling: every route change scrolls to the top, except a `#hash` URL,
 * which scrolls to that element (its `scroll-mt-*` clears the sticky header).
 * Focus moves to `main` on route changes (not the very first render).
 */
export default function RootLayout() {
  const { pathname, hash } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const initialised = useRef(false)

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)

    if (!initialised.current) {
      initialised.current = true
      return
    }
    mainRef.current?.focus()
  }, [pathname, hash])

  return (
    <div
      className="min-h-svh bg-fog font-sans text-obsidian antialiased"
      style={{ overflowX: 'clip' }}
    >
      <SiteHeader />
      <main id="main" ref={mainRef} tabIndex={-1} className="focus:outline-none">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
