/*
 * Page-content hooks. Each one starts from the local fallback (so the first
 * paint never waits on the network) and replaces it with the published CMS
 * payload when the request succeeds. A failed request simply leaves the
 * fallback in place.
 */
import { useEffect, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router'
import { fetchEnvelope } from '../../cms/content'
import {
  fetchProjectCategories,
  fetchProjectPreview,
  fetchProjects,
  prefetchProject,
  type DetailResult,
  type ProjectCardData,
  type ProjectCategory,
  type ProjectDetailData,
} from '../../cms/projects'
import {
  HOME_FALLBACK,
  homeFromCms,
  SERVICE_FALLBACKS,
  servicePageFromCms,
  servicesFromCms,
  SERVICES_FALLBACK,
  siteFromCms,
  SITE_FALLBACK,
  workFromCms,
  WORK_FALLBACK,
  type HomePayload,
  type ServicePagePayload,
  type ServicesPayload,
  type SitePayload,
  type WorkPayload,
} from './map'
import type { CmsProject } from './map'
import type {
  HomeView,
  ServicePageData,
  ServicePageView,
  ServicesPageView,
  SiteContent,
  WorkPageView,
} from './types'

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(SITE_FALLBACK)

  useEffect(() => {
    let active = true
    void fetchEnvelope<SitePayload>('/site').then((envelope) => {
      if (active && envelope) setContent(siteFromCms(envelope.data))
    })
    return () => {
      active = false
    }
  }, [])

  return content
}

/** The page shell content RootLayout provides to every route. */
export function useSiteChrome(): SiteContent {
  return useOutletContext<SiteContent>()
}

export function useHomeContent(): HomeView {
  const [view, setView] = useState<HomeView>(HOME_FALLBACK)

  useEffect(() => {
    let active = true
    void Promise.all([
      fetchEnvelope<HomePayload>('/home'),
      fetchProjects({ featured: true, limit: 12 }),
    ]).then(([home, cards]) => {
      if (!active) return

      let next = home?.data ? homeFromCms(home.data) : HOME_FALLBACK
      if (cards && cards.projects.length > 0) {
        // Published CMS cards are the only work the site may show. The home
        // document keeps the editorial *order*, but any featured slug it names
        // must still exist in the published list — a stale/draft slug can no
        // longer resurrect a card from the bundled fallback.
        const cmsProjects = cardsFromCms(cards.projects)
        const bySlug = new Map(cmsProjects.map((project) => [project.slug, project]))
        const featured = next.latestWork.featured.filter((entry) => bySlug.has(entry.slug))
        const used = new Set(featured.map((entry) => entry.slug))
        const columns = ['left', 'right'] as const
        let index = 0
        for (const project of cmsProjects) {
          if (!used.has(project.slug)) {
            featured.push({ slug: project.slug, column: columns[index++ % 2] })
          }
        }
        next = {
          ...next,
          latestWork: { ...next.latestWork, featured },
          projects: cmsProjects,
        }
      }
      setView(next)
    })
    return () => {
      active = false
    }
  }, [])

  return view
}

export function useServicesContent(): ServicesPageView {
  const [view, setView] = useState<ServicesPageView>(SERVICES_FALLBACK)

  useEffect(() => {
    let active = true
    void fetchEnvelope<ServicesPayload>('/services-page').then((envelope) => {
      if (active && envelope) setView(servicesFromCms(envelope.data))
    })
    return () => {
      active = false
    }
  }, [])

  return view
}

/**
 * The Work listing (cms-projects-spec.md §9.5): the `_work` index (hero, page
 * size) still comes from `/work-page`, but the grid is driven by the published
 * `projects` table via `/api/public/projects`. When that endpoint fails or is
 * unreachable, the legacy payload's projects (and the bundled fallback) stay in
 * place, so the page never blanks.
 */
export function useWorkContent(): WorkPageView {
  const [view, setView] = useState<WorkPageView>(WORK_FALLBACK)

  useEffect(() => {
    let active = true
    void Promise.all([
      fetchEnvelope<WorkPayload>('/work-page'),
      fetchProjects({ limit: 50 }),
    ]).then(([work, cards]) => {
      if (!active) return

      let next = work?.data ? workFromCms(work.data) : WORK_FALLBACK
      if (cards && cards.projects.length > 0) {
        next = { ...next, projects: cardsFromCms(cards.projects) }
      }
      setView(next)
    })
    return () => {
      active = false
    }
  }, [])

  return view
}

