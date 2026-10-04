import { useState, type KeyboardEvent } from 'react'
import DarkPanel from '../primitives/DarkPanel'
import SectionHeading from '../primitives/SectionHeading'
import LongArrowLink from '../primitives/LongArrowLink'
import ProjectCard from '../primitives/ProjectCard'
import CrossfadeStack from '../primitives/CrossfadeStack'
import CarouselControls from '../primitives/CarouselControls'
import { LATEST_WORK, TESTIMONIALS, WORK_PROJECTS } from '../../content/home'

/**
 * "Our latest work" (latest-work spec): one pure-black panel holding two
 * staggered columns. The right column is the header + two cards, the left
 * column is two cards + the testimonial slider, so the testimonial lives
 * inside the panel rather than in its own section.
 */
export default function LatestWork() {
  const [index, setIndex] = useState(0)
  const total = TESTIMONIALS.length
  const prev = () => setIndex((i) => (i + total - 1) % total)
  const next = () => setIndex((i) => (i + 1) % total)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowLeft') prev()
    else if (event.key === 'ArrowRight') next()
  }

  const rightProjects = WORK_PROJECTS.filter((project) => project.column === 'right')
  const leftProjects = WORK_PROJECTS.filter((project) => project.column === 'left')

  return (
    <section
      id="work"
      aria-label={LATEST_WORK.heading}
      className="scroll-mt-24 py-[15px] md:py-[25px] lg:py-[80px]"
    >
      <DarkPanel>
        <div className="grid gap-y-[25px] md:grid-cols-2 md:items-start md:gap-x-[30px] md:gap-y-0 lg:gap-x-[calc(var(--u)*5)]">
          {/* DOM order: right column first (header + its two cards). */}
          <div className="flex min-w-0 flex-col gap-[25px] md:col-start-2 md:row-start-1 md:gap-[30px] lg:gap-[50px]">
            <div>
              <SectionHeading tone="dark" className="lg:-ml-[46px]">
                {LATEST_WORK.heading}
              </SectionHeading>
              <div className="ml-[26px] md:ml-[36px] lg:ml-0">
                <p className="mt-[25px] text-[14px] leading-[1.5] text-white md:text-[20px] lg:text-[16px]">
                  {LATEST_WORK.intro}
                </p>
                <div className="mt-[25px] md:mt-[30px]">
                  <LongArrowLink
                    href={LATEST_WORK.viewAll.href}
                    tone="mint"
                    thin
                    gapClassName="gap-[10px]"
                    arrowClassName="w-[34px] md:w-[46px] lg:w-[34px]"
                  >
                    {LATEST_WORK.viewAll.label}
                  </LongArrowLink>
                </div>
              </div>
            </div>

            {rightProjects.map((project) => (
              <ProjectCard key={project.slug} {...project} />
            ))}
          </div>

          {/* Left column: its two cards (md+) plus the testimonial slider. */}
          <div className="flex min-w-0 flex-col gap-[25px] md:col-start-1 md:row-start-1 md:gap-[30px] lg:gap-[50px]">
            {/* Mobile shows only the right-column cards (spec §1). `contents`
                lets the cards join the column's flex flow at md+. */}
            <div className="hidden md:contents">
              {leftProjects.map((project) => (
                <ProjectCard key={project.slug} {...project} />
              ))}
            </div>

            <section
              aria-roledescription="carousel"
              aria-label="Client testimonials"
              tabIndex={0}
              onKeyDown={onKeyDown}
              className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <CrossfadeStack activeIndex={index}>
                {TESTIMONIALS.map((testimonial) => (
                  <figure
                    key={testimonial.name}
                    className="border-l-[6px] border-primary pl-[18px] md:pl-[25px] lg:-ml-[calc(var(--u)*3.4)] lg:pl-[calc(var(--u)*3.4-6px)]"
                  >
                    <blockquote className="text-[clamp(19px,15.2px+1.02vw,28px)] leading-[1.3] text-white">
                      {testimonial.quote}
                    </blockquote>
                    <figcaption className="mt-[20px] text-[clamp(14px,12.1px+.51vw,17px)] leading-[1.3] text-primary md:mt-[30px] lg:mt-[25px] lg:text-[16px]">
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
                prevTone="secondary-on-mobile"
                className="mt-[22px] md:mt-[62px]"
              />
            </section>
          </div>
        </div>
      </DarkPanel>
    </section>
  )
}
