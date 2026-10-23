/*
 * Page-content hooks. Each one starts from the local fallback (so the first
 * paint never waits on the network) and replaces it with the published CMS
 * payload when the request succeeds. A failed request simply leaves the
 * fallback in place.
 */
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import { fetchEnvelope } from '../../cms/content'
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
    void fetchEnvelope<HomePayload>('/home').then((envelope) => {
      if (active && envelope) setView(homeFromCms(envelope.data))
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

export function useWorkContent(): WorkPageView {
  const [view, setView] = useState<WorkPageView>(WORK_FALLBACK)

  useEffect(() => {
    let active = true
    void fetchEnvelope<WorkPayload>('/work-page').then((envelope) => {
      if (active && envelope) setView(workFromCms(envelope.data))
    })
    return () => {
      active = false
    }
  }, [])

  return view
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
