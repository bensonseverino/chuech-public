import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import PageHero from '../components/PageHero'
import WorkGrid from '../components/sections/WorkGrid'
import Pagination from '../components/Pagination'
import ServiceLinks from '../components/sections/ServiceLinks'
import { asset } from '../content/assets'
import { PROJECTS, WORK_PAGE_SIZE } from '../content/projects'
import { usePageTitle } from '../hooks/usePageTitle'

/** Same copy and bold phrases as the Home hero description (spec §4 / §6). */
function HeroDescription() {
  return (
    <>
      <strong className="font-semibold text-obsidian">Manchester-born, globally trusted</strong>{' '}
      &ndash; we&rsquo;ve generated{' '}
      <strong className="font-semibold text-obsidian">£100M+ in client revenue</strong> and
      manage £250K in monthly ad spend, backed by a world-class team built to improve the
      bottom line.
    </>
  )
}

/**
 * `/work` (work page spec §1): the existing `PageHero` with the Work props, the
 * full-bleed project grid, the pagination bar and the service links.
 * Header/footer come from `RootLayout`.
 *
 * Pagination lives in the URL (`?page=N`); a missing, invalid or out-of-range
 * value clamps to the nearest valid page (spec §3).
 */
export default function WorkPage() {
  usePageTitle('Work | Marino')

  const [params] = useSearchParams()
  const totalPages = Math.max(1, Math.ceil(PROJECTS.length / WORK_PAGE_SIZE))
  const raw = Number(params.get('page'))
  const page = Number.isInteger(raw) && raw >= 1 ? Math.min(raw, totalPages) : 1
  const start = (page - 1) * WORK_PAGE_SIZE
  const pageProjects = PROJECTS.slice(start, start + WORK_PAGE_SIZE)

  // On page change, land on the top of the grid (grid top minus the sticky
  // header and 24px). The first render is skipped so a direct load keeps the
  // hero in view. No smooth scroll under reduced motion.
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const grid = document.getElementById('work-grid')
    if (!grid) return
    const sticky = window.matchMedia('(min-width: 768px)').matches
      ? document.querySelector('nav[aria-label="Primary"]')
      : document.querySelector('header.sticky')
    const headerBottom = sticky ? Math.max(0, sticky.getBoundingClientRect().bottom) : 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({
      top: window.scrollY + grid.getBoundingClientRect().top - headerBottom - 24,
      behavior: reduce ? 'auto' : 'smooth',
    })
  }, [page])

  return (
    <>
      <PageHero
        label="Work"
        title="Latest Work"
        pills={['Full-service agency', 'Trusted by UK brands']}
        image={{ src: asset('work-hero') }}
        description={<HeroDescription />}
        showImageOnMobile={false}
        pillAAnchor="straddle"
        pillAMobileInset="0px"
        spacingBottom={{ mobile: '25px', tablet: '45px', desktop: '70px' }}
      />
      <WorkGrid projects={pageProjects} />
      <Pagination page={page} totalPages={totalPages} />
      <ServiceLinks />
    </>
  )
}
