/*
 * Case-study client (site repo: `src/cms/projects.ts`), matching
 * functions/api/public/projects.ts in this repo (cms-projects-spec.md §5.2).
 *
 * Like the rest of the CMS client, a failed fetch returns null and the caller
 * renders its fallback — the site never blocks rendering on the API. Detail
 * responses are also kept in a tiny module-level promise cache so hovering a
 * card can prefetch the page's data before the transition lifts (§9.7).
 */

export type ImageAsset = {
  url: string
  srcSet: string
  width: number
  height: number
  alt: string
  focalX: number
  focalY: number
}

export type ProjectCategory = { slug: string; label: string }

export type ProjectCardData = {
  id: string
  slug: string
  title: string
  image: ImageAsset
  categories: ProjectCategory[]
}

export type ProjectDetailData = ProjectCardData & {
  hero: {
    type: 'image' | 'video'
    image: ImageAsset
    imageMobile?: ImageAsset
    videoUrl?: string
    lead: string
    body?: string
  }
  introHtml?: string
  feature?: { heading: string; text: string; image?: ImageAsset }
  gallery: ImageAsset[]
  testimonial?: { quote: string; author: string; company: string }
  related: ProjectCardData[]
  seo: { title: string; description: string; ogImage?: ImageAsset }
  publishedAt: string
}

function apiBase(): string {
  return import.meta.env?.VITE_CMS_API_BASE ?? '/api/public'
}

async function fetchEnvelope<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${apiBase()}${path}`, {
      headers: { Accept: 'application/json' },
      credentials: 'omit',
    })
    if (!response.ok) return null
    const body = (await response.json()) as { data?: T; version?: number }
    if (!body || typeof body.version !== 'number' || body.data === undefined) return null
    return body.data
  } catch {
    return null
  }
}

// --- Endpoint helpers -----------------------------------------------------------

export type ProjectList = { projects: ProjectCardData[]; nextCursor?: number }

export async function fetchProjects(
  options: { category?: string; featured?: boolean; limit?: number; cursor?: number } = {},
): Promise<ProjectList | null> {
  const params = new URLSearchParams()
  if (options.category) params.set('category', options.category)
  if (options.featured) params.set('featured', '1')
  if (options.limit) params.set('limit', String(options.limit))
  if (options.cursor) params.set('cursor', String(options.cursor))
  const query = params.toString()
  return fetchEnvelope<ProjectList>(`/projects${query ? `?${query}` : ''}`)
}

/**
 * Every published project, following the API cursor to the end. The `/work`
 * page must show ALL published work, not just the first 50 rows; a single
 * request would silently hide anything beyond the API's page limit.
 */
export async function fetchAllProjects(
  options: { category?: string } = {},
): Promise<ProjectCardData[] | null> {
  const all: ProjectCardData[] = []
  let cursor: number | undefined
  // Guard against a broken/malformed cursor loop; 1000 cards is far beyond a
  // realistic portfolio and keeps a buggy response from spinning forever.
  for (let page = 0; page < 20; page += 1) {
    const list = await fetchProjects({ ...options, limit: 50, cursor })
    if (!list) return all.length > 0 ? all : null
    all.push(...list.projects)
    if (list.nextCursor === undefined || list.nextCursor === null) break
    cursor = list.nextCursor
  }
  return all
}

export async function fetchProjectCategories(): Promise<ProjectCategory[] | null> {
  const data = await fetchEnvelope<{ categories: ProjectCategory[] }>('/project-categories')
  return data?.categories ?? null
}

/** Draft preview (§5.1): a short-lived signed token from the CMS Preview button. */
export async function fetchProjectPreview(
  slug: string,
  token: string,
): Promise<ProjectDetailData | null> {
  return fetchEnvelope<ProjectDetailData>(
    `/projects/${encodeURIComponent(slug)}?preview=${encodeURIComponent(token)}`,
  )
}

// --- Detail cache (prefetch, §9.7) ------------------------------------------------

export type DetailResult =
  | { kind: 'ok'; project: ProjectDetailData }
  | { kind: 'redirect'; to: string }
  | { kind: 'missing' }
  | { kind: 'offline' }

type DetailEntry = { promise: Promise<DetailResult>; at: number }

const DETAIL_TTL = 60_000
const detailCache = new Map<string, DetailEntry>()

async function loadDetail(slug: string): Promise<DetailResult> {
  let response: Response
  try {
    response = await fetch(`${apiBase()}/projects/${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
      credentials: 'omit',
    })
  } catch {
    return { kind: 'offline' }
  }

  if (response.status === 404) {
    // Old slugs keep working via `redirectTo` (§5.1); anything else is missing.
    const body = (await response.json().catch(() => null)) as
      | { data?: { redirectTo?: string } }
      | null
    if (body?.data?.redirectTo) return { kind: 'redirect', to: body.data.redirectTo }
    return { kind: 'missing' }
  }
  if (!response.ok) return { kind: 'offline' }

  try {
    const body = (await response.json()) as { data?: ProjectDetailData; version?: number }
    if (!body || typeof body.version !== 'number' || !body.data || 'redirectTo' in body.data) {
      return { kind: 'missing' }
    }
    return { kind: 'ok', project: body.data }
  } catch {
    return { kind: 'offline' }
  }
}

/**
 * Warm the detail cache — called on card hover/focus so `/work/:slug` renders
 * without a skeleton flash behind the page transition (§9.7).
 */
export function prefetchProject(slug: string): Promise<DetailResult> {
  const cached = detailCache.get(slug)
  const now = Date.now()
  if (cached && now - cached.at < DETAIL_TTL) return cached.promise

  const promise = loadDetail(slug)
  detailCache.set(slug, { promise, at: now })
  return promise
}
