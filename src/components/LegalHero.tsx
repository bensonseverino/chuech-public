import Container from './primitives/Container'
import SectionBadge from './primitives/SectionBadge'
import { useHeroLoad } from '../hooks/useHeroLoad'
import { company } from '../data/terms'

type ContactLink = { label: string; href: string; bold?: boolean }

/** Hero contact line — desktop/tablet only, right-aligned (terms spec §2). */
function HeroContactLine({ links }: { links: [ContactLink, ContactLink] }) {
  return (
    <p className="mt-[1.5rem] flex items-baseline justify-end gap-[10px] text-[14px] lg:gap-[calc(var(--u)*0.65)] lg:text-[calc(var(--u)*0.85)]">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={`${link.bold ? 'font-semibold' : 'font-medium'} text-obsidian hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian`}
        >
          {link.label}
        </a>
      ))}
    </p>
  )
}

type LegalHeroProps = {
  /** Breadcrumb pill text (e.g. "Terms & Conditions", "Privacy Policy"). */
  badge: string
  /** The page's one `<h1>` (e.g. "Our Terms", "Your Data"). */
  heading: string
}

/**
 * Shared legal-page hero (terms spec §2; privacy spec §2): fog background,
 * breadcrumb pill ~2rem under the nav, the h1 ~1rem below it, email + phone
 * line right-aligned on md+ under the heading (hidden on mobile — the
 * details table and footer carry the contact details there). Same entrance
 * stagger as every page hero.
 */
export default function LegalHero({ badge, heading }: LegalHeroProps) {
  const heroRef = useHeroLoad<HTMLElement>()

  const contactLinks: [ContactLink, ContactLink] = [
    { label: company.email, href: `mailto:${company.email}`, bold: true },
    { label: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` },
  ]

  return (
    <section ref={heroRef} className="bg-fog pb-[40px] pt-5 md:pt-10 lg:pt-[calc(var(--u)*3.51)]">
      <Container>
        <div data-hero-block>
          <SectionBadge
            as="p"
            iconClassName="h-3.5 w-[37px]"
            className="gap-2 px-5 py-3 text-[13px] leading-[1.5] font-medium text-obsidian"
          >
            {badge}
          </SectionBadge>
        </div>
        <h1
          data-hero-block
          className="mt-[1rem] text-[clamp(40px,11.8vw,70px)] leading-none font-semibold tracking-[-0.0163em] text-obsidian md:text-[8.75vw] lg:text-[calc(var(--u)*6.732)]"
        >
          {heading}
        </h1>
        <div data-hero-block className="hidden md:block">
          <HeroContactLine links={contactLinks} />
        </div>
      </Container>
    </section>
  )
}
