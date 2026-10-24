import { useId } from 'react'
import Container from '../primitives/Container'
import SectionHeading, { TITLE_ROLE } from '../primitives/SectionHeading'
import CheckList from '../primitives/CheckList'
import Button from '../primitives/Button'
import { imageSrc } from '../../content/assets'
import Inline from '../../content/live/inline'
import type { ServicePageView } from '../../content/live/types'

/**
 * "Your website is where you grow your business" (web-design spec §5.2): a
 * white panel with a dot heading, hairline, lead, six-item tick list, body copy
 * and a dark Contact button, beside a top-aligned photo.
 *
 * DOM order is text then photo (mobile keeps that order — the photo is last);
 * at md+ the photo is placed in the left column and is deliberately not
 * stretched, so the space under it stays empty.
 */
export default function FeaturePanel({ feature }: { feature: ServicePageView['feature'] }) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="mt-[50px] lg:mt-[100px]">
      <Container>
        <div className="rounded-panel bg-white px-[25px] py-[25px] shadow-soft lg:px-[70px] lg:py-[62px]">
          <div className="grid gap-[25px] md:grid-cols-2 md:gap-[25px] lg:gap-[70px]">
            {/* --- Text column (DOM first, right column at md+) --- */}
            <div className="order-1 min-w-0 md:order-2 md:col-start-2 md:row-start-1">
              <SectionHeading
                variant="dot"
                id={headingId}
                maxWidth={feature.headingMaxWidth}
                className={`${TITLE_ROLE} text-obsidian`}
              >
                {feature.heading}
              </SectionHeading>

              {/* Hairline under the heading, across the column. */}
              <div aria-hidden="true" className="mt-[25px] h-px w-full bg-silver" />

              <p className="mt-[25px] text-[16px] leading-[24px] font-semibold text-obsidian">
                <Inline text={feature.lead} />
              </p>

              <CheckList items={feature.checklist} className="mt-[25px]" />

              <p className="mt-[25px] text-[16px] leading-[24px] text-obsidian">
                <Inline text={feature.body} />
              </p>

              <div className="mt-[25px]">
                <Button variant="dark" to={feature.cta.to}>
                  {feature.cta.label}
                </Button>
              </div>
            </div>

            {/* --- Photo column (last on mobile, left column at md+) --- */}
            <div className="order-2 min-w-0 md:order-1 md:col-start-1 md:row-start-1 md:self-start">
              <img
                src={imageSrc(feature.image.src)}
                alt={feature.image.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[16/9] w-full rounded-card-lg object-cover md:aspect-[6/5] lg:max-w-[calc(var(--u)*30)]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
