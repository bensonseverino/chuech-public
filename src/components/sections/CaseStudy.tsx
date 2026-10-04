import Container from '../primitives/Container'
import LongArrowLink from '../primitives/LongArrowLink'
import { CASE_STUDY } from '../../content/home'
import { asset } from '../../content/assets'
import blackbirdLogo from '../../assets/marino/blackbird-logo.svg'

/**
 * Blackbird case study (remaining-sections spec §5.8): white panel, two
 * columns at lg+ — logo, 400% Revenue growth, blurb, View Work, Adrian
 * Lambert quote on the left; case image on the right.
 */
export default function CaseStudy() {
  return (
    <section aria-label={CASE_STUDY.heading} className="scroll-mt-24 py-[var(--space-50)] lg:py-[var(--space-80)]">
      <Container>
        <h2 className="clamp-h2 font-bold tracking-[-0.019em] text-obsidian">{CASE_STUDY.heading}</h2>
        <div className="mt-[var(--space-25)] grid grid-cols-1 gap-[var(--space-25)] rounded-panel bg-white p-[25px] shadow-soft md:p-[var(--space-40)] lg:grid-cols-2 lg:items-center">
          {/* Left: text */}
          <div>
            <img
              src={blackbirdLogo}
              alt="Blackbird"
              width={600}
              height={120}
              loading="lazy"
              decoding="async"
              className="h-10 w-auto"
            />
            <p
              className="mt-4 font-semibold tracking-[-0.024em] text-obsidian"
              style={{ fontSize: 'clamp(53px, 7vw, 82.5px)', lineHeight: 1.1 }}
            >
              {CASE_STUDY.stat}
              <span className="block text-[clamp(18px,2.2vw,28px)] font-medium tracking-normal text-obsidian">
                {CASE_STUDY.statLabel}
              </span>
            </p>
            <p className="mt-4 max-w-[55ch] text-[16px] leading-[24px] text-obsidian">{CASE_STUDY.blurb}</p>
            <div className="mt-6">
              <LongArrowLink href={CASE_STUDY.cta.href}>{CASE_STUDY.cta.label}</LongArrowLink>
            </div>
            <figure className="mt-6 max-w-[55ch] border-t border-silver pt-6">
              <blockquote className="text-[clamp(18px,2.2vw,28px)] leading-[1.5] font-normal text-obsidian">
                {CASE_STUDY.testimonial.quote}
              </blockquote>
              <figcaption className="mt-3 text-[16px] leading-[24px]">
                <span className="font-semibold">{CASE_STUDY.testimonial.name}</span>
                <span className="text-obsidian/70">: {CASE_STUDY.testimonial.company}</span>
              </figcaption>
            </figure>
          </div>

          {/* Right: case image */}
          <span className="relative block overflow-hidden rounded-media">
            <img
              src={asset('blackbird')}
              alt="Blackbird brand and website work by Marino"
              width={1600}
              height={1000}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.04]"
            />
          </span>
        </div>
      </Container>
    </section>
  )
}
