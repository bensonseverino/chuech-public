import Container from '../primitives/Container'
import { Reveal } from '../ui/Reveal'
import SectionHeading, { TITLE_ROLE } from '../primitives/SectionHeading'
import Button from '../primitives/Button'
import Inline from '../../content/live/inline'
import type { ServicePageView } from '../../content/live/types'

/**
 * Dark pillars panel (web-design spec §5.4): six titled paragraphs with
 * lavender dots on black, one column on mobile and two from md. The panel grows
 * with its content — nothing is clipped — and closes with a ghost button.
 *
 * The section has no visible heading, so it carries `pillars.label` as its
 * accessible name (defaulting to web-design's).
 */
export default function PillarsPanel({ pillars }: { pillars: ServicePageView['pillars'] }) {
  return (
    <Reveal
      as="section"
      aria-label={pillars.label ?? 'Web design services'}
      className="mt-[50px] lg:mt-[62px]"
    >
      <Container>
        <div className="rounded-panel bg-black px-[25px] py-[25px] text-white lg:px-[70px] lg:py-[62px]">
          <ul className="grid gap-y-[50px] md:grid-cols-2 md:gap-x-[25px] lg:gap-x-[70px] lg:gap-y-[62px]">
            {pillars.items.map((item) => (
              <li key={item.title} className="min-w-0">
                <SectionHeading
                  as="h3"
                  variant="dot"
                  dotColor="secondary"
                  className={`${TITLE_ROLE} lg:-ml-[34px]`}
                >
                  {item.title}
                </SectionHeading>
                <p className="mt-[25px] text-[16px] leading-[24px] text-white/80">
                  <Inline text={item.body} tone="dark" />
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-[50px]">
            <Button variant="ghost-dark" to={pillars.cta.to}>
              {pillars.cta.label}
            </Button>
          </div>
        </div>
      </Container>
    </Reveal>
  )
}
