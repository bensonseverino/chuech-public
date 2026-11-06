import { Reveal } from './ui/Reveal'
import Container from '@/components/primitives/Container'
import SectionHeading from '@/components/primitives/SectionHeading'
import OutlineChip from '@/components/primitives/OutlineChip'
import { about } from '@/data/about'
import { ROUTES } from '@/routes'

/**
 * Our Services card (§4.4). White rounded card, bullet + heading, body paragraph,
 * row of outlined pills linking to /services. Pills wrap on mobile.
 */
export default function ServicesCard() {
  const { services } = about

  return (
    <Reveal
      as="section"
      aria-label={services.heading}
      className="scroll-mt-24 py-[var(--space-50)] md:py-[var(--space-80)]"
      stagger={0.1}
    >
      <Container>
        <div
          className="rounded-[1.75rem] bg-white p-6 md:p-[50px] lg:p-[60px] shadow-soft"
          style={{ borderRadius: '1.75rem' }}
        >
          <div className="flex flex-col gap-[30px]">
            {/* Bullet + heading */}
            <SectionHeading variant="dot" dotColor="obsidian" className="gap-3 max-w-[28em]">
              {services.heading}
            </SectionHeading>

            {/* Body */}
            <p className="text-[16px] leading-[1.6] text-obsidian md:text-[18px] max-w-[48ch]">
              {services.body}
            </p>

            {/* Outlined pills */}
            <div className="flex flex-wrap gap-[8px] md:gap-[12px]">
              {services.pills.map((pill: string) => (
                <OutlineChip
                  key={pill}
                  tone="light"
                  size="lg"
                  to={ROUTES.services}
                  className="whitespace-nowrap"
                >
                  {pill}
                </OutlineChip>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Reveal>
  )
}