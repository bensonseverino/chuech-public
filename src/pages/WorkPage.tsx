import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import PageHero from '../components/PageHero'
import WorkGrid from '../components/sections/WorkGrid'
import Pagination from '../components/Pagination'
import ServiceLinks from '../components/sections/ServiceLinks'
import Inline from '../content/live/inline'
import { useSiteChrome, useWorkContent } from '../content/live/hooks'
import { useMetaDescription, usePageTitle } from '../hooks/usePageTitle'

/**
 * `/work` (work page spec §1): the existing `PageHero` with the Work props, the
 * full-bleed project grid, the pagination bar and the service links.
 * Header/footer come from `RootLayout`.
 *
 * `_work` supplies the hero and page size; the grid reads the published
 * projects collection in its editorial order.
 *
 * Pagination lives in the URL (`?page=N`); a missing, invalid or out-of-range
 * value clamps to the nearest valid page (spec §3).
 */
export default function WorkPage() {
  const view = useWorkContent()
  const { site } = useSiteChrome()

  usePageTitle(view.seo.title)
  useMetaDescription(view.seo.description)

  const [params] = useSearchParams()
  const totalPages = Math.max(1, Math.ceil(view.projects.length / view.pageSize))
  const raw = Number(params.get('page'))
  const page = Number.isInteger(raw) && raw >= 1 ? Math.min(raw, totalPages) : 1
  const start = (page - 1) * view.pageSize
  const pageProjects = view.projects.slice(start, start + view.pageSize)

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
        label={view.hero.label}
        title={view.hero.title}
        pills={view.hero.pills}
        image={{ src: view.hero.image.src, alt: view.hero.image.alt }}
        description={<Inline text={view.hero.description} reveal="load" />}
        contact={{ email: site.email, phone: site.phone }}
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
