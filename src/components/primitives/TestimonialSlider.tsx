import { useState, type KeyboardEvent } from 'react'
import CrossfadeStack from './CrossfadeStack'
import CarouselControls from './CarouselControls'
import type { TestimonialView } from '../../content/live/types'

type Tone = 'dark' | 'light'

/**
 * Quote slider (latest-work spec §5.6, extracted here so the web-design
 * callback panel can reuse it — web-design spec §2).
 *
 * `tone="dark"` is the original panel version (mint bar flush with the dark
 * panel's left edge, white quote, mint attribution); `tone="light"` is the
 * white-panel version (obsidian quote and attribution, mint controls with an
 * obsidian counter). Same six quotes, same crossfade, no autoplay, loops.
 */
export default function TestimonialSlider({
  tone = 'dark',
  className = '',
  testimonials,
}: {
  tone?: Tone
  className?: string
  testimonials: TestimonialView[]
}) {
  const [index, setIndex] = useState(0)
  const total = testimonials.length
  const prev = () => setIndex((i) => (i + total - 1) % total)
  const next = () => setIndex((i) => (i + 1) % total)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowLeft') prev()
    else if (event.key === 'ArrowRight') next()
  }

  if (total === 0) return null

  // The dark tone hangs its bar into the black panel's padding (3.4u); the
  // light tone hangs it into the white panel's 70px desktop padding (§4.4).
  const figureInset =
    tone === 'dark'
      ? 'lg:-ml-[calc(var(--u)*3.4)] lg:pl-[calc(var(--u)*3.4-6px)]'
      : 'lg:-ml-[70px] lg:pl-[64px]'

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={`focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${className}`}
    >
      <CrossfadeStack activeIndex={index}>
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className={`border-l-[6px] border-primary pl-[18px] md:pl-[25px] ${figureInset}`}
          >
            <blockquote
              className={`text-[clamp(19px,15.2px+1.02vw,28px)] leading-[1.3] ${
                tone === 'light' ? 'text-obsidian' : 'text-white'
              }`}
            >
              {testimonial.quote}
            </blockquote>
            <figcaption
              className={`mt-[20px] text-[clamp(14px,12.1px+.51vw,17px)] leading-[1.3] md:mt-[30px] lg:mt-[25px] lg:text-[16px] ${
                tone === 'light' ? 'text-obsidian' : 'text-primary'
              }`}
            >
              {testimonial.name}: <strong className="font-bold">{testimonial.company}</strong>
            </figcaption>
          </figure>
        ))}
      </CrossfadeStack>

      <CarouselControls
        index={index}
        total={total}
        onPrev={prev}
        onNext={next}
        prevTone={tone === 'light' ? 'primary' : 'secondary-on-mobile'}
        tone={tone}
        className="mt-[22px] md:mt-[62px]"
      />
    </section>
  )
}
