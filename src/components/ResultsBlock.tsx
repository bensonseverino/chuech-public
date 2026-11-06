import DarkPanel from '@/components/primitives/DarkPanel'
import { Reveal } from './ui/Reveal'
import Container from '@/components/primitives/Container'
import SectionHeading from '@/components/primitives/SectionHeading'
import LongArrowLink from '@/components/primitives/LongArrowLink'
import ProjectCard from '@/components/primitives/ProjectCard'
import TestimonialSlider from '@/components/primitives/TestimonialSlider'
import { useHomeContent } from '@/content/live/hooks'
import { about } from '@/data/about'
import type { ProjectView } from '@/content/live/types'

/**
 * Results / Work block (§4.5). Reuses the home page's LatestWork primitives.
 * Black rounded container with heading, body, Contact link, project cards (2 columns),
 * testimonial slider, and carousel controls.
 * Projects + testimonials come from home-page data (same source as home "Work" section).
 */
export default function ResultsBlock() {
  const { results } = about
  const home = useHomeContent()
  const projects = home.projects

  // Featured projects for the About page - use the same 4 as Home's latest work
  const featured = home.latestWork.featured

  const cards = featured.flatMap((entry: { slug: string; column: 'left' | 'right' }) => {
    const project = projects.find((candidate: ProjectView) => candidate.slug === entry.slug)
    return project ? [{ project, column: entry.column }] : []
  })
  const rightProjects = cards.filter((card: { project: ProjectView; column: string }) => card.column === 'right').map((card: { project: ProjectView }) => card.project)
  const leftProjects = cards.filter((card: { project: ProjectView; column: string }) => card.column === 'left').map((card: { project: ProjectView }) => card.project)

  return (
    <Reveal
      as="section"
      id="work"
      aria-label={results.heading}
      className="scroll-mt-24 py-[var(--space-50)] md:py-[var(--space-80)] lg:py-[var(--space-100)]"
      stagger={0.1}
    >
      <Container>
        <DarkPanel>
          <div className="grid gap-y-[25px] md:grid-cols-2 md:items-start md:gap-x-[30px] lg:gap-x-[calc(var(--u)*5)]">
            {/* Right column: header + two cards */}
            <div className="flex min-w-0 flex-col gap-[25px] md:col-start-2 md:row-start-1 md:gap-[30px] lg:gap-[50px]">
              <div>
                <SectionHeading tone="dark" className="lg:-ml-[46px]">
                  {results.heading}
                </SectionHeading>
                <div className="ml-[26px] md:ml-[36px] lg:ml-0">
                  <p className="mt-[25px] text-[14px] leading-[1.5] text-white md:text-[20px] lg:text-[16px]">
                    {results.body}
                  </p>
                  <div className="mt-[25px] md:mt-[30px]">
                    <LongArrowLink
                      href={results.linkHref}
                      tone="mint"
                      thin
                      gapClassName="gap-[10px]"
                      arrowClassName="w-[34px] md:w-[46px] lg:w-[34px]"
                    >
                      {results.linkLabel}
                    </LongArrowLink>
                  </div>
                </div>
              </div>

              {rightProjects.map((project: ProjectView) => (
                <ProjectCard key={project.slug} {...project} />
              ))}
            </div>

            {/* Left column: two cards + testimonial slider + controls */}
            <div className="flex min-w-0 flex-col gap-[25px] md:col-start-1 md:row-start-1 md:gap-[30px] lg:gap-[50px]">
              {/* Mobile shows only right-column cards. `contents` lets cards join column's flex flow at md+. */}
              <div className="hidden md:contents">
                {leftProjects.map((project: ProjectView) => (
                  <ProjectCard key={project.slug} {...project} />
                ))}
              </div>

              <TestimonialSlider tone="dark" testimonials={home.testimonials} />
            </div>
          </div>
        </DarkPanel>
      </Container>
    </Reveal>
  )
}