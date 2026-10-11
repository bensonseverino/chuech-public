import { useState } from 'react'
import Container from '../primitives/Container'
import Expandable from '../primitives/Expandable'
import LongArrowLink from '../primitives/LongArrowLink'
import RichText from '../primitives/RichText'
import SectionHeading, { TITLE_ROLE } from '../primitives/SectionHeading'
import { ChevronIcon } from '../icons'
import { FAQ, FAQ_ITEMS, FOUNDER_BLOCK, type FaqItem } from '../../content/home'

type FaqSectionProps = {
  /** Defaults to Home's heading. */
  heading?: string
  /** `start` = Home's left-aligned title; `end` = right-aligned, dot trailing. */
  align?: 'start' | 'end'
  /** Defaults to Home's six questions. */
  items?: FaqItem[]
  /**
   * `plus` = Home's fading plus chip with compact rows; `arrow` = the service
   * page's mint down-arrow chip (22px, 25px at lg) with the roomier 25/30/35px
   * row padding.
   */
  icon?: 'plus' | 'arrow'
  /** Pass `null` to drop the intro paragraph. Defaults to Home's. */
  intro?: string | null
  /** `false` drops the founder block (service pages show the FAQ alone). */
  showFounder?: boolean
  /** Overrides the section's bottom padding (service pages use 80px). */
  bottomSpace?: string
}

/**
 * FAQ accordion (remaining-sections spec §5.9; web-design spec §5.8):
 * one item open at a time, all closed by default, the whole row a button with
 * `aria-expanded`/`aria-controls`. Every prop defaults to Home's current look,
 * so the page-level props are the only difference on service pages.
 */
export default function FaqSection({
  heading = FAQ.heading,
  align = 'start',
  items = FAQ_ITEMS,
  icon = 'plus',
  intro = FAQ.intro,
  showFounder = true,
  bottomSpace,
}: FaqSectionProps) {
  // 0 = all closed (default); otherwise the 1-based index of the open item.
  const [openIndex, setOpenIndex] = useState(0)
  const roomy = icon === 'arrow'

  return (
    <section
      id="faq"
      aria-label={heading}
      className="scroll-mt-24 py-[var(--space-50)] lg:py-[var(--space-80)]"
      style={bottomSpace ? { paddingBottom: bottomSpace } : undefined}
    >
      <Container>
        <div className="mx-auto max-w-[900px]">
          {align === 'end' ? (
            <SectionHeading
              variant="dot"
              align="end"
              className={`${TITLE_ROLE} text-obsidian lg:-mr-[34px]`}
            >
              {heading}
            </SectionHeading>
          ) : (
            <h2 className="clamp-h2 font-bold tracking-[-0.019em] text-obsidian">{heading}</h2>
          )}
          {intro ? (
            <p className="mt-3 max-w-[60ch] text-[16px] leading-[24px] text-obsidian/70">{intro}</p>
          ) : null}

          <ul className={align === 'end' ? 'mt-[40px]' : 'mt-8'}>
            {items.map((item, index) => {
              const open = openIndex === index + 1
              const panelId = `faq-panel-${index}`
              const triggerId = `faq-trigger-${index}`
              return (
                <li key={item.question} className="border-b border-silver">
                  <h3>
                    <button
                      type="button"
                      id={triggerId}
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? 0 : index + 1)}
                      className={`group flex w-full items-center justify-between gap-6 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian ${
                        roomy ? 'py-[25px] md:py-[30px] lg:py-[35px]' : 'py-5'
                      }`}
                    >
                      <span
                        className={
                          roomy
                            ? 'text-[clamp(16px,11.6px+1.17vw,33px)] leading-[1.3] font-normal text-obsidian'
                            : 'text-[clamp(18px,2vw,28px)] leading-[1.3] font-medium text-obsidian'
                        }
                      >
                        {item.question}
                      </span>
                      {roomy ? (
                        <span
                          aria-hidden="true"
                          className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-primary transition-transform ease-standard group-hover:shadow-glow-sm lg:h-[25px] lg:w-[25px] ${
                            open ? 'rotate-180' : ''
                          }`}
                        >
                          <ChevronIcon className="h-3 w-3 rotate-90 text-obsidian" />
                        </span>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary transition-shadow group-hover:shadow-glow-sm"
                        >
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            strokeLinecap="round"
                            className={`h-4 w-4 text-obsidian transition-opacity duration-350 ${open ? 'opacity-0' : 'opacity-100'}`}
                          >
                            <path d="M8 2v12M2 8h12" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </h3>
                  <Expandable open={open} id={panelId}>
                    <div className="pb-6 pr-14 text-[16px] leading-[24px] text-obsidian">
                      <RichText segments={item.answer} />
                    </div>
                  </Expandable>
                </li>
              )
            })}
          </ul>

          {/* Founder block */}
          {showFounder ? (
            <div className="mt-[var(--space-40)] border-t border-silver pt-[var(--space-40)]">
              <h3 className="text-[clamp(24px,2.6vw,33px)] leading-[1.25] font-medium tracking-[-0.03em] text-obsidian">
                {FOUNDER_BLOCK.heading}
              </h3>
              <div className="mt-4 flex max-w-[70ch] flex-col gap-4 text-[16px] leading-[24px] text-obsidian">
                {FOUNDER_BLOCK.paragraphs.map((paragraph, index) => (
                  <p key={index}>
                    <RichText segments={paragraph} />
                  </p>
                ))}
              </div>
              <div className="mt-6">
                <LongArrowLink href={FOUNDER_BLOCK.cta.href}>{FOUNDER_BLOCK.cta.label}</LongArrowLink>
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
