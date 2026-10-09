import { Link } from 'react-router'
import Container from '../primitives/Container'
import Button from '../primitives/Button'
import RichText from '../primitives/RichText'
import { FOOTER } from '../../content/home'

/**
 * Footer (remaining-sections spec §5.10): obsidian canvas, statement with
 * inline mint service links, Get in Touch block, link row, alt logo and
 * company/VAT line above a white/15 hairline.
 */
export default function SiteFooter() {
  return (
    <footer id="contact" className="scroll-mt-24 bg-obsidian pt-[var(--space-80)] pb-[var(--space-40)] text-white">
      <Container>
        {/* Statement */}
        <p className="max-w-[70ch] text-[clamp(18px,2vw,28px)] leading-[1.5] font-normal text-white">
          <RichText segments={[...FOOTER.statement]} tone="dark" />
        </p>

        {/* Get in Touch */}
        <div className="mt-[var(--space-40)] grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-[clamp(24px,2.6vw,33px)] leading-[1.3] font-medium text-white">{FOOTER.getInTouch}</h2>
            <ul className="mt-4 flex flex-col gap-2 text-[16px] leading-[24px]">
              <li>
                <a
                  href={FOOTER.email.href}
                  className="text-white/70 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {FOOTER.email.label}
                </a>
              </li>
              <li>
                <a
                  href={FOOTER.phone.href}
                  className="text-white/70 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {FOOTER.phone.label}
                </a>
              </li>
              <li className="text-white/70">{FOOTER.address}</li>
            </ul>
          </div>
          <div className="flex items-start md:justify-end">
            <Button variant="mint" to={FOOTER.contact.href}>
              {FOOTER.contact.label}
            </Button>
          </div>
        </div>

        {/* Link list — column-first: mobile 2×4, tablet 3×(3,3,2), desktop 4×2 (§9). */}
        <nav aria-label="Footer" className="mt-[var(--space-40)]">
          <ul className="grid grid-flow-col grid-cols-2 grid-rows-4 gap-x-6 gap-y-3 md:grid-cols-3 md:grid-rows-3 lg:grid-cols-4 lg:grid-rows-2">
            {FOOTER.links.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-[14px] font-medium text-white/70 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom: hairline, alt logo, legal */}
        <div className="mt-[var(--space-40)] border-t border-white/15 pt-6">
          <p
            aria-hidden="true"
            className="text-[18px] font-medium tracking-[0.2em] whitespace-nowrap text-white"
          >
            MARINO
          </p>
          <p className="mt-3 text-[13px] leading-[1.2] font-medium text-white/70">{FOOTER.legal}</p>
        </div>
      </Container>
    </footer>
  )
}
