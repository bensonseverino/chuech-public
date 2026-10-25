import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import Container from '../primitives/Container'
import SectionHeading, { TITLE_ROLE } from '../primitives/SectionHeading'
import LongArrowLink from '../primitives/LongArrowLink'
import ProjectCard from '../primitives/ProjectCard'
import { Reveal } from '../ui/Reveal'
import { ChevronIcon } from '../icons'
import type { ProjectView, ServicePageView } from '../../content/live/types'
import './ProjectCarousel.css'

/**
 * "Some of our favourite web design projects" (web-design spec §5.3): a single
 * snap-scrolling row of the shared `ProjectCard` that starts at the container's
 * left edge and bleeds past the right edge of the viewport, plus round mint
 * controls on pointer devices. The scroller is a focusable region driven by the
 * arrow keys as well as swipe and the buttons.
 */
export default function ProjectCarousel({
  heading,
  viewAll,
  projects,
  regionLabel,
}: {
  heading: string
  viewAll: ServicePageView['projects']['viewAll']
  projects: ProjectView[]
  regionLabel: string
}) {
  const headingId = useId()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  /** Keep the button states in step with the scroll position. */
  const sync = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  /** Advance by exactly one card (its box plus the gap between cards). */
  function step(direction: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    // Card list only: the tag chips inside each card are `li`s too.
    const [first, second] = Array.from(el.querySelectorAll<HTMLElement>('.pc-track > li'))
    const distance =
      first && second
        ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
        : el.clientWidth * 0.8
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: direction * distance, behavior: reduce ? 'auto' : 'smooth' })
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    }
  }

  return (
    <Reveal as="section" aria-labelledby={headingId} className="mt-[50px] lg:mt-[62px]">
      <Container>
        <SectionHeading variant="dot" id={headingId} className={`${TITLE_ROLE} text-obsidian`}>
          {heading}
        </SectionHeading>
        <div className="mt-[10px]">
          <LongArrowLink href={viewAll.to} tone="light" thin>
            {viewAll.label}
          </LongArrowLink>
        </div>
      </Container>

      <div className="pc-stage mt-[25px]">
        <div
          ref={scrollerRef}
          role="region"
          aria-label={regionLabel}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onScroll={sync}
          /* Horizontal scroller: horizontal gestures stay native to the row,
             while vertical wheeling over it keeps Lenis smoothing the page. */
          data-lenis-prevent-horizontal
          className="pc-scroll no-scrollbar focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian"
        >
          <ul className="pc-track">
            {projects.map((project) => (
              <li key={project.slug}>
                <ProjectCard
                  slug={project.slug}
                  title={project.title}
                  tags={project.tags}
                  image={project.image}
                  focus={project.focus}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="pc-controls">
          <button
            type="button"
            aria-label="Previous projects"
            onClick={() => step(-1)}
            disabled={!canPrev}
            className="pc-btn pc-btn-prev cursor-pointer"
          >
            <ChevronIcon className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next projects"
            onClick={() => step(1)}
            disabled={!canNext}
            className="pc-btn pc-btn-next cursor-pointer"
          >
            <ChevronIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Reveal>
  )
}
