import Marquee from '../primitives/Marquee'
import MediaFrame from '../primitives/MediaFrame'
import FloatPill from '../primitives/FloatPill'
import Button from '../primitives/Button'
import Container from '../primitives/Container'
import {
  TICKER_ITEMS,
  TICKER_SR,
  STATS_LINES,
  BRIEF_CTA,
  EXPERIENCE_MARQUEE,
  EXPERIENCE_PILLS,
  EXPERIENCE_SR,
} from '../../content/home'
import { asset } from '../../content/assets'
import './ExperienceSection.css'

/* TODO(asset): the three frames use video-4/5/6.mp4 (with matching posters)
   from the live site — the local stats-*.svg placeholders stand in until the
   real files are added. Mobile shows only the first two. */
const EXPERIENCE_MEDIA = ['stats-1', 'stats-2', 'stats-3']

/**
 * "Decades of experience" section (experience spec, replaces §5.5 StatsBand
 * and §5.6 BriefCta).
 *
 * - **< 1024px:** the marquee stage — a giant scrolling headline with two mint
 *   pills and three glowing frames floating around it — plus the one-line CTA.
 * - **>= 1024px:** the approved layout, verbatim: the full-bleed ticker, the
 *   stats display with inline media frames, and the brief CTA. Nothing moves.
 */
export default function ExperienceSection() {
  return (
    <section aria-label="Marino in numbers" className="stats-section scroll-mt-24">
      {/* ---------- < 1024px: floating stage + CTA row ---------- */}
      <div className="lg:hidden">
        <p className="sr-only">{EXPERIENCE_SR}</p>

        <div className="stats-stage" aria-hidden="true">
          <div className="stats-marquee">
            <Marquee speed={100} bleed>
              <span className="stats-text">
                {EXPERIENCE_MARQUEE[0]}
                <i className="stats-dot" />
              </span>
              <span className="stats-text">
                {EXPERIENCE_MARQUEE[1]}
                <i className="stats-dot" />
              </span>
            </Marquee>
          </div>

          <MediaFrame
            className="stats-float stats-m1"
            radius="card md:media"
            src={asset(EXPERIENCE_MEDIA[0])}
          />
          <FloatPill className="stats-float stats-p1" size="sm" variant="a">
            {EXPERIENCE_PILLS[0]}
          </FloatPill>
          <MediaFrame
            className="stats-float stats-m2"
            radius="card md:media"
            src={asset(EXPERIENCE_MEDIA[1])}
          />
          <FloatPill className="stats-float stats-p2" size="sm" variant="b">
            {EXPERIENCE_PILLS[1]}
          </FloatPill>
          <MediaFrame
            className="stats-float stats-m3"
            radius="media"
            halo
            src={asset(EXPERIENCE_MEDIA[2])}
          />
        </div>

        <div className="stats-cta px-4">
          <p className="font-semibold text-obsidian text-[16px] md:text-[17px]">{BRIEF_CTA.text}</p>
          <Button variant="mint" href={BRIEF_CTA.button.href}>
            {BRIEF_CTA.button.label}
          </Button>
        </div>
      </div>

      {/* ---------- >= 1024px: approved layout, unchanged ---------- */}
      <div className="hidden lg:block">
        {/* --- Ticker: full bleed, hairline top and bottom --- */}
        <div className="border-y border-silver py-[var(--space-25)]">
          <p className="sr-only">{TICKER_SR}</p>
          <Marquee seconds={45}>
            <ul className="flex items-center" style={{ gap: '40px' }}>
              {TICKER_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center whitespace-nowrap text-[28px] leading-[1.2] font-medium text-obsidian"
                  style={{ gap: '40px' }}
                >
                  {item}
                  <span
                    aria-hidden="true"
                    className="inline-block h-[6px] w-[6px] shrink-0 rounded-full bg-obsidian"
                  />
                </li>
              ))}
            </ul>
          </Marquee>
        </div>

        {/* --- Stats display: hero-language lines with inline media frames --- */}
        <div className="py-[var(--space-50)] lg:py-[var(--space-80)]">
          <div className="mx-auto px-4 md:px-8 lg:w-[calc(var(--u)*70.56)] lg:px-0">
            <p
              className="font-semibold tracking-[-0.024em] text-obsidian"
              style={{ fontSize: 'clamp(53px, 8vw, 82.5px)', lineHeight: 1.1 }}
            >
              <span className="flex flex-wrap items-center gap-x-[0.3em] gap-y-2">
                {STATS_LINES[0]}
                <MediaFrame
                  src={asset(EXPERIENCE_MEDIA[0])}
                  className="align-middle"
                  style={{ width: 'calc(var(--u)*9.07)' }}
                />
              </span>
              <span className="mt-2 flex flex-wrap items-center gap-x-[0.3em] gap-y-2 lg:mt-0">
                <MediaFrame
                  src={asset(EXPERIENCE_MEDIA[1])}
                  className="align-middle"
                  style={{ width: 'calc(var(--u)*9.07)' }}
                />
                {STATS_LINES[1]}
                <MediaFrame
                  src={asset(EXPERIENCE_MEDIA[2])}
                  className="hidden lg:inline-block"
                  style={{ width: 'calc(var(--u)*9.07)' }}
                />
              </span>
            </p>
          </div>
        </div>

        {/* --- Brief CTA (was §5.6, verbatim) --- */}
        <div className="py-[var(--space-50)] lg:py-[var(--space-80)]">
          <Container>
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-center md:gap-10">
              <p className="text-[clamp(18px,2vw,33px)] leading-[1.3] font-medium text-obsidian md:text-[33px] md:leading-[1.3]">
                {BRIEF_CTA.text}
              </p>
              <Button variant="mint" href={BRIEF_CTA.button.href}>
                {BRIEF_CTA.button.label}
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </section>
  )
}
