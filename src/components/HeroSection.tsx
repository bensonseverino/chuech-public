import PartnerBadge from './PartnerBadge'
import HeroHeadline from './HeroHeadline'
import HeroDesktop from './HeroDesktop'
import ContactRow from './ContactRow'
import Container from './primitives/Container'
import SectionBadge from './primitives/SectionBadge'
import Inline from '../content/live/inline'
import { useHeroLoad } from '../hooks/useHeroLoad'
import type { HomeView, SiteView } from '../content/live/types'

/** Unit-based partner badge for the desktop hero (change spec §2a: 21.6 x 2.34).
    Rendered via the shared SectionBadge primitive (services spec §3.1). */
function DesktopBadge({ site }: { site: SiteView }) {
  return (
    <SectionBadge
      as="p"
      iconClassName="h-[calc(var(--u)*0.5)] w-[calc(var(--u)*1.1)]"
      className="text-obsidian"
      style={{
        width: 'calc(var(--u)*21.6)',
        height: 'calc(var(--u)*2.34)',
        paddingInline: 'calc(var(--u)*1.1)',
        gap: 'calc(var(--u)*0.7)',
        fontSize: 'max(11px, calc(var(--u)*0.711))',
      }}
    >
      <span className="whitespace-nowrap">{site.companyName}</span>
      <span aria-hidden="true" className="h-[calc(var(--u)*0.9)] w-px shrink-0 bg-silver" />
      <span className="shrink-0 font-semibold whitespace-nowrap">{site.address}</span>
    </SectionBadge>
  )
}

/**
 * Hero: badge → headline → description/contact.
 *  - below lg: unchanged responsive layout (spec §9)
 *  - lg+: 3-line desktop layout per change spec §2
 */
export default function HeroSection({ hero, site }: { hero: HomeView['hero']; site: SiteView }) {
  // Above-the-fold hero animates on load, never on scroll (smooth-scroll §7).
  const compactRef = useHeroLoad<HTMLElement>()
  const desktopRef = useHeroLoad<HTMLElement>()

  return (
    <>
      {/* --- below lg: unchanged --- */}
      <section ref={compactRef} className="px-4 pt-5 md:px-8 md:pt-10 lg:hidden">
        <div className="mx-auto max-w-[1440px]">
          <div data-hero-block>
            <PartnerBadge companyName={site.companyName} location={site.address} />
          </div>
          <div data-hero-block>
            <HeroHeadline pills={hero.pills} media={hero.media} />
          </div>

          <div data-hero-block className="mt-5 grid items-start gap-5 pb-10 md:mt-8 md:grid-cols-2 md:items-end md:gap-10 md:pb-14">
            <p className="max-w-[88%] text-[13px] leading-relaxed text-obsidian sm:text-sm md:max-w-md md:text-[15px]">
              {/* Above the fold at scroll 0 on mobile/tablet, so any highlight
                  in it reveals on load instead of sitting dim (§3.6). */}
              <Inline text={hero.description} reveal="load" />
            </p>
            <ContactRow site={site} thumb={hero.media[2].src} />
          </div>
        </div>
      </section>

      {/* --- lg+: desktop 3-line hero (change spec §2) on the shared column --- */}
      <section ref={desktopRef} className="hidden lg:block">
        <Container className="pt-[calc(var(--u)*3.51)] pb-[calc(var(--u)*2.5)]">
          <div data-hero-block>
            <DesktopBadge site={site} />
          </div>
          <div data-hero-block>
            <HeroDesktop pills={hero.pills} media={hero.media} site={site} />
          </div>
        </Container>
      </section>
    </>
  )
}
