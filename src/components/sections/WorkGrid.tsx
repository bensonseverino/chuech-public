import ProjectCard from '../primitives/ProjectCard'
import type { Project } from '../../content/projects'
import './WorkGrid.css'

/**
 * Full-bleed project grid (work page spec §5.1). Columns, gap, aspect ratio and
 * the wide-card positions come from `WorkGrid.css`; equal row heights are driven
 * by a container query, so a wide (2-column) card is exactly as tall as the
 * singles beside it without any JS.
 *
 * The grid is intentionally outside the hero's narrow `Container` — its side
 * margin equals its gap (18px desktop, 25px below).
 */
export default function WorkGrid({ projects }: { projects: Project[] }) {
  return (
    <section id="work-grid" aria-label="Projects" className="work-grid-wrap">
      <h2 className="sr-only">Projects</h2>
      <ul className="work-grid">
        {projects.map((project) => (
          <li key={project.slug}>
            <ProjectCard
              className="work-card"
              fill
              slug={project.slug}
              title={project.title}
              tags={project.tags}
              image={project.image}
              focus={project.focus}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
