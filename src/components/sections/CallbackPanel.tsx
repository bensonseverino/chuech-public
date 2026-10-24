import { useId } from 'react'
import Container from '../primitives/Container'
import SectionHeading, { TITLE_ROLE } from '../primitives/SectionHeading'
import Button from '../primitives/Button'
import TestimonialSlider from '../primitives/TestimonialSlider'
import ContactForm from '../ContactForm'
import { imageSrc } from '../../content/assets'
import Inline from '../../content/live/inline'
import type { ServicePageView, TestimonialView } from '../../content/live/types'

/**
 * "Why your business needs more than a website that looks nice" (web-design
 * spec §5.5): a white panel with the dot heading, body copy, a dark Contact
 * button and the light testimonial slider on the left, and the team photo plus
 * the callback form on the right.
 *
 * Mobile is one column in DOM order (content, photo, form); at md+ the two
 * columns sit side by side with their tops aligned.
 */
export default function CallbackPanel({
  why,
  testimonials,
}: {
  why: ServicePageView['why']
  testimonials: TestimonialView[]
}) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="mt-[50px] lg:mt-[62px]">
      <Container>
        <div className="rounded-panel bg-white px-[25px] py-[25px] shadow-soft lg:px-[70px] lg:py-[62px]">
          <div className="grid gap-[25px] md:grid-cols-2 md:items-start md:gap-[25px] lg:gap-[70px]">
            {/* --- Left column --- */}
            <div className="min-w-0 md:col-start-1 md:row-start-1">
              <SectionHeading
                variant="dot"
                id={headingId}
                maxWidth={why.headingMaxWidth}
                className={`${TITLE_ROLE} text-obsidian`}
              >
                {why.heading}
              </SectionHeading>

              <p className="mt-[25px] text-[16px] leading-[24px] text-obsidian">
                <Inline text={why.body} />
              </p>

              <div className="mt-[25px]">
                <Button variant="dark" to={why.cta.to}>
                  {why.cta.label}
                </Button>
              </div>

              <TestimonialSlider
                tone="light"
                className="mt-[40px]"
                testimonials={testimonials}
              />
            </div>

            {/* --- Right column: photo, then the callback form --- */}
            <div className="min-w-0 md:col-start-2 md:row-start-1">
              <img
                src={imageSrc(why.image.src)}
                alt={why.image.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[16/9] w-full rounded-card-lg object-cover"
              />
              <div className="mt-[30px]">
                <ContactForm
                  fields={why.form.fields}
                  submitLabel={why.form.submitLabel}
                  source={why.form.source}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
