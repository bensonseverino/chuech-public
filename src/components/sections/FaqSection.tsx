import { useState } from 'react'
import Container from '../primitives/Container'
import Expandable from '../primitives/Expandable'
import LongArrowLink from '../primitives/LongArrowLink'
import RichText from '../primitives/RichText'
import { FAQ, FAQ_ITEMS, FOUNDER_BLOCK } from '../../content/home'

/**
 * FAQ (remaining-sections spec §5.9): Expandable accordion, one item open at
 * a time, all closed by default; 32px mint Plus/Minus chips; founder block
 * underneath.
 */
export default function FaqSection() {
  // 0 = all closed (default); otherwise the 1-based index of the open item.
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" aria-label={FAQ.heading} className="scroll-mt-24 py-[var(--space-50)] lg:py-[var(--space-80)]">
      <Container>
        <div className="mx-auto max-w-[900px]">
          <h2 className="clamp-h2 font-bold tracking-[-0.019em] text-obsidian">{FAQ.heading}</h2>
          <p className="mt-3 max-w-[60ch] text-[16px] leading-[24px] text-obsidian/70">{FAQ.intro}</p>

          <ul className="mt-8">
            {FAQ_ITEMS.map((item, index) => {
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
                      className="group flex w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
                    >
                      <span className="text-[clamp(18px,2vw,28px)] leading-[1.3] font-medium text-obsidian">
                        {item.question}
                      </span>
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
        </div>
      </Container>
    </section>
  )
}
