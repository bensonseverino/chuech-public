import type { Env, PagesContext } from './api/_lib/types'

/*
 * GET /robots.txt — points crawlers at the sitemap and explicitly allows the
 * AI search/assistant crawlers the SEO spec wants to cite the site. Short
 * enough that nothing needs caching hard.
 */
export const onRequestGet = async (context: PagesContext<Env>): Promise<Response> => {
  const origin = context.env.SITE_ORIGIN.replace(/\/+$/, '')
  const body = `User-agent: *
Allow: /

# AI search and assistant crawlers: allowed on purpose
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /

Sitemap: ${origin}/sitemap.xml
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
