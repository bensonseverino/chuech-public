import type { CSSProperties, ReactNode } from 'react'
import Container from './primitives/Container'
import SectionBadge from './primitives/SectionBadge'
import FloatPill from './primitives/FloatPill'
import MediaFrame from './primitives/MediaFrame'
import './PageHero.css'

type ContactLink = { label: string; href: string }

export type PageHeroProps = {
  /** Badge label, e.g. "Services" (rendered as a `<p>`, never a heading). */
  label: string
  /** The page's only `<h1>`. */
  title: string
  /** [Pill A (over the image), Pill B (beside the description)]. */
  pills: [string, string]
  /** 16:9 hero photo; `alt` omitted keeps it decorative. */
  image: { src: string; alt?: string }
  /** Same copy/bold phrases as the Home hero description. */
  description: ReactNode
  /** Contact line (email + phone); defaults to the Marino details. */
  contact?: { email: ContactLink; phone: ContactLink }
  /** Show the hero photo on mobile (work page hides it — spec §4). */
  showImageOnMobile?: boolean
  /**
   * How Pill A anchors to the photo at md+: `above` puts its bottom edge on the
   * photo's top edge (Services); `straddle` centres it on the photo's top edge
   * (work page — spec §4).
   */
  pillAAnchor?: 'above' | 'straddle'
  /** Mobile inset from the h1's right edge for Pill A (default `7%`). */
  pillAMobileInset?: string
  /** Space after the hero, per breakpoint (default is the Services 40px). */
  spacingBottom?: { mobile: string; tablet: string; desktop: string }
}

const DEFAULT_CONTACT: { email: ContactLink; phone: ContactLink } = {
  email: { label: 'hello@marino.co.uk', href: 'mailto:hello@marino.co.uk' },
  phone: { label: '0161 660 6263', href: 'tel:01616606263' },
}

const DEFAULT_SPACING = { mobile: '40px', tablet: '40px', desktop: '40px' }

/**
 * Inner-page hero (services spec §4). Same visual language as the Home hero,
 * simpler; built from the existing primitives only (SectionBadge, FloatPill,
 * MediaFrame). One `<h1>`; the two floating pills are decorative.
 *
 * Mobile is a single DOM-ordered column; at md+ the `page-hero-*` classes lay
 * it out on the 2-column grid (badge/title/row/contact + media).
 */
export default function PageHero({
  label,
  title,
  pills,
  image,
  description,
  contact = DEFAULT_CONTACT,
  showImageOnMobile = true,
  pillAAnchor = 'above',
  pillAMobileInset = '7%',
  spacingBottom = DEFAULT_SPACING,
}: PageHeroProps) {
  const [pillA, pillB] = pills

  return (
    /* Bottom spacing is per-breakpoint (Services: 40px everywhere — §4.3). */
    <section
      className="page-hero"
      style={
        {
          '--hero-pb-mobile': spacingBottom.mobile,
          '--hero-pb-tablet': spacingBottom.tablet,
          '--hero-pb-desktop': spacingBottom.desktop,
        } as CSSProperties
      }
    >
      <Container className="pt-5 md:pt-10 lg:pt-[calc(var(--u)*3.51)]">
        <div className="page-hero-grid md:grid md:grid-cols-[1fr_29vw] md:items-start lg:grid-cols-[1fr_calc(var(--u)*21)]">
          {/* --- Badge --- */}
          <div className="page-hero-badge">
            <SectionBadge
              as="p"
              iconClassName="h-3.5 w-[37px]"
              className="gap-2 px-5 py-3 text-[13px] leading-[1.5] font-medium text-obsidian"
            >
              {label}
            </SectionBadge>
          </div>

          {/* --- Title (+ mobile Pill A floating over its top-right) --- */}
          <h1 className="page-hero-title relative mt-[10px] text-[clamp(40px,11.8vw,70px)] leading-none font-semibold tracking-[-0.0163em] text-obsidian md:text-[8.75vw] lg:text-[calc(var(--u)*6.732)]">
            {title}
            <FloatPill
              size="sm"
              variant="a"
              className="absolute top-0 -translate-y-1/2 md:hidden"
              style={{ right: pillAMobileInset }}
            >
              {pillA}
            </FloatPill>
          </h1>

          {/* --- Row: Pill B + description --- */}
          <div className="page-hero-row mt-5 flex items-center md:mt-[35px]">
            {/* The wrapper owns the responsive display: FloatPill's base
                `inline-flex` would otherwise beat a bare `hidden`. */}
            <span className="mr-4 hidden shrink-0 md:inline-flex lg:-ml-[calc(var(--u)*1.45)] lg:mr-[calc(var(--u)*2.7)]">
              <FloatPill
                size="sm"
                variant="b"
                className="lg:h-[3.3em] lg:px-[1.77em] lg:text-[17px]"
              >
                {pillB}
              </FloatPill>
            </span>
            <p className="text-[18px] leading-[1.43] text-obsidian md:max-w-[37vw] md:text-[16px] md:leading-[1.4] lg:max-w-[calc(var(--u)*30)] lg:text-[16px] lg:leading-[24px]">
              {description}
            </p>
          </div>

          {/* --- Media (+ desktop/tablet Pill A on the image's top-left) --- */}
          <div
            className={`page-hero-media relative mt-[40px] w-full self-start md:mt-0 md:justify-self-end ${
              showImageOnMobile ? '' : 'hidden md:block'
            }`}
          >
            <MediaFrame
              src={image.src}
              alt={image.alt ?? ''}
              radius="media lg:card-lg"
              priority
              className="w-full"
            />
            {/* Wrapper owns the responsive display (see Pill B above). */}
            <span
              className={`absolute hidden shrink-0 md:inline-flex ${
                pillAAnchor === 'straddle'
                  ? 'right-[73%] bottom-[calc(95%_-_21px)] lg:right-[79%] lg:bottom-[calc(95%_-_1.65em)]'
                  : 'right-[73%] bottom-[97%] lg:right-[76%]'
              }`}
            >
              <FloatPill size="sm" variant="a" className="lg:h-[3.3em] lg:px-[1.77em] lg:text-[17px]">
                {pillA}
              </FloatPill>
            </span>
          </div>

          {/* --- Contact line (md+ only) --- */}
          <div className="page-hero-contact hidden justify-self-end md:mt-[25px] md:flex">
            <p className="flex items-baseline gap-[10px] text-[14px] lg:gap-[calc(var(--u)*0.65)] lg:text-[calc(var(--u)*0.85)]">
              <a
                href={contact.email.href}
                className="font-semibold text-obsidian hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
              >
                {contact.email.label}
              </a>
              <a
                href={contact.phone.href}
                className="text-obsidian hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
              >
                {contact.phone.label}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
