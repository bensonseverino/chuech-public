import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { TransitionLink } from './transition/PageTransitionProvider'
import { useScrollLock } from '../hooks/useScrollLock'
import chuechLogo from '../assets/marino/chuech-logo2.svg'
import { MenuIcon, CloseIcon, ArrowRightIcon } from './icons'
import Expandable from './primitives/Expandable'
import Button from './primitives/Button'
import { ROUTES } from '../routes'
import type { LinkView, NavigationView, SiteView } from '../content/live/types'

/* ------------------------------------------------------------------ */
/* Nav menu — one glass container holding the nav items, the mint      */
/* Contact pill and an expanding sub-link row (design reference).      */
/*   md (768–1023): tablet row — 44px cells, right-aligned inside the  */
/*                  same content gutter the hero uses (px-8).          */
/*   lg (1024+):    the unit-based design column (all sizes via --u).  */
/*                                                                     */
/* The menu structure comes from `_navigation`; a row with `children`   */
/* renders the expanding sub-link row.                                 */
/* ------------------------------------------------------------------ */

type NavRow = {
  label: string
  to: string
  children?: LinkView[]
  /** Paths (or path prefixes) that light this item's active state. */
  activePaths: string[]
}

function navRows(navigation: NavigationView): NavRow[] {
  return navigation.items.map((item) => ({
    ...item,
    activePaths: [item.to, ...(item.children?.map((child) => child.to) ?? [])],
  }))
}

function menuItems(rows: NavRow[], label: string | null): LinkView[] {
  return rows.find((row) => row.label === label)?.children ?? []
}

