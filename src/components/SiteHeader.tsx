import { useEffect, useState } from 'react'
import chuechLogo from '../assets/marino/chuech-logo2.svg'
import { MenuIcon, ArrowRightIcon } from './icons'
import Expandable from './primitives/Expandable'
import Button from './primitives/Button'

/* ------------------------------------------------------------------ */
/* Desktop nav (lg+) — one glass container holding five items.         */
/* Change spec §1. All sizes are unit-based (`--u`).                    */
/* ------------------------------------------------------------------ */

type MenuKey = 'Services' | 'About'

const SUB_LINKS: Record<MenuKey, string[]> = {
  Services: ['Branding', 'Web Design', 'SEO', 'PPC', 'Video'],
  About: ['About Us', 'Culture', 'Testimonials'],
}

const NAV_ITEMS: { label: string; menu?: MenuKey }[] = [
  { label: 'Services', menu: 'Services' },
  { label: 'Work' },
  { label: 'About', menu: 'About' },
  { label: 'Blog' },
]

const CELL =
  'flex h-[calc(var(--u)*2.83)] items-center justify-center rounded-button text-[max(11px,calc(var(--u)*0.766))] font-normal text-obsidian transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian'

function DesktopNav() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null)
  // Keeps the last opened panel mounted so the collapse animates smoothly.
  const [renderedMenu, setRenderedMenu] = useState<MenuKey>('Services')

  // Keep the panel content in sync with the opened menu without an effect.
  function showMenu(menu: MenuKey) {
    setRenderedMenu(menu)
    setOpenMenu(menu)
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenMenu(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const open = openMenu !== null

  return (
    <nav
      aria-label="Primary"
      onMouseLeave={() => setOpenMenu(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenMenu(null)
      }}
      className="glass-panel rounded-nav absolute top-[calc(var(--u)*2.5)] right-0 w-[calc(var(--u)*40.9)] overflow-hidden"
    >
      <ul className="flex items-center px-[calc(var(--u)*0.77)] py-[calc(var(--u)*0.5)]">
        {NAV_ITEMS.map((item) => (
          <li key={item.label} className="flex-1">
            {item.menu ? (
              <a
                href="#"
                aria-haspopup="true"
                aria-expanded={openMenu === item.menu}
                onMouseEnter={() => showMenu(item.menu!)}
                onFocus={() => showMenu(item.menu!)}
                className={`${CELL} group relative hover:bg-silver/35 ${
                  openMenu === item.menu ? 'bg-silver/35' : ''
                }`}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={`absolute right-[calc(var(--u)*0.52)] grid h-[calc(var(--u)*0.9)] w-[calc(var(--u)*0.9)] place-items-center rounded-full bg-primary transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${
                    openMenu === item.menu ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <ArrowRightIcon className="h-[calc(var(--u)*0.42)] w-[calc(var(--u)*0.42)] text-obsidian" />
                </span>
              </a>
            ) : (
              <a
                href="#"
                onMouseEnter={() => setOpenMenu(null)}
                onFocus={() => setOpenMenu(null)}
                className={`${CELL} hover:bg-silver/35`}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
        <li className="flex-1">
          {/* Shared Button (mint); unit geometry preserved via overrides. */}
          <Button
            variant="mint"
            href="mailto:hello@marino.co.uk"
            className="mx-auto flex min-h-0! h-[calc(var(--u)*2.3)] w-full px-0! text-[max(11px,calc(var(--u)*0.766))]!"
            style={{ width: 'calc(var(--u)*7.74)' }}
          >
            Contact
          </Button>
        </li>
      </ul>

      {/* Expanding dropdown — shared Expandable primitive (grid-rows reveal). */}
      <Expandable open={open}>
          <ul
            className={`flex items-center gap-[calc(var(--u)*2.3)] px-[calc(var(--u)*2.02)] pb-[calc(var(--u)*1.34)] text-[max(11px,calc(var(--u)*0.711))] transition-opacity ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {SUB_LINKS[renderedMenu].map((label) => (
              <li key={label}>
                <a
                  href="#"
                  className="inline-flex items-center gap-[calc(var(--u)*0.34)] text-obsidian transition-opacity hover:opacity-60 focus-visible:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
                >
                  <ArrowRightIcon className="h-[calc(var(--u)*0.5)] w-[calc(var(--u)*0.5)]" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
      </Expandable>
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

/**
 * Sticky header (change spec §1d). Below lg the existing floating pill is kept
 * (now glass); at lg+ the logo sits on the content column and the glass nav
 * container is absolutely positioned so its dropdown overlays content instead
 * of pushing the hero down.
 */
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      {/* --- below lg: existing floating pill (glass per §1c) --- */}
      <div className="px-2.5 pt-2.5 sm:px-3 md:px-8 md:pt-6 lg:hidden">
        <div className="glass-panel rounded-nav mx-auto flex max-w-[1440px] items-center justify-between gap-2 py-1.5 pr-1.5 pl-4 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-0 md:rounded-none md:py-1 md:pr-0 md:pl-0">
          <a
            href="/"
            className="min-w-0 justify-self-start py-0.5 pl-2 md:pl-1"
          >
            <img
              src={chuechLogo}
              alt="Chuech"
              className="h-8 w-auto md:h-7"
            />
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-10">
              {['Services', 'About', 'Blog'].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm font-normal text-obsidian transition-opacity hover:opacity-60"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 justify-self-end md:gap-3">
            {/* Shared Button (mint); important overrides preserve the frozen
                mobile/tablet geometry (§1 placement spec). */}
            <Button
              variant="mint"
              href="mailto:hello@marino.co.uk"
              className="min-h-0! px-4! py-1.5! text-[11px]! whitespace-nowrap md:px-7! md:py-2.5! md:text-[13px]!"
            >
              Contact
            </Button>
            <button
              type="button"
              aria-label="Open menu"
              className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full bg-black text-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
            >
              <MenuIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- lg+: logo on the content column + absolutely-positioned nav --- */}
      <div
        className="relative mx-auto hidden w-[calc(var(--u)*70.56)] lg:block"
        style={{ height: 'calc(var(--u)*6.33)' }}
      >
        <img
          src={chuechLogo}
          alt="Chuech"
          className="absolute left-0 top-[calc(var(--u)*4.415)] h-[calc(var(--u)*2.25)] w-auto -translate-y-1/2"
        />
        <DesktopNav />
      </div>
    </header>
  )
}
