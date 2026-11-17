import { useId } from 'react'
import Container from '../primitives/Container'
import SectionHeading, { TITLE_ROLE } from '../primitives/SectionHeading'
import { Reveal } from '../ui/Reveal'
import ContactForm from '../ContactForm'

export type CallBackContext = {
  projectSlug: string
  projectTitle: string
}

const FIELDS = [
  { name: 'name', label: 'Name*', type: 'text' as const, required: true },
  { name: 'phone', label: 'Phone*', type: 'tel' as const, required: true },
  { name: 'email', label: 'Email', type: 'email' as const, required: false },
]

/**
 * The "Request a Call Back" card on a case study (cms-projects-spec.md §2.6):
 * one white rounded card — the project's testimonial (mint left border,
 * "Name: **Company**") beside the call-back form (Name*, Phone*, Email and the
 * mint pill button). Submissions carry the project context so the inbox shows
 * which project they came from (forms-reviews spec §8.3).
 *
 * Without a testimonial the card shows only the form, centred at a comfortable
 * width (§2 empty-section rule).
 */
export default function CallBackCard({ testimonial, context }: {
  testimonial?: { quote: string; author: string; company: string }
  context: CallBackContext
}) {
  const headingId = useId()

  return (
    <section aria-label="Request a call back" className="py-[50px] md:py-[62px] lg:py-[80px]">
      <Container>
        <Reveal>
          <div
            className={`rounded-panel bg-white px-[25px] py-[25px] shadow-soft lg:px-[70px] lg:py-[62px] ${
              testimonial ? '' : 'mx-auto max-w-[560px]'
            }`}
          >
            <div
              className={
                testimonial
                  ? 'grid gap-[25px] md:grid-cols-2 md:items-start md:gap-[25px] lg:gap-[70px]'
                  : ''
              }
            >
              {testimonial ? (
                <figure className="min-w-0 border-l-[6px] border-primary pl-[18px] md:pl-[25px]">
                  <blockquote className="text-[clamp(19px,15.2px+1.02vw,28px)] leading-[1.3] text-obsidian">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-[20px] text-[clamp(14px,12.1px+.51vw,17px)] leading-[1.3] text-obsidian md:mt-[30px] lg:mt-[25px] lg:text-[16px]">
                    {testimonial.author}:{' '}
                    <strong className="font-bold">{testimonial.company}</strong>
                  </figcaption>
                </figure>
              ) : null}

              <div className="min-w-0">
                <SectionHeading
                  variant="dot"
                  id={headingId}
                  className={`${TITLE_ROLE} text-obsidian`}
                >
                  Request a Call Back
                </SectionHeading>
                <div className="mt-[25px]">
                  <ContactForm
                    fields={FIELDS}
                    submitLabel="Request a Call Back"
                    source="call-back"
                    projectSlug={context.projectSlug}
                    projectTitle={context.projectTitle}
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
