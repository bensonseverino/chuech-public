import Container from '@/components/primitives/Container'
import SectionBadge from '@/components/primitives/SectionBadge'
import { Reveal } from '@/components/ui/Reveal'
import { useHeroLoad } from '@/hooks/useHeroLoad'
import { usePageTitle, useMetaDescription } from '@/hooks/usePageTitle'
import { company, intro, sections } from '@/data/terms'
import { LEGAL_TEXT } from '@/components/LegalDetailsTable'
import LegalDetailsTable from '@/components/LegalDetailsTable'
import LegalSection from '@/components/LegalSection'

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

/**
 * `/terms-conditions` (terms spec §1): nav (RootLayout) → hero (breadcrumb
 * "Terms & Conditions", the one `<h1>` "Our Terms", email + phone line) → the
 * white card (details table, intro, 21 numbered sections) → Get in Touch +
 * footer (RootLayout). No nav item is active; no mint pills, no image, no
 * forms — and the legal copy renders plainly, with only the hero load stagger
 * and a single fade on the card itself (terms spec §9).
 */
export default function TermsPage() {
  usePageTitle('Terms & Conditions | Chuech studio')
  useMetaDescription('Read the terms and conditions for using the Chuech studio website and our services.')

  const heroRef = useHeroLoad<HTMLElement>()

  const contactLinks: [ContactLink, ContactLink] = [
    { label: company.email, href: `mailto:${company.email}`, bold: true },
    { label: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` },
  ]

  return (
    <>
      {/*
        Hero (terms spec §2): fog background, breadcrumb pill ~2rem under the
        nav, the h1 ~1rem below it, contact line right-aligned on md+ under
        the heading (hidden on mobile — the details table and footer carry the
        contact details there).
      */}
      <section ref={heroRef} className="bg-fog pb-[40px] pt-5 md:pt-10 lg:pt-[calc(var(--u)*3.51)]">
        <Container>
          <div data-hero-block>
            <SectionBadge
              as="p"
              iconClassName="h-3.5 w-[37px]"
              className="gap-2 px-5 py-3 text-[13px] leading-[1.5] font-medium text-obsidian"
            >
              Terms &amp; Conditions
            </SectionBadge>
          </div>
          <h1
            data-hero-block
            className="mt-[1rem] text-[clamp(40px,11.8vw,70px)] leading-none font-semibold tracking-[-0.0163em] text-obsidian md:text-[8.75vw] lg:text-[calc(var(--u)*6.732)]"
          >
            Our Terms
          </h1>
          <div data-hero-block className="hidden md:block">
            <HeroContactLine links={contactLinks} />
          </div>
        </Container>
      </section>

      {/*
        Content card (terms spec §3): white, ~1.75rem radius (1.25rem mobile),
        container width, ~3.5rem/3rem inner padding on desktop and ~2rem on
        tablet; starts ~1.5rem below the heading on mobile and ~2.5rem on
        desktop. Only the card itself fades in — the legal paragraphs never
        animate (terms spec §9).
      */}
      <section className="bg-fog pb-[var(--space-100)] pt-[1.5rem] lg:pt-[2.5rem]">
        <Container>
          <Reveal
            aria-label="Chuech studio terms and conditions"
            className="rounded-[1.25rem] bg-white p-[1.25rem] shadow-soft md:rounded-[1.75rem] md:p-[2rem] lg:px-[3.5rem] lg:py-[3rem]"
            y={24}
          >
            <LegalDetailsTable />

            <p className={`${LEGAL_TEXT} mt-[2rem] text-obsidian`}>{intro}</p>

            {sections.map((section, index) => (
              <LegalSection
                key={section.title}
                index={index + 1}
                title={section.title}
                paragraphs={section.paragraphs}
                className={index === 0 ? '!mt-0' : undefined}
              />
            ))}
          </Reveal>
        </Container>
      </section>
    </>
  )
}
