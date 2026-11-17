import ProjectCarousel from './ProjectCarousel'
import type { ProjectCardData } from '../../cms/projects'
import type { ProjectView } from '../../content/live/types'

/**
 * The "Similar Work" band on a case study (cms-projects-spec.md §2.7): a dark
 * section with the dot heading, "View all work →" and the existing snap-scroll
 * carousel of project cards (peeking next card, mint circular arrows). The
 * cards are other projects — the server resolves them automatically or from
 * the owner's manual pick (§5.2).
 */
export default function SimilarWork({ projects }: { projects: ProjectCardData[] }) {
  if (projects.length === 0) return null

  // The carousel renders the shared `ProjectView` shape; a CMS card maps
  // straight onto it (image URL, category labels, focal point).
  const views: ProjectView[] = projects.map((card) => ({
    slug: card.slug,
    title: card.title,
    tags: card.categories.map((category) => category.label),
    image: card.image.url,
    focus: `${card.image.focalX}% ${card.image.focalY}%`,
  }))

  return (
    <div className="bg-black py-[50px] md:py-[62px] lg:py-[80px]">
      <ProjectCarousel
        tone="dark"
        heading="Similar Work"
        viewAll={{ label: 'View all work', to: '/work' }}
        projects={views}
        regionLabel="Similar projects"
      />
    </div>
  )
}
