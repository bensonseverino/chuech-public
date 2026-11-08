import Container from '../primitives/Container'
import Button from '../primitives/Button'
import FooterIntro from '../footer/FooterIntro'
import FooterLinks from '../footer/FooterLinks'
import FooterBottom from '../footer/FooterBottom'
import { footer as footerData } from '../../data/footer'
import { company } from '../../data/terms'
import type { FooterView, SiteView } from '../../content/live/types'

/**
 * Footer (footer spec): full-bleed dark "Get in Touch" block with intro line,
 * giant heading, contact details row, mint Contact pill, arrow-link grid, and
 * bottom logo + legal row. All content driven by `src/data/footer.ts`; the
 * component's props are unchanged so no page needs editing.
 */
export default function SiteFooter({ footer, site }: { footer: FooterView; site: SiteView }) {
  // Content is now driven by src/data/footer.ts; props kept for compat.
  void footer
  void site
  const tradingName = company.tradingName

  return (
    <footer
      id="contact"
      className="scroll-mt-24 bg-obsidian text-white"
      style={{ paddingTop: 'var(--space-80)', paddingBottom: 'var(--space-40)' }}
    >
      <Container>
        {/* 1. Intro line — centered, underlined service links (spec §2.1) */}
        <FooterIntro
          text={footerData.intro.text}
          services={footerData.intro.services}
          tradingName={tradingName}
        />

        {/* 2. Giant "Get in Touch" heading (spec §2.2) */}
        <h2
          className="mt-[1.5rem] sm:mt-[2rem] lg:mt-[3.75rem] text-center font-display tracking-[-0.04em] leading-[0.95] text-white"
          style={{
            fontSize: 'clamp(3.5rem, 14.5vw, 15.5rem)',
            whiteSpace: 'nowrap',
          }}
        >
          {footerData.heading}
        </h2>

        {/* 3. Contact details row (spec §2.3) */}
        <address
          className="mt-[2.5rem] sm:mt-[3rem] lg:mt-[5rem] flex flex-col sm:flex-row items-center justify-center gap-[0.6rem] sm:gap-[2rem] text-white text-center sm:text-left"
          style={{
            fontSize: 'clamp(1.05rem, 1.2rem, 1.2rem)',
            lineHeight: 1.5,
            fontStyle: 'normal',
          }}
        >
          <a
            href={`mailto:${footerData.details.email}`}
            className="underline underline-offset-2 decoration-white/30 hover:decoration-white hover:text-primary transition-colors whitespace-nowrap"
          >
            {footerData.details.email}
          </a>
          <span aria-hidden="true" className="sm:inline hidden">
            &middot;
          </span>
          <a
            href={`tel:${footerData.details.phone.replace(/\s+/g, '')}`}
            className="underline underline-offset-2 decoration-white/30 hover:decoration-white hover:text-primary transition-colors whitespace-nowrap"
          >
            {footerData.details.phone}
          </a>
          <span aria-hidden="true" className="sm:inline hidden">
            &middot;
          </span>
          <span className="whitespace-nowrap">{footerData.details.address}</span>
        </address>

        {/* 4. Contact button (spec §2.4) */}
        <div className="mt-[1.5rem] sm:mt-[2rem] lg:mt-[2.75rem] flex justify-center">
          <Button variant="mint" to={footerData.cta.href} size="footer">
            {footerData.cta.label}
          </Button>
        </div>

        {/* 5. Link grid — arrow links, column-flow (spec §2.5) */}
        <FooterLinks links={footerData.links} />

        {/* 6. Bottom row — logo + legal (spec §2.6) */}
        <div
          className="mt-[3.5rem] sm:mt-[4rem] lg:mt-[5.5rem] pt-[3.5rem] sm:pt-[4rem] lg:pt-[5rem] border-t border-white/15"
        >
          <FooterBottom tradingName={tradingName} legalLine={footerData.legalLine} />
        </div>
      </Container>
    </footer>
  )
}