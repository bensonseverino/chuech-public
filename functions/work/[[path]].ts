/*
 * GET /work and /work/:slug — serve the SPA shell with per-project meta tags
 * injected (cms-projects-spec.md §9.9). Link-preview crawlers (WhatsApp,
 * LinkedIn, X) do not run JavaScript, so the client-rendered
 * `useSeoTags` alone is not enough for shared links: this function fetches the
 * published project from the same-origin public API and rewrites the HTML head
 * before it leaves the edge.
 *
 * Anything the API cannot answer (offline, unknown slug, non-HTML) passes
 * through untouched — the SPA's own 404 and fallback behaviour stay in charge.
 */
import type { PagesContext } from '../api/_lib/types'

/* Minimal shape of the Workers `HTMLRewriter` global (the site's hand-declared
   binding types deliberately don't drag @cloudflare/workers-types in). */
interface HTMLRewriterInstance {
  on(
    selector: string,
    handlers: {
      element(element: {
        setInnerContent(html: string): void
        setAttribute(name: string, value: string): void
      }): void
    },
  ): HTMLRewriterInstance
  transform(response: Response): Response
}
declare const HTMLRewriter: new () => HTMLRewriterInstance

type ProjectMeta = {
  title?: string
  seo?: { title?: string; description?: string; ogImage?: { url?: string } }
}

export const onRequestGet = async (context: PagesContext): Promise<Response> => {
  const response = await context.next()
  const contentType = response.headers.get('Content-Type') ?? ''
  if (!response.ok || !contentType.includes('text/html')) return response

  const url = new URL(context.request.url)
  const slug = /^\/work\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(url.pathname)?.[1]
  if (!slug) return response

  let project: ProjectMeta | null = null
  try {
    const api = await fetch(`${url.origin}/api/public/projects/${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
    })
    if (api.ok) {
      const body = (await api.json()) as { data?: ProjectMeta }
      project = body?.data ?? null
    }
  } catch {
    return response
  }
  if (!project) return response

  // The public detail payload carries SEO under `seo` (title/description/ogImage);
  // `title` also exists at the top level.
  const title = (project.seo?.title ?? (project.title ? `${project.title} | Chuech Studio` : undefined))
  const description = project.seo?.description
  const image = project.seo?.ogImage?.url

  return new HTMLRewriter()
    .on('title', {
      element(element) {
        if (title) element.setInnerContent(title)
      },
    })
    .on('meta[property="og:title"], meta[name="twitter:title"]', {
      element(element) {
        if (title) element.setAttribute('content', title)
      },
    })
    .on('meta[property="og:description"], meta[name="twitter:description"], meta[name="description"]', {
      element(element) {
        if (description) element.setAttribute('content', description)
      },
    })
    .on('meta[property="og:image"], meta[name="twitter:image"]', {
      element(element) {
        if (image) element.setAttribute('content', image)
      },
    })
    .on('meta[property="og:url"]', {
      element(element) {
        element.setAttribute('content', url.toString())
      },
    })
    .transform(response)
}
