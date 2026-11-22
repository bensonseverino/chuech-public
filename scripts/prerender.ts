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
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sirv from 'sirv'
import { chromium } from 'playwright'
import { SEO_ROUTES, type SeoRoute } from '../src/seo/routes.ts'
import { PROJECTS } from '../src/content/projects.ts'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DIST = join(ROOT, 'dist')
const PORT = Number(process.env.PRERENDER_PORT ?? 4399)
const CMS_API_URL = (process.env.CMS_API_URL ?? process.env.VITE_CMS_API_URL ?? '').replace(/\/$/, '')

if (process.env.SKIP_PRERENDER === '1') {
  console.log('[prerender] SKIP_PRERENDER=1 — leaving the SPA shell in dist/')
  process.exit(0)
}

type ProjectForSeo = { slug?: string; updated_at?: string; seoTitle?: string; description?: string }

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
    projects = PROJECTS.map((project) => ({ slug: project.slug }))
    console.log(`[prerender] bundled seed projects: ${projects.length}`)
  }

  const template = SEO_ROUTES.find((route) => route.template)
  if (!template) return []

  return projects
    .filter((project): project is ProjectForSeo & { slug: string } => Boolean(project.slug))
    .map((project) => ({
      ...template,
      path: `/work/${project.slug}`,
      title: project.seoTitle ?? template.title,
      description: project.description ?? template.description,
      lastmod: project.updated_at?.slice(0, 10) ?? template.lastmod,
      template: undefined,
    }))
}

async function main() {
  const routes = [...SEO_ROUTES.filter((route) => !route.template), ...(await projectRoutes())]

  const serve = sirv(DIST, { single: true, etag: true })
  const server = createServer((request, response) => {
    serve(request, response)
  })
  await new Promise<void>((resolve) => server.listen(PORT, resolve))
  const origin = `http://127.0.0.1:${PORT}`
  console.log(`[prerender] serving ${DIST} at ${origin}`)

  const browser = await chromium.launch({
    headless: true,
    channel: process.env.PRERENDER_BROWSER_CHANNEL || undefined,
    args: ['--no-sandbox'],
  })
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 1400, height: 900 },
  })
  const page = await context.newPage()

  try {
    for (const route of routes) {
      try {
        await page.goto(`${origin}${route.path}`, { waitUntil: 'networkidle', timeout: 45_000 })
      } catch {
        // A long-lived connection (video/CDN) must not abort the build; the
        // ready signal below is the real condition we care about.
      }
      await page.waitForFunction(() => document.documentElement.dataset.ready === 'true', null, {
        timeout: 30_000,
      })
      const html = await page.content()
      const relative = route.path.replace(/^\/+/, '').replace(/\/+$/, '')
      const outFile = join(DIST, relative, 'index.html')
      await mkdir(dirname(outFile), { recursive: true })
      await writeFile(outFile, html, 'utf8')
      console.log(`[prerender] ${route.path} -> ${relative || 'index.html'}`)
    }

    // 404 with a true 404 status: no SPA catch-all in public/_redirects, and
    // every valid route now has a real file. sirv's `single` option gives the
    // unknown path the SPA shell so React renders NotFoundPage for capture.
    await page.goto(`${origin}/__prerender_404__`, { waitUntil: 'networkidle', timeout: 45_000 })
    await page.waitForFunction(() => document.documentElement.dataset.ready === 'true', null, {
      timeout: 30_000,
    })
    await writeFile(join(DIST, '404.html'), await page.content(), 'utf8')
    console.log('[prerender] 404 -> 404.html')
  } finally {
    await browser.close()
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
