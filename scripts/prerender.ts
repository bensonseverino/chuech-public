/*
 * Build-time prerender (SEO spec Step 2).
 *
 * Serves dist/ locally, opens every public route in headless Chromium with
 * reduced motion (so GSAP reveals never hide content in the captured HTML),
 * waits for the app's `data-ready` signal, and writes the rendered HTML to
 * dist/<route>/index.html. The SPA shell is kept as the JS entry point, so
 * real visitors still get the normal client-rendered, animated experience.
 *
 * Env:
 *   CMS_API_URL             published-projects API origin (falls back to
 *                           VITE_CMS_API_URL, then to the bundled seed list)
 *   PRERENDER_BROWSER_CHANNEL  e.g. "msedge" to use an installed Edge instead
 *                           of downloading Playwright's Chromium (local QA)
 *   SKIP_PRERENDER=1        used by the Cloudflare Pages native build; the
 *                           GitHub Action performs the real prerender
 */
import { createServer } from 'node:http'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sirv from 'sirv'
import { chromium } from 'playwright'
import { SEO_ROUTES, type SeoRoute } from '../src/seo/routes.ts'
import { SITE } from '../src/seo/site.ts'
import { PROJECTS } from '../src/content/projects.ts'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DIST = join(ROOT, 'dist')
const PORT = Number(process.env.PRERENDER_PORT ?? 4399)
const CMS_API_URL = (process.env.CMS_API_URL ?? process.env.VITE_CMS_API_URL ?? '').replace(/\/$/, '')

if (process.env.SKIP_PRERENDER === '1') {
  console.log('[prerender] SKIP_PRERENDER=1 — leaving the SPA shell in dist/')
  process.exit(0)
}

type ProjectForSeo = {
  slug?: string
  title?: string
  updated_at?: string
  seoTitle?: string
  description?: string
}

/** Fetch every published project slug from the CMS, paging through the public
 *  API. Any failure is non-fatal: the bundled published seed list is used. */
async function projectRoutes(): Promise<SeoRoute[]> {
  let projects: ProjectForSeo[] = []
  if (CMS_API_URL) {
    try {
      let cursor: string | null = null
      for (let page = 0; page < 20; page++) {
        const query = new URLSearchParams({ limit: '50' })
        if (cursor) query.set('cursor', cursor)
        const response = await fetch(`${CMS_API_URL}/api/public/projects?${query}`, {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(10_000),
        })
        if (!response.ok) throw new Error(`CMS API returned ${response.status}`)
        const body = (await response.json()) as {
          data?: { projects?: ProjectForSeo[]; nextCursor?: string | number | null }
        }
        projects.push(...(body.data?.projects ?? []))
        cursor = body.data?.nextCursor == null ? null : String(body.data.nextCursor)
        if (!cursor) break
      }
      console.log(`[prerender] CMS projects: ${projects.length}`)
    } catch (error) {
      console.warn(`[prerender] CMS unavailable (${String(error)}); using bundled seed projects`)
      projects = []
    }
  }

  if (projects.length === 0) {
    projects = PROJECTS.map((project) => ({ slug: project.slug, title: project.title }))
    console.log(`[prerender] bundled seed projects: ${projects.length}`)
  }

  const template = SEO_ROUTES.find((route) => route.template)
  if (!template) return []

  return projects
    .filter((project): project is ProjectForSeo & { slug: string } => Boolean(project.slug))
    .map((project) => {
      const title = project.title ?? project.seoTitle ?? template.title
      return {
        ...template,
        path: `/work/${project.slug}`,
        title,
        description: project.description ?? `A case study by ${SITE.name}: ${title}.`,
        lastmod: project.updated_at?.slice(0, 10) ?? template.lastmod,
        template: undefined,
      }
    })
}

