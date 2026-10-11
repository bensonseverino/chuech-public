import DarkPanel from '../primitives/DarkPanel'
import SectionHeading from '../primitives/SectionHeading'
import LongArrowLink from '../primitives/LongArrowLink'
import ProjectCard from '../primitives/ProjectCard'
import TestimonialSlider from '../primitives/TestimonialSlider'
import { LATEST_WORK } from '../../content/home'
import { PROJECTS } from '../../content/projects'

/**
 * "Our latest work" (latest-work spec): one pure-black panel holding two
 * staggered columns. The right column is the header + two cards, the left
 * column is two cards + the testimonial slider, so the testimonial lives
 * inside the panel rather than in its own section.
 *
 * `intro` overrides the intro paragraph (services page uses different copy);
 * the default keeps the Home text.
 */
export default function LatestWork({ intro = LATEST_WORK.intro }: { intro?: string }) {
  const rightProjects = PROJECTS.filter((project) => project.column === 'right')
  const leftProjects = PROJECTS.filter((project) => project.column === 'left')

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
                  {intro}
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

            <TestimonialSlider tone="dark" />
          </div>
        </div>
      </DarkPanel>
    </section>
  )
}
