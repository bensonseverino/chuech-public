import Container from '../primitives/Container'
import SectionHeading from '../primitives/SectionHeading'
import RevealRow from '../primitives/RevealRow'
import { imageSrc } from '../../content/assets'
import type { ServiceView } from '../../content/live/types'

type ServicesSectionProps = {
  /** Visible heading (the Home badge copy). */
  heading: string
  /** Rows to render, in CMS order. */
  services: ServiceView[]
  /** Home renders the "Our Services" badge; the page variant keeps an sr-only h2. */
  showBadge?: boolean
  /**
   * `home` keeps the section padding; `page` drops the top padding and tightens
   * the bottom so the hero above and the logo strip below sit close (spec §5.1).
   */
  variant?: 'home' | 'page'
}

/**
 * "Our Services" (marino-services-section §5): a `SectionHeading tone="light"`
 * badge plus five hover-reveal rows — badge h2, row titles h3, one link per row.
 * Container keeps 30px side padding below lg (reported against the hero's
 * padding in the final QA note; hero untouched per spec §10).
 *
 * Page variant (services spec §5.1): no badge (sr-only `<h2>Our services</h2>`),
 * top padding 0, bottom 35px at md+, 20px on mobile.
 */
export default function ServicesSection({
  heading,
  services,
  showBadge = true,
  variant = 'home',
}: ServicesSectionProps) {
  const isPage = variant === 'page'

  return (
    <section
      id="services"
      aria-label={heading}
      className={
        isPage
          ? 'scroll-mt-24 pb-5 text-obsidian md:pb-[35px]'
          : 'scroll-mt-24 py-[var(--space-50)] text-obsidian lg:py-[var(--space-80)]'
      }
    >
      <Container className="px-[30px]! lg:px-0!">
        {showBadge ? (
          <SectionHeading
            tone="light"
            iconClassName="h-3.5 w-[37px] md:w-[54px]"
            className="gap-2 px-5 py-3 text-[13px] leading-[1.5] font-medium text-obsidian"
          >
            {heading}
          </SectionHeading>
        ) : (
          <h2 className="sr-only">Our services</h2>
        )}

        <ul className={showBadge ? 'mt-[40px] lg:mt-0' : 'mt-0'}>
          {services.map((service) => (
            <RevealRow
              key={service.slug}
              href={`/${service.pageSlug ?? service.slug}/`}
              title={service.title}
              description={service.description}
              keywords={service.keywords}
              image={imageSrc(service.image)}
              focus={service.focus}
            />
          ))}
        </ul>
      </Container>
    </section>
  )
}