async function postRoutes(): Promise<SeoRoute[]> {
  const template = SEO_ROUTES.find((route) => route.template && route.type === 'post')
  if (!template || !CMS_API_URL) return []
  try {
    const response = await fetch(`${CMS_API_URL}/api/public/posts?limit=50`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return []
    const body = (await response.json()) as {
      data?: { posts?: Array<Record<string, unknown>> }
    }
    const posts = body.data?.posts ?? []
    return posts
      .filter((post) => post.status === 'published' && post.slug)
      .map((post) => {
        const seo = (post.seo ?? {}) as Record<string, unknown>
        return {
          ...template,
          path: `/insights/${post.slug}`,
          title: String(seo.title ?? post.title ?? template.title),
          description: String(seo.description ?? post.excerpt ?? template.description),
          lastmod: String(post.updated_at ?? post.published_at ?? template.lastmod).slice(0, 10),
          template: undefined,
        }
      })
  } catch {
    return []
  }
}

/** Crawl files generated from the same route list (SEO spec Step 5). */
async function writeCrawlFiles(routes: SeoRoute[]) {
  const escapeXml = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) =>
      `  <url>\n    <loc>${escapeXml(route.path === '/' ? SITE.url : SITE.url + route.path)}</loc>\n    <lastmod>${route.lastmod}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`
  await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8')

  const services = routes.filter((route) => route.type === 'service')
  const projects = routes.filter((route) => route.type === 'project')
  const llms = `# ${SITE.name}
> Web design agency in Kenya. Websites, branding, SEO, social media marketing, PPC, brand and graphic design.

## Services
${services
  .map((route) => `- [${route.title.split(' | ')[0]}](${SITE.url}${route.path}): ${route.description}`)
  .join('\n')}

## Work
${projects.map((route) => `- [${route.title}](${SITE.url}${route.path}): ${route.description}`).join('\n')}

## Company
- [About](${SITE.url}/about)
- [Insights](${SITE.url}/insights)
- [Contact](${SITE.url}/contact): ${SITE.email}, ${SITE.phone}
`
  await writeFile(join(DIST, 'llms.txt'), llms, 'utf8')

  /* Trailing-slash duplicates all redirect to the slashless canonical URL.
     No SPA catch-all: every valid route has a prerendered file. */
  const redirectsPath = join(DIST, '_redirects')
  const base = (await readFile(redirectsPath, 'utf8'))
    .split('# Generated: trailing-slash duplicates')[0]
    .trimEnd()
  const slashRules = routes
    .filter((route) => route.path !== '/')
    .map((route) => `${route.path}/  ${route.path}  301`)
  await writeFile(
    redirectsPath,
    `${base}\n\n# Generated: trailing-slash duplicates\n${slashRules.join('\n')}\n`,
    'utf8',
  )
  console.log('[prerender] sitemap.xml, llms.txt, _redirects written')
}

async function main() {
  const routes = [
    ...SEO_ROUTES.filter((route) => !route.template),
    ...(await projectRoutes()),
    ...(await postRoutes()),
  ]

  /* Serve the pristine SPA shell for every document request. Serving a
     previously prerendered file as the fallback would carry its baked-in head
     tags into the next capture, duplicating metadata on every route. */
  const shell = await readFile(join(DIST, 'index.html'), 'utf8')
  const serve = sirv(DIST, { etag: true })
  const server = createServer((request, response) => {
    const accept = request.headers.accept ?? ''
    if (accept.includes('text/html')) {
      response.setHeader('Content-Type', 'text/html; charset=utf-8')
      response.end(shell)
      return
    }
    serve(request, response)
  })
  await new Promise<void>((resolve) => server.listen(PORT, resolve))
  const origin = `http://127.0.0.1:${PORT}`
  console.log(`[prerender] serving ${DIST} at ${origin}`)

  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined
  try {
    browser = await chromium.launch({
      headless: true,
      channel: process.env.PRERENDER_BROWSER_CHANNEL || undefined,
      args: ['--no-sandbox'],
    })
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 1400, height: 900 },
    })
    /* A prerendered file has data-ready baked into <html>. When sirv serves
       that file as the SPA fallback for the next route, a stale "ready" would
       let us capture before React mounts. Clear it on every navigation. */
    await context.addInitScript(() => {
      document.documentElement?.removeAttribute('data-ready')
    })
    const page = await context.newPage()

    const waitForApp = () =>
      page.waitForFunction(
        () =>
          document.documentElement.dataset.ready === 'true' &&
          (document.getElementById('root')?.children.length ?? 0) > 0 &&
          Boolean(document.head.querySelector('meta[name="description"]')),
        null,
        { timeout: 30_000 },
      )

    for (const route of routes) {
      try {
        await page.goto(`${origin}${route.path}`, { waitUntil: 'networkidle', timeout: 45_000 })
      } catch {
        // A long-lived connection (video/CDN) must not abort the build; the
        // ready signal below is the real condition we care about.
      }
      await waitForApp()
      const html = await page.content()
      const relative = route.path.replace(/^\/+/, '').replace(/\/+$/, '')
      const outFile = join(DIST, relative, 'index.html')
      await mkdir(dirname(outFile), { recursive: true })
      await writeFile(outFile, html, 'utf8')
      console.log(`[prerender] ${route.path} -> ${relative || 'index.html'}`)
    }

    // 404 with a true 404 status: no SPA catch-all in public/_redirects, and
    // every valid route now has a real file. The unknown path gets the clean
    // shell above so React renders NotFoundPage for capture.
    await page.goto(`${origin}/__prerender_404__`, { waitUntil: 'networkidle', timeout: 45_000 })
    await waitForApp()
    await writeFile(join(DIST, '404.html'), await page.content(), 'utf8')
    console.log('[prerender] 404 -> 404.html')

    await writeCrawlFiles(routes)
  } finally {
    await browser?.close()
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }

  console.log(`[prerender] done: ${routes.length} routes + 404`)
}

main().catch((error) => {
  console.error('[prerender] FAILED:', error)
  process.exitCode = 1
})
