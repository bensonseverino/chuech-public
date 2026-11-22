/*
 * Insights data (SEO spec Step 7). Reads published posts from the same public
 * CMS API pattern the rest of the site uses. Until the CMS has a `posts`
 * collection the fetch fails quietly and the site shows no articles — the
 * seeded outlines in content/posts.ts are drafts and stay hidden.
 */
import { useEffect, useState } from 'react'
import { publishedPosts, type PostView } from '../posts'

const apiBase = () => import.meta.env?.VITE_CMS_API_BASE ?? '/api/public'

type CmsPost = Record<string, unknown>

function mapPost(raw: CmsPost): PostView {
  const seo = (raw.seo ?? {}) as CmsPost
  return {
    slug: String(raw.slug ?? ''),
    title: String(raw.title ?? ''),
    excerpt: String(raw.excerpt ?? ''),
    body: String(raw.body ?? ''),
    author: String(raw.author ?? ''),
    category: String(raw.category ?? ''),
    image: raw.image
      ? String((raw.image as { url?: string }).url ?? raw.image)
      : undefined,
    publishedAt: String(raw.published_at ?? raw.publishedAt ?? ''),
    updatedAt: raw.updated_at ? String(raw.updated_at) : undefined,
    seoTitle: seo.title ? String(seo.title) : undefined,
    seoDescription: seo.description ? String(seo.description) : undefined,
    relatedService: raw.related_service ? String(raw.related_service) : undefined,
    status: raw.status === 'published' ? 'published' : 'draft',
  }
}

/** All published posts (empty until the CMS publishes any). */
export function useInsights(): PostView[] {
  const [posts, setPosts] = useState<PostView[]>(() => publishedPosts())

  useEffect(() => {
    let active = true
    fetch(`${apiBase()}/posts?limit=50`, { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: unknown) => {
        if (!active || !body) return
        const envelope = body as { data?: { posts?: CmsPost[] } }
        const list = Array.isArray(envelope.data?.posts) ? envelope.data.posts.map(mapPost) : null
        setPosts(publishedPosts(list))
      })
      .catch(() => {
        // CMS posts collection not deployed yet — keep the empty fallback.
      })
    return () => {
      active = false
    }
  }, [])

  return posts
}

/** One published post by slug, or undefined for a draft/unknown slug. */
export function useInsight(slug: string): PostView | undefined {
  const posts = useInsights()
  return posts.find((post) => post.slug === slug)
}
