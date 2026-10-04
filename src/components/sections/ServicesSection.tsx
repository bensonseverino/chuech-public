import Container from '../primitives/Container'
import SectionHeading from '../primitives/SectionHeading'
import RevealRow from '../primitives/RevealRow'
import { SERVICES, SERVICES_HEADING } from '../../content/home'
import { asset } from '../../content/assets'

/**
 * "Our Services" (marino-services-section §5): a `SectionHeading tone="light"`
 * badge plus five hover-reveal rows — badge h2, row titles h3, one link per row.
 * Container keeps 30px side padding below lg (reported against the hero's
 * padding in the final QA note; hero untouched per spec §10).
 */
export default function ServicesSection() {
  return (
    <section
      id="services"
      aria-label={SERVICES_HEADING}
      className="scroll-mt-24 py-[var(--space-50)] text-obsidian lg:py-[var(--space-80)]"
    >
      <Container className="px-[30px]! lg:px-0!">
        <SectionHeading
          tone="light"
          iconClassName="h-3.5 w-[37px] md:w-[54px]"
          className="gap-2 px-5 py-3 text-[13px] leading-[1.5] font-medium text-obsidian"
        >
          {SERVICES_HEADING}
        </SectionHeading>

        <ul className="mt-[40px] lg:mt-0">
          {SERVICES.map((service) => (
            <RevealRow
              key={service.slug}
              href={`/${service.slug}/`}
              title={service.title}
              description={service.description}
              keywords={service.keywords}
              image={asset(service.image)}
              focus={service.focus}
            />
          ))}
        </ul>
      </Container>
    </section>
  )
}