function isItemActive(pathname: string, item: NavRow) {
  return item.activePaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

/** Tablet sizing first, scaled to the frozen unit geometry at lg+. */
const CELL =
  'flex h-11 items-center justify-center rounded-button px-4 text-[14px] font-normal text-obsidian transition-colors hover:bg-silver/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian lg:h-[calc(var(--u)*2.83)] lg:px-0 lg:text-[max(11px,calc(var(--u)*0.766))]'

/**
 * The shared nav container. It is rendered inside a zero-height sticky layer,
 * so its sub-link row expands over the page instead of pushing it down, and
 * the container itself stays pinned while the logo scrolls away.
 */
function NavMenu({ navigation }: { navigation: NavigationView }) {
  const { pathname } = useLocation()
  const rows = navRows(navigation)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  // Keeps the last opened panel mounted so the collapse animates smoothly.
  const [renderedMenu, setRenderedMenu] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  // Keep the panel content in sync with the opened menu without an effect.
  function showMenu(menu: string) {
    setRenderedMenu(menu)
    setOpenMenu(menu)
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenMenu(null)
    }
    // Tapping anywhere outside dismisses the menu (touch tablets have no hover).
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  const open = openMenu !== null

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      onMouseLeave={() => setOpenMenu(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenMenu(null)
      }}
      className="glass rounded-nav absolute top-[calc(var(--u)*2.5)] right-8 w-[calc(var(--u)*56)] max-w-full overflow-hidden lg:right-0 lg:w-[calc(var(--u)*40.9)]"
    >
      <ul className="flex items-center justify-between gap-1 px-2 py-1.5 lg:gap-0 lg:px-[calc(var(--u)*0.77)] lg:py-[calc(var(--u)*0.5)]">
        {rows.map((item) => {
          const active = isItemActive(pathname, item)
          const menu = item.children?.length ? item.label : undefined
          const highlighted = active || (menu ? openMenu === menu : false)

          return (
            <li key={item.label} className="lg:flex-1">
              <TransitionLink
                to={item.to}
                aria-haspopup={menu ? true : undefined}
                aria-expanded={menu ? openMenu === menu : undefined}
                aria-current={active ? 'page' : undefined}
                onMouseEnter={() => (menu ? showMenu(menu) : setOpenMenu(null))}
                onFocus={() => (menu ? showMenu(menu) : setOpenMenu(null))}
                className={`${CELL} group relative ${highlighted ? 'bg-silver/35' : ''}`}
              >
                <span>{item.label}</span>
                {menu ? (
                  <span
                    aria-hidden="true"
                    className={`absolute right-[calc(var(--u)*0.52)] hidden h-[calc(var(--u)*0.9)] w-[calc(var(--u)*0.9)] place-items-center rounded-full bg-primary transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 lg:grid ${
                      highlighted ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <ArrowRightIcon className="h-[calc(var(--u)*0.42)] w-[calc(var(--u)*0.42)] text-obsidian" />
                  </span>
                ) : null}
              </TransitionLink>
            </li>
          )
        })}
        <li className="lg:flex-1">
          {/* Shared Button (mint); unit geometry preserved via lg overrides. */}
          <Button
            variant="mint"
            to={navigation.cta.to}
            className="mx-auto flex min-h-0! h-11 text-[14px]! lg:h-[calc(var(--u)*2.3)] lg:w-[calc(var(--u)*7.74)] lg:px-0! lg:text-[max(11px,calc(var(--u)*0.766))]!"
          >
            {navigation.cta.label}
          </Button>
        </li>
      </ul>

      {/* Expanding dropdown — shared Expandable primitive (grid-rows reveal). */}
      <Expandable open={open}>
        <ul
          className={`flex items-center justify-between gap-2 px-6 pb-3 text-[13px] transition-opacity lg:justify-normal lg:gap-[calc(var(--u)*2.3)] lg:px-[calc(var(--u)*2.02)] lg:pb-[calc(var(--u)*1.34)] lg:text-[max(11px,calc(var(--u)*0.711))] ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {menuItems(rows, renderedMenu).map((sub) => (
            <li key={sub.label}>
              <TransitionLink
                to={sub.to}
                className="inline-flex items-center gap-1.5 whitespace-nowrap text-obsidian transition-opacity hover:opacity-60 focus-visible:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian lg:gap-[calc(var(--u)*0.34)]"
              >
                <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 lg:h-[calc(var(--u)*0.5)] lg:w-[calc(var(--u)*0.5)]" />
                {sub.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </Expandable>
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile slide-out menu                                               */
/* ------------------------------------------------------------------ */

/** Touch-sized row shared by the plain links and the expanding parents. */
const MOBILE_ROW =
  'flex min-h-[44px] w-full items-center justify-between gap-3 rounded-button px-3 text-left text-[15px] text-obsidian transition-colors hover:bg-silver/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian'

/**
 * Below-md panel behind the hamburger. It reuses the same `Expandable`
 * primitive (0fr -> 1fr grid reveal) and the same `glass` surface as the
 * desktop nav container, so both breakpoints read as one component. The panel
 * is absolutely positioned below the sticky pill, so opening it overlays the
 * page instead of pushing it down.
 */
function MobileMenu({
  open,
  expanded,
  onToggle,
  onClose,
  navigation,
}: {
  open: boolean
  expanded: string | null
  onToggle: (menu: string) => void
  onClose: () => void
  navigation: NavigationView
}) {
  const { pathname } = useLocation()
  const rows = navRows(navigation)

  return (
    <>
      {/* Dims the page behind the panel; tapping it also dismisses the menu. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 -z-10 bg-obsidian/25 transition-opacity ease-standard duration-[350ms] ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* `pointer-events-none` keeps the wrapper's gutter from swallowing taps on
          the page below the pill while the panel is closed; the surface itself
          re-enables them. */}
      <div className="pointer-events-none absolute inset-x-0 top-full px-2.5 pt-2.5 sm:px-3">
        <Expandable open={open} id="mobile-menu">
          <nav
            aria-label="Mobile"
            className="glass pointer-events-auto rounded-nav mx-auto max-w-[1440px] p-2"
          >
            <ul className="flex flex-col gap-0.5">
              {rows.map((item) => {
                const active = isItemActive(pathname, item)
                const menu = item.children?.length ? item.label : undefined

                if (!menu) {
                  return (
                    <li key={item.label}>
                      <TransitionLink
                        to={item.to}
                        aria-current={active ? 'page' : undefined}
                        onClick={onClose}
                        className={`${MOBILE_ROW} ${active ? 'bg-silver/35' : ''}`}
                      >
                        {item.label}
                        <ArrowRightIcon className="h-4 w-4 shrink-0 text-obsidian/35" />
                      </TransitionLink>
                    </li>
                  )
                }

                const isOpen = expanded === menu

                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => onToggle(menu)}
                      className={`${MOBILE_ROW} cursor-pointer ${active ? 'bg-silver/35' : ''}`}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary transition-transform ease-standard ${
                          isOpen ? 'rotate-90' : ''
                        }`}
                      >
                        <ArrowRightIcon className="h-3 w-3 text-obsidian" />
                      </span>
                    </button>

                    <Expandable open={isOpen}>
                      <ul className="flex flex-col pb-1">
                        {menuItems(rows, menu).map((sub) => (
                          <li key={sub.label}>
                            <TransitionLink
                              to={sub.to}
                              onClick={onClose}
                              className="flex min-h-[40px] items-center gap-2 rounded-button py-0.5 pr-3 pl-6 text-[14px] text-obsidian/80 transition-colors hover:bg-silver/35 hover:text-obsidian focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
                            >
                              <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-obsidian/45" />
                              {sub.label}
                            </TransitionLink>
                          </li>
                        ))}
                      </ul>
                    </Expandable>
                  </li>
                )
              })}
            </ul>

            <div className="px-0.5 pt-1.5 pb-0.5">
              {/* Shared Button (mint), full width on touch. */}
              <Button variant="mint" to={navigation.cta.to} className="w-full">
                {navigation.cta.label}
              </Button>
            </div>
          </nav>
        </Expandable>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

/**
 * md+ layout (change spec §1d, revised): the logo is a plain flow element, so
 * it scrolls away, while the glass nav container lives in a zero-height sticky
 * layer pinned to the top of the viewport. Both are direct children of the
 * page wrapper, which is what lets the sticky layer travel the whole page.
 * Below md the original floating pill (now glass) keeps its geometry and gains
 * the slide-out panel behind the hamburger.
 */
export default function SiteHeader({
  site,
  navigation,
}: {
  site: SiteView
  navigation: NavigationView
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  // Only one sub-row is expanded at a time, matching the desktop container.
  const [expanded, setExpanded] = useState<string | null>(null)
  const mobileRef = useRef<HTMLElement>(null)

  // Freezes the page (Lenis stop, or body overflow before Lenis mounts) while
  // the mobile panel is open — smooth-scroll spec §4 / §12.
  useScrollLock(menuOpen)

  function closeMenu() {
    setMenuOpen(false)
    setExpanded(null)
  }

  useEffect(() => {
    // Dismissing the menu also collapses whatever sub-row was open.
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') closeMenu()
    }
    // Tapping the page behind the panel also dismisses the menu.
    function onPointerDown(event: PointerEvent) {
      if (!mobileRef.current?.contains(event.target as Node)) closeMenu()
    }
    // The panel only exists below md, so drop the state when the viewport grows.
    const mdUp = window.matchMedia('(min-width: 768px)')
    function onBreakpoint() {
      if (mdUp.matches) closeMenu()
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    mdUp.addEventListener('change', onBreakpoint)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
      mdUp.removeEventListener('change', onBreakpoint)
    }
  }, [])

  return (
    <>
      {/* --- below md: floating glass pill + slide-out panel --- */}
      <header ref={mobileRef} className="sticky top-0 z-50 md:hidden">
        <MobileMenu
          open={menuOpen}
          expanded={expanded}
          onToggle={(menu) => setExpanded((current) => (current === menu ? null : menu))}
          onClose={closeMenu}
          navigation={navigation}
        />

        <div className="px-2.5 pt-2.5 sm:px-3">
          <div className="glass rounded-nav mx-auto flex max-w-[1440px] items-center justify-between gap-2 py-1.5 pr-1.5 pl-4">
            <TransitionLink to={ROUTES.home} className="min-w-0 py-0.5 pl-2">
              <img src={chuechLogo} alt={site.companyName} className="h-8 w-auto" />
            </TransitionLink>

            <div className="flex items-center gap-1.5">
              {/* Shared Button (mint); important overrides preserve the frozen
                  mobile geometry (§1 placement spec). */}
              <Button
                variant="mint"
                to={navigation.cta.to}
                className="min-h-0! px-4! py-1.5! text-[11px]! whitespace-nowrap"
              >
                {navigation.cta.label}
              </Button>
              <button
                type="button"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => {
                  // Functional update so rapid taps can't act on a stale render.
                  setMenuOpen((value) => !value)
                  setExpanded(null)
                }}
                className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full bg-black text-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {menuOpen ? <CloseIcon className="h-3.5 w-3.5" /> : <MenuIcon className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- md+: sticky nav layer (zero height, so it adds no flow height) --- */}
      <div className="sticky top-0 z-50 hidden h-0 md:block">
        <div className="relative mx-auto w-full max-w-[1440px] px-8 lg:w-[calc(var(--u)*70.56)] lg:max-w-none lg:px-0">
          <NavMenu navigation={navigation} />
        </div>
      </div>

      {/* --- md+: the Chuech logo, deliberately NOT sticky --- */}
      <header className="relative z-40 hidden h-[calc(var(--u)*2.5_+_58px)] md:block lg:h-[calc(var(--u)*6.33)]">
        <div className="relative mx-auto w-full max-w-[1440px] px-8 lg:w-[calc(var(--u)*70.56)] lg:max-w-none lg:px-0">
          <TransitionLink
            to={ROUTES.home}
            className="absolute top-[calc(var(--u)*2.5_+_29px)] left-8 block -translate-y-1/2 lg:top-[calc(var(--u)*4.415)] lg:left-0"
          >
            <img
              src={chuechLogo}
              alt={site.companyName}
              className="block h-7 w-auto lg:h-[calc(var(--u)*2.25)]"
            />
          </TransitionLink>
        </div>
      </header>
    </>
  )
}