/** CMS cards → the shared card view (image URL, category labels, focal point). */
function cardsFromCms(cards: ProjectCardData[]): WorkPageView['projects'] {
  return cards.map((card) => ({
    slug: card.slug,
    title: card.title,
    tags: card.categories.map((category) => category.label),
    image: card.image.url,
    focus: `${card.image.focalX}% ${card.image.focalY}%`,
  }))
}

/** Stable local data per slug, built once. */
const FALLBACK_PAGES = new Map<string, ServicePageData>()

function fallbackData(slug: string, fallback: ServicePageView): ServicePageData {
  const cached = FALLBACK_PAGES.get(slug)
  if (cached) return cached

  const value: ServicePageData = {
    ...servicePageFromCms(null, undefined, fallback),
    stats: HOME_FALLBACK.stats,
    testimonials: HOME_FALLBACK.testimonials,
  }
  FALLBACK_PAGES.set(slug, value)
  return value
}

/**
 * A service page needs three requests: the page document, the projects its
 * carousel filters, and the home document for the shared Experience band and
 * testimonials. All are cached by the API, and any one may fail on its own
 * without discarding the others.
 */
export function useServicePage(slug: string): ServicePageData {
  const fallback = SERVICE_FALLBACKS[slug] ?? SERVICE_FALLBACKS['web-design']
  const initial = fallbackData(slug, fallback)
  const [loaded, setLoaded] = useState<{ slug: string; data: ServicePageData } | null>(null)

  useEffect(() => {
    let active = true

    void Promise.all([
      fetchEnvelope<ServicePagePayload>(`/pages/${encodeURIComponent(slug)}`),
      fetchEnvelope<CmsProject[]>('/collections/projects'),
      fetchEnvelope<HomePayload>('/home'),
    ]).then(([page, projects, home]) => {
      if (!active) return
      const homeView = home?.data ? homeFromCms(home.data) : HOME_FALLBACK
      setLoaded({
        slug,
        data: {
          ...servicePageFromCms(page?.data ?? null, projects?.data, fallback),
          stats: homeView.stats,
          testimonials: homeView.testimonials,
        },
      })
    })

    return () => {
      active = false
    }
  }, [slug, fallback])

  return loaded?.slug === slug ? loaded.data : initial
}

// --- Case studies (cms-projects-spec.md §9.2) --------------------------------------

/**
 * Published project cards from the CMS. `null` while the request is in flight
 * and on failure — the caller keeps its existing (fallback) content.
 */
export function useProjects(
  options: { category?: string; featured?: boolean; limit?: number } = {},
): ProjectCardData[] | null {
  const [cards, setCards] = useState<ProjectCardData[] | null>(null)
  const key = JSON.stringify(options)

  useEffect(() => {
    let active = true
    void fetchProjects(options).then((list) => {
      if (active && list) setCards(list.projects)
    })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return cards
}

/** The CMS categories, in editorial order. `null` while loading / on failure. */
export function useProjectCategories(): ProjectCategory[] | null {
  const [categories, setCategories] = useState<ProjectCategory[] | null>(null)

  useEffect(() => {
    let active = true
    void fetchProjectCategories().then((data) => {
      if (active && data) setCategories(data)
    })
    return () => {
      active = false
    }
  }, [])

  return categories
}

export type ProjectResult =
  | { state: 'loading'; project: null }
  | { state: 'ok'; project: ProjectDetailData }
  | { state: 'redirect'; to: string }
  | { state: 'missing'; project: null }

/**
 * One case study. Reads through the shared detail cache (a card hover
 * prefetches it, §9.7); `?preview=<token>` fetches a draft directly and is
 * never cached. `missing` covers unknown slugs and drafts without a token;
 * `redirect` is a renamed slug keeping its old URL alive (§5.1).
 */
export function useProject(slug: string): ProjectResult {
  const [result, setResult] = useState<ProjectResult>({ state: 'loading', project: null })
  const [params] = useSearchParams()
  const previewToken = params.get('preview')

  useEffect(() => {
    let active = true
    setResult({ state: 'loading', project: null })

    const promise: Promise<DetailResult> = previewToken
      ? fetchProjectPreview(slug, previewToken).then((data) =>
          data ? { kind: 'ok', project: data } : { kind: 'missing' },
        )
      : prefetchProject(slug)

    void promise.then((data) => {
      if (!active) return
      if (data.kind === 'ok') setResult({ state: 'ok', project: data.project })
      else if (data.kind === 'redirect') setResult({ state: 'redirect', to: data.to })
      else setResult({ state: 'missing', project: null })
    })

    return () => {
      active = false
    }
  }, [slug, previewToken])

  return result
}
