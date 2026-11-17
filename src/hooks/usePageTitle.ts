import { useEffect } from 'react'

/**
 * Per-route page title (services spec §3.3). `react-helmet` is not installed,
 * so this 6-line hook sets `document.title` and restores nothing on unmount
 * (each route sets its own title).
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}

/**
 * Per-route meta description (web-design spec §3). Updates the tag in
 * `index.html` when there is one and creates it otherwise.
 */
export function useMetaDescription(description: string) {
  useEffect(() => {
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
    }
    tag.content = description
  }, [description])
}

/** Upsert (or remove) one `<meta property|name>` tag in the document head. */
function upsertMeta(attribute: 'property' | 'name', key: string, content: string | null) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!content) {
    tag?.remove()
    return
  }
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.content = content
}

/**
 * Per-route Open Graph / Twitter tags (cms-projects-spec.md §9.9): title,
 * description, image and canonical URL so shared links render correctly. The
 * `index.html` defaults stay for the pages that don't call this.
 */
export function useSeoTags({
  title,
  description,
  image,
  path,
}: {
  title: string
  description?: string
  image?: string
  path?: string
}) {
  useEffect(() => {
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description ?? null)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:image', image ?? null)
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : null)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description ?? null)
    upsertMeta('name', 'twitter:image', image ?? null)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (path) {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = `${window.location.origin}${path}`
    }
  }, [title, description, image, path])
}
